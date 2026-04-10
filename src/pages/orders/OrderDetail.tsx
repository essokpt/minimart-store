import { motion } from 'motion/react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  CreditCard, 
  Banknote, 
  QrCode, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Printer, 
  ShoppingBag,
  MapPin,
  ExternalLink,
  Package
} from 'lucide-react';
import { useOrderDetails } from './useOrders';
import { useStores } from '../Stock/useStores';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Loading } from '../../components/ui/Loading';
import { ErrorState } from '../../components/ui/ErrorState';
import { formatCurrency } from '../../lib/formatters';

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'Processing': return <Badge variant="primary">{status}</Badge>;
    case 'Pending': return <Badge variant="warning">{status}</Badge>;
    case 'Shipped': return <Badge variant="info">{status}</Badge>;
    case 'Delivered': return <Badge variant="success">{status}</Badge>;
    case 'Completed': return <Badge variant="success">{status}</Badge>;
    case 'Cancelled': return <Badge variant="error">{status}</Badge>;
    default: return <Badge variant="secondary">{status}</Badge>;
  }
};

const getPaymentIcon = (method: string) => {
  switch (method?.toLowerCase()) {
    case 'cash': return <Banknote size={16} className="text-green-500" />;
    case 'card': return <CreditCard size={16} className="text-blue-500" />;
    case 'qr': return <QrCode size={16} className="text-purple-500" />;
    default: return <ShoppingBag size={16} />;
  }
};

