import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Package, Upload, X } from 'lucide-react';
import { useRef, useState, ChangeEvent, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { productSchema, ProductInput } from '../../lib/validations';
import { FormProvider } from './FormProvider';
import { InputField, NumberField, SelectField, TextareaField } from './FormField';
import { Button } from '../ui/Button';
import { Category } from '../../types';

type FormMode = 'create' | 'edit';

interface ProductFormProps {
  categories: Category[];
  initialData?: Partial<ProductInput>;
  onSubmit: (data: ProductInput, imageFile?: File | null) => Promise<void> | void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

// Form values type with strings for form inputs
type ProductFormValues = {
  name: string;
  category_id: string;
  brand: string;
  model: string;
  cost_price: number;
  unit_price: number;
  description: string;
  barcode: string;
  stock_value: number;
  type: string;
  status: string;
  image: string;
};

const statusOptions = [
  { value: 'Active', label: 'Active' },
  { value: 'Inactive', label: 'Inactive' },
  { value: 'Discontinued', label: 'Discontinued' },
];

const typeOptions = [
  { value: 'Physical', label: 'Physical' },
  { value: 'Digital', label: 'Digital' },
  { value: 'Service', label: 'Service' },
];

const getDefaultValues = (
  initialData?: Partial<ProductInput>,
  categories?: Category[]
): ProductFormValues => ({
  name: initialData?.name || '',
  category_id: initialData?.category_id || categories?.[0]?.category_id || '',
  brand: initialData?.brand || '',
  model: initialData?.model || '',
  cost_price: initialData?.cost_price ?? 0,
  unit_price: initialData?.unit_price ?? 0,
  barcode: initialData?.barcode || '',
  stock_value: initialData?.stock_value ?? 0,
  type: initialData?.type || 'Physical',
  status: initialData?.status || 'Active',
  description: initialData?.description || '',
  image: initialData?.image || '',
});

export function ProductForm({
  categories,
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: ProductFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingImageFile, setPendingImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>(initialData?.image || '');
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const formMode: FormMode = initialData ? 'edit' : 'create';

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema) as any,
    mode: 'onChange',
    defaultValues: getDefaultValues(initialData, categories),
  });

  // debug: inspect form default values at initialization
  // eslint-disable-next-line no-console
  //console.log('ProductForm init defaultValues ->', getDefaultValues(initialData, categories));

  const categoryOptions = categories.map(cat => ({
    value: cat.category_id,
    label: cat.name,
  }));

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      form.setError('image', {
        type: 'manual',
        message: 'Please select a valid image file',
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      form.setError('image', {
        type: 'manual',
        message: 'Image size must be less than 5MB',
      });
      return;
    }

    setPendingImageFile(file);
    const previewUrl = URL.createObjectURL(file);
    setImagePreviewUrl(previewUrl);
    form.clearErrors('image');
  };

  const clearImage = () => {
    setPendingImageFile(null);
    setImagePreviewUrl('');
    form.setValue('image', '');
    form.clearErrors('image');
  };

  const handleFormSubmit = async (data: ProductFormValues) => {
    try {
      // Trigger built-in validation for all fields
      const valid = await form.trigger();
      if (!valid) return;

      // Additional custom validation: require image (file or URL) for create mode
      const values = form.getValues();
      const hasImageFile = pendingImageFile;
      const hasImageUrl = (values.image || '').toString().trim().length > 0;

      if (!hasImageFile && !hasImageUrl && formMode === 'create') {
        form.setError('image', {
          type: 'manual',
          message: 'Please provide either an image file or URL',
        });
        return;
      }

      // Coerce numeric fields to numbers to satisfy backend/types
      const payload: ProductInput = {
        name: values.name,
        category_id: values.category_id,
        brand: values.brand || '',
        model: values.model || '',
        cost_price: Number(values.cost_price) || 0,
        unit_price: Number(values.unit_price) || 0,
        barcode: values.barcode || '',
        stock_value: Number(values.stock_value) || 0,
        type: values.type || 'Physical',
        status: values.status || 'Active',
        description: values.description || '',
        image: values.image || '',
      } as ProductInput;

      await onSubmit(payload, pendingImageFile);

      // If creation succeeded, reset form to defaults so inputs clear
      if (formMode === 'create') {
        form.reset(getDefaultValues(undefined, categories));
        setImagePreviewUrl('');
        setPendingImageFile(null);
      }
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  // Reset form when initialData changes
  useEffect(() => {
    const defaults = getDefaultValues(initialData, categories);
    form.reset(defaults);
    // debug: log reset values to verify edit-mode initialization
    // eslint-disable-next-line no-console
    // console.log('ProductForm: reset with initialData ->', initialData, 'defaults ->', defaults, 'form values ->', form.getValues());
    setImagePreviewUrl(initialData?.image || '');
    setPendingImageFile(null);
  }, [initialData, categories, form]);

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      if (imagePreviewUrl && imagePreviewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary/10 rounded-lg text-primary">
          <Package size={20} />
        </div>
        <h2 className="text-xl font-bold font-headline">Product Information</h2>
      </div>

      <FormProvider form={form} onSubmit={handleFormSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          {/* Product Name - Full Width */}
          <InputField
            name="name"
            label="Product Name *"
            placeholder="e.g. Organic Apple Juice"
            containerClassName="md:col-span-2"
          />

          {/* Brand & Model */}
          <InputField
            name="brand"
            label="Brand"
            placeholder="e.g. Nature's Best"
          />
          <InputField
            name="model"
            label="Model"
            placeholder="e.g. Premium Gold"
          />

          {/* Category & Status */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                Category *
              </label>
            </div>
            <AnimatePresence mode="wait">
              {!isAddingCategory ? (
                <motion.div
                  key="select"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <SelectField
                    name="category_id"
                    options={categoryOptions}
                    placeholder="Select Category"
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="input"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-3 bg-surface-container rounded-sm border border-primary/20 space-y-2"
                >
                  <InputField
                    name="new_category"
                    placeholder="New Category Name"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <SelectField
            name="status"
            label="Product Status"
            options={statusOptions}
          />

          {/* Cost Price & Unit Price */}
          <NumberField
            name="cost_price"
            label="Cost Price ($) *"
            placeholder="0.00"
            min={0}
            step={0.01}
            
          />
          <NumberField
            name="unit_price"
            label="Selling Price ($) *"
            placeholder="0.00"
            min={0.01}
            step={0.01}
          />

          {/* Barcode & Stock */}
          <InputField
            name="barcode"
            label="Barcode / SKU"
            placeholder="00000000"
          />
          <NumberField
            name="stock_value"
            label="Initial Stock Value *"
            placeholder="0"
            min={0}
          />

          {/* Type */}
          <SelectField
            name="type"
            label="Product Type"
            options={typeOptions}
            containerClassName="md:col-span-2"
          />

          {/* Description */}
          <TextareaField
            name="description"
            label="Product Description"
            placeholder="Enter detailed product description..."
            rows={4}
            containerClassName="md:col-span-2"
          />

          {/* Image Upload */}
          <div className="md:col-span-2 space-y-2">
            <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
              Product Image
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`w-full bg-surface-container-highest border-2 border-dashed border-outline-variant/30 rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-surface-container-high transition-all overflow-hidden relative group ${
                imagePreviewUrl || form.watch('image') ? '' : 'h-40'
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />
              {imagePreviewUrl || form.watch('image') ? (
                <>
                  <img
                    src={imagePreviewUrl || form.watch('image')}
                    className="w-full object-contain max-h-64 rounded-lg"
                    alt="Preview"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                    <Upload className="text-white" size={24} />
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      clearImage();
                    }}
                    className="absolute top-2 right-2 p-1.5 bg-error/80 text-white rounded-full hover:bg-error transition-colors"
                  >
                    <X size={16} />
                  </button>
                </>
              ) : (
                <>
                  <Upload className="text-on-surface-variant" size={24} />
                  <span className="text-xs text-on-surface-variant font-medium">
                    Click to upload image
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Image URL */}
          <InputField
            name="image"
            label="Image URL"
            placeholder="https://example.com/image.jpg"
            helperText="Or enter an image URL directly"
            containerClassName="md:col-span-2"
          />
        </div>

        {/* Form Actions */}
        <div className="flex gap-4 pt-6 border-t border-outline-variant/10">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            className="flex-1"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex-1"
            loading={isSubmitting}
            disabled={isSubmitting || !form.formState.isValid}
          >
            {/* {formMode === 'edit' ? 'Update Product' : 'Create Product'} */}
            Save
          </Button>
        </div>
      </FormProvider>
    </div>
  );
}
