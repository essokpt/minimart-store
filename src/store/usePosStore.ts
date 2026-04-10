import { create } from 'zustand';
import { CartItem, Product, Customer } from '../types';

interface HeldOrder {
  id: string;
  cart: CartItem[];
  orderDiscount: number;
  timestamp: string;
}

interface PosState {
  cart: CartItem[];
  orderDiscount: number; // percentage
  heldOrders: HeldOrder[];
  selectedCustomer: Customer | null;
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, delta: number) => void;
  setItemDiscount: (productId: string, discount: number, type?: 'percentage' | 'fixed') => void;
  setOrderDiscount: (discount: number) => void;
  selectCustomer: (customer: Customer | null) => void;
  clearCart: () => void;
  holdCurrentOrder: () => void;
  resumeOrder: (id: string) => void;
  deleteHeldOrder: (id: string) => void;
  cartTotal: () => number;
  cartItemCount: () => number;
}

export const usePosStore = create<PosState>((set, get) => ({
  cart: [],
  orderDiscount: 0,
  heldOrders: [],
  selectedCustomer: null,
  
  addItem: (product) => set((state) => {
    console.log('Adding product to cart:', product);
    // Find matching item by BOTH product_id AND receipt_item_id to ensure batch accuracy
    const existing = state.cart.find((item) => 
      item.product_id === product.product_id && 
      (item as any).receipt_item_id === (product as any).receipt_item_id
    );

    if (existing) {
      return {
        cart: state.cart.map((item) => 
          (item.product_id === product.product_id && (item as any).receipt_item_id === (product as any).receipt_item_id)
            ? { ...item, qty: item.qty + 1 } : item
        )
      };
    }
    return { cart: [...state.cart, { ...product, qty: 1 }] };
  }),
  
  removeItem: (productId) => set((state) => ({
    cart: state.cart.filter((item) => item.product_id !== productId)
  })),
  
  updateQuantity: (productId, delta) => set((state) => ({
    cart: state.cart.map((item) => {
      if (item.product_id === productId) {
        const newQty = Math.max(0, item.qty + delta);
        return { ...item, qty: newQty };
      }
      return item;
    }).filter((item) => item.qty > 0)
  })),
  
  setItemDiscount: (productId, discount, type = 'percentage') => set((state) => ({
    cart: state.cart.map((item) => 
      item.product_id === productId ? { ...item, discount, discount_type: type } : item
    )
  })),

  setOrderDiscount: (discount) => set({ orderDiscount: discount }),

  holdCurrentOrder: () => set((state) => {
    if (state.cart.length === 0) return state;
    const newHeldOrder: HeldOrder = {
      id: Math.random().toString(36).substring(7),
      cart: [...state.cart],
      orderDiscount: state.orderDiscount,
      timestamp: new Date().toISOString()
    };
    return {
      heldOrders: [newHeldOrder, ...state.heldOrders],
      cart: [],
      orderDiscount: 0
    };
  }),

  resumeOrder: (id) => set((state) => {
    const order = state.heldOrders.find(o => o.id === id);
    if (!order) return state;
    return {
      cart: order.cart,
      orderDiscount: order.orderDiscount,
      heldOrders: state.heldOrders.filter(o => o.id !== id)
    };
  }),

  deleteHeldOrder: (id) => set((state) => ({
    heldOrders: state.heldOrders.filter(o => o.id !== id)
  })),

  selectCustomer: (customer) => set({ selectedCustomer: customer }),

  clearCart: () => set({ cart: [], orderDiscount: 0, selectedCustomer: null }),
  
  cartTotal: () => {
    const { cart, orderDiscount } = get();
    const subtotal = cart.reduce((total, item) => {
      let itemPrice = item.unit_price;
      if (item.discount) {
        if (item.discount_type === 'percentage') {
          itemPrice = item.unit_price * (1 - item.discount / 100);
        } else {
          itemPrice = Math.max(0, item.unit_price - item.discount);
        }
      }
      return total + (itemPrice * item.qty);
    }, 0);
    
    return subtotal * (1 - orderDiscount / 100);
  },
  
  cartItemCount: () => {
    const { cart } = get();
    return cart.reduce((count, item) => count + item.qty, 0);
  }
}));
