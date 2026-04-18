export type ReportPeriod = 'today' | 'weekly' | 'monthly' | 'custom';
export type ReportType = 'orders' | 'inventory' | 'revenue';
export type GroupBy = 'daily' | 'weekly' | 'monthly';

export interface ReportFilters {
  period: ReportPeriod;
  customStartDate?: string;
  customEndDate?: string;
  reportType: ReportType;
  groupBy: GroupBy;
  statusFilter?: string;
  categoryFilter?: string;
  paymentMethodFilter?: string;
}

export interface OrderReportSummary {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  orderCountByStatus: Record<string, number>;
}

export interface OrderReportTrend {
  date: string;
  orderCount: number;
  revenue: number;
}

export interface OrderReportDetail {
  id: string;
  order_number: string;
  customer: string;
  created_at: string;
  amount: number;
  status: string;
  payment_method: string;
  order_type?: string;
}

export interface OrderReport {
  summary: OrderReportSummary;
  trend: OrderReportTrend[];
  details: OrderReportDetail[];
}

export interface InventoryReportStockItem {
  product_id: string;
  name: string;
  category: string;
  cost_price: number;
  unit_price: number;
  stock_value: number;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
}

export interface InventoryReport {
  summary: {
    totalProducts: number;
    totalStockValue: number;
    lowStockCount: number;
    outOfStockCount: number;
    inStockCount: number;
  };
  stockLevels: InventoryReportStockItem[];
}

export interface RevenueReport {
  summary: {
    totalRevenue: number;
    averageOrderValue: number;
    totalTransactions: number;
    revenueByPaymentMethod: Record<string, number>;
  };
  trend: Array<{
    date: string;
    dailyRevenue: number;
    transactionCount: number;
  }>;
}
