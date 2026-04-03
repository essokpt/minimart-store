import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Plus, Minus, Trash2, Receipt, Percent, ArrowRight, ScanLine, Users, ShoppingCart } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { CheckoutModal } from '../../components/pos/CheckoutModal';
import { categories as mockCategories } from '../../data/mockData';
import { usePosStore } from '../../store/usePosStore';
import { useInventory } from '../inventory/useInventory';
import { usePOS } from './usePOS';
import { Loading } from '@/src/components/ui/Loading';

export function POS() {
  const { products, isLoading: isLoadingInventory } = useInventory();
  const { checkout } = usePOS();

  const cart = usePosStore((state) => state.cart);
  const addItem = usePosStore((state) => state.addItem);
  const removeItem = usePosStore((state) => state.removeItem);
  const updateQuantity = usePosStore((state) => state.updateQuantity);
  const cartTotal = usePosStore((state) => state.cartTotal());
  const cartItemCount = usePosStore((state) => state.cartItemCount());

  const [isCartOpen, setIsCartOpen] = useState(true);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const taxRate = 0.08;
  const taxAmount = cartTotal * taxRate;
  const finalTotal = cartTotal + taxAmount;

  if (isLoadingInventory) {
    return (
      // <div className="h-[calc(100vh-80px)] flex flex-col items-center justify-center space-y-4">
      //   <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      //   <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Loading Catalog...</p>
      // </div>
      <Loading label='POS data' />
    );
  }


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex h-[calc(100vh-80px)] -m-10"
    >
      <section className="flex-1 p-10 overflow-y-auto bg-background">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-headline font-extrabold text-on-surface tracking-tight">Point of Sale</h2>
            <p className="text-on-surface-variant font-medium uppercase tracking-widest text-[10px]">Terminal #04 • Wednesday, Oct 25</p>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setIsCartOpen(!isCartOpen)} className="relative">
              <ShoppingCart size={16} />
              {isCartOpen ? 'Hide Cart' : 'Show Cart'}
              {!isCartOpen && cartItemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-error text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                  {cartItemCount}
                </span>
              )}
            </Button>
            <Button>
              <ScanLine size={16} />
              Quick Scan
            </Button>
          </div>
        </div>

        {/* <div className="flex gap-3 mb-10 overflow-x-auto pb-2 no-scrollbar">
          {mockCategories.map((cat, i) => (
            <Button
              key={cat}
              variant={i === 0 ? 'primary' : 'secondary'}
            >
              {cat}
            </Button>
          ))}
        </div> */}

        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card key={product.product_id} className="p-4 text-left" hover onClick={() => addItem(product)}>
              <div className="aspect-square rounded-md bg-surface-container mb-4 overflow-hidden border border-outline-variant/10">
                <img
                  src={product.image_url || product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
              <p className="text-[9px] font-bold text-primary uppercase tracking-widest mb-1">{product.model}</p>
              <h3 className="font-headline font-bold text-on-surface leading-tight mb-2 truncate">{product.name}</h3>
              <div className="flex justify-between items-center">
                <span className="text-lg font-mono font-bold text-on-surface-variant">${product.unit_price.toFixed(2)}</span>
                <div className="w-9 h-9 rounded-md bg-secondary-container flex items-center justify-center text-on-secondary-container shadow-sm group-hover:bg-primary group-hover:text-on-primary transition-colors border border-outline-variant/20">
                  <Plus size={18} />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <AnimatePresence>
        {isCartOpen && (
          <motion.section
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 420, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="h-full glass-panel border-l border-outline-variant/10 shadow-2xl z-10 shrink-0 overflow-hidden"
          >
            <div className="w-[420px] h-full flex flex-col">
              <div className="p-8 border-b border-surface-container">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-headline font-extrabold text-2xl text-on-surface">Order Summary</h3>
                  <Badge variant="secondary" className="font-mono">{cartItemCount} ITEMS</Badge>
                </div>
                <div className="flex items-center gap-2 text-xs text-on-surface-variant/60 font-medium">
                  <Users size={14} />
                  <span>Guest Customer</span>
                  <button className="text-primary font-bold ml-auto hover:underline">Add Loyalty</button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center text-on-surface-variant space-y-4">
                    <Receipt size={48} className="opacity-20" />
                    <p className="font-medium">Cart is empty.<br />Scan or select items to add.</p>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div key={item.product_id} className="flex gap-6 group items-center">
                      <div className="w-20 h-20 rounded-md bg-surface-container-low overflow-hidden flex-shrink-0 border border-outline-variant/20 shadow-sm">
                        <img src={item.image_url || item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div className="flex-1 py-1">
                        <div className="flex justify-between mb-3 items-start relative">
                          <h4 className="text-base font-bold text-on-surface leading-tight pr-12">{item.name}</h4>
                          <button onClick={() => removeItem(item.product_id)} className="absolute top-0 right-0 text-on-surface-variant/40 hover:text-error transition-colors p-1"><Trash2 size={18} /></button>
                        </div>
                        <div className="flex items-center justify-between mt-auto">
                          <div className="flex items-center bg-surface-container-low rounded-md p-1 shadow-sm border border-outline-variant/10">
                            <button onClick={() => updateQuantity(item.product_id, -1)} className="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors bg-surface-container hover:bg-surface-container-highest rounded-sm"><Minus size={16} /></button>
                            <span className="text-sm font-mono font-bold w-10 text-center">{item.qty}</span>
                            <button onClick={() => updateQuantity(item.product_id, 1)} className="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors bg-surface-container hover:bg-surface-container-highest rounded-sm"><Plus size={16} /></button>
                          </div>
                          <div className="text-right">
                            <span className="block text-base font-mono font-extrabold text-primary">${(item.unit_price * item.qty).toFixed(2)}</span>
                            <span className="block text-[10px] text-on-surface-variant font-mono font-bold uppercase tracking-wider mt-0.5">@ ${item.unit_price.toFixed(2)} / ea</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="p-8 bg-surface-container border-t border-outline-variant/10 space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-on-surface-variant font-medium">Subtotal</span>
                    <span className="text-on-surface font-mono font-bold">${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-on-surface-variant font-medium">Tax (8%)</span>
                    <span className="text-on-surface font-mono font-bold">${taxAmount.toFixed(2)}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-outline-variant/10 flex justify-between items-center mb-6">
                  <span className="text-base font-headline font-extrabold text-on-surface">Total Amount</span>
                  <span className="text-3xl font-mono font-bold text-primary tracking-tight">${finalTotal.toFixed(2)}</span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <Button variant="secondary" className="w-full">
                    <Receipt size={16} />
                    Hold Order
                  </Button>
                  <Button variant="secondary" className="w-full">
                    <Percent size={16} />
                    Discount
                  </Button>
                </div>

                <Button
                  className="w-full py-6 text-lg"
                  onClick={() => setIsCheckoutOpen(true)}
                  disabled={cart.length === 0}
                >
                  Check Out
                  <ArrowRight size={22} />
                </Button>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        total={finalTotal}
      />
    </motion.div>
  );
}
