import { motion, AnimatePresence } from 'motion/react';
import {
  Store,
  Plus,
  Edit2,
  Trash2,
  Search,
  MapPin,
  Phone,
  CheckCircle2,
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
import { useStores } from './useStores';
import { Store as StoreType } from '@/src/types';
import { useTranslation } from 'react-i18next';
import { Loading } from '@/src/components/ui/Loading';
import { ErrorState } from '@/src/components/ui/ErrorState';

export function Stores() {
  const { t } = useTranslation();
  const { stores, isLoading, error, createStore, updateStore, deleteStore } = useStores();

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [storeToDelete, setStoreToDelete] = useState<string | null>(null);
  const [editingStore, setEditingStore] = useState<StoreType | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<StoreType>>({
    name: '',
    code: null,
    address: '',
    phone: '',
    status: 'Active'
  });

  const filteredStores = stores.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenModal = (store?: StoreType) => {
    if (store) {
      setEditingStore(store);
      setFormData(store);
    } else {
      setEditingStore(null);
      setFormData({
        name: '',
        code: null,
        address: '',
        phone: '',
        status: 'Active'
      });
    }
    setIsModalOpen(true);
    setModalError(null);
  };

  const handleSave = async () => {
    try {
      setModalError(null);
      if (editingStore) {
        await updateStore.mutateAsync({
          id: editingStore.store_id,
          updates: formData
        });
      } else {
        await createStore.mutateAsync(formData);
      }
      setIsModalOpen(false);
    } catch (err: any) {
      console.error('Failed to save store:', err);
      setModalError(err?.message || 'Failed to save store. Please check your connection and try again.');
    }
  };

  const handleDeleteClick = (id: string) => {
    setStoreToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const processDelete = async () => {
    if (!storeToDelete) return;
    try {
      await deleteStore.mutateAsync(storeToDelete);
      setIsDeleteModalOpen(false);
      setStoreToDelete(null);
    } catch (err) {
      console.error('Failed to delete store:', err);
    }
  };

  if (isLoading) return <Loading label='stores' />;
  if (error) return <div className="h-[calc(100vh-120px)] flex items-center justify-center">
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
          <h1 className="text-4xl font-headline font-extrabold text-on-surface tracking-tight mb-2">
            {t('sidebar.stores')}
          </h1>
          <p className="text-on-surface-variant font-medium">Manage your retail locations and branches.</p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <Plus size={18} />
          Add New Store
        </Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-primary/5 border-primary/10">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg text-primary">
              <Building2 size={24} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Total Stores</p>
              <p className="text-2xl font-headline font-extrabold text-on-surface">{stores.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6 bg-secondary-container/10 border-secondary-container/20">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-secondary-container/30 rounded-lg text-secondary">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Active Status</p>
              <p className="text-2xl font-headline font-extrabold text-on-surface">
                {stores.filter(s => s.status === 'Active').length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-0 overflow-hidden" variant="elevated">
        <div className="p-6 border-b border-outline-variant/10 bg-surface-container-low flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex-1 max-w-md w-full">
            <Input
              placeholder="Search by store name or code..."
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
                <th className="px-8 py-4">Store Details</th>
                <th className="px-8 py-4">Contact</th>
                <th className="px-8 py-4">Status</th>
                <th className="px-8 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {filteredStores.map((store) => (
                <tr key={store.store_id} className="hover:bg-surface-container-low/50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-surface-container rounded text-on-surface-variant">
                        <Building2 size={18} />
                      </div>
                      <div>
                        <p className="font-bold text-on-surface text-sm">{store.name}</p>
                        <p className="text-[10px] text-on-surface-variant/60 font-mono">{store.code}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="space-y-1">
                      {store.phone && (
                        <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                          <Phone size={14} />
                          <span>{store.phone}</span>
                        </div>
                      )}
                      {store.address && (
                        <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                          <MapPin size={14} />
                          <span className="truncate max-w-[200px]">{store.address}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <Badge variant={store.status === 'Active' ? 'success' : 'secondary'}>
                      {store.status}
                    </Badge>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenModal(store)}
                        className="p-2 text-on-surface-variant/40 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(store.store_id)}
                        className="p-2 text-on-surface-variant/40 hover:text-error hover:bg-error/5 rounded-lg transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredStores.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-8 py-10 text-center text-on-surface-variant/60 italic">
                    No stores found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingStore ? 'Edit Store' : 'Add New Store'}
        maxWidth="max-w-lg"
        error={modalError}
        footer={
          <>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button
              onClick={handleSave}
              loading={createStore.isPending || updateStore.isPending}
            >
              {editingStore ? 'Save Changes' : 'Create Store'}
            </Button>
          </>
        }
      >
        <div className="space-y-5">

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Store Name"
              placeholder="e.g. Downtown Branch"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <Input
              label="Store Code"
              placeholder="e.g. ST-01"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest ml-1">Address</label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-4 py-3 bg-surface-container-highest border-none rounded-lg focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all text-sm min-h-[100px] outline-none"
              placeholder="Enter the full address of this store..."
            />
          </div>
          <Input
            label="Phone Number"
            placeholder="e.g. +1 234 567 890"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />

          <Select
            label="Status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </Select>


        </div>
      </Modal>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          deleteStore.reset();
        }}
        onConfirm={processDelete}
        title="Delete Store"
        message="Are you sure you want to delete this store? This will also remove any linked inventory data. This action cannot be undone."
        loading={deleteStore.isPending}
        error={deleteStore.error?.message}
      />
    </motion.div>
  );
}
