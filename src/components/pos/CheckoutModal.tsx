import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CreditCard, Banknote, QrCode, CheckCircle2, Printer, ArrowRight, Loader2, Award } from 'lucide-react';
import { Button } from '../ui/Button';
import { usePosStore } from '../../store/usePosStore';
import { useStores } from '../../pages/Stock/useStores';
import { useLoyalty } from '../../pages/settings/useLoyalty';
import { formatCurrency } from '../../lib/formatters';
import { CartItem, Order } from '../../types';
import { usePOS } from '../../pages/pos/usePOS';
import { orderSchema } from '../../lib/validations';

type CheckoutStep = 'payment' | 'processing' | 'success';
type PaymentMethod = 'cash' | 'card' | 'qr' | null;

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  total: number;
}

export function CheckoutModal({ isOpen, onClose, total }: CheckoutModalProps) {
  const [step, setStep] = useState<CheckoutStep>('payment');
  const [method, setMethod] = useState<PaymentMethod>(null);
  const [receivedAmount, setReceivedAmount] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('Guest Customer');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [completedOrder, setCompletedOrder] = useState<{ items: CartItem[], total: number, method: string, received?: number, change?: number } | null>(null);

  const cart = usePosStore((state) => state.cart);
  const clearCart = usePosStore((state) => state.clearCart);
  const selectedCustomer = usePosStore((state) => state.selectedCustomer);
  const { checkout, deductStock, createOrderItems } = usePOS();

  const { stores } = useStores();
  const { settings: loyaltySettings } = useLoyalty();

  const activeStore = stores[0];
  const currencySymbol = activeStore?.currency_symbol || '$';
  const taxRate = (activeStore?.tax_rate || 0) / 100;

  // Reset state when opened
  useEffect(() => {
    if (isOpen) {
      setStep('payment');
      setMethod(null);
      setCompletedOrder(null);
      setReceivedAmount('');
      setCustomerName(selectedCustomer?.full_name || 'Guest Customer');
    }
  }, [isOpen, selectedCustomer]);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    if (!method) return;

    let received = total;
    let change = 0;

    if (method === 'cash') {
      received = Number(receivedAmount);
      if (received < total) return;
      change = received - total;
    }

    setStep('processing');

    try {
      // Create the order data object
      const orderData: Partial<Order> = {
        order_number: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
        customer: customerName,
        status: 'Completed',
        order_type: 'pos',
        payment_method: method,
        cash_received: method === 'cash' ? received : undefined,
        change: method === 'cash' ? change : undefined,
        amount: total,
      };

      // Validate with Zod
      // const validated = orderSchema.safeParse(orderData);
      // if (!validated.success) {
      //   const errors: Record<string, string> = {};
      //   validated.error.issues.forEach(err => {
      //     if (err.path[0]) errors[err.path[0] as string] = err.message;
      //   });
      //   setFormErrors(errors);
      //   setStep('payment');
      //   return;
      // }

      setFormErrors({});
      console.log('order data', orderData);
      // Execute checkout (create order)
      if (cart.length > 0) {
        // orderData already has status: 'Completed', etc.
        const newOrder = await checkout.mutateAsync(orderData);

        // Map cart items to the new order using the created order_id
        // and link specific stock items via product_stock_id
        if (newOrder && newOrder.order_id) {
          const orderItems = cart.map(item => ({
            order_id: newOrder.order_id,
            product_id: item.product_id,
            product_stock_id: '1c26bf4a-e19f-49dc-abc3-0b864fd9a9e9', // Correctly use the receipt item ID
            quantity: item.qty,
            unit_price: item.unit_price,
            total: item.unit_price * item.qty,

          }));

          await createOrderItems.mutateAsync(orderItems);
        }
      }

      //Capture order data for the success state UI
      setCompletedOrder({
        items: [...cart],
        total,
        method,
        received: method === 'cash' ? received : undefined,
        change: method === 'cash' ? change : undefined
      });

      setStep('success');
      clearCart();
    } catch (err) {
      console.error('Checkout failed:', err);
      setStep('payment'); // Go back to payment if failed
    }
  };

  const handleComplete = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={step === 'payment' ? onClose : undefined}
      />

      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="relative bg-surface rounded-xl shadow-2xl w-full max-w-lg overflow-hidden border border-outline-variant/20 z-10"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-outline-variant/10 bg-surface-container-lowest">
          <h2 className="font-headline font-extrabold text-2xl text-on-surface">
            {step === 'payment' && 'Select Payment'}
            {step === 'processing' && 'Processing...'}
            {step === 'success' && 'Transaction Complete'}
          </h2>
          {step === 'payment' && (
            <button onClick={onClose} className="p-2 text-on-surface-variant hover:bg-surface-container rounded-full transition-colors">
              <X size={24} />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-8">
          <AnimatePresence mode="wait">
            {step === 'payment' && (
              <motion.div
                key="payment"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <div className="space-y-4 mb-8">
                  <div>
                    <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">Customer Name</label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className={`w-full bg-surface-container-lowest border border-outline-variant/30 rounded-md py-3 px-4 font-bold focus:ring-2 focus:ring-primary/50 outline-none ${formErrors.customer ? 'ring-error ring-1' : ''}`}
                      placeholder="Guest Customer"
                    />
                    {formErrors.customer && <p className="text-[10px] text-error font-bold mt-1">{formErrors.customer}</p>}
                  </div>
                  <div className="flex flex-col items-center">
                    <p className="text-on-surface-variant font-medium mb-1">Total Amount Due</p>
                    <p className="text-5xl font-mono font-extrabold text-primary tracking-tight">{formatCurrency(total, { currencySymbol })}</p>
                    {selectedCustomer && loyaltySettings?.enabled && (
                      <div className="mt-4 flex items-center gap-2 bg-primary/5 px-4 py-2 rounded-full border border-primary/10">
                        <Award size={14} className="text-primary" />
                        <span className="text-[10px] font-bold text-primary uppercase tracking-widest">
                          Earns {Math.round(total * loyaltySettings.points_per_currency)} points
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <PaymentOption
                    icon={<Banknote size={32} />}
                    label="Cash"
                    selected={method === 'cash'}
                    onClick={() => setMethod('cash')}
                  />
                  <PaymentOption
                    icon={<CreditCard size={32} />}
                    label="Card"
                    selected={method === 'card'}
                    onClick={() => setMethod('card')}
                  />
                  <PaymentOption
                    icon={<QrCode size={32} />}
                    label="QR Code"
                    selected={method === 'qr'}
                    onClick={() => setMethod('qr')}
                  />
                </div>

                <AnimatePresence>
                  {method === 'cash' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="pt-4 border-t border-outline-variant/10 overflow-hidden"
                    >
                      <label className="block text-sm font-bold text-on-surface mb-2">Amount Received</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-bold">{currencySymbol}</span>
                        <input
                          type="number"
                          min={total}
                          step="0.01"
                          value={receivedAmount}
                          onChange={(e) => setReceivedAmount(e.target.value)}
                          placeholder={total.toFixed(2)}
                          className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-md py-3 pl-8 pr-4 font-mono text-lg font-bold focus:ring-2 focus:ring-primary/50 outline-none"
                        />
                      </div>

                      {Number(receivedAmount) > 0 && Number(receivedAmount) >= total && (
                        <div className="mt-3 flex justify-between items-center text-sm font-medium">
                          <span className="text-on-surface-variant">Change Due:</span>
                          <span className="font-mono font-bold text-primary text-lg">{formatCurrency(Number(receivedAmount) - total, { currencySymbol })}</span>
                        </div>
                      )}
                      {Number(receivedAmount) > 0 && Number(receivedAmount) < total && (
                        <div className="mt-2 text-xs text-error font-medium">Insufficient amount</div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {step === 'processing' && (
              <motion.div
                key="processing"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-col items-center justify-center py-12 space-y-6 text-center"
              >
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Loader2 size={40} className="text-primary animate-spin" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-on-surface mb-2">Processing Payment...</h3>
                  <p className="text-on-surface-variant">Please ask the customer to follow the prompt.</p>
                </div>
              </motion.div>
            )}

            {step === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-2 text-center space-y-4"
              >
                <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 mb-2">
                  <CheckCircle2 size={36} />
                </div>
                <div>
                  <h3 className="font-headline text-2xl font-extrabold text-on-surface mb-1">Payment Successful!</h3>
                  <p className="text-on-surface-variant font-medium text-sm">Order completed successfully.</p>
                </div>

                {/* Receipt Preview */}
                {completedOrder && (
                  <div className="w-full bg-white text-black p-6 rounded-md shadow-inner border border-outline-variant/30 text-left relative print-only font-mono text-sm h-64 overflow-y-auto print:h-auto print:overflow-visible my-2">
                    <div className="text-center mb-4 pb-4 border-b border-black/10">
                      <h4 className="font-bold text-lg">MINIMART PRO</h4>
                      <p className="text-xs text-gray-500">Terminal #04 • {new Date().toLocaleDateString()}</p>
                      <p className="text-xs text-gray-500 mt-1">Order #INV-{Math.floor(1000 + Math.random() * 9000)}</p>
                    </div>

                    <div className="space-y-2 mb-4">
                      {completedOrder.items.map(item => (
                        <div key={item.product_id} className="flex justify-between items-start text-xs border-b border-black/5 pb-2">
                          <div className="flex-1 pr-4">
                            <span className="font-bold block">{item.name}</span>
                            <span className="text-gray-500">{item.qty} x {formatCurrency(item.unit_price, { currencySymbol })}</span>
                          </div>
                          <span className="font-bold whitespace-nowrap">{formatCurrency(item.unit_price * item.qty, { currencySymbol })}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Subtotal</span>
                        <span>{formatCurrency(completedOrder.total / (1 + taxRate), { currencySymbol })}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>Tax ({activeStore?.tax_rate || 0}%)</span>
                        <span>{formatCurrency(completedOrder.total - (completedOrder.total / (1 + taxRate)), { currencySymbol })}</span>
                      </div>
                      <div className="flex justify-between font-bold text-base mt-2 pt-2 border-t border-black/10">
                        <span>Total (Paid)</span>
                        <span>{formatCurrency(completedOrder.total, { currencySymbol })}</span>
                      </div>
                      <div className="flex justify-between text-xs mt-2 text-gray-600">
                        <span>Method</span>
                        <span className="uppercase font-bold">{completedOrder.method}</span>
                      </div>
                      {completedOrder.method === 'cash' && (
                        <>
                          <div className="flex justify-between text-xs pt-1">
                            <span>Tendered</span>
                            <span>{formatCurrency(completedOrder.received, { currencySymbol })}</span>
                          </div>
                          <div className="flex justify-between text-xs font-bold pt-1">
                            <span>Change</span>
                            <span>{formatCurrency(completedOrder.change, { currencySymbol })}</span>
                          </div>
                        </>
                      )}

                      {selectedCustomer && (
                        <div className="mt-4 pt-4 border-t border-dash border-black/20 text-center">
                          <p className="text-[10px] font-bold uppercase tracking-widest">Loyalty Points Update</p>
                          <div className="flex justify-between text-[10px] mt-1">
                            <span>Points Earned</span>
                            <span>+{Math.round(completedOrder.total * (loyaltySettings?.points_per_currency || 0))}</span>
                          </div>
                          <div className="flex justify-between text-[10px] font-bold">
                            <span>New Balance</span>
                            <span>{selectedCustomer.loyalty_points + Math.round(completedOrder.total * (loyaltySettings?.points_per_currency || 0))}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="w-full space-y-3 pt-2">
                  <Button
                    variant="secondary"
                    className="w-full py-4 rounded-xl border-2 border-outline-variant/20 hover:border-primary/50 transition-colors bg-surface hover:bg-surface-container-lowest print:hidden"
                    onClick={() => window.print()}
                  >
                    <Printer size={20} className="mr-2 text-primary" />
                    <span className="font-bold text-on-surface">Print Customer Slip</span>
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        {step === 'payment' && (
          <div className="p-6 border-t border-outline-variant/10 bg-surface-container-lowest flex justify-end gap-3">
            <Button variant="secondary" onClick={onClose} className="px-6">Cancel</Button>
            <Button
              onClick={handleConfirm}
              disabled={!method || (method === 'cash' && (Number(receivedAmount) < total || isNaN(Number(receivedAmount))))}
              className="px-8 min-w-[140px]"
            >
              {method ? (
                <>Confirm <ArrowRight size={18} className="ml-2" /></>
              ) : 'Select Method'}
            </Button>
          </div>
        )}

        {step === 'success' && (
          <div className="p-6 border-t border-outline-variant/10 bg-surface-container flex justify-center print:hidden">
            <Button onClick={handleComplete} className="w-full py-4 text-lg shadow-xl shadow-primary/20">
              New Transaction
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  );
}

function PaymentOption({ icon, label, selected, onClick }: { icon: React.ReactNode, label: string, selected: boolean, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`
        flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all duration-200
        ${selected
          ? 'border-primary bg-primary/5 text-primary shadow-sm scale-105'
          : 'border-outline-variant/20 bg-surface hover:bg-surface-container hover:border-primary/30 text-on-surface-variant hover:text-on-surface'
        }
      `}
    >
      <div className={`mb-3 ${selected ? 'text-primary' : 'text-on-surface-variant/60'}`}>
        {icon}
      </div>
      <span className="font-bold text-sm">{label}</span>
    </button>
  );
}
