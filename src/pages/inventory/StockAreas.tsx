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
  X,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';

interface StockArea {
  id: string;
  name: string;
  code: string;
  type: 'Ambient' | 'Cold' | 'Hazardous' | 'Display';
  capacity: number;
  currentUsage: number;
  description: string;
}

export function StockAreas() {
  const [areas, setAreas] = useState<StockArea[]>([
    { id: '1', name: 'Main Warehouse', code: 'WH-MAIN', type: 'Ambient', capacity: 1000, currentUsage: 650, description: 'Primary storage for non-perishable goods.' },
    { id: '2', name: 'Cold Storage Unit 3', code: 'CS-03', type: 'Cold', capacity: 200, currentUsage: 180, description: 'Refrigerated unit for dairy and fresh produce.' },
    { id: '3', name: 'Aisle 4 Display', code: 'DISP-A4', type: 'Display', capacity: 50, currentUsage: 42, description: 'Front-of-store display shelving.' },
    { id: '4', name: 'Chemical Bunker', code: 'HAZ-01', type: 'Hazardous', capacity: 100, currentUsage: 15, description: 'Secure storage for cleaning supplies and chemicals.' },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArea, setEditingArea] = useState<StockArea | null>(null);
  const [formData, setFormData] = useState<Partial<StockArea>>({
    name: '',
    code: '',
    type: 'Ambient',
    capacity: 0,
    description: ''
  });

  const filteredAreas = areas.filter(a => 
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
        code: '',
        type: 'Ambient',
        capacity: 0,
        description: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (editingArea) {
      setAreas(areas.map(a => a.id === editingArea.id ? { ...a, ...formData } as StockArea : a));
    } else {
      const newArea: StockArea = {
        ...formData,
        id: Math.random().toString(36).substr(2, 9),
        currentUsage: 0
      } as StockArea;
      setAreas([...areas, newArea]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this stock area?')) {
      setAreas(areas.filter(a => a.id !== id));
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
              <p className="text-2xl font-headline font-extrabold text-on-surface">{areas.length}</p>
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
                {areas.reduce((acc, a) => acc + a.capacity, 0)} Units
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
                {Math.round((areas.reduce((acc, a) => acc + a.currentUsage, 0) / areas.reduce((acc, a) => acc + a.capacity, 0)) * 100)}%
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
                <th className="px-8 py-4">Type</th>
                <th className="px-8 py-4">Utilization</th>
                <th className="px-8 py-4">Capacity</th>
                <th className="px-8 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {filteredAreas.map((area) => (
                <tr key={area.id} className="hover:bg-surface-container-low/50 transition-colors group">
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
                          className={`h-full transition-all duration-500 ${
                            (area.currentUsage / area.capacity) > 0.9 ? 'bg-error' : 
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
                        onClick={() => handleDelete(area.id)}
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

      {/* Create/Update Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-surface/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/20 overflow-hidden"
            >
              <div className="p-6 border-b border-outline-variant/10 flex justify-between items-center">
                <h2 className="text-xl font-headline font-extrabold text-on-surface">
                  {editingArea ? 'Edit Stock Area' : 'Add New Stock Area'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-surface-container rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 space-y-5">
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
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest ml-1">Storage Type</label>
                    <select 
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                      className="w-full px-4 py-3 bg-surface-container-highest border-none rounded-lg focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all text-sm appearance-none cursor-pointer"
                    >
                      <option value="Ambient">Ambient</option>
                      <option value="Cold">Cold Storage</option>
                      <option value="Hazardous">Hazardous</option>
                      <option value="Display">Display</option>
                    </select>
                  </div>
                  <Input 
                    label="Capacity (Units)" 
                    type="number" 
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                  />
                </div>

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

              <div className="p-6 border-t border-outline-variant/10 bg-surface-container-low/30 flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button onClick={handleSave}>
                  {editingArea ? 'Save Changes' : 'Create Area'}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
