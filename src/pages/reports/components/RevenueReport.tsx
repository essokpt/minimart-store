import { motion } from 'motion/react';
import { Card } from '../../../components/ui/Card';
import { DollarSign, CreditCard, TrendingUp } from 'lucide-react';
import { useRevenueReport } from '../hooks/useRevenueReport';
import { formatCurrency } from '../../../lib/formatters';
import { formatDateForDisplay } from '../utils/dateUtils';
import type { ReportPeriod } from '../../../types/reports';

interface RevenueReportProps {
  period: ReportPeriod;
  customStartDate?: string;
  customEndDate?: string;
}

export function RevenueReport({ period, customStartDate, customEndDate }: RevenueReportProps) {
  const { report, isLoading } = useRevenueReport({ period, customStartDate, customEndDate });

  const maxRevenue = Math.max(...report.trend.map((t) => t.dailyRevenue), 1);

  const paymentColors: Record<string, string> = {
    cash: 'bg-green-500',
    'bank transfer': 'bg-blue-500',
    card: 'bg-purple-500',
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="p-6" variant="elevated">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
              Total Revenue
            </span>
            <div className="p-2 rounded-full bg-primary/10">
              <DollarSign size={16} className="text-primary" />
            </div>
          </div>
          <p className="text-2xl font-headline font-extrabold text-on-surface">
            {isLoading ? '...' : formatCurrency(report.summary.totalRevenue)}
          </p>
        </Card>

        <Card className="p-6" variant="elevated">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
              Avg Order Value
            </span>
            <div className="p-2 rounded-full bg-secondary/10">
              <TrendingUp size={16} className="text-secondary" />
            </div>
          </div>
          <p className="text-2xl font-headline font-extrabold text-on-surface">
            {isLoading ? '...' : formatCurrency(report.summary.averageOrderValue)}
          </p>
        </Card>

        <Card className="p-6" variant="elevated">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
              Transactions
            </span>
            <div className="p-2 rounded-full bg-tertiary/10">
              <CreditCard size={16} className="text-tertiary" />
            </div>
          </div>
          <p className="text-2xl font-headline font-extrabold text-on-surface">
            {isLoading ? '...' : report.summary.totalTransactions}
          </p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6" variant="elevated">
          <h3 className="text-lg font-headline font-bold mb-6">Daily Revenue Trend</h3>
          {isLoading ? (
            <div className="h-64 bg-surface-container-low rounded animate-pulse" />
          ) : report.trend.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-on-surface-variant italic">
              No revenue data for this period
            </div>
          ) : (
            <div className="space-y-4">
              {report.trend.map((t) => (
                <div key={t.date} className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-mono font-bold text-on-surface-variant">
                      {formatDateForDisplay(t.date)}
                    </span>
                    <span className="font-bold text-on-surface">
                      {formatCurrency(t.dailyRevenue)}
                    </span>
                  </div>
                  <div className="h-6 bg-surface-container-low rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500"
                      style={{ width: `${(t.dailyRevenue / maxRevenue) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-on-surface-variant">
                    <span>{t.transactionCount} transactions</span>
                    <span>avg {formatCurrency(t.transactionCount > 0 ? t.dailyRevenue / t.transactionCount : 0)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-6" variant="elevated">
          <h3 className="text-lg font-headline font-bold mb-6">Revenue by Payment Method</h3>
          {isLoading ? (
            <div className="h-64 bg-surface-container-low rounded animate-pulse" />
          ) : Object.keys(report.summary.revenueByPaymentMethod).length === 0 ? (
            <div className="h-64 flex items-center justify-center text-on-surface-variant italic">
              No payment data available
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(report.summary.revenueByPaymentMethod).map(([method, amount]) => {
                const percentage = report.summary.totalRevenue > 0
                  ? ((amount / report.summary.totalRevenue) * 100).toFixed(1)
                  : '0';
                return (
                  <div key={method} className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${paymentColors[method.toLowerCase()] || 'bg-slate-400'}`} />
                        <span className="text-sm font-bold text-on-surface capitalize">{method}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-mono font-bold text-on-surface">
                          {formatCurrency(amount)}
                        </span>
                        <span className="text-xs text-on-surface-variant ml-2">({percentage}%)</span>
                      </div>
                    </div>
                    <div className="h-3 bg-surface-container-low rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${paymentColors[method.toLowerCase()] || 'bg-slate-400'}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}

              <div className="pt-4 border-t border-outline-variant/20">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-on-surface-variant uppercase tracking-widest">Total</span>
                  <span className="text-lg font-headline font-extrabold text-on-surface">
                    {formatCurrency(report.summary.totalRevenue)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </motion.div>
  );
}
