import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Store,
  MapPin,
  Mail,
  Phone,
  Globe,
  DollarSign,
  Percent,
  Save,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { ErrorState } from '../../components/ui/ErrorState';
import { useStoreSettings } from './useSettings';
import { storeSettingsSchema, StoreSettingsInput } from '../../lib/validations';
import { ZodError } from 'zod';
import { Loading } from '@/src/components/ui/Loading';

export function Settings() {
  const { settings, isLoading, error, updateSettings, isUpdating } = useStoreSettings();
  const [formData, setFormData] = useState<StoreSettingsInput>({
    storeName: '',
    address: '',
    email: '',
    phone: '',
    logoUrl: '',
    currency: 'USD',
    taxRate: 0,
  });
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof StoreSettingsInput, string>>>({});
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const handleSave = async () => {
    try {
      setFormErrors({});
      const validatedData = storeSettingsSchema.parse(formData);
      await updateSettings(validatedData);
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (err) {
      if (err instanceof ZodError) {
        const errors: any = {};
        err.issues.forEach(issue => {
          errors[issue.path[0]] = issue.message;
        });
        setFormErrors(errors);
      }
    }
  };

  if (isLoading) {
    return (
      <Loading />
    );
  }

  if (error) {
    return <ErrorState onRetry={() => window.location.reload()} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-12 pb-20"
    >
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-headline font-extrabold text-on-surface tracking-tight mb-2">Store Settings</h1>
          <p className="text-on-surface-variant font-medium">Manage your retail identity and business configuration.</p>
        </div>
        <Button
          onClick={handleSave}
          disabled={isUpdating}
          className="shadow-lg px-8"
        >
          {isUpdating ? 'Saving...' : <><Save size={18} /> Save Changes</>}
        </Button>
      </header>

      <div className="grid grid-cols-1 gap-8">
        {/* General Store Information */}
        <Card className="p-8" variant="elevated">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-primary/10 text-primary rounded-lg">
              <Store size={20} />
            </div>
            <h2 className="text-xl font-headline font-bold">Store Identity</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <Input
                label="Store Name"
                placeholder="e.g. Minimart Pro flagship"
                value={formData.storeName}
                onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                error={formErrors.storeName}
              />
              <Input
                label="Logo URL"
                placeholder="https://example.com/logo.png"
                icon={<ImageIcon size={18} />}
                value={formData.logoUrl}
                onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                error={formErrors.logoUrl}
              />
            </div>
            <div className="flex flex-col items-center justify-center p-6 bg-surface-container-low rounded-2xl border-2 border-dashed border-outline-variant/20">
              {formData.logoUrl ? (
                <img src={formData.logoUrl} alt="Store Logo" className="max-h-32 object-contain mb-4" />
              ) : (
                <Store size={48} className="text-on-surface-variant/20 mb-4" />
              )}
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Logo Preview</p>
            </div>
          </div>
        </Card>

        {/* Contact & Location */}
        <Card className="p-8" variant="elevated">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-secondary-container text-secondary rounded-lg">
              <MapPin size={20} />
            </div>
            <h2 className="text-xl font-headline font-bold">Contact & Location</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <Input
                label="Physical Address"
                placeholder="123 Retail Ave, Business District"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                error={formErrors.address}
              />
            </div>
            <Input
              label="Public Email"
              type="email"
              placeholder="contact@store.com"
              icon={<Mail size={18} />}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              error={formErrors.email}
            />
            <Input
              label="Phone Number"
              type="tel"
              placeholder="+1 (555) 000-0000"
              icon={<Phone size={18} />}
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              error={formErrors.phone}
            />
          </div>
        </Card>

        {/* Business Configuration */}
        <Card className="p-8" variant="elevated">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-tertiary-container text-tertiary rounded-lg">
              <Globe size={20} />
            </div>
            <h2 className="text-xl font-headline font-bold">Business Rules</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select
              label="Primary Currency"
              value={formData.currency}
              onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              error={formErrors.currency}
            >
              <option value="USD">USD ($) - US Dollar</option>
              <option value="EUR">EUR (€) - Euro</option>
              <option value="GBP">GBP (£) - British Pound</option>
              <option value="THB">THB (฿) - Thai Baht</option>
            </Select>
            <Input
              label="Default Tax Rate (%)"
              type="number"
              step="0.01"
              icon={<Percent size={18} />}
              value={formData.taxRate}
              onChange={(e) => setFormData({ ...formData, taxRate: parseFloat(e.target.value) })}
              error={formErrors.taxRate}
            />
          </div>
        </Card>
      </div>

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
              <p className="text-xs opacity-80">Your store profile has been saved successfully.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