export function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: order, isLoading, error } = useOrderDetails(id);
  const { stores } = useStores();
  const activeStore = stores[0];
  const currencySymbol = activeStore?.currency_symbol || '$';

  if (isLoading) return <div className="h-[60vh] flex items-center justify-center"><Loading /></div>;
  if (error || !order) return <ErrorState onRetry={() => window.location.reload()} />;

  const subtotal = order.order_items?.reduce((sum: number, item: any) => sum + (item.total || 0), 0) || 0;
  const taxRate = (activeStore?.tax_rate || 0) / 100;
  const totalAmount = order.amount || subtotal;

  const handlePrint = () => {
    window.print();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-4">
          <Button variant="secondary" size="sm" onClick={() => navigate('/orders')}>
            <ArrowLeft size={18} />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-headline font-bold text-on-surface">Order Detail</h2>
              {getStatusBadge(order.status)}
            </div>
            <p className="text-on-surface-variant font-mono text-sm mt-1">{order.order_number}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={handlePrint}>
            <Printer size={18} className="mr-2" />
            Print Invoice
          </Button>
          <Button>
            <ExternalLink size={18} className="mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content: Items List */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="overflow-hidden" variant="elevated">
            <div className="px-8 py-6 border-b border-outline-variant/10 bg-surface-container-lowest flex items-center justify-between">
              <h3 className="font-bold flex items-center gap-2">
                <Package size={20} className="text-primary" />
                Order Items ({order.order_items?.length || 0})
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-surface-container-highest/20 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60">
                  <tr>
                    <th className="px-8 py-4">Product</th>
                    <th className="px-8 py-4">Unit Price</th>
                    <th className="px-8 py-4">Quantity</th>
                    <th className="px-8 py-4 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/5">
                  {order.order_items?.map((item: any) => {
                     const product = item.stock_receipt_item?.product;
                     return (
                      <tr key={item.order_item_id} className="hover:bg-surface-container-low transition-colors">
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded bg-surface-container overflow-hidden border border-outline-variant/20">
                              <img 
                                src={product?.image_url || product?.image || '/placeholder-product.png'} 
                                alt={product?.name || 'Product'} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-on-surface">{product?.name || 'Unknown Product'}</p>
                              <p className="text-[10px] text-on-surface-variant/60 uppercase tracking-tighter">SKU: {item.stock_receipt_item?.sku || 'N/A'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-5 font-mono text-xs">{formatCurrency(item.unit_price, { currencySymbol })}</td>
                        <td className="px-8 py-5 text-sm font-medium">{item.quantity}</td>
                        <td className="px-8 py-5 text-right font-mono font-bold text-on-surface">{formatCurrency(item.total, { currencySymbol })}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Customer & Shipping Detail Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <User size={20} />
                  </div>
                  <h4 className="font-bold">Customer Information</h4>
                </div>
                <div className="space-y-4">
                   <div>
                      <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Name</p>
                      <p className="text-sm font-medium">{order.customer || 'Guest Customer'}</p>
                   </div>
                   <div>
                      <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Contact Information</p>
                      <p className="text-sm font-medium opacity-60 italic text-xs">No contact details provided</p>
                   </div>
                </div>
             </Card>

             <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                    <MapPin size={20} />
                  </div>
                  <h4 className="font-bold">Shipping/Fulfillment</h4>
                </div>
                <div className="space-y-4">
                   <div>
                      <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Order Type</p>
                      <Badge variant="secondary" className="mt-1 uppercase text-[10px]">{order.order_type || 'Manual'}</Badge>
                   </div>
                   <div>
                      <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Location</p>
                      <p className="text-sm font-medium">{activeStore?.name || 'Main Terminal'}</p>
                   </div>
                </div>
             </Card>
          </div>
        </div>

        {/* Sidebar: Totals & Summary */}
        <div className="space-y-8">
          <Card className="p-8 space-y-6" variant="elevated">
            <h3 className="font-bold text-xl mb-4">Summary</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm py-3 border-b border-outline-variant/10">
                <div className="flex items-center gap-2 text-on-surface-variant font-medium">
                  <Calendar size={16} />
                  <span>Order Date</span>
                </div>
                <span className="font-bold">
                  {order.created_at ? new Date(order.created_at).toLocaleDateString() : 'N/A'}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm py-3 border-b border-outline-variant/10">
                <div className="flex items-center gap-2 text-on-surface-variant font-medium">
                  {getPaymentIcon(order.payment_method)}
                  <span>Payment Method</span>
                </div>
                <span className="font-bold uppercase tracking-wider text-[10px] bg-surface-container py-1 px-3 rounded-full text-on-surface">
                  {order.payment_method || 'N/A'}
                </span>
              </div>
            </div>

            <div className="pt-6 space-y-3">
              <div className="flex justify-between text-sm text-on-surface-variant">
                <span>Subtotal</span>
                <span className="font-mono">{formatCurrency(subtotal, { currencySymbol })}</span>
              </div>
              <div className="flex justify-between text-sm text-on-surface-variant">
                <span>Tax ({activeStore?.tax_rate || 0}%)</span>
                <span className="font-mono">{formatCurrency(totalAmount * taxRate, { currencySymbol })}</span>
              </div>
              <div className="flex justify-between items-end pt-4 mt-4 border-t border-outline-variant/10 text-primary">
                <span className="text-lg font-bold">Total Amount</span>
                <span className="text-3xl font-mono font-extrabold tracking-tighter">{formatCurrency(totalAmount, { currencySymbol })}</span>
              </div>
            </div>
            
            {order.cash_received !== undefined && (
              <div className="bg-surface-container-low p-4 rounded-xl space-y-2">
                 <div className="flex justify-between text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                    <span>Cash Received</span>
                    <span className="font-mono">{formatCurrency(order.cash_received, { currencySymbol })}</span>
                 </div>
                 <div className="flex justify-between text-xs font-bold text-primary uppercase tracking-widest border-t border-outline-variant/10 pt-2">
                    <span>Change Given</span>
                    <span className="font-mono">{formatCurrency(order.change || 0, { currencySymbol })}</span>
                 </div>
              </div>
            )}
          </Card>

          {/* Receipt Print Area (Visible only when printing) */}
          <div className="hidden print:block w-full text-black p-8 font-mono text-sm">
             <div className="text-center mb-6 pb-6 border-b border-black">
                <h1 className="text-2xl font-bold">MINIMART PRO</h1>
                <p>{activeStore?.address || 'Terminal #04'}</p>
                <p>Order {order.order_number}</p>
                <p>{new Date(order.created_at).toLocaleString()}</p>
             </div>
             
             <div className="space-y-2 mb-6">
                {order.order_items?.map((item: any) => (
                   <div key={item.order_item_id} className="flex justify-between">
                      <span>{item.quantity}x {item.stock_receipt_item?.product?.name}</span>
                      <span>{formatCurrency(item.total, { currencySymbol })}</span>
                   </div>
                ))}
             </div>

             <div className="border-t border-black pt-4 space-y-1">
                <div className="flex justify-between font-bold text-lg">
                   <span>TOTAL</span>
                   <span>{formatCurrency(totalAmount, { currencySymbol })}</span>
                </div>
                <div className="flex justify-between">
                   <span>Method</span>
                   <span className="uppercase">{order.payment_method}</span>
                </div>
                {order.cash_received && (
                   <>
                    <div className="flex justify-between">
                        <span>Received</span>
                        <span>{formatCurrency(order.cash_received, { currencySymbol })}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Change</span>
                        <span>{formatCurrency(order.change || 0, { currencySymbol })}</span>
                    </div>
                   </>
                )}
             </div>
             
             <div className="mt-10 text-center text-xs">
                <p>Thank you for shopping with us!</p>
                <p>Please keep this receipt for your records.</p>
             </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
