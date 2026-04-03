import { create } from 'zustand';
import { CartItem, Product } from '../types';

interface PosState {
  cart: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, delta: number) => void;
  clearCart: () => void;
  cartTotal: () => number;
  cartItemCount: () => number;
}

export const usePosStore = create<PosState>((set, get) => ({
  cart: [],
  
  addItem: (product) => set((state) => {
    console.log('Adding product to cart:', product);
    const existing = state.cart.find((item) => item.product_id === product.product_id);
    if (existing) {
      return {
        cart: state.cart.map((item) => 
          item.product_id === product.product_id ? { ...item, qty: item.qty + 1 } : item
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
  
  clearCart: () => set({ cart: [] }),
  
  cartTotal: () => {
    const { cart } = get();
    return cart.reduce((total, item) => total + (item.unit_price * item.qty), 0);
  },
  
  cartItemCount: () => {
    const { cart } = get();
    return cart.reduce((count, item) => count + item.qty, 0);
  }
}));
