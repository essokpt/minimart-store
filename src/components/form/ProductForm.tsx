import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Package, Upload, X } from 'lucide-react';
import { useRef, useState, ChangeEvent, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { productSchema, ProductInput } from '../../lib/validations';
import { FormProvider } from './FormProvider';
import { InputField, NumberField, SelectField, TextareaField } from './FormField';
import { Button } from '../ui/Button';
import { Category } from '../../types';

interface ProductFormProps {
  categories: Category[];
  initialData?: Partial<ProductInput>;
  onSubmit: (data: ProductInput, imageFile?: File | null) => void;
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

export function ProductForm({
  categories,
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: ProductFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingImageFile, setPendingImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>('');
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  //console.log('ProductForm rendered with initialData:', initialData);
  const form = useForm<ProductFormValues>({
      resolver: zodResolver(productSchema) as any,
      defaultValues: initialData ? {
        name: initialData.name || '',
        category_id: initialData.category_id || categories[0]?.category_id || '',
        brand: initialData.brand || '',
        model: initialData.model || '',
        cost_price: initialData.cost_price ?? 0,
        unit_price: initialData.unit_price ?? 0,
        barcode: initialData.barcode || '',
        stock_value: initialData.stock_value ?? 0,
        type: initialData.type || 'Physical',
        status: initialData.status || 'Active',
        description: initialData.description || '',
        image: initialData.image || '',
      } :{
        name: '',
        category_id: categories[0]?.category_id || '',
        brand: '',
        model: '',
        cost_price: 0,
        unit_price: 0,
        barcode: '',
        stock_value: 0,
        type: 'Physical',
        status: 'Active',
        description: '',
        image: '',
      },
    });

  const categoryOptions = categories.map(cat => ({
    value: cat.category_id,
    label: cat.name,
  }));

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPendingImageFile(file);
    const previewUrl = URL.createObjectURL(file);
    setImagePreviewUrl(previewUrl);
  };

  const clearImage = () => {
    setPendingImageFile(null);
    setImagePreviewUrl('');
    form.setValue('image', '');
  };

  const handleSubmit = (data: ProductFormValues) => {
    onSubmit(data as unknown as ProductInput, pendingImageFile);
  };

  // Track previous initialData to detect actual changes
 // const prevInitialDataRef = useRef<Partial<ProductInput> | undefined>(undefined);
 // const hasInitialDataBeenApplied = useRef<boolean>(false);

  //useEffect(() => {
   // const isNewInitialData = initialData !== prevInitialDataRef.current;
   // const isFirstCategoriesLoad = !hasInitialDataBeenApplied.current && categories.length > 0;

    // Reset when:
    // 1. initialData actually changed (edit mode), OR
    // 2. initialData exists and categories just loaded (first time with data)
  //   if (isNewInitialData || (initialData && isFirstCategoriesLoad)) {
  //     if (isNewInitialData) {
  //       prevInitialDataRef.current = initialData;
  //     }
  //     hasInitialDataBeenApplied.current = true;

  //     if (initialData) {
  //       form.reset({
  //         name: initialData.name || '',
  //         category_id: initialData.category_id || '',
  //         brand: initialData.brand || '',
  //         model: initialData.model || '',
  //         cost_price: initialData.cost_price ?? 0,
  //         unit_price: initialData.unit_price ?? 0,
  //         barcode: initialData.barcode || '',
  //         stock_value: initialData.stock_value ?? 0,
  //         type: initialData.type || 'Physical',
  //         status: initialData.status || 'Active',
  //         description: initialData.description || '',
  //         image: initialData.image || '',
  //       });
  //        Also set image preview if there's an image
  //       if (initialData.image) {
  //         setImagePreviewUrl(initialData.image);
  //       }
  //     }
  //   } else if (!initialData && isNewInitialData) {
  //      Switched to "new product" mode
  //     hasInitialDataBeenApplied.current = false;
  //     form.reset({
  //       name: '',
  //       category_id: categories[0]?.category_id || '',
  //       brand: '',
  //       model: '',
  //       cost_price: 0,
  //       unit_price: 0,
  //       barcode: '',
  //       stock_value: 0,
  //       type: 'Physical',
  //       status: 'Active',
  //       description: '',
  //       image: '',
  //     });
  //     setImagePreviewUrl('');
  //     setPendingImageFile(null);
  //   }
  // }, [initialData, categories, form]);

  

  // Cleanup preview URL on unmount and when initialData changes
  // useEffect(() => {
  //   return () => {
  //     if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
  //   };
  // }, [imagePreviewUrl]);

  // Clear image preview when initialData is null (new product)
  // useEffect(() => {
  //   if (!initialData) {
  //     setImagePreviewUrl('');
  //     setPendingImageFile(null);
  //   }
  // }, [initialData]);

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary/10 rounded-lg text-primary">
          <Package size={20} />
        </div>
        <h2 className="text-xl font-bold font-headline">Product Information</h2>
      </div>

      <FormProvider form={form} onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          {/* Product Name - Full Width */}
          <InputField
            name="name"
            label="Product Name *"
           // placeholder={initialData ? initialData.name : "e.g. Organic Apple Juice"}
            
            containerClassName="md:col-span-2"
          />

          {/* Brand & Model */}
          <InputField
            name="brand"
            label="Brand"
            
           // placeholder={initialData ? initialData.brand : "e.g. Nature's Best"}
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
          >
            {initialData ? 'Update Product' : 'Save Product'}
          </Button>
        </div>
      </FormProvider>
    </div>
  );
}
