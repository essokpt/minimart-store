import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { StoreSettingsInput } from '../../lib/validations';

export function useStoreSettings() {
  const queryClient = useQueryClient();

  const settingsQuery = useQuery({
    queryKey: ['store-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('store_settings')
        .select('*')
        .single();
      
      if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "no rows returned"
      return data as StoreSettingsInput | null;
    },
  });

  const updateSettingsMutation = useMutation({
    mutationFn: async (newSettings: StoreSettingsInput) => {
      // Assuming a single row with id 1 exists or using upsert
      const { data, error } = await supabase
        .from('store_settings')
        .upsert({ id: 1, ...newSettings })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['store-settings'] });
    },
  });

  return {
    settings: settingsQuery.data,
    isLoading: settingsQuery.isLoading,
    error: settingsQuery.error,
    updateSettings: updateSettingsMutation.mutateAsync,
    isUpdating: updateSettingsMutation.isPending,
  };
}
