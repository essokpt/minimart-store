import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { Product } from '../../types';
import { useNotificationStore } from '../../store/useNotificationStore';

export function useInventory() {
  const queryClient = useQueryClient();
  const { addNotification } = useNotificationStore();

  // Fetch all products
  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*, category:product_categories(*)')
        .order('name', { ascending: true });

      if (error) {
        addNotification('error', `Failed to load products: ${error.message}`);
        throw error;
      }
      return data as Product[];
    }
  });

  // Create product
  const createProduct = useMutation({
    mutationFn: async (newProduct: Partial<Product>) => {
      const { data, error } = await supabase
        .from('products')
        .insert([newProduct])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      addNotification('success', `Product "${data.name}" created successfully`);
    },
    onError: (error: any) => {
      addNotification('error', `Failed to create product: ${error.message}`);
    }
  });

  // Update product
  const updateProduct = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Product> }) => {
      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('product_id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      addNotification('success', `Product "${data.name}" updated successfully`);
    },
    onError: (error: any) => {
      addNotification('error', `Failed to update product: ${error.message}`);
    }
  });

  // Delete product
  const deleteProduct = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('product_id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      addNotification('success', 'Product deleted successfully');
    },
    onError: (error: any) => {
      addNotification('error', `Failed to delete product: ${error.message}`);
    }
  });

  // Upload image to Supabase Storage
  const uploadImage = useMutation({
    mutationFn: async (file: File) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { data, error: uploadError } = await supabase.storage
        .from('products')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('products')
        .getPublicUrl(filePath);

      return publicUrl;
    }
  });

  return {
    products,
    isLoading,
    error,
    createProduct,
    updateProduct,
    deleteProduct,
    uploadImage
  };
}

export function useProduct(id: string | undefined) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('product_id', id)
        .single();
      // .or(`product_id.eq.${id},barcode.eq.${id}`)
      // .maybeSingle();

      if (error) throw error;
      return data as unknown as Product;
    },
    enabled: !!id
  });
}
export function useProductSearch(query: string, categoryId?: string | null) {
  return useQuery({
    queryKey: ['product-search', query, categoryId],
    queryFn: async () => {
      let supabaseQuery = supabase
        .from('products')
        .select('*, category:product_categories(*)');

      if (query.trim()) {
        const searchTerm = `%${query.trim()}%`;
        supabaseQuery = supabaseQuery.or(`name.ilike.${searchTerm},brand.ilike.${searchTerm},model.ilike.${searchTerm},barcode.ilike.${searchTerm}`);
      }

      if (categoryId && categoryId !== 'all') {
        supabaseQuery = supabaseQuery.eq('category_id', categoryId);
      }

      const { data, error } = await supabaseQuery
        .order('name', { ascending: true })
        .limit(50);

      if (error) throw error;
      return data as Product[];
    },
    placeholderData: (previousData) => previousData,
  });
}
