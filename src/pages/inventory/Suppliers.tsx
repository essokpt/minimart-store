import { motion, AnimatePresence } from 'motion/react';
import { Truck, PlusCircle, Search, Edit2, Trash2, Mail, Phone, MapPin, Check, X, Building2, User } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { ErrorState } from '../../components/ui/ErrorState';
import { Modal } from '../../components/ui/Modal';
import { ConfirmModal } from '../../components/ui/ConfirmModal';
import { Loading } from '../../components/ui/Loading';
import { useSuppliers } from './useSuppliers';
import { SupplierInput } from '../../lib/validations';
import { Supplier } from '../../types';

export function Suppliers() {
  const { suppliers, isLoading, error: fetchError, createSupplier, updateSupplier, deleteSupplier } = useSuppliers();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [supplierToDelete, setSupplierToDelete] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState<Partial<Supplier>>({
    name: '',
    contact_name: '',
    email: '',
    phone: '',
    address: '',
    category: '',
    status: 'Active'
  });

  const filteredSuppliers = suppliers.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.contact_name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (s.email?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      name: '',
      contact_name: '',
      email: '',
      phone: '',
      address: '',
      category: '',
      status: 'Active'
    });
    setIsModalOpen(true);
  };

  const handleEdit = (supplier: Supplier) => {
    setEditingId(supplier.supplier_id);
    setFormData({ ...supplier });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setSupplierToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      if (editingId) {
        await updateSupplier.mutateAsync({ id: editingId, updates: formData as SupplierInput });
      } else {
        await createSupplier.mutateAsync(formData as SupplierInput);
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error('Failed to save supplier:', err);
    }
  };

  if (fetchError) return <ErrorState onRetry={() => window.location.reload()} />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-4xl font-headline font-extrabold text-on-surface tracking-tight mb-2">Supplier Network</h2>
          <p className="text-on-surface-variant font-medium">Manage your vendor relationships and procurement contact points.</p>
        </div>
        <Button onClick={handleOpenAdd}>
          <PlusCircle size={18} />
          Add New Supplier
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5 bg-primary/5 border-primary/10">
          <div className="flex items-center gap-3 mb-3">
            <span className="p-2 bg-primary/10 text-primary rounded-md">
              <Truck size={20} />
            </span>
            <h3 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Total Vendors</h3>
          </div>
          <p className="text-3xl font-headline font-bold text-on-surface">{suppliers.length}</p>
        </Card>
        <Card className="p-5 bg-success/5 border-success/10">
          <div className="flex items-center gap-3 mb-3">
            <span className="p-2 bg-success/10 text-success rounded-md">
              <Check size={20} />
            </span>
            <h3 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Active Relationships</h3>
          </div>
          <p className="text-3xl font-headline font-bold text-on-surface">{suppliers.filter(s => s.status === 'Active').length}</p>
        </Card>
        <div className="bg-surface-container p-4 rounded-sm border border-outline-variant/10 flex items-center gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search suppliers..."
              icon={<Search size={18} />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-surface-container-low"
            />
          </div>
        </div>
      </div>

      <Card className="overflow-hidden" variant="elevated">
        {isLoading ? (
          <div className="p-20 flex justify-center"><Loading /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-surface-container-highest/30 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60">
                <tr>
                  <th className="px-8 py-4">Supplier Name</th>
                  <th className="px-8 py-4">Contact Person</th>
                  <th className="px-8 py-4">Phone & Email</th>
                  <th className="px-8 py-4">Status</th>
                  <th className="px-8 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {filteredSuppliers.map((supplier) => (
                  <tr key={supplier.supplier_id} className="group hover:bg-surface-container-low/30 transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-primary border border-outline-variant/20">
                          <Building2 size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-on-surface">{supplier.name}</p>
                          <p className="text-[10px] text-on-surface-variant font-medium">{supplier.category || 'General Vendor'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2 text-on-surface">
                        <User size={14} className="text-on-surface-variant" />
                        <span className="text-sm font-medium">{supplier.contact_name || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="space-y-1">
                        <p className="text-xs font-mono flex items-center gap-2">
                          <Phone size={12} className="text-on-surface-variant" />
                          {supplier.phone || 'No phone'}
                        </p>
                        <p className="text-xs font-mono flex items-center gap-2">
                          <Mail size={12} className="text-on-surface-variant" />
                          {supplier.email || 'No email'}
                        </p>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <Badge variant={supplier.status === 'Active' ? 'success' : 'secondary'}>{supplier.status}</Badge>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleEdit(supplier)} className="p-2 hover:bg-surface-container rounded-md transition-all">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDelete(supplier.supplier_id)} className="p-2 hover:bg-error/5 hover:text-error rounded-md transition-all">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredSuppliers.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-8 py-10 text-center text-on-surface-variant italic">No suppliers found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Supplier' : 'Add New Supplier'}
        footer={
          <div className="flex gap-4 w-full">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)} className="flex-1">Cancel</Button>
            <Button className="flex-1" onClick={handleSubmit} loading={createSupplier.isPending || updateSupplier.isPending}>Save Supplier</Button>
          </div>
        }
      >
        <div className="space-y-6">
          <Input
            label="Supplier Name"
            placeholder="e.g. Acme Corporation"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            icon={<Building2 size={18} />}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Contact Person"
              placeholder="Full Name"
              value={formData.contact_name}
              onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
              icon={<User size={18} />}
            />
            <Input
              label="Category"
              placeholder="e.g. Electronics, Fresh Food"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Phone Number"
              placeholder="+1 555-000-0000"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              icon={<Phone size={18} />}
            />
            <Input
              label="Email Address"
              type="email"
              placeholder="vendor@company.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              icon={<Mail size={18} />}
            />
          </div>
          <Input
            label="Address"
            placeholder="Full business address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            icon={<MapPin size={18} />}
          />
        </div>
      </Modal>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={async () => {
          if (supplierToDelete) {
            await deleteSupplier.mutateAsync(supplierToDelete);
            setIsDeleteModalOpen(false);
          }
        }}
        title="Delete Supplier"
        message="Are you sure you want to remove this supplier? This will not affect previous stock receipts but will remove this vendor from the active list."
        loading={deleteSupplier.isPending}
      />
    </motion.div>
  );
}
