import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronRight, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Truck, 
  ShoppingBag,
  PlusCircle,
  Minus,
  Plus,
  Trash2,
  Send,
  Package,
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

interface OrderItem {
  id: string;
  name: string;
  sku: string;
  details: string;
  price: number;
  quantity: number;
  image: string;
}

export function CreateOrder() {
  const navigate = useNavigate();
  const [items, setItems] = useState<OrderItem[]>([
    { 
      id: '1', 
      name: 'Signature Wool Blazer', 
      sku: 'AT-BL-001 • Navy Blue • Size 48',
      price: 850.00, 
      quantity: 1, 
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBo7P33AKD1f6VekRMnq7Aro7j_Af01seriw-kfrWiZ9iFp61iMxI3RlJW9aceVvf3bk_YK1uohTo1UTDFBLpgwVoRrS0izLEFU_RUye872LSserdbDANQIcUFUdlvu6ymwqw2PmiIfixKEasKp-bGqdyIPLb1T8S-J7-pw51F9dY4Yq8yAfnGWLe1q0lvx4scKio-KxM3hPC75-KeVrCcn90d0Cna486eZkECmBq2E8-Nja30WPaYhd3jVYvmUcbUNItVKbHlZ37Y' 
    },
    { 
      id: '2', 
      name: 'Atelier Craft Sneakers', 
      sku: 'AT-SK-442 • Crimson • Size 42',
      price: 420.00, 
      quantity: 2, 
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCy9539pVcWRC6vbj2EEd9u4Lu4k3w-RZlZan_1EpDocLxB4Yt0-70oWYlt5ESDYernMg-41zF9XADXyGjmLJicxBOMr2rNp73h0JlcZxo10GV-Y336855qR8epNmcLZddwREHGJzxqe23zEwWBkw40VR_GsWOUXsI_CVWIBVDPmNFDIeFSkaM74szJ7mcRCSR9l8l09kR13hZQPvs1d21G5SV-ldz6_w6rwr3_H-_HYEiqAtUmgaFaGrQsR7msBmrpTSiQyLJ_QnA' 
    },
  ]);

  const [shippingMethod, setShippingMethod] = useState<'Standard' | 'Express' | 'Pickup'>('Standard');
  const [isSuccess, setIsSuccess] = useState(false);

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = subtotal * 0.10;
  const shippingCost = shippingMethod === 'Express' ? 15.00 : 0;
  const discount = 127.00; // Mock discount
  const total = subtotal + tax + shippingCost - discount;

  const updateQuantity = (id: string, delta: number) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ));
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const handleCreateOrder = () => {
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
          
          {/* Customer Information Section */}
          <Card className="p-8" variant="elevated">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <User size={20} />
              </div>
              <h2 className="text-xl font-bold font-headline">Customer details</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Full Name" placeholder="e.g. Julianne Moore" />
              <Input label="Email Address" type="email" placeholder="julianne@example.com" />
              <Input label="Phone Number" type="tel" placeholder="+1 (555) 000-0000" />
              <Input label="Customer ID (Optional)" placeholder="AT-9921" />
            </div>
          </Card>

          {/* Shipping & Delivery Section */}
          <Card className="p-8" variant="elevated">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Truck size={20} />
              </div>
              <h2 className="text-xl font-bold font-headline">Shipping details</h2>
            </div>
            
            <div className="space-y-6">
              <Input label="Street Address" placeholder="123 Atelier Way, Floor 4" />
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="col-span-2">
                  <Input label="City" placeholder="Paris" />
                </div>
                <Input label="Postal Code" placeholder="75001" />
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-on-surface-variant">Country</label>
                  <select className="w-full bg-surface-container-highest border-none rounded-lg focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all py-3 px-4 outline-none appearance-none">
                    <option>France</option>
                    <option>Italy</option>
                    <option>United Kingdom</option>
                    <option>USA</option>
                  </select>
                </div>
              </div>

              <div className="pt-4">
                <label className="text-sm font-semibold text-on-surface-variant mb-4 block">Shipping Method</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { id: 'Standard', label: 'Standard Delivery', sub: '3-5 business days', price: 'Free' },
                    { id: 'Express', label: 'Express Courier', sub: 'Next day delivery', price: '€15.00' },
                    { id: 'Pickup', label: 'Boutique Pickup', sub: 'Ready in 2 hours', price: 'Free' },
                  ].map((method) => (
                    <label 
                      key={method.id}
                      className={`relative flex items-center p-4 cursor-pointer rounded-lg border-2 transition-all ${
                        shippingMethod === method.id 
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
              </div>
            </div>
          </Card>

          {/* Order Items Section */}
          <Card className="p-8" variant="elevated">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <ShoppingBag size={20} />
                </div>
                <h2 className="text-xl font-bold font-headline">Selected items</h2>
              </div>
              <Button variant="ghost" size="sm">
                <PlusCircle size={18} />
                <span>Add Product</span>
              </Button>
            </div>

            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-6 group hover:bg-surface-container-low/50 p-3 rounded-xl transition-all">
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
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-surface-container-highest rounded-md transition-all text-on-surface-variant"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center font-bold text-sm text-on-surface">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-surface-container-highest rounded-md transition-all text-on-surface-variant"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <div className="w-24 text-right">
                      <p className="font-bold text-on-surface">€{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-on-surface-variant/40 hover:text-error transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}

              {/* Search bar to add items */}
              <div className="mt-8">
                <Input 
                  placeholder="Search catalog for more items..." 
                  icon={<Search size={18} />}
                />
              </div>
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
                  <span className="text-on-surface">€{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-medium text-on-surface-variant">
                  <span>Shipping cost</span>
                  <span className="text-primary font-bold">{shippingCost === 0 ? 'Free' : `€${shippingCost.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-sm font-medium text-on-surface-variant">
                  <span>Tax estimate (10%)</span>
                  <span className="text-on-surface">€{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-medium text-on-surface-variant items-center">
                  <div className="flex items-center gap-2">
                    <span>Discount</span>
                    <Badge variant="primary" size="sm">WELCOME10</Badge>
                  </div>
                  <span className="text-error">-€{discount.toFixed(2)}</span>
                </div>
                
                <div className="h-px bg-outline-variant/20 my-6"></div>
                
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold mb-1">Total amount</p>
                    <p className="text-3xl font-extrabold text-on-surface font-headline">€{total.toFixed(2)}</p>
                  </div>
                  <span className="text-[10px] text-on-surface-variant/60 italic">Taxes included</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-4">
              <Button 
                onClick={handleCreateOrder}
                disabled={items.length === 0 || isSuccess}
                className="w-full py-4 text-lg"
              >
                <Send size={20} />
                Create Order
              </Button>
              <Button variant="secondary" className="w-full">
                Save as Draft
              </Button>
              <Button 
                variant="ghost"
                onClick={() => navigate('/orders')}
                className="w-full text-xs"
              >
                Discard Changes
              </Button>
            </div>

            {/* Mini Map / Warehouse Location Info */}
            <div className="rounded-xl overflow-hidden bg-surface-container-lowest/50 p-4 space-y-4 border border-outline-variant/5">
              <div className="flex items-center gap-2">
                <Package size={14} className="text-primary" />
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">FULFILLMENT CENTER</span>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-surface-container-high flex-shrink-0 flex items-center justify-center text-on-surface-variant/40">
                  <MapPin size={24} />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-on-surface">Hub Paris-Sud (A-4)</p>
                  <p className="text-[10px] text-on-surface-variant font-medium">Stock Level: <span className="text-primary font-bold">High (94%)</span></p>
                  <p className="text-[10px] text-on-surface-variant font-medium">Estimated Dispatch: <span className="text-on-surface font-bold">Today</span></p>
                </div>
              </div>
            </div>
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
