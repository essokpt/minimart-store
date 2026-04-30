import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bell,
  Save,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Package,
  ShieldAlert,
  Info,
  Clock,
  ArrowRight
} from 'lucide-react';
import { useForm, FormProvider } from 'react-hook-form';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { useNotificationSettings } from '../../hooks/useNotifications';
import { Loading } from '../../components/ui/Loading';
import { ErrorState } from '../../components/ui/ErrorState';
import { NotificationType, NotificationPriority } from '../../types';

export function NotificationsSettings() {
  const { settings, isLoading, error, updateSetting } = useNotificationSettings();
  const [isSuccess, setIsSuccess] = useState(false);

  const handleToggle = async (id: string, enabled: boolean) => {
    try {
      await updateSetting.mutateAsync({ id, updates: { enabled } });
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to update setting:', err);
    }
  };

  const handleParamChange = async (id: string, parameter: number) => {
    try {
      await updateSetting.mutateAsync({ id, updates: { parameter } });
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to update parameter:', err);
    }
  };

  const handlePriorityChange = async (id: string, priority: NotificationPriority) => {
    try {
      await updateSetting.mutateAsync({ id, updates: { priority } });
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to update priority:', err);
    }
  };

  if (isLoading) return <Loading />;
  if (error) return <ErrorState onRetry={() => window.location.reload()} />;

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'expiry': return <Calendar size={20} />;
      case 'low_stock': return <Package size={20} />;
      case 'order': return <Info size={20} />;
      default: return <Bell size={20} />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-12 pb-20"
    >
      <header>
        <h1 className="text-4xl font-headline font-extrabold text-on-surface tracking-tight mb-2">Notification Center</h1>
        <p className="text-on-surface-variant font-medium">Configure how and when you want to be notified about business events.</p>
      </header>

      <div className="grid grid-cols-1 gap-6">
        {settings.map((setting: any) => (
          <Card key={setting.id} className="p-8 group" variant="elevated">
            <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
              <div className={`p-4 rounded-2xl shrink-0 transition-colors ${setting.enabled ? 'bg-primary/10 text-primary' : 'bg-surface-container text-on-surface-variant/40'}`}>
                {getIcon(setting.type)}
              </div>
              
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-headline font-bold capitalize">{setting.type.replace('_', ' ')} Alerts</h3>
                  <Badge variant={setting.enabled ? 'primary' : 'secondary'}>
                    {setting.enabled ? 'Active' : 'Disabled'}
                  </Badge>
                </div>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  {setting.type === 'expiry' && 'Receive alerts for product batches nearing their expiration date.'}
                  {setting.type === 'low_stock' && 'Receive alerts when inventory levels fall below a specific threshold.'}
                  {setting.type === 'order' && 'Receive alerts for new incoming orders or order status changes.'}
                  {setting.type === 'system' && 'Critical system updates and security notifications.'}
                </p>
              </div>

              <div className="flex flex-col items-end gap-3 shrink-0">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={setting.enabled} 
                    onChange={(e) => handleToggle(setting.id, e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-surface-container rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>

            {setting.enabled && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-8 pt-8 border-t border-outline-variant/10 grid grid-cols-1 md:grid-cols-2 gap-8"
              >
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60">
                    {setting.type === 'expiry' ? 'Notify days before' : 'Stock threshold'}
                  </label>
                  <div className="flex items-center gap-4">
                    <input 
                      type="number"
                      value={setting.parameter}
                      onChange={(e) => handleParamChange(setting.id, parseInt(e.target.value) || 0)}
                      className="w-24 bg-surface-container-low border border-outline-variant/10 rounded-lg px-4 py-2 font-mono font-bold text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                    />
                    <span className="text-sm text-on-surface-variant font-medium">
                      {setting.type === 'expiry' ? 'days' : 'units'}
                    </span>
                  </div>
                </div>

                <div className="space-y-4 text-right md:text-left">
                  <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60">
                    Alert Priority
                  </label>
                  <div className="flex flex-wrap gap-2 md:justify-start">
                    {['low', 'medium', 'high', 'critical'].map((p) => (
                      <button
                        key={p}
                        onClick={() => handlePriorityChange(setting.id, p as NotificationPriority)}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tighter transition-all ${
                          setting.priority === p 
                          ? 'bg-primary text-on-primary shadow-lg shadow-primary/20' 
                          : 'bg-surface-container text-on-surface-variant/40 hover:bg-surface-container-highest'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </Card>
        ))}
      </div>

      <Card className="p-8 bg-primary/[0.03] border-primary/10 border-2 border-dashed">
        <div className="flex items-center gap-6">
          <div className="p-4 bg-primary/10 text-primary rounded-full shrink-0">
            <ShieldAlert size={24} />
          </div>
          <div className="flex-1 space-y-1">
            <h4 className="font-headline font-bold text-on-surface">Need custom alert rules?</h4>
            <p className="text-xs text-on-surface-variant leading-relaxed">Advanced users can configure webhooks and automated escalation policies through the Developer API portal.</p>
          </div>
          <Button variant="ghost" size="sm">
            Configure API
            <ArrowRight size={14} />
          </Button>
        </div>
      </Card>

      {/* Success Notification */}
      <AnimatePresence>
        {isSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-10 right-10 bg-primary text-on-primary px-8 py-4 rounded-xl shadow-2xl flex items-center gap-3 z-50 border border-white/10"
          >
            <CheckCircle2 size={24} />
            <div>
              <p className="font-bold">Settings Updated</p>
              <p className="text-xs opacity-80">Notification preferences have been saved.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
