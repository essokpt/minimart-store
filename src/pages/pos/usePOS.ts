import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { Order } from '../../types';
import { useNotificationStore } from '../../store/useNotificationStore';

export function usePOS() {
  const queryClient = useQueryClient();
  const { addNotification } = useNotificationStore();

  // Handle high-level POS operations (like checkout)
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
    onSuccess: (data: any) => {
      // Invalidate both orders and dashboard stats since a new order affects both
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      addNotification('success', `Transaction #${data.id} completed successfully`);
    },
    onError: (error: any) => {
      addNotification('error', `Checkout failed: ${error.message}`);
    }
  });

  return {
    checkout
  };
}
