import { useState } from 'react';
import { motion } from 'motion/react';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import type { ReportType, GroupBy, ReportFilters } from '../../../types/reports';

interface CustomReportBuilderProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (filters: ReportFilters) => void;
}

export function CustomReportBuilder({ isOpen, onClose, onGenerate }: CustomReportBuilderProps) {
  const [reportType, setReportType] = useState<ReportType>('orders');
  const [groupBy, setGroupBy] = useState<GroupBy>('daily');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentMethod, setPaymentMethod] = useState('all');

  const handleGenerate = () => {
    onGenerate({
      period: 'custom',
      reportType,
      groupBy,
      customStartDate: startDate,
      customEndDate: endDate,
      statusFilter: statusFilter !== 'all' ? statusFilter : undefined,
      paymentMethodFilter: paymentMethod !== 'all' ? paymentMethod : undefined,
    });
    onClose();
  };

  const handleReset = () => {
    setReportType('orders');
    setGroupBy('daily');
    setStartDate('');
    setEndDate('');
    setStatusFilter('all');
    setPaymentMethod('all');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Build Custom Report"
      maxWidth="max-w-lg"
      footer={
        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={handleReset}>
            Reset
          </Button>
          <Button variant="primary" onClick={handleGenerate}>
            Generate Report
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
            Date Range
          </label>
          <div className="flex items-center gap-3">
            <Input
              type="date"
              size="medium"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="flex-1"
            />
            <span className="text-on-surface-variant font-bold">to</span>
            <Input
              type="date"
              size="medium"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="flex-1"
            />
          </div>
        </div>

        <Select
          label="Report Type"
          value={reportType}
          onChange={(e) => setReportType(e.target.value as ReportType)}
        >
          <option value="orders">Orders Report</option>
          <option value="inventory">Inventory Report</option>
          <option value="revenue">Revenue Report</option>
        </Select>

        <Select
          label="Group By"
          value={groupBy}
          onChange={(e) => setGroupBy(e.target.value as GroupBy)}
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </Select>

        <Select
          label="Order Status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Processing">Processing</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </Select>

        <Select
          label="Payment Method"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <option value="all">All Methods</option>
          <option value="cash">Cash</option>
          <option value="Bank Transfer">Bank Transfer</option>
        </Select>
      </div>
    </Modal>
  );
}
