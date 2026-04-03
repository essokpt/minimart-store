import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { Category } from '../../types';
import { useNotificationStore } from '../../store/useNotificationStore';

export function useCategories() {
  const queryClient = useQueryClient();
  const { addNotification } = useNotificationStore();

  // Fetch all categories
  const { data: categories = [], isLoading, error } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('product_categories')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        addNotification('error', `Failed to load categories: ${error.message}`);
        throw error;
      }
      return data as Category[];
    }
  });

  // Create category
  const createCategory = useMutation({
    mutationFn: async (newName: string) => {
      const { data, error } = await supabase
        .from('product_categories')
        .insert([{ name: newName }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      addNotification('success', `Category "${data.name}" created successfully`);
    },
    onError: (error: any) => {
      addNotification('error', `Failed to create category: ${error.message}`);
    }
  });

  // Delete category
  const deleteCategory = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('product_categories')
        .delete()
        .eq('category_id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      addNotification('success', 'Category deleted successfully');
    },
    onError: (error: any) => {
      addNotification('error', `Failed to delete category: ${error.message}`);
    }
  });

  // Update category
  const updateCategory = useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      const { data, error } = await supabase
        .from('product_categories')
        .update({ name })
        .eq('category_id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      addNotification('success', `Category updated to "${data.name}"`);
    },
    onError: (error: any) => {
      addNotification('error', `Failed to update category: ${error.message}`);
    }
  });

  return {
    categories,
    isLoading,
    error,
    createCategory,
    updateCategory,
    deleteCategory
  };
}
