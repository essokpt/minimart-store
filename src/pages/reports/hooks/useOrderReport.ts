import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase';
import { getDateRangeForPeriod } from '../utils/dateUtils';
import type { ReportPeriod, OrderReport, OrderReportTrend, OrderReportDetail } from '../../../types/reports';

interface UseOrderReportOptions {
  period: ReportPeriod;
  customStartDate?: string;
  customEndDate?: string;
  statusFilter?: string;
  paymentMethodFilter?: string;
  groupBy?: 'daily' | 'weekly' | 'monthly';
}

export function useOrderReport(options: UseOrderReportOptions) {
  const { period, customStartDate, customEndDate, statusFilter, paymentMethodFilter, groupBy = 'daily' } = options;
  const { startDate, endDate } = getDateRangeForPeriod(period, customStartDate, customEndDate);

  const { data, isLoading, error } = useQuery({
    queryKey: ['order-report', period, customStartDate, customEndDate, statusFilter, paymentMethodFilter],
    queryFn: async (): Promise<OrderReport> => {
      let query = supabase
        .from('orders')
        .select('*')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString())
        .order('created_at', { ascending: true });

      if (statusFilter && statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      if (paymentMethodFilter && paymentMethodFilter !== 'all') {
        query = query.eq('payment_method', paymentMethodFilter);
      }

      const { data: orders, error } = await query;

      if (error) throw error;

      // Calculate summary
      const totalOrders = orders.length;
      const totalRevenue = orders.reduce((sum, o) => sum + (o.amount || 0), 0);
      const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

      const orderCountByStatus: Record<string, number> = {};
      orders.forEach((o) => {
        orderCountByStatus[o.status] = (orderCountByStatus[o.status] || 0) + 1;
      });

      // Calculate trend (group by date)
      const trendMap: Record<string, OrderReportTrend> = {};

      orders.forEach((o) => {
        const dateKey = o.created_at?.split('T')[0] || '';
        if (!trendMap[dateKey]) {
          trendMap[dateKey] = { date: dateKey, orderCount: 0, revenue: 0 };
        }
        trendMap[dateKey].orderCount += 1;
        trendMap[dateKey].revenue += o.amount || 0;
      });

      const trend = Object.values(trendMap).sort((a, b) => a.date.localeCompare(b.date));

      // Details
      const details: OrderReportDetail[] = orders.map((o) => ({
        id: o.id,
        order_number: o.order_number,
        customer: o.customer,
        created_at: o.created_at || '',
        amount: o.amount || 0,
        status: o.status,
        payment_method: o.payment_method,
        order_type: o.order_type,
      }));

      return {
        summary: {
          totalOrders,
          totalRevenue,
          averageOrderValue,
          orderCountByStatus,
        },
        trend,
        details,
      };
    },
  });

  return {
    report: data || { summary: { totalOrders: 0, totalRevenue: 0, averageOrderValue: 0, orderCountByStatus: {} }, trend: [], details: [] },
    isLoading,
    error,
  };
}
