export interface Category {
  category_id: string;
  name: string;
  created_at?: string;
}

export interface Product {
  product_id: string;
  name: string;
  model?: string;
  brand?: string;
  category_id: string;
  category?: Category;
  cost_price: number;
  unit_price: number;
  image?: string;
  image_url?: string;
  description?: string;
  barcode?: string;
  stock_value?: number;
  type?: string;
  status?: string;
}



export interface CartItem extends Product {
  qty: number;
  discount?: number;
  discount_type?: 'percentage' | 'fixed';
  receipt_item_id?: number;
  lot_number?: string;
}

export interface Stat {
  label: string;
  value: string;
  change: string;
  iconName: string;
  color: string;
  bg: string;
}

export interface TopSellingItem {
  name: string;
  sales: string;
  price: string;
  image: string;
}

export interface StockArea {
  area_id: string;
  name: string;
  status: string;
  type: string;
  capacity: number;
  currentUsage: number;
  description: string;
  store_id?: string;
  stock_receipt_items: Stock_receiptitems[];
  created_at: string;
}

export interface Stock_receiptitems {
  receipt_item_id: number;
  receipt_id: number;
  product: Product;
  variant_id: number;
  serial_id: number;
  lot_number: string;
  expires_at: string;
  name: string;
  sku: string;
  quantity: number;
  unitCost: number;
  area: StockArea;
}

export interface StockReceipt {
  receipt_id: string;
  supplier_name: string;
  date: string;
  totalUnits: number;
  totalValuation: number;
  status: 'Posted' | 'Draft' | 'Cancelled';
  receipt_number: string;
  notes: string;
  created_at: string;
  created_by: number;
  stock_receipt_items: Stock_receiptitems[];
}


export interface Store {
  store_id: string;
  name: string;
  code: string;
  address?: string;
  phone?: string;
  status: 'Active' | 'Inactive';
  currency_symbol?: string;
  tax_rate?: number;
}

export interface Order {
  id: string;
  order_id?: string;
  order_number: string;
  customer: string;
  order_type: string;
  payment_method: string;
  cash_received?: number;
  change?: number;
  created_at?: string;
  amount?: number;
  status: 'Confirmed' | 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Completed';
}

export interface OrderItem {
  order_item_id: string;
  product_id: string;
  order_id: string;
  product_stock_id: string;
  barcode: string;
  sku: string;
  name: string;
  quantity: number;
  unit_price: number;
  discount?: number;
  discount_type?: 'percentage' | 'fixed';
  total: number;
}

export interface LoyaltySettings {
  id: string;
  points_per_currency: number;
  currency_per_point: number;
  min_redemption_points: number;
  enabled: boolean;
}

export interface Supplier {
  supplier_id: string;
  name: string;
  contact_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  category?: string;
  status: 'Active' | 'Inactive';
  created_at?: string;
}

export interface Customer {
  customer_id: string;
  full_name: string;
  email?: string;
  phone?: string;
  address?: string;
  loyalty_points: number;
  created_at?: string;
}
