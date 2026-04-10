import { motion, AnimatePresence } from 'motion/react';
import {
  MapPin,
  Plus,
  Edit2,
  Trash2,
  Search,
  Box,
  ThermometerSnowflake,
  Warehouse,
  LayoutGrid,
  CheckCircle2,
  AlertCircle,
  Building2,
  Filter,
  Calendar,
  Eye,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { InputField, NumberField, SelectField, TextareaField } from '../../components/form/FormField';
import { Modal } from '../../components/ui/Modal';
import { ConfirmModal } from '../../components/ui/ConfirmModal';
import { useStock } from './useStock';
import { useStores } from './useStores';
import { StockArea } from '../../types';
import { Loading } from '../../components/ui/Loading';
import { ErrorState } from '../../components/ui/ErrorState';
import { stockAreaSchema, StockAreaInput } from '../../lib/validations';
import { TableHeader } from '../../components/table/TableHeader';
import { Pagination } from '../../components/table/Pagination';
import { Link } from 'react-router-dom';


export function StockAreas() {
  const { stockArea, isLoading, error, createArea, updateArea, deleteArea } = useStock();
  const { stores } = useStores();
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [areaToDelete, setAreaToDelete] = useState<string | null>(null);
  const [editingArea, setEditingArea] = useState<StockArea | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);

  const form = useForm<StockAreaInput>({
    resolver: zodResolver(stockAreaSchema),
    defaultValues: {
      name: '',
      status: 'Active',
      type: 'Ambient',
      capacity: 0,
      description: '',
      store_id: ''
    }
  });

  const handleOpenModal = (area?: StockArea) => {
    if (area) {
      setEditingArea(area);
      form.reset({
        name: area.name || '',
        status: area.status || 'Active',
        type: (area.type as any) || 'Ambient',
        capacity: area.capacity || 0,
        currentUsage: area.currentUsage || 0,
        description: area.description || '',
        store_id: area.store_id || ''
      });
    } else {
      setEditingArea(null);
      form.reset({
        name: '',
        status: 'Active',
        type: 'Ambient',
        capacity: 0,
        currentUsage: 0,
        description: '',
        store_id: stores[0]?.store_id || ''
      });
    }
    setIsModalOpen(true);
    setModalError(null);
  };

  const handleSave = async (values: StockAreaInput) => {
    try {
      setModalError(null);
      if (editingArea) {
        console.log('Editing area:', editingArea);
        const id = editingArea.area_id || editingArea.area_id;
        await updateArea.mutateAsync({
          id: id,
          updates: values
        });
      } else {
        await createArea.mutateAsync({
          ...values,
          currentUsage: 0,
          store_id: values.store_id || stores[0]?.store_id
        });
      }
      setIsModalOpen(false);
    } catch (err: any) {
      console.error('Failed to save area:', err);
      setModalError(err?.message || 'Failed to save stock area. Please try again.');
    }
  };

  const filteredReceipts = stockArea.filter(record => {
    const q = searchQuery.toLowerCase();
    return (
      record.name?.toLowerCase().includes(q) ||
      record.status?.toLowerCase().includes(q) ||
      String(record.area_id || '').toLowerCase().includes(q)
    );
  });

  const total = filteredReceipts.length;
  const startIndex = (page - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, total);
  const paginatedAreas = filteredReceipts.slice(startIndex, endIndex);

  useEffect(() => {
    setPage(1);
    // ensure form has sensible store default when stores load
    if (!editingArea && stores[0]?.store_id) {
      const current = form.getValues();
      if (!current.store_id) form.setValue('store_id', stores[0].store_id);
    }
  }, [stores]);

  const handleDeleteClick = (id: string) => {
    setAreaToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const processDelete = async () => {
    if (!areaToDelete) return;
    try {
      await deleteArea.mutateAsync(areaToDelete);
      setIsDeleteModalOpen(false);
      setAreaToDelete(null);
    } catch (err) {
      console.error('Failed to delete area:', err);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Cold': return <ThermometerSnowflake size={18} />;
      case 'Hazardous': return <AlertCircle size={18} />;
      case 'Display': return <LayoutGrid size={18} />;
      default: return <Warehouse size={18} />;
    }
  };

  if (isLoading) return <Loading label='stores area' />;
  if (error) return
  <div className="h-[calc(100vh-120px)] flex items-center justify-center">
    <ErrorState onRetry={() => window.location.reload()} />
  </div>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-headline font-extrabold text-on-surface tracking-tight mb-2">Stock Areas</h1>
          <p className="text-on-surface-variant font-medium">Manage physical storage locations and inventory zones.</p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <Plus size={18} />
          Add New Area
        </Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-primary/5 border-primary/10">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg text-primary">
              <Warehouse size={24} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Total Areas</p>
              <p className="text-2xl font-headline font-extrabold text-on-surface">{stockArea.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6 bg-secondary-container/10 border-secondary-container/20">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-secondary-container/30 rounded-lg text-secondary">
              <Box size={24} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Total Capacity</p>
              <p className="text-2xl font-headline font-extrabold text-on-surface">
                {stockArea.reduce((acc, a) => acc + a.capacity, 0)} Units
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-6 bg-surface-container-highest/30">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-surface-container-highest rounded-lg text-on-surface-variant">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Avg. Utilization</p>
              <p className="text-2xl font-headline font-extrabold text-on-surface">
                {Math.round((stockArea.reduce((acc, a) => acc + a.currentUsage, 0) / stockArea.reduce((acc, a) => acc + a.capacity, 0)) * 100)}%
              </p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-0 overflow-hidden" variant="elevated">
        <TableHeader>
          <div className="flex-1 max-w-md w-full">
            <Input
              placeholder="Search by ID, supplier, or reference..."
              icon={<Search size={18} />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <Filter size={16} />
              <span>Filter</span>
            </Button>
            <Button variant="ghost" size="sm">
              <Calendar size={16} />
              <span>Date Range</span>
            </Button>
          </div>
        </TableHeader>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-surface-container-highest/30 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60">
              <tr>
                <th className="px-8 py-4">Area Details</th>
                <th className="px-8 py-4">Store</th>
                <th className="px-8 py-4">Type</th>
                <th className="px-8 py-4">Utilization</th>
                <th className="px-8 py-4">Capacity</th>
                <th className="px-8 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {paginatedAreas.map((area) => (
                <tr key={area.area_id} className="hover:bg-surface-container-low/50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-surface-container rounded text-on-surface-variant">
                        <MapPin size={18} />
                      </div>
                      <div>
                        <p className="font-bold text-on-surface text-sm">{area.name}</p>
                        <p className="text-[10px] text-on-surface-variant/60 font-mono">{area.status}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2 text-sm font-medium text-on-surface-variant">
                      <Building2 size={16} className="text-primary/60" />
                      <span>{stores.find(s => s.store_id === (area.store_id || area.store_id))?.name || 'N/A'}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2 text-sm font-medium text-on-surface-variant">
                      {getTypeIcon(area.type)}
                      <span>{area.type}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="w-full max-w-[120px] space-y-1.5">
                      <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60">
                        <span>{Math.round((area.currentUsage / area.capacity) * 100)}%</span>
                        <span>{area.currentUsage}/{area.capacity}</span>
                      </div>
                      <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 ${(area.currentUsage / area.capacity) > 0.9 ? 'bg-error' :
                            (area.currentUsage / area.capacity) > 0.7 ? 'bg-tertiary' : 'bg-primary'
                            }`}
                          style={{ width: `${(area.currentUsage / area.capacity) * 100}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-sm font-bold text-on-surface">{area.capacity} Units</span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link to={`/stock-areas/${area.area_id}`} className="p-2 hover:bg-surface-container rounded-md">
                        <Eye size={16} />
                      </Link>

                      <button
                        onClick={() => handleOpenModal(area)}
                        className="p-2 text-on-surface-variant/40 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(area.area_id)}
                        className="p-2 text-on-surface-variant/40 hover:text-error hover:bg-error/5 rounded-lg transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination page={page} setPage={setPage} pageSize={pageSize} setPageSize={setPageSize} total={total} />

      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingArea ? 'Edit Stock Area' : 'Add New Stock Area'}
        maxWidth="max-w-lg"
        error={modalError}
        footer={
          <>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button
              onClick={() => form.handleSubmit(handleSave)()}
              loading={createArea.isPending || updateArea.isPending}
            >
              {editingArea ? 'Save Changes' : 'Create Area'}
            </Button>
          </>
        }
      >
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(handleSave)} className="space-y-5">
            <InputField name="name" label="Area Name" placeholder="e.g. Main Warehouse" />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <SelectField
                  name="type"
                  label="Storage Type"
                  options={[
                    { value: 'Ambient', label: 'Ambient' },
                    { value: 'Cold', label: 'Cold Storage' },
                    { value: 'Hazardous', label: 'Hazardous' },
                    { value: 'Display', label: 'Display' }
                  ]}
                />
              </div>
              <NumberField name="capacity" label="Capacity (Units)" />
            </div>

            <SelectField
              name="store_id"
              label="Assigned Store"
              options={stores.map((s) => ({ value: s.store_id, label: s.name }))}
              placeholder="Select a store"
            />

            <TextareaField name="description" label="Description" placeholder="Describe the purpose or constraints of this area..." />
            <InputField name="status" label="Status" placeholder="Active" />

          </form>
        </FormProvider>
      </Modal>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          deleteArea.reset();
        }}
        onConfirm={processDelete}
        title="Delete Stock Area"
        message="Are you sure you want to delete this stock area? All associated inventory records will be unassigned. This action cannot be undone."
        loading={deleteArea.isPending}
        error={deleteArea.error?.message}
      />
    </motion.div>
  );
}
