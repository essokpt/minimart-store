import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { LoyaltySettings } from '../../types';
import { LoyaltyInput } from '../../lib/validations';

export function useLoyalty() {
  const queryClient = useQueryClient();

  const { data: settings, isLoading, error } = useQuery({
    queryKey: ['loyalty-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('loyalty_settings')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 is code for no rows found
      return data as LoyaltySettings | null;
    }
  });

  const updateSettings = useMutation({
    mutationFn: async (updates: LoyaltyInput) => {
      const { data, error } = await supabase
        .from('loyalty_settings')
        .upsert({ id: 'default', ...updates })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loyalty-settings'] });
    }
  });

  return {
    settings,
    isLoading,
    error,
    updateSettings
  };
}
