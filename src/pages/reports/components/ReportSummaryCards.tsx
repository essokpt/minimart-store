import { Card } from '../../../components/ui/Card';
import { TrendingUp, ShoppingCart, DollarSign, Package } from 'lucide-react';
import { formatCurrency } from '../../../lib/formatters';

interface ReportSummaryCardsProps {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  topCategory?: string;
  isLoading?: boolean;
}

export function ReportSummaryCards({
  totalRevenue,
  totalOrders,
  averageOrderValue,
  topCategory,
  isLoading,
}: ReportSummaryCardsProps) {
  const cards = [
    {
      label: 'Total Revenue',
      value: formatCurrency(totalRevenue),
      icon: DollarSign,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      label: 'Total Orders',
      value: totalOrders.toString(),
      icon: ShoppingCart,
      color: 'text-secondary',
      bg: 'bg-secondary/10',
    },
    {
      label: 'Avg Order Value',
      value: formatCurrency(averageOrderValue),
      icon: TrendingUp,
      color: 'text-tertiary',
      bg: 'bg-tertiary/10',
    },
    {
      label: 'Top Category',
      value: topCategory || 'N/A',
      icon: Package,
      color: 'text-on-surface-variant',
      bg: 'bg-surface-container',
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="p-6 animate-pulse">
            <div className="h-4 w-20 bg-surface-container rounded mb-4"></div>
            <div className="h-8 w-24 bg-surface-container rounded"></div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <Card key={card.label} className="p-6" variant="elevated" data-report-summary>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
              {card.label}
            </span>
            <div className={`p-2 rounded-full ${card.bg}`}>
              <card.icon size={16} className={card.color} />
            </div>
          </div>
          <p className="text-2xl font-headline font-extrabold text-on-surface">{card.value}</p>
        </Card>
      ))}
    </div>
  );
}
