import { motion, AnimatePresence } from 'motion/react';
import { Award, Save, CheckCircle2, Info, Gift, TrendingUp, DollarSign } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Loading } from '../../components/ui/Loading';
import { ErrorState } from '../../components/ui/ErrorState';
import { useLoyalty } from './useLoyalty';
import { LoyaltyInput } from '../../lib/validations';

export function Loyalty() {
  const { settings, isLoading, error, updateSettings } = useLoyalty();
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState<LoyaltyInput>({
    points_per_currency: 1,
    currency_per_point: 0.05,
    min_redemption_points: 100,
    enabled: true
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        points_per_currency: settings.points_per_currency,
        currency_per_point: settings.currency_per_point,
        min_redemption_points: settings.min_redemption_points,
        enabled: settings.enabled
      });
    }
  }, [settings]);

  const handleSave = async () => {
    try {
      await updateSettings.mutateAsync(formData);
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to update loyalty settings:', err);
    }
  };

  if (isLoading) return <Loading />;
  if (error) return <ErrorState onRetry={() => window.location.reload()} />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-12 pb-20"
    >
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-headline font-extrabold text-on-surface tracking-tight">Loyalty Program</h1>
            <Badge variant={formData.enabled ? 'success' : 'secondary'} className="h-6 uppercase">{formData.enabled ? 'Enabled' : 'Disabled'}</Badge>
          </div>
          <p className="text-on-surface-variant font-medium">Configure how customers earn and redeem reward points in your store.</p>
        </div>
        <Button onClick={handleSave} loading={updateSettings.isPending} className="shadow-lg px-8">
          <Save size={18} />
          Save Settings
        </Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="space-y-8">
          <Card className="p-8" variant="elevated">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-primary/10 text-primary rounded-lg">
                <TrendingUp size={20} />
              </div>
              <h2 className="text-xl font-headline font-bold">Earning Rules</h2>
            </div>
            
            <div className="space-y-6">
              <Input
                label="Points Per Currency Spent"
                type="number"
                placeholder="e.g. 1"
                value={formData.points_per_currency}
                onChange={(e) => setFormData({ ...formData, points_per_currency: parseFloat(e.target.value) || 0 })}
                icon={<DollarSign size={18} />}
              />
              <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest italic flex items-center gap-2">
                <Info size={12} />
                Example: Spend $10.00 and earn {Math.round(10 * formData.points_per_currency)} points.
              </p>
            </div>
          </Card>

          <Card className="p-8" variant="elevated">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-secondary-container text-secondary rounded-lg">
                <Gift size={20} />
              </div>
              <h2 className="text-xl font-headline font-bold">Redemption Rules</h2>
            </div>
            
            <div className="space-y-6">
              <Input
                label="Monetary Value Per Point"
                type="number"
                placeholder="e.g. 0.05"
                value={formData.currency_per_point}
                onChange={(e) => setFormData({ ...formData, currency_per_point: parseFloat(e.target.value) || 0 })}
                icon={<DollarSign size={18} />}
              />
              <Input
                label="Minimum Points to Redeem"
                type="number"
                placeholder="e.g. 100"
                value={formData.min_redemption_points}
                onChange={(e) => setFormData({ ...formData, min_redemption_points: parseInt(e.target.value) || 0 })}
                icon={<Award size={18} />}
              />
              <div className="p-4 bg-secondary/5 rounded-sm border border-secondary/10">
                <p className="text-xs font-medium text-secondary-container">
                  With current settings, {formData.min_redemption_points} points = ${(formData.min_redemption_points * formData.currency_per_point).toFixed(2)} discount.
                </p>
              </div>
            </div>
          </Card>
        </section>

        <section className="space-y-8">
          <Card className="p-8 bg-surface-container border-outline-variant/10">
            <h3 className="text-lg font-headline font-bold mb-4">Program Status</h3>
            <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-lg border border-outline-variant/20">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${formData.enabled ? 'bg-success animate-pulse' : 'bg-outline-variant'}`}></div>
                <span className="text-sm font-bold text-on-surface">{formData.enabled ? 'Active Program' : 'Inactive Program'}</span>
              </div>
              <button 
                onClick={() => setFormData({ ...formData, enabled: !formData.enabled })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${formData.enabled ? 'bg-primary' : 'bg-outline-variant'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.enabled ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
            <p className="mt-4 text-xs text-on-surface-variant leading-relaxed">
              When disabled, customers will no longer earn or be able to redeem points. Previous point balances will be preserved in the database.
            </p>
          </Card>

          <Card className="p-8 bg-primary/5 border-primary/10">
            <h3 className="text-lg font-headline font-bold mb-4 flex items-center gap-2">
              <Info size={20} className="text-primary" />
              Developer Note
            </h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              To fully integrate this loyalty system:
              <br/><br/>
              1. Add a <code>loyalty_points</code> field to the <code>customers</code> table.
              <br/>
              2. Update the POS checkout logic to calculate and add points based on <code>points_per_currency</code>.
              <br/>
              3. Implement a redemption modal in POS to check current balance and apply discounts.
            </p>
          </Card>
        </section>
      </div>

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
              <p className="font-bold">Loyalty Settings Saved</p>
              <p className="text-xs opacity-80">Your reward program configuration is now updated.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
