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
  Building2
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Select } from '../../components/ui/Select';
import { Modal } from '../../components/ui/Modal';
import { ConfirmModal } from '../../components/ui/ConfirmModal';
import { useStock } from './useStock';
import { useStores } from './useStores';
import { StockArea } from '@/src/types';
import { Loading } from '@/src/components/ui/Loading';
import { ErrorState } from '@/src/components/ui/ErrorState';


export function StockAreas() {
  const { stockArea, isLoading, error, createArea, updateArea, deleteArea } = useStock();
  const { stores } = useStores();

  // const [areas, setAreas] = useState<StockArea[]>([
  //   { id: '1', name: 'Main Warehouse', code: 'WH-MAIN', type: 'Ambient', capacity: 1000, currentUsage: 650, description: 'Primary storage for non-perishable goods.' },
  //   { id: '2', name: 'Cold Storage Unit 3', code: 'CS-03', type: 'Cold', capacity: 200, currentUsage: 180, description: 'Refrigerated unit for dairy and fresh produce.' },
  //   { id: '3', name: 'Aisle 4 Display', code: 'DISP-A4', type: 'Display', capacity: 50, currentUsage: 42, description: 'Front-of-store display shelving.' },
  //   { id: '4', name: 'Chemical Bunker', code: 'HAZ-01', type: 'Hazardous', capacity: 100, currentUsage: 15, description: 'Secure storage for cleaning supplies and chemicals.' },
  // ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [areaToDelete, setAreaToDelete] = useState<string | null>(null);
  const [editingArea, setEditingArea] = useState<StockArea | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<StockArea>>({
    name: '',
    code: '',
    type: 'Ambient',
    capacity: 0,
    description: '',
    store_id: ''
  });

  const filteredAreas = stockArea.filter(a =>
    a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenModal = (area?: StockArea) => {
    if (area) {
      setEditingArea(area);
      setFormData(area);
    } else {
      setEditingArea(null);
      setFormData({
        name: '',
        code: null,
        type: 'Ambient',
        capacity: 0,
        description: '',
        store_id: stores[0]?.store_id || ''
      });
    }
    setIsModalOpen(true);
    setModalError(null);
  };

  const handleSave = async () => {
    try {
      setModalError(null);
      if (editingArea) {
        // ensure we use the correct ID field for the update
        const id = editingArea.areas_id || editingArea.area_id;
        await updateArea.mutateAsync({
          id: id,
          updates: formData
        });
      } else {
        await createArea.mutateAsync({
          ...formData,
          currentUsage: 0,
          store_id: formData.store_id || stores[0]?.store_id
        });
      }
      setIsModalOpen(false);
    } catch (err: any) {
      console.error('Failed to save area:', err);
      setModalError(err?.message || 'Failed to save stock area. Please try again.');
    }
  };

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
        <div className="p-6 border-b border-outline-variant/10 bg-surface-container-low flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex-1 max-w-md w-full">
            <Input
              placeholder="Search by area name or code..."
              icon={<Search size={18} />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

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
              {filteredAreas.map((area) => (
                <tr key={area.areas_id} className="hover:bg-surface-container-low/50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-surface-container rounded text-on-surface-variant">
                        <MapPin size={18} />
                      </div>
                      <div>
                        <p className="font-bold text-on-surface text-sm">{area.name}</p>
                        <p className="text-[10px] text-on-surface-variant/60 font-mono">{area.code}</p>
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
                      <button
                        onClick={() => handleOpenModal(area)}
                        className="p-2 text-on-surface-variant/40 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(area.areas_id)}
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
              onClick={handleSave}
              loading={createArea.isPending || updateArea.isPending}
            >
              {editingArea ? 'Save Changes' : 'Create Area'}
            </Button>
          </>
        }
      >
        <div className="space-y-5">
          <Input
            label="Area Name"
            placeholder="e.g. Main Warehouse"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <Input
            label="Area Code"
            placeholder="e.g. WH-01"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Select
                label="Storage Type"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
              >
                <option value="Ambient">Ambient</option>
                <option value="Cold">Cold Storage</option>
                <option value="Hazardous">Hazardous</option>
                <option value="Display">Display</option>
              </Select>
            </div>
            <Input
              label="Capacity (Units)"
              type="number"
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
            />
          </div>

          <Select
            label="Assigned Store"
            value={formData.store_id}
            onChange={(e) => setFormData({ ...formData, store_id: e.target.value })}
          >
            <option value="">Select a store</option>
            {stores.map(store => (
              <option key={store.store_id} value={store.store_id}>{store.name}</option>
            ))}
          </Select>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest ml-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 bg-surface-container-highest border-none rounded-lg focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all text-sm min-h-[100px] outline-none"
              placeholder="Describe the purpose or constraints of this area..."
            />
          </div>
        </div>
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
