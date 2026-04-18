import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Plus,
  Download,
  Filter,
  TrendingUp,
  Truck,
  RotateCcw,
  Eye,
  ShoppingBag,
  Clock,
  CheckCircle2,
  XCircle,
  Trash2,
  FileText,
  Edit
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Select } from '../../components/ui/Select';
import { ErrorState } from '../../components/ui/ErrorState';
import { ConfirmModal } from '../../components/ui/ConfirmModal';
import { Modal } from '../../components/ui/Modal';
import { TableHeader, Pagination } from '../../components/table';

import { useOrders } from './useOrders';
import { useStores } from '../Stock/useStores';
import { formatCurrency } from '../../lib/formatters';
import { Order } from '../../types';
import { Loading } from '../../components/ui/Loading';

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

export function Orders() {
  const { orders, isLoading, error, deleteOrder, updateOrder } = useOrders();
  const { stores } = useStores();
  const activeStore = stores[0];
  const currencySymbol = activeStore?.currency_symbol || '$';

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Orders');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);

  const [updateModalOrder, setUpdateModalOrder] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState<Order['status']>('Pending');

  const filteredOrders = (orders || []).filter(order => {
    const matchesStatus = statusFilter === 'All Orders' || order.status === statusFilter;
    const searchLower = (searchQuery || '').toLowerCase();
    const matchesSearch =
      (order.order_number || '').toLowerCase().includes(searchLower) ||
      (order.customer || '').toLowerCase().includes(searchLower);

    return matchesStatus && matchesSearch;
  });

  // Pagination
  const total = filteredOrders.length;
  const startIndex = (page - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, total);
  const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [searchQuery, statusFilter, pageSize]);

  const handleDeleteClick = (id: string) => {
    setOrderToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleUpdateStatusClick = (order: Order) => {
    setUpdateModalOrder(order);
    setNewStatus(order.status);
  };

  const processUpdateStatus = async () => {
    if (!updateModalOrder) return;
    try {
      console.log('update order', updateModalOrder);
      await updateOrder.mutateAsync({
        id: updateModalOrder.order_id,
        updates: { status: newStatus }
      });
      setUpdateModalOrder(null);
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const processDelete = async () => {
    if (!orderToDelete) return;
    try {
      await deleteOrder.mutateAsync(orderToDelete);
      setIsDeleteModalOpen(false);
      setOrderToDelete(null);
    } catch (err) {
      console.error('Failed to delete order:', err);
    }
  };

  if (error) {
    return (
      <div className="h-[calc(100vh-120px)] flex items-center justify-center">
        <ErrorState onRetry={() => window.location.reload()} />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-12 pb-20"
    >
      {/* Page Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-4xl font-headline font-extrabold text-on-surface tracking-tight">Order Management</h2>
          <p className="text-on-surface-variant font-medium">Tracking <span className="text-primary font-bold">{total}</span> total orders in your system.</p>
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
            <Badge variant="primary" className="font-mono">+12%</Badge>
          </div>
          <h3 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Total Orders</h3>
          <p className="text-2xl font-headline font-bold text-on-surface mt-1">{orders.length}</p>
        </Card>

        <Card className="p-5" hover>
          <div className="flex items-center justify-between mb-3">
            <span className="p-2 bg-amber-500/10 text-amber-600 rounded-md">
              <Clock size={20} />
            </span>
            <Badge variant="warning" className="font-mono">Action Required</Badge>
          </div>
          <h3 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Pending Fulfillment</h3>
          <p className="text-2xl font-headline font-bold text-on-surface mt-1">
            {orders.filter(o => o.status === 'Pending').length}
          </p>
        </Card>

        <Card className="p-5" hover>
          <div className="flex items-center justify-between mb-3">
            <span className="p-2 bg-green-500/10 text-green-600 rounded-md">
              <CheckCircle2 size={20} />
            </span>
            <Badge variant="success" className="font-mono">98%</Badge>
          </div>
          <h3 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Success Rate</h3>
          <p className="text-2xl font-headline font-bold text-on-surface mt-1">High Efficiency</p>
        </Card>

        <Card className="p-5" hover>
          <div className="flex items-center justify-between mb-3">
            <span className="p-2 bg-error/10 text-error rounded-md">
              <XCircle size={20} />
            </span>
            <Badge variant="error" className="font-mono">2.4%</Badge>
          </div>
          <h3 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Return Rate</h3>
          <p className="text-2xl font-headline font-bold text-on-surface mt-1">Minimal Returns</p>
        </Card>
      </div>

      {/* Orders Table Area */}
      <Card className="overflow-hidden" variant="elevated">
        <TableHeader>
          <div className="flex items-center gap-2 min-w-[200px]">
            <Select
              size="small"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-surface-container"
            >
              <option value="All Orders">All Statuses</option>
              {['Pending', 'Processing', 'Shipped', 'Delivered', 'Completed', 'Cancelled'].map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </Select>
          </div>

          <div className="flex-1 max-w-md">
            <Input
              placeholder="Search by ID or customer..."
              icon={<Search size={18} />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-surface-container"
            />
          </div>

          <div className="flex items-center gap-3">
            <Button variant="secondary" size="sm">
              <Filter size={16} />
              Filters
            </Button>
          </div>
        </TableHeader>

        {isLoading ? (
          <div className="p-10 flex justify-center"><Loading /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-surface-container-highest/30 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60">
                <tr>
                  <th className="px-8 py-5">Order ID</th>
                  <th className="px-8 py-5">Customer</th>
                  <th className="px-8 py-5">Date</th>
                  <th className="px-8 py-5">Type</th>
                  <th className="px-8 py-5">Payment</th>
                  <th className="px-8 py-5">Amount</th>
                  <th className="px-8 py-5">Status</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {paginatedOrders.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-8 py-10 text-center text-on-surface-variant italic">No orders found matching your criteria.</td>
                  </tr>
                )}
                {paginatedOrders.map((order) => (
                  <tr key={order.order_id} className="group hover:bg-surface-container-low/30 transition-colors">
                    <td className="px-8 py-5">
                      <span className="font-mono font-bold text-primary">{order.order_number}</span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-on-surface">{order.customer}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="space-y-0.5">
                        <p className="text-xs text-on-surface font-medium">
                          {order.created_at ? new Date(order.created_at).toLocaleDateString() : 'N/A'}
                        </p>
                        <p className="text-[10px] text-on-surface-variant/60 font-mono">
                          {order.created_at ? new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                        </p>
                      </div>
                    </td>
                    <td className="px-8 py-5 uppercase tracking-tighter">
                      <Badge variant={order.order_type === 'pos' ? 'primary' : 'secondary'} className="text-[9px] font-extrabold px-2">{order.order_type}</Badge>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2 text-xs font-bold text-on-surface-variant">
                        {order.payment_method === 'cash' ? <ShoppingBag size={12} /> : <Clock size={12} />}
                        <span className="uppercase">{order.payment_method}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 font-mono text-sm font-bold text-on-surface">
                      {formatCurrency(order.amount || 0, { currencySymbol })}
                    </td>
                    <td className="px-8 py-5">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="px-8 py-5 text-right text-on-surface-variant/30 group-hover:text-on-surface-variant transition-colors">
                      <div className="flex justify-end gap-1">
                        <Link to={`/orders/${order.order_id}`} className="p-2 hover:bg-surface-container rounded-md transition-all" title="View Details">
                          <Eye size={16} />
                        </Link>
                        <button
                          onClick={() => handleUpdateStatusClick(order)}
                          disabled={order.order_type?.toLowerCase() === 'pos' || order.status?.toLowerCase() === 'completed'}
                          className={`p-2 rounded-md transition-all ${
                            order.order_type?.toLowerCase() === 'pos' || order.status?.toLowerCase() === 'completed'
                              ? 'opacity-30 cursor-not-allowed'
                              : 'hover:bg-surface-container'
                          }`}
                          title={(order.order_type?.toLowerCase() === 'pos' || order.status?.toLowerCase() === 'completed') ? "Cannot edit POS or completed orders" : "Update Status"}
                        >
                          <Edit size={16} />
                        </button>
                        <button className="p-2 hover:bg-surface-container rounded-md transition-all" title="Print Invoice">
                          <FileText size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(order.order_id!)}
                          className="p-2 hover:bg-error/5 hover:text-error rounded-md transition-all"
                          title="Delete Order"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <Pagination
          page={page}
          setPage={setPage}
          pageSize={pageSize}
          setPageSize={setPageSize}
          total={total}
        />
      </Card>

      {/* Asymmetric Detail Section (Preserved Bento UI) */}
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
              <span>12% change</span>
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

      <Modal
        isOpen={!!updateModalOrder}
        onClose={() => setUpdateModalOrder(null)}
        title="Update Order Status"
        maxWidth="max-w-md"
        footer={
          <>
            <Button variant="ghost" onClick={() => setUpdateModalOrder(null)}>Cancel</Button>
            <Button
              onClick={processUpdateStatus}
              loading={updateOrder.isPending}
            >
              Save Status
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-on-surface-variant">Update the status for order <strong className="text-primary">{updateModalOrder?.order_number}</strong>.</p>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Status</label>
            <Select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value as Order['status'])}
              className="w-full"
            >
              {['Pending', 'Processing', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled', 'Completed'].map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </Select>
          </div>
        </div>
      </Modal>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setOrderToDelete(null);
        }}
        onConfirm={processDelete}
        title="Delete Order"
        message="Are you sure you want to delete this order? This will remove the transaction record from the system permanently. This action cannot be undone."
        loading={deleteOrder.isPending}
      />

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
