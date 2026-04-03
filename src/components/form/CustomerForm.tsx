import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Mail, Phone, MapPin, Truck } from 'lucide-react';
import { customerSchema, CustomerInput } from '../../lib/validations';
import { FormProvider } from './FormProvider';
import { InputField, SelectField } from './FormField';
import { Button } from '../ui/Button';

interface CustomerFormProps {
  initialData?: Partial<CustomerInput>;
  onSubmit: (data: CustomerInput) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  submitLabel?: string;
}

const countryOptions = [
  { value: 'France', label: 'France' },
  { value: 'Italy', label: 'Italy' },
  { value: 'United Kingdom', label: 'United Kingdom' },
  { value: 'USA', label: 'United States' },
  { value: 'Germany', label: 'Germany' },
  { value: 'Spain', label: 'Spain' },
];

export function CustomerForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
  submitLabel = 'Continue',
}: CustomerFormProps) {
  const form = useForm<CustomerInput>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      postalCode: '',
      country: 'France',
      ...initialData,
    },
  });

  return (
    <div className="space-y-8">
      {/* Customer Information */}
      <div className="bg-surface-container p-6 rounded-xl border border-outline-variant/10">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            <User size={20} />
          </div>
          <h2 className="text-xl font-bold font-headline">Customer Details</h2>
        </div>

        <FormProvider form={form} onSubmit={onSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              name="fullName"
              label="Full Name *"
              placeholder="e.g. Julianne Moore"
              icon={<User size={18} />}
            />
            <InputField
              name="email"
              label="Email Address *"
              type="email"
              placeholder="julianne@example.com"
              icon={<Mail size={18} />}
            />
            <InputField
              name="phone"
              label="Phone Number *"
              type="tel"
              placeholder="+1 (555) 000-0000"
              icon={<Phone size={18} />}
            />
          </div>

          {/* Shipping Information */}
          <div className="mt-8 pt-8 border-t border-outline-variant/10">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Truck size={20} />
              </div>
              <h2 className="text-xl font-bold font-headline">Shipping Address</h2>
            </div>

            <div className="space-y-6">
              <InputField
                name="address"
                label="Street Address *"
                placeholder="123 Atelier Way, Floor 4"
                icon={<MapPin size={18} />}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InputField
                  name="city"
                  label="City *"
                  placeholder="Paris"
                />
                <InputField
                  name="postalCode"
                  label="Postal Code *"
                  placeholder="75001"
                />
                <SelectField
                  name="country"
                  label="Country *"
                  options={countryOptions}
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-4 pt-6 mt-8 border-t border-outline-variant/10">
            {onCancel && (
              <Button
                type="button"
                variant="secondary"
                onClick={onCancel}
                className="flex-1"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              className={onCancel ? 'flex-1' : 'w-full'}
              loading={isSubmitting}
            >
              {submitLabel}
            </Button>
          </div>
        </FormProvider>
      </div>
    </div>
  );
}
