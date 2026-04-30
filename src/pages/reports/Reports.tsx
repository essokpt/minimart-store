import { useState } from 'react';
import { motion } from 'motion/react';
import { BarChart, PieChart, LineChart, FileText, Package, DollarSign, Settings } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { ReportFilters } from './components/ReportFilters';
import { OrderReport } from './components/OrderReport';
import { InventoryReport } from './components/InventoryReport';
import { RevenueReport } from './components/RevenueReport';
import { CustomReportBuilder } from './components/CustomReportBuilder';
import { ExportButton } from './components/ExportButton';
import { useReports } from './useReports';
import { ErrorState } from '../../components/ui/ErrorState';
import { Loading } from '../../components/ui/Loading';
import type { ReportType, ReportFilters as ReportFiltersType } from '../../types/reports';

export function Reports() {
  const { recentTransactions, isLoading, error } = useReports();
  const [activePeriod, setActivePeriod] = useState<'today' | 'weekly' | 'monthly' | 'custom'>('monthly');
  const [activeReport, setActiveReport] = useState<ReportType>('orders');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [showCustomBuilder, setShowCustomBuilder] = useState(false);
  const [customFilters, setCustomFilters] = useState<ReportFiltersType | null>(null);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="h-[calc(100vh-120px)] flex items-center justify-center">
        <ErrorState onRetry={() => window.location.reload()} />
      </div>
    );
  }

  const handleCustomFilters = (filters: ReportFiltersType) => {
    setCustomFilters(filters);
    setActiveReport(filters.reportType);
    setActivePeriod('custom');
    setCustomStartDate(filters.customStartDate || '');
    setCustomEndDate(filters.customEndDate || '');
  };

  const reportTabs: { value: ReportType; label: string; icon: typeof BarChart }[] = [
    { value: 'orders', label: 'Orders', icon: FileText },
    { value: 'inventory', label: 'Inventory', icon: Package },
    { value: 'revenue', label: 'Revenue', icon: DollarSign },
  ];

  const renderReport = () => {
    const reportProps = {
      period: activePeriod,
      customStartDate,
      customEndDate,
    };

    switch (activeReport) {
      case 'orders':
        return (
          <OrderReport
            {...reportProps}
            statusFilter={customFilters?.statusFilter}
            paymentMethodFilter={customFilters?.paymentMethodFilter}
          />
        );
      case 'inventory':
        return <InventoryReport />;
      case 'revenue':
        return <RevenueReport {...reportProps} />;
      default:
        return <OrderReport {...reportProps} />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <header className="flex flex-wrap justify-between items-end gap-4">
        <div>
          <h2 className="text-4xl font-headline font-extrabold text-on-surface tracking-tight mb-2">
            Analytics & Reports
          </h2>
          <p className="text-on-surface-variant font-medium">
            Detailed insights into your store's financial health and operational efficiency.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setShowCustomBuilder(true)}>
            <Settings size={18} />
            Custom Report
          </Button>
          <ExportButton 
            elementId="report-content" 
            title={`${activeReport.charAt(0).toUpperCase() + activeReport.slice(1)} Report`} 
          />
        </div>
      </header>

      <div className="flex flex-wrap items-center gap-4 border-b border-outline-variant/20 pb-4">
        <div className="flex gap-2">
          {reportTabs.map((tab) => (
            <Button
              key={tab.value}
              variant={activeReport === tab.value ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setActiveReport(tab.value)}
            >
              <tab.icon size={16} />
              {tab.label}
            </Button>
          ))}
        </div>

        <div className="flex-1" />

        <ReportFilters
          activePeriod={activePeriod}
          onPeriodChange={setActivePeriod}
          customStartDate={customStartDate}
          customEndDate={customEndDate}
          onCustomDateChange={(start, end) => {
            setCustomStartDate(start);
            setCustomEndDate(end);
          }}
        />
      </div>

      <div id="report-content">
        {renderReport()}
      </div>

      <CustomReportBuilder
        isOpen={showCustomBuilder}
        onClose={() => setShowCustomBuilder(false)}
        onGenerate={handleCustomFilters}
      />
    </motion.div>
  );
}
