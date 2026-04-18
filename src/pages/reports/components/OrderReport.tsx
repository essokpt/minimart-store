import { motion } from 'motion/react';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { ReportTable } from './ReportTable';
import { ReportSummaryCards } from './ReportSummaryCards';
import { BarChart3 } from 'lucide-react';
import { useOrderReport } from '../hooks/useOrderReport';
import { formatCurrency } from '../../../lib/formatters';
import { formatDateForDisplay } from '../utils/dateUtils';
import type { ReportPeriod } from '../../../types/reports';

interface OrderReportProps {
  period: ReportPeriod;
  customStartDate?: string;
  customEndDate?: string;
  statusFilter?: string;
  paymentMethodFilter?: string;
}

export function OrderReport({ period, customStartDate, customEndDate, statusFilter, paymentMethodFilter }: OrderReportProps) {
  const { report, isLoading } = useOrderReport({ period, customStartDate, customEndDate, statusFilter, paymentMethodFilter });

  const maxRevenue = Math.max(...report.trend.map((t) => t.revenue), 1);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <ReportSummaryCards
        totalRevenue={report.summary.totalRevenue}
        totalOrders={report.summary.totalOrders}
        averageOrderValue={report.summary.averageOrderValue}
        isLoading={isLoading}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6" variant="elevated">
          <h3 className="text-lg font-headline font-bold mb-6 flex items-center gap-2">
            <BarChart3 size={20} className="text-primary" />
            Order Trend
          </h3>
          {isLoading ? (
            <div className="h-48 bg-surface-container-low rounded animate-pulse" />
          ) : report.trend.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-on-surface-variant italic">
              No order data for this period
            </div>
          ) : (
            <div className="space-y-3">
              {report.trend.map((t) => (
                <div key={t.date} className="flex items-center gap-4">
                  <span className="text-xs font-mono font-bold text-on-surface-variant w-24 shrink-0">
                    {formatDateForDisplay(t.date)}
                  </span>
                  <div className="flex-1 bg-surface-container-low rounded-full h-8 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all duration-500 flex items-center justify-end pr-3"
                      style={{ width: `${(t.revenue / maxRevenue) * 100}%` }}
                    >
                      <span className="text-xs font-bold text-on-primary">
                        {formatCurrency(t.revenue)}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-on-surface-variant w-16 text-right shrink-0">
                    {t.orderCount} orders
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-6" variant="elevated">
          <h3 className="text-lg font-headline font-bold mb-6">Status Breakdown</h3>
          {isLoading ? (
            <div className="h-48 bg-surface-container-low rounded animate-pulse" />
          ) : (
            <div className="space-y-4">
              {Object.entries(report.summary.orderCountByStatus).map(([status, count]) => {
                const percentage = report.summary.totalOrders > 0
                  ? ((count / report.summary.totalOrders) * 100).toFixed(1)
                  : '0';
                return (
                  <div key={status} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Badge
                        variant={
                          status === 'Delivered' || status === 'Completed' ? 'success' :
                          status === 'Cancelled' ? 'error' :
                          status === 'Processing' || status === 'Pending' ? 'warning' :
                          'info'
                        }
                      >
                        {status}
                      </Badge>
                      <span className="text-sm font-mono font-bold text-on-surface">
                        {count} ({percentage}%)
                      </span>
                    </div>
                    <div className="h-2 bg-surface-container-low rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          status === 'Delivered' || status === 'Completed' ? 'bg-green-500' :
                          status === 'Cancelled' ? 'bg-red-500' :
                          status === 'Processing' || status === 'Pending' ? 'bg-amber-500' :
                          'bg-blue-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
              {Object.keys(report.summary.orderCountByStatus).length === 0 && (
                <div className="text-center text-on-surface-variant italic py-8">
                  No status data available
                </div>
              )}
            </div>
          )}
        </Card>
      </div>

      <Card className="p-6" variant="elevated">
        <h3 className="text-lg font-headline font-bold mb-6">Order Details</h3>
        <ReportTable
          data={report.details}
          pageSize={10}
          emptyMessage="No orders found for this period"
          columns={[
            { key: 'order_number', header: 'Order #', sortable: true },
            { key: 'created_at', header: 'Date', sortable: true, render: (v) => formatDateForDisplay(v as string) },
            { key: 'customer', header: 'Customer', sortable: true },
            { key: 'amount', header: 'Amount', sortable: true, render: (v) => formatCurrency(v as number) },
            { key: 'status', header: 'Status', render: (v) => (
              <Badge variant={
                v === 'Delivered' || v === 'Completed' ? 'success' :
                v === 'Cancelled' ? 'error' :
                v === 'Processing' || v === 'Pending' ? 'warning' :
                'info'
              }>
                {v as string}
              </Badge>
            )},
            { key: 'payment_method', header: 'Payment', sortable: true },
          ]}
        />
      </Card>
    </motion.div>
  );
}
