import { z } from 'zod';

// Helper to coerce string to number for form inputs
const numberOrString = z.union([
  z.number(),
  z.string().transform((val) => {
    const parsed = parseFloat(val);
    return isNaN(parsed) ? 0 : parsed;
  })
]);

export const productSchema = z.object({
  name: z.string().min(3, "Product name must be at least 3 characters"),
  model: z.string().optional().or(z.literal('')),
  brand: z.string().optional().or(z.literal('')),
  category_id: z.string().min(1, "Category is required"),
  cost_price: z.number().or(z.string().transform((v) => parseFloat(v) || 0)).pipe(
    z.number().nonnegative("Cost price cannot be negative")
  ),
  unit_price: z.number().or(z.string().transform((v) => parseFloat(v) || 0)).pipe(
    z.number().positive("Unit price must be more than 0")
  ),
  description: z.string().optional().or(z.literal('')),
  barcode: z.string().optional().or(z.literal('')),
  stock_value: z.number().or(z.string().transform((v) => parseInt(v) || 0)).pipe(
    z.number().int().nonnegative("Stock cannot be negative")
  ),
  type: z.string().optional().or(z.literal('')),
  status: z.string().optional().or(z.literal('')),
  image: z.string().url("Invalid image URL").optional().or(z.literal('')),
});

export const orderSchema = z.object({
  order_number: z.string().min(1),
  customer: z.string().min(2, "Customer name is required"),
  total_amount: z.number().positive(),
  status: z.enum(['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']),
});

export const customerSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().min(0),
  phone: z.string().min(0),
  address: z.string().min(0),
  city: z.string().min(0),
  postalCode: z.string().min(0),
  country: z.string().min(0),
});

export const storeSettingsSchema = z.object({
  storeName: z.string().min(2, "Store name is required"),
  address: z.string().min(5, "Address is required"),
  email: z.string().email("Invalid store email"),
  phone: z.string().min(7, "Phone number is required"),
  logoUrl: z.string().url("Invalid logo URL").optional().or(z.literal('')),
  currency: z.string().min(1, "Currency is required"),
  taxRate: z.number().min(0).max(100),
});

export const storeSchema = z.object({
  store_id: z.string().optional(),
  name: z.string().min(2, 'Store name is required'),
  code: z.string().min(1, 'Store code is required'),
  address: z.string().optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  status: z.enum(['Active', 'Inactive']).optional(),
  currency_symbol: z.string().optional().or(z.literal('')),
  tax_rate: z.number().or(z.string().transform((v) => parseFloat(v) || 0)).optional()
});

export const StockReceiptitemsSchema = z.object({
  receipt_item_id: z.string().min(1, "Receipt item ID is required"),
  receipt_id: z.string().min(1, "Receipt ID is required"),
  product_id: z.string().min(1, "Product ID is required"),
  variant_id: z.string().min(1, "Variant ID is required"),
  serial_id: z.string().min(1, "Serial ID is required"),
  lot_number: z.string().min(1, "Lot number is required"),
  expires_at: z.string().min(1, "Expires at is required"),
  quantity: z.number().min(1, "Quantity is required"),
  unit_cost: z.number().min(1, "Unit cost is required"),
  area_id: z.string().min(1, "Area ID is required"),
})

export const stockReceiptSchema = z.object({
  receipt_id: z.string().optional(),
  supplier_name: z.string().min(1, "Supplier name is required"),
  status: z.enum(['Posted', 'Draft', 'Cancelled']),
  receipt_number: z.string(),
  notes: z.string(),
  created_at: z.string(),
  created_by: z.string(),
  //stock_receiptitems: z.array(StockReceiptitemsSchema),
})

export const stockAreaSchema = z.object({
  area_id: z.string().optional(),
  name: z.string().min(2, "Area name is required"),
  status: z.string().min(0),
  type: z.enum(['Ambient', 'Cold', 'Hazardous', 'Display']).optional(),
  capacity: z.number().int().min(0, "Capacity must be 0 or greater"),
  currentUsage: z.number().int().min(0).optional(),
  description: z.string().optional().or(z.literal('')),
  store_id: z.string().optional().or(z.literal('')),
});

export const loyaltySchema = z.object({
  id: z.string().optional(),
  points_per_currency: z.number().min(0),
  currency_per_point: z.number().min(0),
  min_redemption_points: z.number().int().min(0),
  enabled: z.boolean(),
});

export const supplierSchema = z.object({
  supplier_id: z.string().optional(),
  name: z.string().min(2, "Supplier name is required"),
  contact_name: z.string().optional().or(z.literal('')),
  email: z.string().email("Invalid email address").optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  address: z.string().optional().or(z.literal('')),
  category: z.string().optional().or(z.literal('')),
  status: z.enum(['Active', 'Inactive']).default('Active'),
});

export type ProductInput = z.infer<typeof productSchema>;
export type OrderInput = z.infer<typeof orderSchema>;
export type CustomerInput = z.infer<typeof customerSchema>;
export type StoreSettingsInput = z.infer<typeof storeSettingsSchema>;
export type StoreInput = z.infer<typeof storeSchema>;
export type StockReceiptitems = z.infer<typeof StockReceiptitemsSchema>;
export type StockReceipt = z.infer<typeof stockReceiptSchema>;
export type StockAreaInput = z.infer<typeof stockAreaSchema>;
export type SupplierInput = z.infer<typeof supplierSchema>;
export type LoyaltyInput = z.infer<typeof loyaltySchema>;
