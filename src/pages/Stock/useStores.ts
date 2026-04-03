import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { Store } from '../../types';

export function useStores() {
  const queryClient = useQueryClient();

  // Fetch all stores
  const { data: stores = [], isLoading, error } = useQuery({
    queryKey: ['stores'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stores')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      return data as Store[];
    }
  });

  // Create store
  const createStore = useMutation({
    mutationFn: async (newStore: Partial<Store>) => {
      const { data, error } = await supabase
        .from('stores')
        .insert([newStore])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stores'] });
    }
  });

  // Update store
  const updateStore = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Store> }) => {
      const { data, error } = await supabase
        .from('stores')
        .update(updates)
        .eq('store_id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stores'] });
    }
  });

  // Delete store
  const deleteStore = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('stores')
        .delete()
        .eq('store_id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stores'] });
    }
  });

  return {
    stores,
    isLoading,
    error,
    createStore,
    updateStore,
    deleteStore
  };
}
