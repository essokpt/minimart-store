import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';

export function useReports() {
  const { data: recentTransactions = [], isLoading, error } = useQuery({
    queryKey: ['recent-transactions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data;
    }
  });

  return {
    recentTransactions,
    isLoading,
    error
  };
}
