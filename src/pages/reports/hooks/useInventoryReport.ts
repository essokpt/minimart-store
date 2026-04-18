import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase';
import type { InventoryReport, InventoryReportStockItem } from '../../../types/reports';

export function useInventoryReport() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['inventory-report'],
    queryFn: async (): Promise<InventoryReport> => {
      const { data: products, error } = await supabase
        .from('products')
        .select('*, category:product_categories(name)')
        .order('name', { ascending: true });

      if (error) throw error;

      let totalStockValue = 0;
      let lowStockCount = 0;
      let outOfStockCount = 0;
      let inStockCount = 0;

      const stockLevels: InventoryReportStockItem[] = (products || []).map((p: any) => {
        const stockValue = p.stock_value || 0;
        const unitPrice = p.unit_price || 0;
        const costPrice = p.cost_price || 0;
        totalStockValue += stockValue * costPrice;

        let status: 'in_stock' | 'low_stock' | 'out_of_stock';
        if (stockValue === 0) {
          outOfStockCount++;
          status = 'out_of_stock';
        } else if (stockValue < 20) {
          lowStockCount++;
          status = 'low_stock';
        } else {
          inStockCount++;
          status = 'in_stock';
        }

        return {
          product_id: p.product_id,
          name: p.name,
          category: p.category?.name || 'Uncategorized',
          cost_price: costPrice,
          unit_price: unitPrice,
          stock_value: stockValue,
          status,
        };
      });

      return {
        summary: {
          totalProducts: products?.length || 0,
          totalStockValue,
          lowStockCount,
          outOfStockCount,
          inStockCount,
        },
        stockLevels,
      };
    },
  });

  return {
    report: data || { summary: { totalProducts: 0, totalStockValue: 0, lowStockCount: 0, outOfStockCount: 0, inStockCount: 0 }, stockLevels: [] },
    isLoading,
    error,
  };
}
