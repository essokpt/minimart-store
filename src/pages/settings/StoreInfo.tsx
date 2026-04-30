import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Store as StoreIcon,
  MapPin,
  Mail,
  Phone,
  Save,
  CheckCircle2,
  Building2,
  Globe,
  Percent
} from 'lucide-react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { ErrorState } from '../../components/ui/ErrorState';
import { InputField, SelectField, TextareaField } from '../../components/form/FormField';
import { storeSchema, StoreInput } from '../../lib/validations';
import { Loading } from '../../components/ui/Loading';
import { useStores } from '../Stock/useStores';

export function StoreInfo() {
  const { stores, isLoading, error, updateStore } = useStores();
  const [isSuccess, setIsSuccess] = useState(false);

  const activeStore = stores[0];

  const form = useForm<StoreInput>({
    resolver: zodResolver(storeSchema),
    defaultValues: {
      name: '',
      code: '',
      address: '',
      phone: '',
      status: 'Active',
      //currency_symbol: '$',
      //tax_rate: 0
    }
  });

  useEffect(() => {
    if (activeStore) {
      form.reset({
        store_id: activeStore.store_id,
        name: activeStore.name || '',
        code: activeStore.code || '',
        address: activeStore.address || '',
        phone: activeStore.phone || '',
        status: (activeStore.status as any) || 'Active',
        //currency_symbol: activeStore.currency_symbol || '$',
        // tax_rate: activeStore.tax_rate || 0
      });
    }
  }, [activeStore]);

  const handleSave = async (values: StoreInput) => {
    if (!activeStore) return;
    try {
      await updateStore.mutateAsync({
        id: activeStore.store_id,
        updates: values
      });
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to update store:', err);
    }
  };

  if (isLoading) return <Loading />;
  if (error || !activeStore) return <ErrorState onRetry={() => window.location.reload()} />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-12 pb-20"
    >
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-headline font-extrabold text-on-surface tracking-tight mb-2">Store Profile</h1>
          <p className="text-on-surface-variant font-medium">Manage your primary retail identity and business configuration.</p>
        </div>
        <Button
          onClick={form.handleSubmit(handleSave)}
          loading={updateStore.isPending}
          className="shadow-lg px-8"
        >
          {updateStore.isPending ? 'Saving...' : <><Save size={18} /> Save Changes</>}
        </Button>
      </header>

      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(handleSave)} className="grid grid-cols-1 gap-8">
          {/* General Store Information */}
          <Card className="p-8" variant="elevated">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-primary/10 text-primary rounded-lg">
                <StoreIcon size={20} />
              </div>
              <h2 className="text-xl font-headline font-bold">Store Identity</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <InputField
                  name="name"
                  label="Store Name"
                  placeholder="e.g. Minimart Pro flagship"
                />
                <InputField
                  name="code"
                  label="Store Code"
                  placeholder="e.g. ST-001"
                  icon={<Building2 size={18} />}
                />
              </div>
              <div className="flex flex-col items-center justify-center p-6 bg-surface-container-low rounded-2xl border-2 border-dashed border-outline-variant/20">
                <StoreIcon size={48} className="text-on-surface-variant/20 mb-4" />
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Store Icon</p>
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
                <TextareaField
                  name="address"
                  label="Physical Address"
                  placeholder="123 Retail Ave, Business District"
                />
              </div>
              <InputField
                name="phone"
                label="Phone Number"
                type="tel"
                placeholder="+1 (555) 000-0000"
                icon={<Phone size={18} />}
              />
              <SelectField
                name="status"
                label="Operation Status"
                options={[
                  { value: 'Active', label: 'Active' },
                  { value: 'Inactive', label: 'Inactive' }
                ]}
              />
            </div>
          </Card>
          {/* Regional Settings */}
          <Card className="p-8" variant="elevated">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-tertiary-container text-tertiary rounded-lg">
                <Globe size={20} />
              </div>
              <h2 className="text-xl font-headline font-bold">Regional Settings</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                name="currency_symbol"
                label="Currency Symbol"
                placeholder="e.g. $, £, €, ฿"
                icon={<Globe size={18} />}
              />
              <InputField
                name="tax_rate"
                label="Default Tax Rate (%)"
                type="number"
                placeholder="e.g. 8"
                icon={<Percent size={18} />}
              />
            </div>
          </Card>
        </form>
      </FormProvider>

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
