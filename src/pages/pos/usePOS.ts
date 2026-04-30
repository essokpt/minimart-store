import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { Order, OrderItem } from '../../types';
import { useNotificationStore } from '../../store/useNotificationStore';
import { Stock_receiptitems } from '../../types';

export function usePOS() {
  const queryClient = useQueryClient();
  const { addNotification } = useNotificationStore();

  // Lookup barcode from stock_receipt_items table ONLY
  const lookupBarcode = async (barcode: string) => {
    // Try stock_receipt_items table (check SKU, lot_number, or serial_id)
    // Note: We use .or to check multiple potential barcode/identifier fields
    const { data: receiptItem, error: rError } = await supabase
      .from('stock_receipt_items')
      //.from('products')
      .select('*, product:products(*, category:product_categories(*))')
      .or(`barcode.eq.${barcode}`)
      .eq('status', 'in-stock')
      .gt('quantity', 0)
    //.maybeSingle();

    console.log('find product:', barcode, receiptItem)
    const item: any = receiptItem?.length ? receiptItem[0] : null;
    if (item) {
      return {
        ...item.product,
        receipt_item_id: item.receipt_item_id, // Keep track of which receipt item it came from
        sku: item.sku,
        lot_number: item.lot_number
      };
    };
    return null;
  }
  // Mutation to deduct stock after sale
  const deductStock = useMutation({
    mutationFn: async (items: { product_id: string; qty: number; receipt_item_id?: number }[]) => {
      const results = await Promise.all(items.map(async (item) => {
        const operations = [];

        // 1. Update master product inventory
        const { data: product } = await supabase
          .from('products')
          .select('stock_value')
          .eq('product_id', item.product_id)
          .single();

        const currentMasterStock = product?.stock_value || 0;
        const newMasterStock = Math.max(0, currentMasterStock - item.qty);

        operations.push(
          supabase
            .from('products')
            .update({ stock_value: newMasterStock })
            .eq('product_id', item.product_id)
        );

        // 2. If we have a specific receipt item, update its quantity too
        if (item.receipt_item_id) {
          const { data: receiptItem } = await supabase
            .from('stock_receipt_items')
            .select('quantity')
            .eq('receipt_item_id', item.receipt_item_id)
            .single();

          const currentReceiptQty = receiptItem?.quantity || 0;
          const newReceiptQty = Math.max(0, currentReceiptQty - item.qty);

          operations.push(
            supabase
              .from('stock_receipt_items')
              .update({ quantity: newReceiptQty })
              .eq('receipt_item_id', item.receipt_item_id)
          );
        }

        const responses = await Promise.all(operations);
        const error = responses.find(r => r.error)?.error;
        if (error) throw error;

        return responses.map(r => r.data);
      }));
      return results;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['stock-receipts'] });
      queryClient.invalidateQueries({ queryKey: ['area-detail'] });
    }
  });

  // Mutation for POS checkout (create order)
  const checkout = useMutation({
    mutationFn: async (orderData: Partial<Order>) => {
      const { data, error } = await supabase
        .from('orders')
        .insert([orderData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    }
  });

  const createOrderItems = useMutation({
    mutationFn: async (items: Partial<OrderItem>[]) => {
      const { data, error } = await supabase
        .from('order_items')
        .insert(items)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    }
  });

  return {
    checkout,
    lookupBarcode,
    deductStock,
    createOrderItems
  };
}
