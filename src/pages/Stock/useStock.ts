import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { Product, StockArea, StockReceipt, Stock_receiptitems } from '../../types';
import { useNotificationStore } from '../../store/useNotificationStore';

export function useStock() {
  const queryClient = useQueryClient();
  const { addNotification } = useNotificationStore();

  // Fetch all products
  const { data: stocks = [], isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        addNotification('error', `Failed to load stock: ${error.message}`);
        throw error;
      }
      return data as Product[];
    }
  });

  const { data: stockArea = [], isLoading: isLoadingArea, error: errorArea } = useQuery({
    queryKey: ['area'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('areas')
        .select('*');

      if (error) {
        addNotification('error', `Failed to load stock areas: ${error.message}`);
        throw error;
      }
      return data as StockArea[];
    }
  });

  const { data: stockReceipts = [], isLoading: isLoadingReceipt, error: errorReceipt } = useQuery({
    queryKey: ['stockReceipt'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stock_receipts')
        .select('*');

      if (error) {
        addNotification('error', `Failed to load stock areas: ${error.message}`);
        throw error;
      }
      return data as StockReceipt[];
    }
  });

  // const { data: stockReceiptDetails = [], isLoading: isLoadingReceiptDetails, error: errorReceiptDetails } = useQuery({
  //   queryKey: ['stockReceiptDetails'],
  //   queryFn: async function (id:any) {
  //     const { data, error } = await supabase
  //       .from('stock_receipts')
  //       .select('*,stock_receipt_items(*)')
  //       .eq('receipt_id', id)
  //       .single();

  //     if (error) {
  //       addNotification('error', `Failed to load stock areas: ${error.message}`);
  //       throw error;
  //     }
  //     return data as StockReceipt;
  //   }
  // });


  // Create product
  const createProduct = useMutation({
    mutationFn: async (newProduct: Partial<Product>) => {
      const { data, error } = await supabase
        .from('stock')
        .insert([newProduct])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['stock'] });
      addNotification('success', `Stock item "${data.name || 'New Item'}" created`);
    },
    onError: (error: any) => {
      addNotification('error', `Failed to create stock item: ${error.message}`);
    }
  });

  const createStockReceipt = useMutation({
    mutationFn: async (newProduct: Partial<StockReceipt>) => {
      const { data, error } = await supabase
        .from('stock_receipts')
        .insert([newProduct])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['stock'] });
      addNotification('success', `Stock item "${data.name || 'New Item'}" created`);
    },
    onError: (error: any) => {
      addNotification('error', `Failed to create stock item: ${error.message}`);
    }
  });

  const createStockReceiptItem = useMutation({
    mutationFn: async (newStockReceiptItem: Partial<Stock_receiptitems>) => {
      const { data, error } = await supabase
        .from('stock_receipt_items')
        .insert([newStockReceiptItem])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['stock_receipt_items'] });
      addNotification('success', `Stock item "${data.name || 'New Item'}" created`);
    },
    onError: (error: any) => {
      addNotification('error', `Failed to create stock item: ${error.message}`);
    }
  });

  // Update product
  const updateProduct = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Product> }) => {
      const { data, error } = await supabase
        .from('stock')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['stock'] });
      addNotification('success', `Stock item "${data.name}" updated`);
    },
    onError: (error: any) => {
      addNotification('error', `Failed to update stock item: ${error.message}`);
    }
  });

  // Delete product
  const deleteProduct = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('stock')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stock'] });
      addNotification('success', 'Stock item deleted successfully');
    },
    onError: (error: any) => {
      addNotification('error', `Failed to delete stock item: ${error.message}`);
    }
  });

  // Create area
  const createArea = useMutation({
    mutationFn: async (newArea: Partial<StockArea>) => {
      const { data, error } = await supabase
        .from('areas')
        .insert([newArea])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['area'] });
      addNotification('success', `Area "${data.name}" created successfully`);
    },
    onError: (error: any) => {
      addNotification('error', `Failed to create area: ${error.message}`);
    }
  });

  // Update area
  const updateArea = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<StockArea> }) => {
      const { data, error } = await supabase
        .from('areas')
        .update(updates)
        .eq('area_id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['area'] });
      addNotification('success', `Area "${data.name}" updated`);
    },
    onError: (error: any) => {
      addNotification('error', `Failed to update area: ${error.message}`);
    }
  });

  // Delete area
  const deleteArea = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('areas')
        .delete()
        .eq('areas_id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['area'] });
      addNotification('success', 'Area deleted successfully');
    },
    onError: (error: any) => {
      addNotification('error', `Failed to delete area: ${error.message}`);
    }
  });

  return {
    stocks,
    stockArea,
    isLoading,
    isLoadingArea,
    error,
    errorArea,
    createProduct,
    updateProduct,
    deleteProduct,
    createArea,
    updateArea,
    deleteArea,
    stockReceipts,
    isLoadingReceipt,
    errorReceipt,
    createStockReceipt,
    createStockReceiptItem,
    // stockReceiptDetails,
    // isLoadingReceiptDetails,
    // errorReceiptDetails
  };
}
