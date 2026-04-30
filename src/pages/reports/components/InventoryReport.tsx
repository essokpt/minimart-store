import { motion } from 'motion/react';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { ReportTable } from './ReportTable';
import { ReportSummaryCards } from './ReportSummaryCards';
import { Package, AlertTriangle, XCircle, CheckCircle } from 'lucide-react';
import { useInventoryReport } from '../hooks/useInventoryReport';
import { formatCurrency } from '../../../lib/formatters';

export function InventoryReport() {
  const { report, isLoading } = useInventoryReport();

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6" variant="elevated" data-report-summary>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
              Total Products
            </span>
            <div className="p-2 rounded-full bg-primary/10">
              <Package size={16} className="text-primary" />
            </div>
          </div>
          <p className="text-2xl font-headline font-extrabold text-on-surface">
            {isLoading ? '...' : report.summary.totalProducts}
          </p>
        </Card>

        <Card className="p-6" variant="elevated" data-report-summary>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
              Stock Value
            </span>
            <div className="p-2 rounded-full bg-secondary/10">
              <CheckCircle size={16} className="text-secondary" />
            </div>
          </div>
          <p className="text-2xl font-headline font-extrabold text-on-surface">
            {isLoading ? '...' : formatCurrency(report.summary.totalStockValue)}
          </p>
        </Card>

        <Card className="p-6" variant="elevated" data-report-summary>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
              Low Stock
            </span>
            <div className="p-2 rounded-full bg-amber-500/10">
              <AlertTriangle size={16} className="text-amber-600" />
            </div>
          </div>
          <p className="text-2xl font-headline font-extrabold text-on-surface">
            {isLoading ? '...' : report.summary.lowStockCount}
          </p>
        </Card>

        <Card className="p-6" variant="elevated" data-report-summary>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
              Out of Stock
            </span>
            <div className="p-2 rounded-full bg-error/10">
              <XCircle size={16} className="text-error" />
            </div>
          </div>
          <p className="text-2xl font-headline font-extrabold text-on-surface">
            {isLoading ? '...' : report.summary.outOfStockCount}
          </p>
        </Card>
      </div>

      <Card className="p-6" variant="elevated">
        <h3 className="text-lg font-headline font-bold mb-6">Stock Levels</h3>
        <ReportTable
          data={report.stockLevels}
          pageSize={15}
          emptyMessage="No products found"
          columns={[
            { key: 'name', header: 'Product', sortable: true },
            { key: 'category', header: 'Category', sortable: true },
            { key: 'stock_value', header: 'Stock', sortable: true },
            { key: 'unit_price', header: 'Unit Price', sortable: true, render: (v) => formatCurrency(v as number) },
            { key: 'cost_price', header: 'Cost Price', sortable: true, render: (v) => formatCurrency(v as number) },
            { key: 'status', header: 'Status', render: (v) => {
              const status = v as 'in_stock' | 'low_stock' | 'out_of_stock';
              return (
                <Badge variant={
                  status === 'in_stock' ? 'success' :
                  status === 'low_stock' ? 'warning' :
                  'error'
                }>
                  {status === 'in_stock' ? 'In Stock' :
                   status === 'low_stock' ? 'Low Stock' :
                   'Out of Stock'}
                </Badge>
              );
            }},
          ]}
        />
      </Card>
    </motion.div>
  );
}
