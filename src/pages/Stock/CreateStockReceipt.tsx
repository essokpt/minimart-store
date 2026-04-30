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
  Upload,
  Edit
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
import { useNotificationStore } from '../../store/useNotificationStore';
import { Route, Router, useRoutes } from 'react-router-dom';

interface ReceiptItem {
  id: string;
  name: string;
  sku: string;
  barcode: string;
  currentStock: number;
  receivedQty: number;
  unitCost: number;
  image: string;
  location_name: string;
  area: string;
  lot_number?: string;
  expiry_date?: string;
  isAutoSelected?: boolean;
  existingLocations?: any[];
}

export function CreateStockReceipt() {
  const { createStockReceipt, createStockReceiptItem, stockArea, getProductLocations } = useStock();
  const { addNotification } = useNotificationStore();
  const { products, createProduct, updateProduct, uploadImage } = useInventory();
  const { categories } = useCategories();
  const [location, setLocation] = useState({ area_id: '', name: '' });
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productLocations, setProductLocations] = useState<{ area_id: string, name: string, quantity: number }[]>([]);
  const [receivedItems, setReceivedItems] = useState<ReceiptItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [editingItem, setEditingItem] = useState<ReceiptItem | null>(null);
  const [productLocationsMap, setProductLocationsMap] = useState<Record<string, any[]>>({});
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
  const [sku, setSku] = useState('');
  const [barcode, setBarcode] = useState('');

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

  useEffect(() => {
    const fetchLocations = async () => {
      if (selectedProduct?.product_id) {
        const locs = await getProductLocations(selectedProduct.product_id);
        setProductLocations(locs);

        // Auto-select the first location if it's the only one
        if (locs.length === 1) {
          setLocation({
            area_id: locs[0].area_id,
            name: locs[0].name
          });
        }
      } else {
        setProductLocations([]);
      }
    };
    fetchLocations();
  }, [selectedProduct?.product_id]);


  // const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (!file) return;
  //   setPendingImageFile(file);
  //   setImagePreviewUrl(URL.createObjectURL(file));
  // };

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

  useEffect(() => {
    const fetchAreas = async () => {
      const missingIds = filteredProducts
        .map(p => p.product_id)
        .filter(id => !productLocationsMap[id]);

      if (missingIds.length === 0) return;

      const newLocations = { ...productLocationsMap };
      await Promise.all(missingIds.map(async id => {
        const locs = await getProductLocations(id);
        newLocations[id] = locs;
      }));
      setProductLocationsMap(newLocations);
    };

    if (filteredProducts.length > 0) {
      fetchAreas();
    }
  }, [filteredProducts]);

  const addItem = async (product: Product) => {
    const existingIndex = receivedItems.findIndex(item => item.id === product.product_id);

    if (existingIndex > -1) {
      // Increment quantity if exists
      const updatedItems = [...receivedItems];
      updatedItems[existingIndex].receivedQty += 1;
      setReceivedItems(updatedItems);
    } else {
      const locations = await getProductLocations(product.product_id);
      const existingArea = locations.length > 0 ? locations[0] : null;

      let productBarcode = product.barcode;
      if (!productBarcode) {
        productBarcode = '885' + Date.now().toString().slice(-10); // Standard-length auto barcode
        try {
          await updateProduct.mutateAsync({
            id: product.product_id,
            updates: { barcode: productBarcode }
          });
          addNotification('success', `Assigned new barcode: ${productBarcode}`);
        } catch (err) {
          console.error('Failed to auto-update barcode:', err);
        }
      }

      // Add as new item
      setReceivedItems([...receivedItems, {
        id: product.product_id,
        name: product.name,
        sku: '',
        barcode: productBarcode || barcode,
        currentStock: product.stock_value || 0,
        image: product.image_url || product.image || '',
        receivedQty: 1,
        unitCost: product.cost_price || 0,
        location_name: existingArea ? existingArea.name : '',
        area: existingArea ? existingArea.area_id : '',
        isAutoSelected: !!existingArea,
        existingLocations: locations,
      }]);
    }

    setSearchQuery('');
    setItemQty(1);
    setUnitCost(0);
    setSku('');
    setBarcode('');
  };

  const updateReceivedItem = (id: string, updates: Partial<ReceiptItem>) => {
    setReceivedItems(items => items.map(item =>
      item.id === id ? { ...item, ...updates } : item
    ));
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
      if (newStockReceipt && receivedItems.length > 0) {
        const newStockItems = receivedItems.map(item => ({
          // ...item,
          receipt_id: newStockReceipt.receipt_id,
          product: item.id,
          barcode: item.barcode,
          sku: item.sku,
          lot_number: item.lot_number || null,
          expires_at: item.expiry_date || null,
          quantity: item.receivedQty,
          unit_cost: item.unitCost,
          area: item.area || null,
        }));
        // for (const item of receivedItems) {
        //   const newItem: any = {
        //     receipt_id: newStockReceipt.receipt_id || newStockReceipt.id || newStockReceipt.receipt_number,
        //     product: item.id,
        //     lot_number: (item as any).lot_number || null,
        //     quantity: item.receivedQty,
        //     unit_cost: item.unitCost,
        //     area: item.area || null,
        //   };
        //console.log(newStockItems);
        await createStockReceiptItem.mutateAsync(newStockItems as any[]);
      }
    } catch (err) {
      console.error('Failed to create stock receipt:', err);
    }

    // Navigate to newly created receipt detail page


    // fallback: clear form and show success
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 3000);
    setReceivedItems([]);
    navigate(`/stock/receipts`);

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

      <div className="space-y-8">
        <Card className="overflow-hidden flex flex-col" variant="elevated">
          {/* Unified Header: Supplier + Product Search */}
          <div className="p-8 border-b border-outline-variant/10 bg-surface-container-low/30">
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              <div className="w-full lg:w-[350px]">
                <Input
                  label="Supplier Entity"
                  placeholder="Enter supplier name..."
                  icon={<Building2 size={18} />}
                  value={supplier}
                  onChange={(e) => form.setValue('supplier_name', e.target.value)}
                />
              </div>
              <div className="flex-1 relative w-full">
                <div className="flex items-end gap-3">
                  <div className="flex-1">
                    <Input
                      label="Search and Add Product"
                      placeholder="Start typing SKU or Product Name..."
                      icon={<Search size={18} />}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsProductModalOpen(true)}
                    className="h-[48px] px-6 flex items-center gap-2 bg-secondary text-on-secondary rounded-lg hover:bg-secondary/90 transition-all font-bold shadow-sm"
                    title="Create New Product"
                  >
                    <Plus size={20} />
                    <span className="hidden sm:inline text-xs uppercase tracking-widest">New Product</span>
                  </button>
                </div>

                {searchQuery.trim().length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-3 bg-surface-container-lowest border border-outline-variant/20 rounded-lg shadow-2xl z-20 overflow-hidden max-h-[320px] overflow-y-auto">
                    {filteredProducts.length > 0 ? (
                      <>
                        {filteredProducts.map(product => (
                          <button
                            key={product.product_id}
                            onClick={() => addItem(product)}
                            className="w-full flex items-center gap-4 p-4 hover:bg-primary/5 transition-colors text-left border-b border-outline-variant/10 last:border-0 group"
                          >
                            <div className="w-12 h-12 rounded bg-surface-container overflow-hidden shrink-0 border border-outline-variant/20 group-hover:border-primary/30 transition-colors">
                              {(product.image_url || product.image) ? (
                                <img src={product.image_url || product.image} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-on-surface-variant/20">
                                  <Package size={20} />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-on-surface truncate group-hover:text-primary transition-colors">{product.name}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10px] text-on-surface-variant font-mono bg-surface-container rounded px-1.5 py-0.5">{product.barcode || 'No Barcode'}</span>
                                <span className="text-[10px] text-on-surface-variant/60 font-medium whitespace-nowrap">Stock: {product.stock_value || 0}</span>
                                {productLocationsMap[product.product_id]?.length > 0 && (
                                  <div className="flex items-center gap-1 text-[10px] text-primary font-bold bg-primary/10 rounded px-1.5 py-0.5 ml-auto">
                                    <MapPin size={10} />
                                    <span>{productLocationsMap[product.product_id][0].name}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            <Plus size={18} className="text-primary opacity-0 group-hover:opacity-100 transition-all mr-2 shrink-0 scale-90 group-hover:scale-100" />
                          </button>
                        ))}
                      </>
                    ) : (
                      <div className="p-8 text-center space-y-4">
                        <Package size={40} className="mx-auto text-on-surface-variant/10" />
                        <div className="space-y-1">
                          <p className="text-sm font-bold text-on-surface">No products found</p>
                          <p className="text-xs text-on-surface-variant">We couldn't find any results for "{searchQuery}"</p>
                        </div>
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
            </div>
          </div>

          <div className="flex-1 overflow-x-auto min-h-[400px]">
            <table className="w-full text-left">
              <thead className="bg-surface-container-low text-[10px] font-black uppercase tracking-[0.15em] text-on-surface-variant/50 border-b border-outline-variant/10">
                <tr>
                  <th className="px-8 py-5">Item Details</th>
                  <th className="px-8 py-5 w-40 text-center">Qty</th>
                  <th className="px-8 py-5">Storage Destination</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container/30">
                {receivedItems?.map(item => (
                  <tr key={item.id} className="hover:bg-primary/[0.02] transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded border border-outline-variant/10 bg-surface-container overflow-hidden shrink-0">
                          <img src={item.image} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                        <div>
                          <div className="font-bold text-sm text-on-surface mb-0.5">{item.name}</div>
                          <div className="flex gap-2">
                            <span className="text-[10px] text-on-surface-variant/50 font-mono tracking-tighter">{item.barcode}</span>
                            {item.sku && <span className="text-[10px] text-on-surface-variant/30 font-mono italic">({item.sku})</span>}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <div className="flex items-center justify-center">
                        <input
                          type="number"
                          className="w-20 bg-surface-container-low border border-outline-variant/10 rounded-lg px-3 py-2 text-center text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                          value={item.receivedQty}
                          onChange={(e) => updateReceivedItem(item.id, { receivedQty: parseInt(e.target.value) || 0 })}
                        />
                      </div>
                    </td>
                    <td className="px-8 py-5 relative">
                      {item.existingLocations && item.existingLocations.length > 0 && (
                        <div className="absolute top-2 left-8 flex items-center gap-1.5">
                          <Badge variant="primary" className="text-[7px] py-0 px-1 font-black uppercase tracking-tighter animate-pulse bg-primary/20 text-primary border-none">
                            Existing: {item.existingLocations.map(l => l.name).join(', ')}
                          </Badge>
                        </div>
                      )}
                      <select
                        className="w-full max-w-[200px] bg-surface-container-low border border-outline-variant/10 rounded-lg px-3 py-2 text-xs font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all cursor-pointer appearance-none mt-2"
                        value={item.area}
                        onChange={(e) => {
                          const id = e.target.value;
                          const areaName = stockArea?.find(a => a.area_id === id)?.name || 'Unknown';
                          updateReceivedItem(item.id, { area: id, location_name: areaName });
                        }}
                      >
                        <option value="">Select Area</option>
                        {stockArea?.map(area => (
                          <option key={area.area_id} value={area.area_id}>{area.name}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditingItem(item)}
                          className="p-2 text-on-surface-variant/40 hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                          title="Full Edit"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-2 text-on-surface-variant/40 hover:text-error hover:bg-error/10 rounded-lg transition-all"
                          title="Remove"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {receivedItems.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-8 py-32 text-center mt-8">
                      <div className="max-w-xs mx-auto space-y-4">
                        <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center mx-auto">
                          <Package size={32} className="text-on-surface-variant/20" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-bold text-on-surface">Empty Receipt Session</p>
                          <p className="text-xs text-on-surface-variant">There are currently no items added to this stock receipt. Search for products above to get started.</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Receipt Summary Footer */}
          <div className="p-8 bg-surface-container-low border-t border-outline-variant/20">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="flex items-center gap-10">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/50 mb-1">Total Items</span>
                  <span className="text-2xl font-headline font-black text-on-surface">{receivedItems.length}</span>
                </div>
                <div className="w-[1px] h-10 bg-outline-variant/20"></div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/50 mb-1">Total Units</span>
                  <span className="text-2xl font-headline font-black text-on-surface">
                    {receivedItems.reduce((acc, item) => acc + (item.receivedQty || 0), 0)}
                  </span>
                </div>
              </div>

              <div className="flex gap-4 w-full md:w-auto">
                <Button
                  variant="outline"
                  className="flex-1 md:flex-none h-12 px-8 font-bold border-2"
                  onClick={() => setReceivedItems([])}
                >
                  Discard Draft
                </Button>
                <Button
                  className="flex-1 md:flex-none h-12 px-10 font-bold shadow-lg shadow-primary/20"
                  onClick={() => form.handleSubmit(handleSubmit)()}
                  disabled={receivedItems.length === 0}
                >
                  Confirm & Post Stock
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Modal
        isOpen={!!editingItem}
        onClose={() => setEditingItem(null)}
        title="Edit Line Item Details"
        maxWidth="w-[550px]"
      >
        {(() => {
          const activeItem = receivedItems.find(i => i.id === editingItem?.id) || editingItem;
          if (!activeItem) return null;

          return (
            <div className="space-y-6 pt-2 max-h-[80vh] overflow-y-auto pr-2 custom-scrollbar">
              <div className="flex items-center gap-4 p-4 bg-surface-container-low rounded-xl border border-outline-variant/10">
                <div className="w-16 h-16 rounded-lg bg-white overflow-hidden shrink-0 border border-outline-variant/10">
                  <img src={activeItem.image} alt="" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-on-surface">{activeItem.name}</h3>
                  <p className="text-xs text-on-surface-variant font-mono">{activeItem.barcode}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Quantity to Receive"
                  type="number"
                  value={activeItem.receivedQty}
                  onChange={(e) => updateReceivedItem(activeItem.id, { receivedQty: parseInt(e.target.value) || 0 })}
                />
                <Input
                  label="Unit Cost Price"
                  type="number"
                  step="0.01"
                  icon={<span className="text-sm font-bold">$</span>}
                  value={activeItem.unitCost}
                  onChange={(e) => updateReceivedItem(activeItem.id, { unitCost: parseFloat(e.target.value) || 0 })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Barcode / EAN"
                  value={activeItem.barcode}
                  onChange={(e) => updateReceivedItem(activeItem.id, { barcode: e.target.value })}
                />
                <Input
                  label="SKU Code"
                  value={activeItem.sku}
                  onChange={(e) => updateReceivedItem(activeItem.id, { sku: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Lot / Batch Number"
                  placeholder="BATCH-001"
                  value={activeItem.lot_number || ''}
                  onChange={(e) => updateReceivedItem(activeItem.id, { lot_number: e.target.value })}
                />
                <Input
                  label="Expiry Date"
                  type="date"
                  value={activeItem.expiry_date || ''}
                  onChange={(e) => updateReceivedItem(activeItem.id, { expiry_date: e.target.value })}
                />
              </div>

              <Select
                label="Storage Destination"
                value={activeItem.area}
                onChange={(e) => {
                  const id = e.target.value;
                  const areaName = stockArea?.find(a => a.area_id === id)?.name || '';
                  updateReceivedItem(activeItem.id, { area: id, location_name: areaName });
                }}
              >
                <option value="">Select Area</option>
                {stockArea?.map(area => (
                  <option key={area.area_id} value={area.area_id}>{area.name}</option>
                ))}
              </Select>

              <div className="pt-4 flex gap-3 sticky bottom-0 bg-surface-container-lowest pb-2">
                <Button
                  variant="secondary"
                  className="flex-1 h-12 font-bold"
                  onClick={() => setEditingItem(null)}
                >
                  Close
                </Button>
                <Button
                  className="flex-1 h-12 font-bold shadow-lg shadow-primary/20"
                  onClick={() => setEditingItem(null)}
                >
                  Save Details
                </Button>
              </div>
            </div>
          );
        })()}
      </Modal>


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
              setBarcode(newProduct.barcode || '');
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

