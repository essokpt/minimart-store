import { motion } from 'motion/react';
import { ArrowLeft, Package, Edit2, Archive, Copy, Barcode, TrendingUp, AlertTriangle, MapPin } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { Loading } from '../../components/ui/Loading';
import { ErrorState } from '../../components/ui/ErrorState';
import { useProduct, useInventory } from './useInventory';
import { useCategories } from './useCategories';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { useState, useEffect } from 'react';
import { formatCurrency } from '../../lib/formatters';
import { useStores } from '../Stock/useStores';
import { useStock } from '../Stock/useStock';

export function ProductDetail() {
  const { id } = useParams();
  const { data: product, isLoading, error } = useProduct(id);
  const { updateProduct } = useInventory();
  const { categories } = useCategories();
  const { stores } = useStores();
  const activeStore = stores[0];
  const currencySymbol = activeStore?.currency_symbol || '$';

  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [adjustmentType, setAdjustmentType] = useState<'Add' | 'Remove'>('Add');
  const [adjustmentValue, setAdjustmentValue] = useState<number>(0);
  const [editProduct, setEditProduct] = useState<any>(null);

  const { getProductLocations } = useStock();
  const [productLocations, setProductLocations] = useState<{ area_id: string, name: string, quantity: number }[]>([]);

  useEffect(() => {
    const fetchLocations = async () => {
      if (id) {
        const locs = await getProductLocations(id);
        setProductLocations(locs);
      }
    };
    fetchLocations();
  }, [id, getProductLocations]);

  const handleAdjustStock = async () => {
    if (!product || adjustmentValue <= 0) return;
    const currentStock = product.stock_value || 0;
    const newStock = adjustmentType === 'Add' ? currentStock + adjustmentValue : Math.max(0, currentStock - adjustmentValue);

    try {
      await updateProduct.mutateAsync({ id: product.product_id, updates: { stock_value: newStock } });
      setIsAdjustModalOpen(false);
      setAdjustmentValue(0);
    } catch (err) {
      console.error('Failed to adjust stock:', err);
    }
  };

  const handleEditProduct = async () => {
    if (!product || !editProduct) return;
    try {
      await updateProduct.mutateAsync({ id: product.product_id, updates: editProduct });
      setIsEditModalOpen(false);
    } catch (err) {
      console.error('Failed to update product:', err);
    }
  };

  if (isLoading) return <div className="h-[calc(100vh-120px)] flex items-center justify-center"><Loading /></div>;
  if (error || !product) return <div className="h-[calc(100vh-120px)] flex items-center justify-center"><ErrorState onRetry={() => window.location.reload()} /></div>;

  const isLowStock = product.stock_value ? product.stock_value < 20 : false;
  const marginPercentage = product.unit_price && product.cost_price
    ? Math.round(((product.unit_price - product.cost_price) / product.unit_price) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/products">
            <Button variant="ghost" size="icon" className="w-10 h-10 rounded-full bg-surface-container hover:bg-surface-container-high border border-outline-variant/20">
              <ArrowLeft size={20} />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-headline font-extrabold text-on-surface tracking-tight">{product.name}</h2>
              <Badge variant="primary" className="ml-2">{product.category?.name}</Badge>
            </div>
            <p className="text-on-surface-variant font-medium mt-1">
              {product.brand} {product.model} · Inventory Status
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setIsAdjustModalOpen(true)}>
            <Archive size={18} />
            Adjust Stock
          </Button>
          <Button onClick={() => {
            setEditProduct({ ...product });
            setIsEditModalOpen(true);
          }}>
            <Edit2 size={18} />
            Edit Product
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-8">
          <Card className="p-2 overflow-hidden bg-surface-container-lowest border-outline-variant/20">
            <div className="aspect-square rounded-sm overflow-hidden bg-surface-container relative group">
              <img
                src={product.image_url || product.image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <Button variant="secondary" size="sm" className="w-full backdrop-blur-md bg-white/20 text-white border-white/30 hover:bg-white/30">
                  Update Image
                </Button>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-surface-container border-outline-variant/10">
            <h3 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-4">Identification</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-surface-container-lowest rounded-sm border border-outline-variant/20">
                <div>
                  <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest">Barcode / SKU</p>
                  <p className="font-mono font-bold text-on-surface mt-0.5">{product.barcode || 'N/A'}</p>
                </div>
                <button className="text-primary hover:text-primary-container p-2 rounded-md transition-colors"><Copy size={16} /></button>
              </div>
              <div className="p-6 bg-surface-container-lowest rounded-sm border border-outline-variant/20 flex flex-col items-center justify-center gap-2">
                <Barcode size={64} className="text-on-surface opacity-80" strokeWidth={1} />
                <p className="font-mono text-[10px] tracking-[0.2em] font-medium text-on-surface-variant">{product.barcode}</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <Card className="p-8 bg-surface-container-lowest border-outline-variant/20" variant="elevated">
            <h3 className="text-xl font-headline font-bold mb-6">Pricing & Inventory</h3>
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Retail Price</p>
                  <p className="text-4xl font-mono font-extrabold text-primary">{formatCurrency(product.unit_price, { currencySymbol })}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Cost Margin</p>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-on-surface">{formatCurrency(product.cost_price, { currencySymbol })}</span>
                    <Badge variant="success" className="text-[8px]">{marginPercentage}% MARGIN</Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-6 pl-8 border-l border-outline-variant/20">
                <div>
                  <div className="flex justify-between items-end mb-1">
                    <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Stock Level</p>
                    <span className="font-mono font-bold text-on-surface">{product.stock_value || 0} Unit{product.stock_value !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="h-2 w-full bg-surface-container rounded-sm overflow-hidden mb-2">
                    <div
                      className={`h-full ${isLowStock ? 'bg-error' : 'bg-primary'}`}
                      style={{ width: `${Math.min(((product.stock_value || 0) / 100) * 100, 100)}%` }}
                    ></div>
                  </div>
                  {isLowStock ? (
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-error uppercase tracking-widest">
                      <AlertTriangle size={12} /> Low stock warning
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                      <TrendingUp size={12} className="text-primary" /> Stock is healthy
                    </div>
                  )}
                </div>

                <div>
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Product Details</p>
                  <div className="flex items-center gap-2">
                    <Package size={16} className="text-secondary" />
                    <span className="font-headline font-semibold text-sm">{product.type} · {product.status}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-8 bg-surface-container-lowest border-outline-variant/20">
            <h3 className="text-xl font-headline font-bold mb-6">Product Description</h3>
            <p className="text-on-surface-variant leading-relaxed">
              {product.description || 'No detailed description available for this product.'}
            </p>
          </Card>

          <Card className="p-0 overflow-hidden bg-surface-container-lowest border-outline-variant/20">
            <div className="p-6 border-b border-outline-variant/10 flex items-center justify-between">
              <h3 className="text-xl font-headline font-bold">Stock History</h3>
              <Button variant="ghost" size="sm">View All Logs</Button>
            </div>
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-container-low text-[10px] font-black uppercase tracking-widest text-on-surface-variant/50 border-b border-outline-variant/10">
                <tr>
                  <th className="px-6 py-4">Storage Area</th>
                  <th className="px-6 py-4 text-right">In Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {productLocations.length > 0 ? (
                  productLocations.map(loc => (
                    <tr key={loc.area_id} className="hover:bg-surface-container-low/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-on-surface flex items-center gap-2">
                        <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-primary">
                          <MapPin size={16} />
                        </div>
                        {loc.name}
                      </td>
                      <td className="px-6 py-4 text-right font-mono font-bold text-on-surface">
                        <Badge variant="secondary" className="px-3 py-1 text-sm bg-surface-container text-on-surface border-outline-variant/20">
                          {loc.quantity} Units
                        </Badge>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={2} className="px-6 py-12 text-center text-on-surface-variant font-medium">
                      No stock locations recorded for this product.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </Card>
        </div>
      </div>
      <Modal
        isOpen={isAdjustModalOpen}
        onClose={() => setIsAdjustModalOpen(false)}
        title="Adjust Stock Level"
        footer={
          <div className="flex gap-4 w-full">
            <Button variant="secondary" onClick={() => setIsAdjustModalOpen(false)} className="flex-1">Cancel</Button>
            <Button className="flex-1" onClick={handleAdjustStock} loading={updateProduct.isPending}>Update Stock</Button>
          </div>
        }
      >
        <div className="space-y-6">
          <div className="p-4 bg-primary/10 rounded-sm flex items-center justify-between border border-primary/20">
            <div className="flex items-center gap-3 text-primary">
              <Package size={20} />
              <span className="font-bold text-sm">Current Level</span>
            </div>
            <span className="font-mono font-extrabold text-lg text-primary">{product.stock_value || 0} Units</span>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div
                onClick={() => setAdjustmentType('Add')}
                className={`p-4 rounded-sm border-2 transition-all cursor-pointer flex flex-col items-center gap-2 ${adjustmentType === 'Add' ? 'border-primary bg-primary/5' : 'border-outline-variant/30 opacity-60 hover:opacity-100'}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${adjustmentType === 'Add' ? 'bg-primary text-on-primary' : 'bg-surface-container'}`}>
                  <span className="text-xl font-bold">+</span>
                </div>
                <span className="text-xs font-bold uppercase tracking-widest">Add Stock</span>
              </div>
              <div
                onClick={() => setAdjustmentType('Remove')}
                className={`p-4 rounded-sm border-2 transition-all cursor-pointer flex flex-col items-center gap-2 ${adjustmentType === 'Remove' ? 'border-error bg-error/5' : 'border-outline-variant/30 opacity-60 hover:opacity-100'}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${adjustmentType === 'Remove' ? 'bg-error text-on-error' : 'bg-surface-container'}`}>
                  <span className="text-xl font-bold">-</span>
                </div>
                <span className="text-xs font-bold uppercase tracking-widest">Remove Stock</span>
              </div>
            </div>

            <Input
              label="Adjustment Quantity"
              type="number"
              placeholder="0"
              value={adjustmentValue}
              onChange={(e) => setAdjustmentValue(parseInt(e.target.value) || 0)}
              className="text-center font-mono text-xl"
            />
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Quick Edit Product"
        footer={
          <div className="flex gap-4 w-full">
            <Button variant="secondary" onClick={() => setIsEditModalOpen(false)} className="flex-1">Cancel</Button>
            <Button className="flex-1" onClick={handleEditProduct} loading={updateProduct.isPending}>Save Changes</Button>
          </div>
        }
      >
        <div className="space-y-6">
          <Input
            label="Product Name"
            value={editProduct?.name || ''}
            onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Selling Price"
              type="number"
              value={editProduct?.unit_price || 0}
              onChange={(e) => setEditProduct({ ...editProduct, unit_price: parseFloat(e.target.value) })}
            />
            <Select
              label="Category"
              value={editProduct?.category_id || ''}
              onChange={(e) => setEditProduct({ ...editProduct, category_id: e.target.value })}
            >
              {categories.map(cat => (
                <option key={cat.category_id} value={cat.category_id}>{cat.name}</option>
              ))}
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Description</label>
            <textarea
              className="w-full h-32 p-4 bg-surface-container-low border border-outline-variant/30 rounded-sm focus:outline-none focus:border-primary transition-colors text-sm text-on-surface font-medium resize-none"
              value={editProduct?.description || ''}
              onChange={(e) => setEditProduct({ ...editProduct, description: e.target.value })}
            />
          </div>
        </div>
      </Modal>
    </motion.div>
  );
}
