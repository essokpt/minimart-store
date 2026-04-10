import { motion } from 'motion/react';
import {
  Search,
  Plus,
  Trash2,
  Package,
  MapPin,
  CheckCircle,
  Truck,
  PlusCircle,
  Building2,
  Calendar,
  ShoppingCart,
  History,
  Save,
  Send,
  AlertTriangle,
  Upload
} from 'lucide-react';
import { useState, useRef, ChangeEvent, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Select } from '../../components/ui/Select';
import { Modal } from '../../components/ui/Modal';
import { useInventory } from '../inventory/useInventory';
import { useCategories } from '../inventory/useCategories';
import { Product } from '../../types';
import { productSchema, StockReceipt, stockReceiptSchema } from '../../lib/validations';
import { InputField, NumberField, SelectField, TextareaField } from '../../components/form/FormField';
import { ProductForm } from '../../components/form/ProductForm';
import { useStock } from './useStock';
import { Route, Router, useRoutes } from 'react-router-dom';

interface ReceiptItem {
  id: string;
  name: string;
  sku: string;
  currentStock: number;
  receivedQty: number;
  unitCost: number;
  image: string;
  location_name: string;
  area: string;
}

export function CreateStockReceipt() {
  const { createStockReceipt, createStockReceiptItem, stockArea } = useStock();
  const { products, createProduct, uploadImage } = useInventory();
  const { categories } = useCategories();
  const [location, setLocation] = useState({ area_id: '', name: '' });
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [receivedItems, setReceivedItems] = useState<ReceiptItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  //const [supplier, setSupplier] = useState('');
  //const [deliveryNote, setDeliveryNote] = useState('');
  // Form states
  const form = useForm<StockReceipt>({
    resolver: zodResolver(stockReceiptSchema),
    defaultValues: {
      supplier_name: '',
      notes: '',
      status: 'Posted',
      receipt_number: 'SR-' + Date.now().toString(),
      created_at: new Date().toISOString(),
      created_by: ''
    }
  });

  const { watch, setValue } = form;
  const navigate = useNavigate();

  const supplier = watch('supplier_name');
  const deliveryNote = watch('notes');
  const [itemQty, setItemQty] = useState(1);
  const [unitCost, setUnitCost] = useState(0);

  // Product creation modal states
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '', category_id: '', brand: '', model: '',
    cost_price: 0, unit_price: 0, barcode: '', stock_value: 0,
    type: 'Physical', status: 'Active', description: '', image: '', image_url: ''
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [pendingImageFile, setPendingImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPendingImageFile(file);
    setImagePreviewUrl(URL.createObjectURL(file));
  };

  const handleCreateProduct = async () => {
    const validated = productSchema.safeParse(newProduct);
    if (!validated.success) {
      const errors: Record<string, string> = {};
      validated.error.issues.forEach(err => {
        if (err.path[0]) errors[err.path[0] as string] = err.message;
      });
      setFormErrors(errors);
      return;
    }
    setFormErrors({});
    try {
      let productData = { ...newProduct };
      if (pendingImageFile) {
        const publicUrl = await uploadImage.mutateAsync(pendingImageFile);
        productData.image = publicUrl;
      }
      await createProduct.mutateAsync(productData);
      setIsProductModalOpen(false);
      setPendingImageFile(null);
      setImagePreviewUrl('');
      setNewProduct({
        name: '', category_id: categories.length > 0 ? categories[0].category_id : '',
        brand: '', model: '', cost_price: 0, unit_price: 0, barcode: '',
        stock_value: 0, type: 'Physical', status: 'Active', description: '', image: '', image_url: ''
      });
    } catch (err) {
      console.error('Failed to create product:', err);
    }
  };

  // Filter real products from database
  const filteredProducts = searchQuery.trim().length > 0
    ? products.filter(p =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.barcode?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (p.brand?.toLowerCase() || '').includes(searchQuery.toLowerCase())
    ).slice(0, 8)
    : [];

  const addItem = (product: Product) => {
    if (!receivedItems.find(item => item.id === product.product_id)) {
      setReceivedItems([...receivedItems, {
        id: product.product_id,
        name: product.name,
        sku: product.barcode || '',
        currentStock: product.stock_value || 0,
        image: product.image_url || product.image || '',
        receivedQty: itemQty,
        unitCost: unitCost || product.cost_price,
        location_name: location.name,
        area: location.area_id,
      }]);
    }
    setSearchQuery('');
    setItemQty(1);
    setUnitCost(0);
  };

  const removeItem = (id: string) => {
    setReceivedItems(items => items.filter(item => item.id !== id));
  };

  const handleSubmit = async (values?: StockReceipt) => {
    // Build payload
    const newStockReceiptData: any = {
      supplier_name: values?.supplier_name || supplier,
      notes: values?.notes || deliveryNote,
      status: values?.status || 'Posted',
      receipt_number: values?.receipt_number || ('SR-' + Date.now()),
      created_at: values?.created_at || new Date().toISOString(),
      created_by: values?.created_by || null
    };

    try {
      const newStockReceipt = await createStockReceipt.mutateAsync(newStockReceiptData);
      // Optionally create items if API expects them separately
      if (receivedItems && receivedItems.length > 0) {
        for (const item of receivedItems) {
          const newItem: any = {
            receipt_id: newStockReceipt.receipt_id || newStockReceipt.id || newStockReceipt.receipt_number,
            product: item.id,
            lot_number: (item as any).lot_number || null,
            quantity: item.receivedQty,
            unit_cost: item.unitCost,
            area: item.area || null,
          };
          try {
            await createStockReceiptItem.mutateAsync(newItem);
          } catch (e) {
            // continue creating other items even if one fails
            console.error('Failed to create receipt item', e);
          }
        }
      }

      // Navigate to newly created receipt detail page
      const receiptId = newStockReceipt.receipt_id || newStockReceipt.id || newStockReceipt.receipt_number;
      if (receiptId) {
        navigate(`/stock/receipts`);
        return;
      }

      // fallback: clear form and show success
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);
      setReceivedItems([]);
    } catch (err: any) {
      console.error('Failed to create stock receipt:', err);
    }
    //setModalError(err?.message || 'Failed to save store. Please check your connection and try again.');
  };

  // const totalUnits = receivedItems.reduce((acc, item) => acc + item.receivedQty, 0);
  // const totalValuation = receivedItems.reduce((acc, item) => acc + (item.receivedQty * item.unitCost), 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <header className="mb-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="text-4xl font-headline font-extrabold text-on-surface tracking-tight mb-2">Create Stock Receipt</h1>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="uppercase tracking-widest px-3 py-1">Draft</Badge>
              <p className="text-on-surface-variant font-medium">Receipt #SR-2023-0892</p>
            </div>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <Button variant="ghost" className="flex-1 md:flex-none">
              <Save size={18} />
              Save as Template
            </Button>
            <Button className="flex-1 md:flex-none shadow-lg" onClick={() => form.handleSubmit(handleSubmit)()}>
              <Send size={18} />
              Post Receipt
            </Button>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-8">
        {/* Left Column: Form Section */}
        <div className="col-span-12 xl:col-span-5 space-y-8">
          {/* Supplier & Logistics Card */}
          <Card className="p-8" variant="elevated">
            <div className="flex items-center gap-2 mb-6">
              <Truck className="text-primary" size={20} />
              <h2 className="text-lg font-headline font-bold">Supplier Information</h2>
            </div>
            <div className="space-y-5">
              <Input
                label="Supplier Entity"
                placeholder="Search or select supplier..."
                icon={<Building2 size={18} />}
                value={supplier}
                onChange={(e) => form.setValue('supplier_name', e.target.value)}
              />
              
            </div>
          </Card>

          {/* Item Entry Form */}
          <Card className="p-8 border border-outline-variant/10" variant="elevated">
            <div className="flex items-center gap-2 mb-6">
              <PlusCircle className="text-primary" size={20} />
              <h2 className="text-lg font-headline font-bold">Add Inventory Item</h2>
            </div>
            <div className="space-y-5">
              <div className="relative">
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <Input
                      label="Search Product"
                      placeholder="SKU or Product Name..."
                      icon={<Search size={18} />}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setNewProduct(prev => ({
                        ...prev,
                        category_id: categories.length > 0 ? categories[0].category_id : ''
                      }));
                      setIsProductModalOpen(true);
                    }}
                    className="h-[42px] w-[42px] shrink-0 flex items-center justify-center bg-primary text-on-primary rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
                    title="Create New Product"
                  >
                    <Plus size={20} />
                  </button>
                </div>
                {searchQuery.trim().length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-surface-container-lowest border border-outline-variant/20 rounded-sm shadow-xl z-20 overflow-hidden max-h-[320px] overflow-y-auto">
                    {filteredProducts.length > 0 ? (
                      <>
                        {filteredProducts.map(product => (
                          <button
                            key={product.product_id}
                            onClick={() => {
                              //console.log("seleproduct", product);
                              setSelectedProduct(product)
                              setSearchQuery('')
                            }}
                            className="w-full flex items-center gap-4 p-4 hover:bg-surface-container transition-colors text-left border-b border-outline-variant/10 last:border-0"
                          >
                            <div className="w-10 h-10 rounded-sm bg-surface-container overflow-hidden shrink-0">
                              {(product.image_url || product.image) ? (
                                <img src={product.image_url || product.image} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-on-surface-variant/30">
                                  <Package size={16} />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-on-surface truncate">{product.name}</p>
                              <p className="text-[10px] text-on-surface-variant font-mono">{product.barcode || 'No SKU'} · Stock: {product.stock_value || 0}</p>
                            </div>
                            <Plus size={18} className="text-primary ml-2 shrink-0" />
                          </button>
                        ))}
                        <button
                          onClick={() => setIsProductModalOpen(true)}
                          className="w-full flex items-center justify-center gap-2 p-3 bg-surface-container-low hover:bg-surface-container transition-colors text-primary text-xs font-bold uppercase tracking-widest"
                        >
                          <PlusCircle size={14} />
                          Create New Product
                        </button>
                      </>
                    ) : (
                      <div className="p-6 text-center space-y-3">
                        <Package size={32} className="mx-auto text-on-surface-variant/20" />
                        <p className="text-sm text-on-surface-variant">No products found for "<span className="font-bold text-on-surface">{searchQuery}</span>"</p>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => setIsProductModalOpen(true)}
                          className="mx-auto"
                        >
                          <PlusCircle size={14} />
                          Create New Product
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
              {selectedProduct && (
                <div
                  className="w-full flex items-center gap-4 p-4 hover:bg-surface-container transition-colors text-left border-b border-outline-variant/10 last:border-0"
                >
                  <div className="w-10 h-10 rounded-sm bg-surface-container overflow-hidden shrink-0">
                    {(selectedProduct.image_url || selectedProduct.image) ? (
                      <img src={selectedProduct.image_url || selectedProduct.image} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-on-surface-variant/30">
                        <Package size={16} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-on-surface truncate">{selectedProduct.name}</p>
                    <p className="text-[10px] text-on-surface-variant font-mono">{selectedProduct.barcode || 'No SKU'} · Stock: {selectedProduct.stock_value || 0}</p>
                  </div>
                  <Plus size={18} className="text-primary ml-2 shrink-0" />
                </div>
              )
              }
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Quantity"
                  type="number"
                  value={itemQty}
                  onChange={(e) => setItemQty(parseInt(e.target.value))}
                />
                <Input
                  label="Unit Cost ($)"
                  type="number"
                  placeholder="0.00"
                  value={unitCost}
                  onChange={(e) => setUnitCost(parseFloat(e.target.value))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input label="Batch / Lot Number" placeholder="BATCH-2023-A" />
                <Input label="Expiry Date" type="date" />
              </div>

              <div className="space-y-2">
                <Select
                  label="Storage Destination"
                  value={location.area_id}
                  onChange={(e) => {
                    const id = e.target.value;
                    if (!id) {
                      setLocation({ area_id: '', name: '' });
                      return;
                    }
                    const area = stockArea?.find(a => a.area_id === id);
                    if (area) {
                      setLocation({
                        area_id: area.area_id,
                        name: area.name
                      });
                    }
                  }}
                >
                  <option value="">Select Storage Area</option>
                  {stockArea?.map((area) => (
                    <option key={area.area_id} value={area.area_id}>
                      {area.name}
                    </option>
                  ))}
                  {/* <option>Main Warehouse</option>
                  <option>Front Shelf - A1</option>
                  <option>Cold Storage Unit 3</option>
                  <option>Aisle 4 Display</option> */}
                </Select>
              </div>
              <Button
                variant="secondary"
                className="w-full py-4 mt-2 font-bold"
                onClick={() => {
                  addItem(selectedProduct as Product)
                  setSelectedProduct(null)
                  setItemQty(1)
                  setUnitCost(0)
                  setLocation({ area_id: '', name: '' })
                }
                }
              >
                Add to Receipt List
              </Button>


            </div>
          </Card>
        </div>

        {/* Right Column: Table & Summary */}
        <div className="col-span-12 xl:col-span-7 space-y-8">
          <Card className="overflow-hidden flex flex-col h-full min-h-[600px]" variant="elevated">
            <div className="p-6 flex justify-between items-center border-b border-outline-variant/10">
              <h2 className="text-lg font-headline font-bold">Items in Current Session</h2>
              <span className="text-sm text-on-surface-variant font-medium">{receivedItems.length} items selected</span>
            </div>

            <div className="flex-1 overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-surface-container-low text-xs font-bold uppercase tracking-wider text-on-surface-variant/60">
                  <tr>
                    <th className="px-6 py-4">Item Details</th>
                    <th className="px-6 py-4">Quantity</th>
                    <th className="px-6 py-4">Location</th>
                    <th className="px-6 py-4 text-right">Unit Cost</th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container">
                  {receivedItems?.map(item => (
                    <tr key={item.id} className="hover:bg-surface-container-low/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded bg-surface-container overflow-hidden shrink-0">
                            <img src={item.image} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </div>
                          <div>
                            <div className="font-bold text-sm text-on-surface">{item.name}</div>
                            <div className="text-xs text-on-surface-variant/60 font-mono">{item.sku}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">{item.receivedQty} units</td>
                      <td className="px-6 py-4">
                        <Badge variant="primary" className="text-[10px] uppercase font-bold">{item.location_name}</Badge>
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-semibold">${item.unitCost.toFixed(2)}</td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-on-surface-variant/40 hover:text-error transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {receivedItems.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-20 text-center">
                        <Package size={48} className="mx-auto text-on-surface-variant/20 mb-4" />
                        <p className="text-on-surface-variant font-medium">No items in this session.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Receipt Summary Footer */}
            <div className="p-8 bg-surface-container-low border-t border-outline-variant/20">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                {/* <div className="space-y-2">
                  <p className="text-sm font-semibold text-on-surface-variant/60 uppercase tracking-wider">Session Summary</p>
                  <div className="flex gap-6">
                    <div className="flex flex-col">
                      <span className="text-2xl font-headline font-extrabold text-on-surface">{totalUnits}</span>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Total Units</span>
                    </div>
                    <div className="h-10 w-[1px] bg-outline-variant/50 self-center"></div>
                    <div className="flex flex-col">
                      <span className="text-2xl font-headline font-extrabold text-primary">${totalValuation.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Total Valuation</span>
                    </div>
                  </div>
                </div> */}
                <div className="w-full md:w-auto flex gap-4">
                  <Button variant="outline" className="flex-1 md:flex-none" onClick={() => setReceivedItems([])}>
                    Discard Draft
                  </Button>
                  <Button className="flex-1 md:flex-none px-10" onClick={() => form.handleSubmit(handleSubmit)()} disabled={receivedItems.length === 0}>
                    Confirm & Post Receipt
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {isSuccess && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed bottom-10 right-10 bg-primary text-on-primary px-8 py-4 rounded-sm shadow-2xl flex items-center gap-3 z-50"
        >
          <CheckCircle size={24} />
          <div>
            <p className="font-bold">Stock Received Successfully</p>
            <p className="text-xs opacity-80">Inventory levels have been updated.</p>
          </div>
        </motion.div>
      )}

      {/* Mini Create Product Modal - now using shared ProductForm component */}
      <Modal
        isOpen={isProductModalOpen}
        onClose={() => {
          setIsProductModalOpen(false);
          setPendingImageFile(null);
          setImagePreviewUrl('');
          setFormErrors({});
        }}
        title="Create Product"
        maxWidth="w-[600px]"
      >
        <ProductForm
          categories={categories}
          isSubmitting={createProduct.isPending}
          onCancel={() => {
            setIsProductModalOpen(false);
            setPendingImageFile(null);
            setImagePreviewUrl('');
            setFormErrors({});
          }}
          onSubmit={async (data, imageFile) => {
            try {
              const payload: any = { ...data };
              if (imageFile) {
                const publicUrl = await uploadImage.mutateAsync(imageFile);
                payload.image = publicUrl;
              }
              const newProduct = await createProduct.mutateAsync(payload);
              setSelectedProduct(newProduct);
              setIsProductModalOpen(false);
              setPendingImageFile(null);
              setImagePreviewUrl('');
            } catch (err) {
              console.error('Failed to create product:', err);
            }
          }}
        />
      </Modal>
    </motion.div>
  );
}
function useAreas(): { areas: any; } {
  throw new Error('Function not implemented.');
}

