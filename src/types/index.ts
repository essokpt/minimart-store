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
  code: string;
  type: string;
  capacity: number;
  currentUsage: number;
  description: string;
  store_id?: string;
}

export interface Stock_receiptitems {
  receipt_item_id: number;
  receipt_id: number;
  product_id: number;
  variant_id: number;
  serial_id: number;
  lot_number: string;
  expires_at: string;
  name: string;
  sku: string;
  quantity: number;
  unitCost: number;
  area_id: number;
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
  stock_receiptitems: Stock_receiptitems[];
}


export interface Store {
  store_id: string;
  name: string;
  code: string;
  address?: string;
  phone?: string;
  status: 'Active' | 'Inactive';
}

export interface Order {
  id: string;
  order_id?: string;
  order_number: string;
  customer: string;
  customer_name?: string;
  avatar?: string;
  initials?: string;
  date?: string;
  created_at?: string;
  total?: string;
  total_amount?: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
}
