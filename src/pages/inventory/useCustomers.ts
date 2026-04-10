import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { Customer } from '../../types';

export function useCustomers() {
  const queryClient = useQueryClient();

  const { data: customers = [], isLoading, error } = useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('full_name', { ascending: true });

      if (error) throw error;
      return data as Customer[];
    }
  });

  const createCustomer = useMutation({
    mutationFn: async (newCustomer: Partial<Customer>) => {
      const { data, error } = await supabase
        .from('customers')
        .insert([newCustomer])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    }
  });

  const searchCustomers = async (query: string) => {
    if (!query) return [];
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .or(`full_name.ilike.%${query}%,email.ilike.%${query}%,phone.ilike.%${query}%`)
      .limit(10);
    
    if (error) throw error;
    return data as Customer[];
  };

  return {
    customers,
    isLoading,
    error,
    createCustomer,
    searchCustomers
  };
}
