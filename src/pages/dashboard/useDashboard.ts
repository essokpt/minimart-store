import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { stats as mockStats, topSelling as mockTopSelling } from '../../data/mockData';

export function useDashboard() {
  // Fetch real-time stats from Supabase
  const { data: stats = mockStats, isLoading: isLoadingStats, error: errorStats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      // In a real app, you'd calculate these from your tables
      // For now, we mix mock data with some real counts if possible
      const { count: ordersCount } = await supabase.from('orders').select('*', { count: 'exact', head: true });
      const { count: productsCount } = await supabase.from('products').select('*', { count: 'exact', head: true });

      return mockStats.map(stat => {
        if (stat.label === 'Active Orders') return { ...stat, value: String(ordersCount || 0) };
        if (stat.label === 'Total Products') return { ...stat, value: String(productsCount || 0) }; // Assuming we add this stat
        return stat;
      });
    }
  });

  const { data: topSelling = mockTopSelling, isLoading: isLoadingTopSelling, error: errorTopSelling } = useQuery({
    queryKey: ['top-selling'],
    queryFn: async () => {
      // Logic to fetch top selling products from Supabase
      return mockTopSelling;
    }
  });

  return {
    stats,
    topSelling,
    isLoading: isLoadingStats || isLoadingTopSelling,
    error: errorStats || errorTopSelling
  };
}
