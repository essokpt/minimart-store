import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronRight,
  Truck,
  ShoppingBag,
  PlusCircle,
  Minus,
  Plus,
  Trash2,
  Send,
  Package,
  MapPin,
  CheckCircle,
  Search,
  FileText
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { CustomerForm } from '../../components/form/CustomerForm';
import { CustomerInput } from '../../lib/validations';
import { useInventory } from '../inventory/useInventory';
import { Order, Product } from '@/src/types';
import { usePOS } from '../pos/usePOS';

interface OrderItem {
  product_id: string;
  name: string;
  sku: string;
  barcode: string;
  price: number;
  quantity: number;
  image: string;
}

export function CreateOrder() {
  const navigate = useNavigate();

  const [shippingMethod, setShippingMethod] = useState<'Standard' | 'Express' | 'Pickup'>('Standard');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { products, createProduct, uploadImage } = useInventory();
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const { checkout, createOrderItems } = usePOS();

  const subtotal = orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = subtotal * 0.07;
  const shippingCost = shippingMethod === 'Express' ? 15.00 : 0;
  const discount = 0.00; // Mock discount
  const total = subtotal + tax + shippingCost - discount;

  // Filter real products from database
  const filteredProducts = searchQuery.trim().length > 0
    ? products.filter(p =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.barcode?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (p.brand?.toLowerCase() || '').includes(searchQuery.toLowerCase())
    ).slice(0, 8)
    : [];

  const updateQuantity = (id: string, delta: number) => {
    setOrderItems(prev => prev.map(item =>
      item.product_id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ));
  };

  const removeItem = (id: string) => {
    setOrderItems(prev => prev.filter(item => item.product_id !== id));
  };

  const addItem = (product: Product) => {
    const existingIndex = orderItems.findIndex(item => item.product_id === product.product_id);

    if (existingIndex > -1) {
      // Increment quantity if exists
      const updatedItems = [...orderItems];
      updatedItems[existingIndex].quantity += 1;
      setOrderItems(updatedItems);
    } else {
      // Add as new item
      setOrderItems([...orderItems, {
        product_id: product.product_id,
        name: product.name,
        sku: '',
        barcode: product.barcode || '',
        // currentStock: product.stock_value || 0,
        image: product.image_url || product.image || '',
        quantity: 1,
        price: product.unit_price || 0,
      }]);
    }

    setSearchQuery('');

  };


  const handleCustomerSubmit = async (customerData: CustomerInput) => {
    setIsSubmitting(true);
    const orderData: Partial<Order> = {
      order_number: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
      customer: customerData.fullName,
      status: 'Confirmed',
      order_type: 'Online/Call-in',
      payment_method: 'Bank Transfer',
      cash_received: 0,
      change: 0,
      amount: total,
    };
    console.log('create new order', customerData)
    try {
      if (orderItems.length > 0) {
        // orderData already has status: 'Completed', etc.
        const newOrder = await checkout.mutateAsync(orderData);

        if (newOrder && newOrder.order_id) {
          const newOrderItems = orderItems.map(item => ({
            order_id: newOrder.order_id,
            product_id: item.product_id,
            quantity: item.quantity,
            barcode: item.barcode,
            unit_price: item.price,
            sku: item.sku,
            total: item.price * item.quantity,

          }));
          console.log('create order items', orderItems);
          await createOrderItems.mutateAsync(newOrderItems as any[]);
        }
      }
    } catch (error) {
      console.error('Error creating order:', error);
    }
    // Simulate API call

    setIsSubmitting(false);
    setIsSuccess(true);
    setTimeout(() => {
      navigate('/orders');
    }, 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto space-y-12"
    >
      {/* Page Header */}
      <div>
        <nav className="flex items-center gap-2 text-sm text-on-surface-variant/60 mb-4 font-medium">
          <span>Orders</span>
          <ChevronRight size={14} />
          <span className="text-on-surface">New Manual Order</span>
        </nav>
        <h1 className="text-4xl font-extrabold tracking-tight text-on-surface font-headline mb-2">Create manual order</h1>
        <p className="text-on-surface-variant font-medium">Fill in the details to curate a new bespoke order for your clientele.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* Main Form Section */}
        <div className="xl:col-span-8 space-y-8">
          <Card className="p-8" variant="elevated">
            <div className="flex items-center justify-between mb-8">
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
                    //   onClick={() => setIsProductModalOpen(true)}
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
                          // onClick={() => setIsProductModalOpen(true)}
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

            <div className="space-y-6">
              {orderItems.map((item) => (
                <div key={item.product_id} className="flex items-center gap-6 group hover:bg-surface-container-low/50 p-3 rounded-xl transition-all">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-surface-container border border-outline-variant/10">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-on-surface">{item.name}</h4>
                    <p className="text-[10px] text-on-surface-variant font-medium uppercase tracking-wider">{item.sku}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center bg-surface-container-high rounded-lg p-1 border border-outline-variant/10">
                      <button
                        onClick={() => updateQuantity(item.product_id, -1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-surface-container-highest rounded-md transition-all text-on-surface-variant"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center font-bold text-sm text-on-surface">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product_id, 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-surface-container-highest rounded-md transition-all text-on-surface-variant"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <div className="w-24 text-right">
                      <p className="font-bold text-on-surface">{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                    <button
                      onClick={() => removeItem(item.product_id)}
                      className="p-2 text-on-surface-variant/40 hover:text-error transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
          {/* Customer Information Section */}
          <CustomerForm
            onSubmit={handleCustomerSubmit}
            isSubmitting={isSubmitting}
            submitLabel="Create Order"
          />
          {/* Shipping Method Section */}
          <Card className="p-8" variant="elevated">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Truck size={20} />
              </div>
              <h2 className="text-xl font-bold font-headline">Shipping Method</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { id: 'Standard', label: 'Standard Delivery', sub: '3-5 business days', price: 'Free' },
                { id: 'Express', label: 'Express Courier', sub: 'Next day delivery', price: '15.00' },
                { id: 'Pickup', label: 'Boutique Pickup', sub: 'Ready in 2 hours', price: 'Free' },
              ].map((method) => (
                <label
                  key={method.id}
                  className={`relative flex items-center p-4 cursor-pointer rounded-lg border-2 transition-all ${shippingMethod === method.id
                    ? 'border-primary bg-primary/5'
                    : 'border-transparent bg-surface-container-low hover:bg-surface-container'
                    }`}
                >
                  <input
                    type="radio"
                    name="shipping"
                    className="hidden"
                    checked={shippingMethod === method.id}
                    onChange={() => setShippingMethod(method.id as any)}
                  />
                  <div>
                    <p className="font-bold text-on-surface text-sm">{method.label}</p>
                    <p className="text-[10px] text-on-surface-variant font-medium">{method.sub}</p>
                  </div>
                  <span className="ml-auto font-bold text-primary text-sm">{method.price}</span>
                </label>
              ))}
            </div>
          </Card>


        </div>

        {/* Sidebar Summary */}
        <aside className="xl:col-span-4 sticky top-28 space-y-6">
          <Card className="p-8 space-y-8" variant="elevated">
            <div>
              <h2 className="text-xl font-bold font-headline mb-6">Order summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between text-sm font-medium text-on-surface-variant">
                  <span>Subtotal</span>
                  <span className="text-on-surface">{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-medium text-on-surface-variant">
                  <span>Shipping cost</span>
                  <span className="text-primary font-bold">{shippingCost === 0 ? 'Free' : `${shippingCost.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-sm font-medium text-on-surface-variant">
                  <span>Tax estimate (7%)</span>
                  <span className="text-on-surface">{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-medium text-on-surface-variant items-center">
                  <div className="flex items-center gap-2">
                    <span>Discount</span>
                    <Badge variant="primary" size="sm">WELCOME10</Badge>
                  </div>
                  <span className="text-error">-{discount.toFixed(2)}</span>
                </div>

                <div className="h-px bg-outline-variant/20 my-6"></div>

                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold mb-1">Total amount</p>
                    <p className="text-3xl font-extrabold text-on-surface font-headline">{total.toFixed(2)}</p>
                  </div>
                  <span className="text-[10px] text-on-surface-variant/60 italic">Taxes included</span>
                </div>
              </div>
            </div>

            {/* Note: Submit button is now in CustomerForm */}
          </Card>

          {/* Quick Notes */}
          <div className="p-4 space-y-3">
            <div className="flex items-center gap-2">
              <FileText size={14} className="text-on-surface-variant/40" />
              <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Internal Notes</label>
            </div>
            <textarea
              className="w-full bg-transparent border-none focus:ring-0 text-sm p-0 resize-none h-24 placeholder:italic placeholder:text-on-surface-variant/30 text-on-surface-variant font-medium"
              placeholder="Add a note for the packing team..."
            ></textarea>
          </div>
        </aside>
      </div>

      {/* Success Overlay */}
      <AnimatePresence>
        {isSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-surface/80 backdrop-blur-md flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center space-y-6"
            >
              <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center text-on-primary mx-auto shadow-2xl shadow-primary/40 border-t border-white/30">
                <CheckCircle size={48} />
              </div>
              <div className="space-y-2">
                <h2 className="text-4xl font-headline font-extrabold text-on-surface">Order Success!</h2>
                <p className="text-on-surface-variant font-medium">Order #ORD-9921 has been created successfully.</p>
              </div>
              <p className="text-xs text-on-surface-variant font-mono animate-pulse">Redirecting to order list...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
