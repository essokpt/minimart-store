import { motion } from 'motion/react';
import * as Icons from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { useDashboard } from './useDashboard';
import { ErrorState } from '../../components/ui/ErrorState';

export function Dashboard() {
  const { stats, topSelling, isLoading, error } = useDashboard();

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-120px)] flex flex-col items-center justify-center space-y-6">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-headline font-extrabold text-on-surface tracking-tight">Syncing Store Data</h2>
          <p className="text-on-surface-variant font-medium uppercase tracking-widest text-[10px] animate-pulse">Connecting to MiniMart Retail Cloud...</p>
        </div>
      </div>
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
      <header>
        <h2 className="text-4xl font-headline font-extrabold text-on-surface tracking-tight mb-2">Store Overview</h2>
        <p className="text-on-surface-variant">Real-time performance metrics for <span className="text-primary font-semibold">MiniMart Pro #42</span></p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          // Dynamically get the icon component from lucide-react using the string name
          const IconComponent = (Icons as any)[stat.iconName] || Icons.HelpCircle;
          return (
          <Card key={i} className="p-6" hover>
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 ${stat.bg} rounded-md ${stat.color}`}>
                <IconComponent size={24} />
              </div>
              <Badge variant={stat.label === 'Store Traffic' ? 'error' : 'primary'} className="font-mono">
                {stat.change}
              </Badge>
            </div>
            <p className="text-on-surface-variant text-[10px] font-bold uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-3xl font-mono font-bold text-on-surface tracking-tight">{stat.value}</h3>
            {stat.label === 'Total Revenue' && (
              <div className="mt-4 h-1 w-full bg-surface-container rounded-none overflow-hidden">
                <div className="h-full bg-primary" style={{ width: '75%' }}></div>
              </div>
            )}
            {stat.label === 'Active Orders' && (
              <div className="text-[10px] text-on-surface-variant mt-4 flex items-center gap-1 font-bold uppercase tracking-widest">
                <Icons.Clock size={12} /> 14 pending pickup
              </div>
            )}
            {stat.label === 'Store Traffic' && (
              <div className="text-[10px] text-error mt-4 flex items-center gap-1 font-bold uppercase tracking-widest">
                <Icons.TrendingDown size={12} /> Slower than last Tuesday
              </div>
            )}
          </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 p-8" variant="elevated">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-xl font-headline font-bold">Daily Sales Performance</h3>
              <p className="text-sm text-on-surface-variant">Transaction volume over the last 24 hours</p>
            </div>
            <div className="flex gap-2 bg-surface-container-lowest p-1 rounded-sm border border-outline-variant/10">
              <Button size="sm">Day</Button>
              <Button variant="secondary" size="sm">Week</Button>
            </div>
          </div>
          
          <div className="h-64 flex items-end justify-between gap-4 px-4 border-b border-outline-variant/20">
            {[45, 65, 40, 85, 95, 70, 55, 60, 75, 40, 50, 35].map((height, i) => (
              <div 
                key={i} 
                className={`w-full rounded-t-sm transition-all duration-500 ${i === 4 ? 'bg-primary shadow-lg shadow-primary/20' : 'bg-primary/10 hover:bg-primary/30'}`}
                style={{ height: `${height}%` }}
              ></div>
            ))}
          </div>
          <div className="flex justify-between mt-4 px-4 text-[10px] font-mono font-bold text-on-surface-variant uppercase tracking-widest">
            <span>08:00</span>
            <span>12:00</span>
            <span>16:00</span>
            <span>20:00</span>
            <span>00:00</span>
          </div>
        </Card>

        <Card className="p-8 flex flex-col" variant="elevated">
          <h3 className="text-xl font-headline font-bold mb-6">Top Selling</h3>
          <div className="space-y-6 flex-1">
            {topSelling.map((product, i) => (
              <div key={i} className="flex items-center gap-4 group cursor-pointer">
                <div className="w-14 h-14 rounded-md bg-surface-container-low overflow-hidden flex-shrink-0 border border-outline-variant/10">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-on-surface">{product.name}</p>
                  <p className="text-xs text-on-surface-variant font-medium">{product.sales}</p>
                </div>
                <p className="text-sm font-mono font-bold text-primary">{product.price}</p>
              </div>
            ))}
          </div>
          <Button variant="ghost" size="sm" className="mt-8 w-full">
            View Full Report
            <Icons.ArrowRight size={16} />
          </Button>
        </Card>
      </div>
    </motion.div>
  );
}
