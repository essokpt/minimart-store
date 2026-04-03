import { motion } from 'motion/react';
import {
  Search,
  Plus,
  Download,
  Filter,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Truck,
  RotateCcw,
  Eye,
  ShoppingBag,
  Clock,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Select } from '../../components/ui/Select';
import { ErrorState } from '../../components/ui/ErrorState';

import { useOrders } from './useOrders';
import { Order } from '../../types';

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'Processing': return <Badge variant="primary">{status}</Badge>;
    case 'Pending': return <Badge variant="warning">{status}</Badge>;
    case 'Shipped': return <Badge variant="info">{status}</Badge>;
    case 'Delivered': return <Badge variant="success">{status}</Badge>;
    case 'Cancelled': return <Badge variant="error">{status}</Badge>;
    default: return <Badge variant="secondary">{status}</Badge>;
  }
};

export function Orders() {
  const { orders, isLoading, error } = useOrders();

  if (error) {
    return (
      <div className="h-[calc(100vh-120px)] flex items-center justify-center">
        <ErrorState onRetry={() => window.location.reload()} />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-12 pb-20"
    >
      {/* Page Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-4xl font-headline font-extrabold text-on-surface tracking-tight">Order Management</h2>
          <p className="text-on-surface-variant font-medium">You have <span className="text-primary font-bold">1,284</span> total orders in your retail ecosystem.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary">
            <Download size={18} />
            Export CSV
          </Button>
          <Link to="/orders/create">
            <Button>
              <Plus size={18} />
              Create Manual Order
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-5" hover>
          <div className="flex items-center justify-between mb-3">
            <span className="p-2 bg-primary/10 text-primary rounded-md">
              <ShoppingBag size={20} />
            </span>
            <Badge variant="primary">+12%</Badge>
          </div>
          <h3 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Total Orders</h3>
          <p className="text-2xl font-headline font-bold text-on-surface mt-1">1,284</p>
        </Card>

        <Card className="p-5" hover>
          <div className="flex items-center justify-between mb-3">
            <span className="p-2 bg-amber-500/10 text-amber-600 rounded-md">
              <Clock size={20} />
            </span>
            <Badge variant="warning">Action Required</Badge>
          </div>
          <h3 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Pending Fulfillment</h3>
          <p className="text-2xl font-headline font-bold text-on-surface mt-1">42</p>
        </Card>

        <Card className="p-5" hover>
          <div className="flex items-center justify-between mb-3">
            <span className="p-2 bg-green-500/10 text-green-600 rounded-md">
              <CheckCircle2 size={20} />
            </span>
            <Badge variant="success">98%</Badge>
          </div>
          <h3 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Success Rate</h3>
          <p className="text-2xl font-headline font-bold text-on-surface mt-1">Delivered</p>
        </Card>

        <Card className="p-5" hover>
          <div className="flex items-center justify-between mb-3">
            <span className="p-2 bg-error/10 text-error rounded-md">
              <XCircle size={20} />
            </span>
            <Badge variant="error">2.4%</Badge>
          </div>
          <h3 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Return Rate</h3>
          <p className="text-2xl font-headline font-bold text-on-surface mt-1">Refunded</p>
        </Card>
      </div>

      {/* Filter Chips Section */}
      <section>
        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm">All Orders</Button>
          {['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((status) => (
            <Button key={status} variant="secondary" size="sm">
              {status}
            </Button>
          ))}
          <div className="h-6 w-px bg-outline-variant/30 mx-2"></div>
          <Button variant="outline" size="sm">
            <Filter size={18} />
            Advanced Filters
          </Button>
        </div>
      </section>

      {/* Orders Table Area */}
      <Card className="overflow-hidden" variant="elevated">
        <div className="p-6 border-b border-outline-variant/10 flex flex-wrap items-center justify-between gap-4 bg-surface-container-lowest">
          <div className="flex items-center gap-4 flex-1 md:flex-none">
            <Input
              placeholder="Search orders, customers..."
              icon={<Search size={16} />}
              className="md:w-64"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low/50">
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Order ID</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Customer</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Date</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Total Amount</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Status</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {orders.length === 0 && !isLoading && (
                <tr>
                  <td colSpan={6} className="px-8 py-8 text-center text-on-surface-variant">There are no orders to display.</td>
                </tr>
              )}
              {orders.map((order) => (
                <tr key={order.order_id} className="group hover:bg-surface-container-low/30 transition-colors">
                  <td className="px-8 py-5">
                    <span className="font-mono font-bold text-primary">{order.order_number}</span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      {order.avatar ? (
                        <img src={order.avatar} alt={order.customer || order.customer_name} className="w-8 h-8 rounded-full object-cover border border-outline-variant/20" referrerPolicy="no-referrer" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center text-[10px] font-bold">
                          {order.initials || String(order.customer_name || 'UC').substring(0, 2).toUpperCase()}
                        </div>
                      )}
                      <span className="text-sm font-bold text-on-surface">{order.customer || order.customer_name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-xs text-on-surface-variant font-medium">{order.date || (order.created_at ? new Date(order.created_at).toLocaleDateString() : '')}</td>
                  <td className="px-8 py-5 font-mono text-sm font-bold text-on-surface">{order.total ? order.total : `$${(order.total_amount || 0).toFixed(2)}`}</td>
                  <td className="px-8 py-5">
                    {getStatusBadge(order.status)}
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-on-surface-variant/60 hover:text-primary hover:bg-primary/5 rounded-md transition-all border border-transparent hover:border-primary/20"><Eye size={16} /></button>
                      <button className="p-2 text-on-surface-variant/60 hover:text-on-surface hover:bg-surface-container-highest rounded-md transition-all border border-transparent hover:border-outline-variant/20"><MoreVertical size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-8 py-6 bg-surface-container-low/30 border-t border-outline-variant/10 flex items-center justify-between">
          <p className="text-[10px] font-mono font-bold text-on-surface-variant uppercase tracking-wider">Showing <span className="font-bold">1 - 25</span> of 1,284 results</p>
          <div className="flex items-center gap-1">
            <button className="w-10 h-10 flex items-center justify-center text-on-surface-variant/60 hover:bg-surface-container rounded-md transition-colors border border-outline-variant/20 disabled:opacity-30" disabled>
              <ChevronLeft size={18} />
            </button>
            <button className="w-10 h-10 flex items-center justify-center bg-primary text-on-primary font-mono font-bold rounded-md shadow-sm">1</button>
            <button className="w-10 h-10 flex items-center justify-center text-on-surface-variant hover:bg-surface-container font-mono font-bold rounded-md transition-colors border border-outline-variant/20">2</button>
            <button className="w-10 h-10 flex items-center justify-center text-on-surface-variant hover:bg-surface-container font-mono font-bold rounded-md transition-colors border border-outline-variant/20">3</button>
            <span className="px-2 text-on-surface-variant/30">...</span>
            <button className="w-10 h-10 flex items-center justify-center text-on-surface-variant hover:bg-surface-container font-mono font-bold rounded-md transition-colors border border-outline-variant/20">52</button>
            <button className="w-10 h-10 flex items-center justify-center text-on-surface-variant/60 hover:bg-surface-container rounded-md transition-colors border border-outline-variant/20">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </Card>

      {/* Asymmetric Detail Section (Bento Inspired) */}
      <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-8" variant="elevated">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold tracking-tight font-headline">Weekly Order Volume</h3>
            <div className="w-40">
              <Select size="small">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
              </Select>
            </div>
          </div>

          <div className="h-64 flex items-end justify-between gap-4 px-4">
            {[40, 65, 50, 85, 70, 95, 60].map((height, i) => (
              <div key={i} className="flex-1 group relative">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className={`w-full rounded-t-sm transition-all ${i === 5 ? 'bg-primary shadow-lg shadow-primary/20' : 'bg-primary/10 group-hover:bg-primary/20'}`}
                />
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface text-[10px] font-bold py-1 px-2 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap uppercase tracking-widest">
                  {Math.round(height * 2.84)} orders
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 px-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
              <span key={day} className={i === 5 ? 'text-primary' : ''}>{day}</span>
            ))}
          </div>
        </Card>

        <div className="flex flex-col gap-6">
          <Card className="flex-1 p-6 bg-primary-container text-on-primary-container relative overflow-hidden group" variant="flat">
            <Truck size={96} className="absolute -right-4 -bottom-4 opacity-10 rotate-12 transition-transform group-hover:scale-110" />
            <h4 className="text-[10px] font-bold opacity-80 mb-1 uppercase tracking-widest">Active Deliveries</h4>
            <p className="text-4xl font-headline font-extrabold tracking-tighter mb-4">42</p>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
              <TrendingUp size={18} />
              <span>12% more than yesterday</span>
            </div>
          </Card>

          <Card className="flex-1 p-6 bg-secondary-container text-on-secondary-container relative overflow-hidden group" variant="flat">
            <RotateCcw size={96} className="absolute -right-4 -bottom-4 opacity-10 -rotate-12 transition-transform group-hover:scale-110" />
            <h4 className="text-[10px] font-bold opacity-80 mb-1 uppercase tracking-widest">Return Requests</h4>
            <p className="text-4xl font-headline font-extrabold tracking-tighter mb-4">08</p>
            <button className="text-[10px] font-bold underline underline-offset-4 hover:opacity-70 transition-opacity uppercase tracking-widest">Review Pending</button>
          </Card>
        </div>
      </div>

      {/* Contextual FAB */}
      <Link
        to="/orders/create"
        className="fixed bottom-10 right-10 w-16 h-16 bg-primary text-on-primary rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50 group border-t border-white/20"
      >
        <Plus size={32} className="transition-transform group-hover:rotate-90" />
      </Link>
    </motion.div>
  );
}
