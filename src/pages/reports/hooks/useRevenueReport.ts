import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase';
import { getDateRangeForPeriod } from '../utils/dateUtils';
import type { ReportPeriod, RevenueReport } from '../../../types/reports';

interface UseRevenueReportOptions {
  period: ReportPeriod;
  customStartDate?: string;
  customEndDate?: string;
}

export function useRevenueReport(options: UseRevenueReportOptions) {
  const { period, customStartDate, customEndDate } = options;
  const { startDate, endDate } = getDateRangeForPeriod(period, customStartDate, customEndDate);

  const { data, isLoading, error } = useQuery({
    queryKey: ['revenue-report', period, customStartDate, customEndDate],
    queryFn: async (): Promise<RevenueReport> => {
      const { data: orders, error } = await supabase
        .from('orders')
        .select('*')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString())
        .order('created_at', { ascending: true });

      if (error) throw error;

      const totalRevenue = orders.reduce((sum, o) => sum + (o.amount || 0), 0);
      const totalTransactions = orders.length;
      const averageOrderValue = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;

      // Revenue by payment method
      const revenueByPaymentMethod: Record<string, number> = {};
      orders.forEach((o) => {
        const method = o.payment_method || 'Unknown';
        revenueByPaymentMethod[method] = (revenueByPaymentMethod[method] || 0) + (o.amount || 0);
      });

      // Daily trend
      const trendMap: Record<string, { dailyRevenue: number; transactionCount: number }> = {};
      orders.forEach((o) => {
        const dateKey = o.created_at?.split('T')[0] || '';
        if (!trendMap[dateKey]) {
          trendMap[dateKey] = { dailyRevenue: 0, transactionCount: 0 };
        }
        trendMap[dateKey].dailyRevenue += o.amount || 0;
        trendMap[dateKey].transactionCount += 1;
      });

      const trend = Object.entries(trendMap)
        .map(([date, values]) => ({ date, ...values }))
        .sort((a, b) => a.date.localeCompare(b.date));

      return {
        summary: {
          totalRevenue,
          averageOrderValue,
          totalTransactions,
          revenueByPaymentMethod,
        },
        trend,
      };
    },
  });

  return {
    report: data || { summary: { totalRevenue: 0, averageOrderValue: 0, totalTransactions: 0, revenueByPaymentMethod: {} }, trend: [] },
    isLoading,
    error,
  };
}
