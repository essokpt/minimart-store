import { Calendar } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import type { ReportPeriod } from '../../types/reports';

interface ReportFiltersProps {
  activePeriod: ReportPeriod;
  onPeriodChange: (period: ReportPeriod) => void;
  customStartDate?: string;
  customEndDate?: string;
  onCustomDateChange?: (start: string, end: string) => void;
}

export function ReportFilters({
  activePeriod,
  onPeriodChange,
  customStartDate,
  customEndDate,
  onCustomDateChange,
}: ReportFiltersProps) {
  const periods: { value: ReportPeriod; label: string }[] = [
    { value: 'today', label: 'Today' },
    { value: 'weekly', label: 'This Week' },
    { value: 'monthly', label: 'This Month' },
    { value: 'custom', label: 'Custom' },
  ];

  return (
    <div className="flex flex-wrap items-center gap-3">
      {periods.map((period) => (
        <Button
          key={period.value}
          variant={activePeriod === period.value ? 'primary' : 'outline'}
          size="sm"
          onClick={() => onPeriodChange(period.value)}
        >
          {period.value !== 'custom' && period.label}
          {period.value === 'custom' && (
            <span className="flex items-center gap-2">
              <Calendar size={16} />
              Custom Range
            </span>
          )}
        </Button>
      ))}

      {activePeriod === 'custom' && (
        <div className="flex items-center gap-2 ml-4">
          <Input
            type="date"
            size="small"
            value={customStartDate || ''}
            onChange={(e) => onCustomDateChange?.(e.target.value, customEndDate || '')}
            className="w-36"
          />
          <span className="text-on-surface-variant text-sm font-bold">to</span>
          <Input
            type="date"
            size="small"
            value={customEndDate || ''}
            onChange={(e) => onCustomDateChange?.(customStartDate || '', e.target.value)}
            className="w-36"
          />
        </div>
      )}
    </div>
  );
}
