import { motion } from 'motion/react';
import { BarChart, PieChart, LineChart, Download, Calendar, Filter } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';

import { useReports } from './useReports';
import { ErrorState } from '../../components/ui/ErrorState';
import { Loading } from '@/src/components/ui/Loading';

export function Reports() {
  const { recentTransactions, isLoading, error } = useReports();

  if (isLoading) {
    return (
      <Loading />
    );
  }

  if (error) {
    return (
      <div className="h-[calc(100vh-120px)] flex items-center justify-center">
        <ErrorState onRetry={() => window.location.reload()} />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-12"
    >
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-headline font-extrabold text-on-surface tracking-tight mb-2">Analytics & Reports</h2>
          <p className="text-on-surface-variant font-medium">Detailed insights into your store's financial health and operational efficiency.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary">
            <Calendar size={18} />
            Last 30 Days
          </Button>
          <Button>
            <Download size={18} />
            Download Report
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 p-8" variant="elevated">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-xl font-headline font-bold flex items-center gap-3">
              <LineChart size={24} className="text-primary" />
              Revenue Growth
            </h3>
            <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-sm bg-primary"></div>
                <span>Current Period</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-sm bg-slate-200"></div>
                <span>Previous Period</span>
              </div>
            </div>
          </div>
          <div className="h-80 bg-surface-container-low/30 rounded-md flex items-center justify-center border border-dashed border-outline-variant/20">
            <p className="text-on-surface-variant font-medium italic text-sm">Interactive chart visualization would render here.</p>
          </div>
        </Card>

        <Card className="p-8" variant="elevated">
          <h3 className="text-xl font-headline font-bold mb-8 flex items-center gap-3">
            <PieChart size={24} className="text-secondary" />
            Category Distribution
          </h3>
          <div className="aspect-square bg-surface-container-low/30 rounded-md flex items-center justify-center border border-dashed border-outline-variant/20 mb-8">
            <div className="w-3/4 h-3/4 rounded-full border-[20px] border-primary/20 border-t-primary border-r-secondary border-b-tertiary"></div>
          </div>
          <div className="space-y-4">
            {[
              { label: 'Gourmet', value: '42%', color: 'bg-primary' },
              { label: 'Beverages', value: '28%', color: 'bg-secondary' },
              { label: 'Produce', value: '18%', color: 'bg-tertiary' },
              { label: 'Other', value: '12%', color: 'bg-slate-200' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-sm ${item.color}`}></div>
                  <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">{item.label}</span>
                </div>
                <span className="text-sm font-mono font-bold text-on-surface">{item.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-8" variant="elevated">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-xl font-headline font-bold flex items-center gap-3">
            <BarChart size={24} className="text-tertiary" />
            Recent Transactions
          </h3>
          <Button variant="ghost" size="sm">View All History</Button>
        </div>
        <div className="space-y-1">
          {recentTransactions.length === 0 && (
            <div className="p-8 text-center text-on-surface-variant italic">No recent transactions found.</div>
          )}
          {recentTransactions.map((tr: any, i: number) => (
            <div key={tr.id || i} className="flex items-center justify-between p-4 hover:bg-surface-container-low rounded-md transition-colors cursor-pointer group border-b border-outline-variant/5 last:border-0">
              <div className="flex items-center gap-6">
                <span className="font-mono text-xs font-bold text-on-surface-variant">{tr.order_number || `#${tr.id}`}</span>
                <div>
                  <p className="text-sm font-bold text-on-surface">{tr.customer || tr.customer_name}</p>
                  <p className="text-[10px] text-on-surface-variant font-mono font-bold uppercase tracking-wider">
                    {tr.created_at ? new Date(tr.created_at).toLocaleString() : 'Recent'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-8">
                <Badge variant={tr.status === 'Delivered' || tr.status === 'Processing' ? 'primary' : (tr.status === 'Cancelled' ? 'error' : 'warning')}>
                  {tr.status}
                </Badge>
                <span className="text-sm font-mono font-bold text-on-surface w-20 text-right">
                  ${(tr.total_amount || 0).toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
}
