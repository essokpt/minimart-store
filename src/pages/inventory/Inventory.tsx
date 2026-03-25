import { motion, AnimatePresence } from 'motion/react';
import { Filter, PlusCircle, Search, ChevronLeft, ChevronRight, Edit2, Trash2, Barcode, Package, AlertTriangle, TrendingUp, X, Upload, LayoutGrid, List } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';

export function Inventory() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  
  const products = [
    { name: 'Artisan Olive Oil', desc: 'Extra Virgin 500ml', category: 'Pantry', sku: 'OO-EV-0042', price: '$24.99', stock: 142, total: 200, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDjOKq4YtFL-rNuFjMKVSFfLceg_e2lQLGB4CzNOrD0lsDsff6iUiIUxxlCkAyoX1y3WMC3kjYuaa9pPPZw99kKr_pxJ4cDJ3khQW45o-mBQZxyHXoVcXux-V7HtDumlTqWi_25k0Jy7hhg_yg4AHgIwJIZYaBB4gvHD2EELig6X8tfSL5pX3P-BvLpl9v8Wvr40Mpz5LlI-AJyozfQ6GQCd81bPxTMLfRC36xLxXOV-8fP3RU6LGwu2puxKFPbcfydJS5LZWbmJfg' },
    { name: 'Dragon Fruit', desc: 'Organic Red', category: 'Produce', sku: 'FR-DR-1182', price: '$5.50', stock: 12, total: 100, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAV6G54EzMeshGvpHWFgI2wL3PJh4fsB8r-fCUqu_UqlR-Falo0qtQZNG07qeko-M36B64464pLfjae2AR49CB6a7M5TlAY3T7ossyGIOscxbUiI51fK2XTx5VK0jP0sZ-Ux6x57d0gAjzhxmIPVUUeus-fpI8DXxWIf4FIlOcQRJ8vq_l0nVMuoak7DyYHxwTjSrcQn-bkO1IW5-D6wEyTCRuJ26IzEHG30ckQSfyZp3OJixt0CKw1WLzOn-kzbfdX9Y9UjkjwbYo' },
    { name: '70% Dark Chocolate', desc: 'Single Origin 80g', category: 'Snacks', sku: 'CH-DC-8821', price: '$8.99', stock: 88, total: 200, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA62ldbK9gE1kkTQraX1pKRJ7uCK-W6B3p3pmY1l_ldl-t4dP4BlDKVHenADSc9TUEaZtV23rzAkF67XWu0qV7aRIZEsbrXro8cFfPq22U8T_jf35Se9TrMsDRz3O33TievsMPJZY62UooaKuPUWDTU7tF5mh3HBpFse-l_j4QfmJQ5lWsrb46f8TJItF_28kwK29vHT06Ox-L4waAgjcaRlOdliU-9gw8WHVHMZ35uDh1Fm9pHV8yx2CJRe_Y1ZxZHNnsvCtSFqW0' },
    { name: 'Whole Bean Coffee', desc: 'Ethiopian Yirgacheffe', category: 'Beverages', sku: 'BV-CF-5509', price: '$18.00', stock: 210, total: 250, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB9VN8rnIz2qVC-8uSu5LaJGZuk0-BPgULKStX3BtyivnEX2u_DuUu3rkZv5AkZYTZ-SnypX41K6k4t91PqqRhCK_T-TCccyPrq9XLfse16tktPTsbz3xNgdJqYMDRLyFhwsjVC7yVEL6ZUrmidOlBg_GlJRzD6ZiiDo5wNbzIuz2XDaguaRA6A7OncOLpvdweB916XXJ949oJdAE4MaMweKPpAJeeirtm4oxeqYtwavhgQSCRNBu4GJ6BGM_NLAvIJJehN0ZK1tmg' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-12"
    >
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div className="space-y-1">
          <h2 className="text-4xl font-headline font-extrabold text-on-surface tracking-tight">Product Inventory</h2>
          <p className="text-on-surface-variant font-medium">Manage and monitor your retail stock levels across all departments.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary">
            <Filter size={18} />
            Export CSV
          </Button>
          <Button 
            onClick={() => setIsModalOpen(true)}
          >
            <PlusCircle size={18} />
            Add New Product
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-surface-container rounded-sm shadow-2xl overflow-hidden border border-outline-variant/10"
            >
              <div className="p-8 border-b border-outline-variant/10 flex justify-between items-center bg-surface-container-high">
                <h3 className="text-2xl font-headline font-extrabold text-on-surface">Add New Product</h3>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-surface-container-highest rounded-sm transition-colors">
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-10 space-y-8">
                <div className="grid grid-cols-2 gap-8">
                  <Input label="Product Name" placeholder="e.g. Organic Honey" />
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Category</label>
                    <select className="w-full bg-surface-container-highest border-none rounded-sm focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all py-3 px-4 outline-none appearance-none">
                      <option>Pantry</option>
                      <option>Produce</option>
                      <option>Beverages</option>
                      <option>Snacks</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-8">
                  <Input label="SKU" placeholder="SKU-0000" className="font-mono text-xs" />
                  <Input label="Price ($)" type="number" placeholder="0.00" className="font-mono" />
                  <Input label="Initial Stock" type="number" placeholder="0" className="font-mono" />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Product Image</label>
                  <div className="border border-dashed border-outline-variant/30 rounded-sm p-8 flex flex-col items-center justify-center gap-3 bg-surface-container-lowest hover:bg-surface-container-low transition-colors cursor-pointer group">
                    <div className="w-12 h-12 rounded-sm bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform border border-primary/20">
                      <Upload size={24} />
                    </div>
                    <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Click to upload or drag and drop</p>
                    <p className="text-[9px] text-on-surface-variant/40 font-bold uppercase tracking-widest font-mono">PNG, JPG up to 10MB</p>
                  </div>
                </div>

                <div className="pt-4 flex gap-4">
                  <Button variant="secondary" onClick={() => setIsModalOpen(false)} className="flex-1">Cancel</Button>
                  <Button className="flex-1">Save Product</Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card p-5 hover className="p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="p-2 bg-primary/10 text-primary rounded-md">
              <Package size={20} />
            </span>
            <Badge variant="primary" className="font-mono tracking-tighter">24 Categories</Badge>
          </div>
          <h3 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Active Categories</h3>
          <p className="text-2xl font-headline font-bold text-on-surface mt-1">Gourmet & Deli</p>
        </Card>
        
        <Card p-5 hover className="p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="p-2 bg-tertiary/10 text-tertiary rounded-md">
              <AlertTriangle size={20} />
            </span>
            <Badge variant="error" className="font-mono tracking-tighter">8 Items</Badge>
          </div>
          <h3 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Low Stock Alert</h3>
          <p className="text-2xl font-headline font-bold text-on-surface mt-1">Restock Soon</p>
        </Card>

        <div className="md:col-span-2 bg-surface-container p-6 rounded-sm shadow-xl flex items-center justify-between text-on-surface overflow-hidden relative border border-outline-variant/10">
          <div className="relative z-10">
            <h3 className="text-[10px] font-bold opacity-80 uppercase tracking-widest">Inventory Value</h3>
            <p className="text-4xl font-mono font-extrabold mt-1">$142,508.00</p>
            <div className="mt-4 flex items-center gap-2">
              <TrendingUp size={16} className="text-primary" />
              <span className="text-xs font-mono font-bold text-primary">+12.5% from last month</span>
            </div>
          </div>
          <div className="opacity-5 absolute right-[-20px] top-[-20px]">
            <Barcode size={180} />
          </div>
        </div>
      </div>

      <Card className="overflow-hidden" variant="elevated">
        <div className="p-6 border-b border-outline-variant/10 flex flex-wrap items-center justify-between gap-4 bg-surface-container-lowest">
          <div className="flex items-center gap-2">
            <Button size="sm">All Items</Button>
            {['Perishables', 'Household', 'Electronics'].map(cat => (
              <Button key={cat} variant="secondary" size="sm">{cat}</Button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <div className="flex bg-surface-container-high p-1 rounded-lg border border-outline-variant/10">
              <button 
                onClick={() => setViewMode('table')}
                className={`p-2 rounded-md transition-all ${viewMode === 'table' ? 'bg-primary text-on-primary shadow-md' : 'text-on-surface-variant hover:bg-surface-container-highest'}`}
              >
                <List size={18} />
              </button>
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-primary text-on-primary shadow-md' : 'text-on-surface-variant hover:bg-surface-container-highest'}`}
              >
                <LayoutGrid size={18} />
              </button>
            </div>
            <span className="text-[10px] text-on-surface-variant font-mono font-bold uppercase tracking-wider">Displaying 1-10 of 482 products</span>
            <div className="flex gap-1">
              <button className="p-1.5 hover:bg-surface-container rounded-sm transition-colors border border-outline-variant/20"><ChevronLeft size={16} /></button>
              <button className="p-1.5 hover:bg-surface-container rounded-sm transition-colors border border-outline-variant/20"><ChevronRight size={16} /></button>
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {viewMode === 'table' ? (
            <motion.div 
              key="table-view"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="overflow-x-auto"
            >
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low/50">
                    <th className="px-8 py-5 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Product Name</th>
                    <th className="px-8 py-5 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Category</th>
                    <th className="px-8 py-5 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">SKU</th>
                    <th className="px-8 py-5 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Price</th>
                    <th className="px-8 py-5 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Stock Level</th>
                    <th className="px-8 py-5 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {products.map((product, i) => (
                    <tr key={i} className={`group hover:bg-surface-container-low/30 transition-colors ${i % 2 === 1 ? 'bg-surface-container-low/10' : ''}`}>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-md bg-surface-container-high flex items-center justify-center overflow-hidden border border-outline-variant/20">
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-on-surface">{product.name}</p>
                            <p className="text-xs text-on-surface-variant font-medium">{product.desc}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <Badge variant={product.category === 'Produce' ? 'primary' : 'secondary'}>
                          {product.category}
                        </Badge>
                      </td>
                      <td className="px-8 py-5 font-mono text-xs text-on-surface-variant font-medium">{product.sku}</td>
                      <td className="px-8 py-5 font-mono text-sm font-bold text-on-surface">{product.price}</td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="flex-1 h-1 w-24 bg-surface-container rounded-none overflow-hidden">
                            <div 
                              className={`h-full ${product.stock < 20 ? 'bg-error' : 'bg-primary'}`} 
                              style={{ width: `${(product.stock / product.total) * 100}%` }}
                            ></div>
                          </div>
                          <span className={`text-xs font-mono font-bold ${product.stock < 20 ? 'text-error' : 'text-on-surface'}`}>
                            {product.stock}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-2 text-on-surface-variant/60 hover:text-primary hover:bg-primary/5 rounded-md transition-all border border-transparent hover:border-primary/20"><Edit2 size={16} /></button>
                          <button className="p-2 text-on-surface-variant/60 hover:text-error hover:bg-error/5 rounded-md transition-all border border-transparent hover:border-error/20"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          ) : (
            <motion.div 
              key="grid-view"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            >
              {products.map((product, i) => (
                <Card key={i} hover className="overflow-hidden bg-surface-container-lowest">
                  <div className="aspect-square relative overflow-hidden bg-surface-container">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                    <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                      <button className="p-2.5 bg-surface-container-highest/90 backdrop-blur-sm text-on-surface rounded-lg shadow-lg hover:bg-primary hover:text-on-primary transition-all">
                        <Edit2 size={16} />
                      </button>
                      <button className="p-2.5 bg-surface-container-highest/90 backdrop-blur-sm text-on-surface rounded-lg shadow-lg hover:bg-error hover:text-on-primary transition-all">
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="absolute bottom-4 left-4">
                      <Badge variant={product.category === 'Produce' ? 'primary' : 'secondary'} className="backdrop-blur-sm bg-surface-container-highest/90">
                        {product.category}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-5 space-y-4">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="font-bold text-on-surface leading-tight">{product.name}</h4>
                        <span className="font-mono font-bold text-primary text-sm">{product.price}</span>
                      </div>
                      <p className="text-xs text-on-surface-variant font-medium mt-1">{product.desc}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                        <span>Stock Level</span>
                        <span className={product.stock < 20 ? 'text-error' : 'text-on-surface'}>{product.stock} / {product.total}</span>
                      </div>
                      <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-1000 ${product.stock < 20 ? 'bg-error' : 'bg-primary'}`} 
                          style={{ width: `${(product.stock / product.total) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2 border-t border-outline-variant/5">
                      <span className="text-[10px] font-mono font-bold text-on-surface-variant/40 uppercase tracking-widest">{product.sku}</span>
                      <button className="text-[10px] font-bold text-primary uppercase tracking-widest hover:underline">View Details</button>
                    </div>
                  </div>
                </Card>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="p-8 border-t border-outline-variant/10 flex items-center justify-center bg-surface-container-low/10">
          <nav className="flex items-center gap-1">
            <button className="w-10 h-10 flex items-center justify-center text-on-surface-variant/60 hover:bg-surface-container rounded-md transition-colors border border-outline-variant/20"><ChevronLeft size={18} /></button>
            <button className="w-10 h-10 flex items-center justify-center bg-primary text-on-primary font-mono font-bold rounded-md shadow-sm">1</button>
            <button className="w-10 h-10 flex items-center justify-center text-on-surface-variant hover:bg-surface-container font-mono font-bold rounded-md transition-colors border border-outline-variant/20">2</button>
            <button className="w-10 h-10 flex items-center justify-center text-on-surface-variant hover:bg-surface-container font-mono font-bold rounded-md transition-colors border border-outline-variant/20">3</button>
            <span className="w-10 h-10 flex items-center justify-center text-on-surface-variant/30">...</span>
            <button className="w-10 h-10 flex items-center justify-center text-on-surface-variant hover:bg-surface-container font-mono font-bold rounded-md transition-colors border border-outline-variant/20">48</button>
            <button className="w-10 h-10 flex items-center justify-center text-on-surface-variant/60 hover:bg-surface-container rounded-md transition-colors border border-outline-variant/20"><ChevronRight size={18} /></button>
          </nav>
        </div>
      </Card>
    </motion.div>
  );
}
