import { motion } from 'motion/react';
import { 
  Search, 
  Plus, 
  Trash2, 
  Package, 
  MapPin, 
  CheckCircle, 
  Truck, 
  PlusCircle, 
  Building2, 
  Calendar, 
  ShoppingCart,
  History,
  Save,
  Send
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';

interface ReceiptItem {
  id: string;
  name: string;
  sku: string;
  currentStock: number;
  receivedQty: number;
  unitCost: number;
  image: string;
  location: string;
}

export function StockReceipt() {
  const [location, setLocation] = useState('Main Warehouse');
  const [receivedItems, setReceivedItems] = useState<ReceiptItem[]>([
    {
      id: '101',
      name: 'Modernist Timepiece A1',
      sku: 'WAT-MD-01',
      currentStock: 45,
      receivedQty: 24,
      unitCost: 145.00,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAmWRd1hrOaMCnabJnUMFDsqFDmw7vs7K_3Fteqmhmy1j5bsDb2xRNNBG_p_o15MFDt6H48vYpJwephNHUX9PMGbz31fXnQYzefk93SIHQD1uh_GtFpFV8KayalItLuf-zrdey-wxgO4gop6Z8gsVYrwwbTuVXh7CaDZWkFVUlnC7l3DzGG2DbiDhqBw8rEWAX5AT_N-QP4xtF7u6LvUeIRGoefM1Be4o6YuzQzfq-_rdLjX8ofMp7MmNj8U454l8gq9pTZYQcw6fw',
      location: 'Main Warehouse'
    },
    {
      id: '102',
      name: 'AudioSphere Pro Max',
      sku: 'AUD-PH-99',
      currentStock: 12,
      receivedQty: 12,
      unitCost: 320.50,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBY5O_BIdKmtDV7PqCcqIs8mh7YiE5mT1KuHVWzHO_AWj6sMSDa3CJwJt1kGpH086lXsKGq4F1Q8iov7Xcln1-3Si6K29ueifPcxYoj3XX6Po4f5aFeQloRhIMK9mysgmYSla1AdIUGSVd7WMAAiQaxPebgp0ahrNOf_hTxEP6sApzc0A6w9GeVlZL7e7aAr18UaEwLqERFYGf8bLfafUjYG09CABfAN1LNSxY7CyhKi7et9DDJJuSwzJoljRpf4mNkck8LxIiAos4',
      location: 'Front Shelf'
    }
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Form states
  const [supplier, setSupplier] = useState('');
  const [deliveryNote, setDeliveryNote] = useState('');
  const [arrivalDate, setArrivalDate] = useState('');
  const [itemQty, setItemQty] = useState(1);
  const [unitCost, setUnitCost] = useState(0);

  // Mock products for search
  const availableProducts = [
    { id: '1', name: 'Classic Cola 500ml', sku: 'BEV-001', currentStock: 150, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAiSVmFigMTxE6oCnnoLszxfcLUKKTQ4D_e-Ci-hgyXVQiqB589vrSrFCgfVtvJZVnukUhqsfE9uMiP3XaYbFbi7wOdVptsGkeIcFHX1aUd6Y4J_2plFJXc-gVOKK5OuddIFWf8P_j2PeP5fudT7H960Jz4xN9RyEO3GXWFYip3CGz6aNHLpG-l7XOx3ynyQJWCY_2HIZSDSgRQaUDB-vKorncmJFZ6SiGepMO6SRZNNxON0DcMlBYtOOF1QRQ9sXnNFQ2R4Xwz-iU' },
    { id: '2', name: 'Artisan Cupcake', sku: 'BAK-042', currentStock: 24, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAD8NLV3Vyva-ApxiGqQV_P17FRbctpdjcQMzlW_M8UqmRUiGLoXeTrFB6YtJkNc4egvNhOXSOhGbs6AzUxMVtYOTA9x8p8p_4LEQX3bPn0k96qqt5vu6HKv6-kbojoh1cpdZMkHpewz2jAh-sXAo69XryfAsSQV3j3bZD_Elu5C9LG2PxL3-usbQNRfnnxSGQ5sXAOrEJUYpxTeisrYsVtxMwxU_FKzj2ZgDgv_Xi_gZc3_el9gz1O9F7XVzG0UF4sxhOfR9c5xbU' },
    { id: '3', name: 'Sea Salt Chips 150g', sku: 'SNK-102', currentStock: 85, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDGXORq1fqxHkC4rZQQm1Jfplo6UQIfEm8NupuHr6FQAybseACXFaddzDgWo4XsAOMxyrsWCfTiN94WPhYt00NU7KAtH7-oTa-9q9Vtgt9c9vRC4wY4CRS4uBaHBe5x-HkhqL674QvlYRJ9PrAPHf41KewE8IUgJ2kZamtlERWNMlH00IW7IHAKB3jt1CnglzNuQT2YFsdhkDh0oJu-8VS6TCZMT2n92w50UtB5SQom2lubwFmAxqID48ap9DDMbc-_jccO9eINmpY' },
  ];

  const filteredProducts = searchQuery 
    ? availableProducts.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.sku.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  const addItem = (product: any) => {
    if (!receivedItems.find(item => item.id === product.id)) {
      setReceivedItems([...receivedItems, { 
        ...product, 
        receivedQty: itemQty, 
        unitCost: unitCost,
        location: location
      }]);
    }
    setSearchQuery('');
    setItemQty(1);
    setUnitCost(0);
  };

  const removeItem = (id: string) => {
    setReceivedItems(items => items.filter(item => item.id !== id));
  };

  const handleSubmit = () => {
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 3000);
    setReceivedItems([]);
  };

  const totalUnits = receivedItems.reduce((acc, item) => acc + item.receivedQty, 0);
  const totalValuation = receivedItems.reduce((acc, item) => acc + (item.receivedQty * item.unitCost), 0);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <header className="mb-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="text-4xl font-headline font-extrabold text-on-surface tracking-tight mb-2">Stock Receipt</h1>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="uppercase tracking-widest px-3 py-1">Draft</Badge>
              <p className="text-on-surface-variant font-medium">Receipt #SR-2023-0892</p>
            </div>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <Button variant="ghost" className="flex-1 md:flex-none">
              <Save size={18} />
              Save as Template
            </Button>
            <Button className="flex-1 md:flex-none shadow-lg" onClick={handleSubmit}>
              <Send size={18} />
              Post Receipt
            </Button>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-8">
        {/* Left Column: Form Section */}
        <div className="col-span-12 xl:col-span-5 space-y-8">
          {/* Supplier & Logistics Card */}
          <Card className="p-8" variant="elevated">
            <div className="flex items-center gap-2 mb-6">
              <Truck className="text-primary" size={20} />
              <h2 className="text-lg font-headline font-bold">Supplier Information</h2>
            </div>
            <div className="space-y-5">
              <Input 
                label="Supplier Entity" 
                placeholder="Search or select supplier..." 
                icon={<Building2 size={18} />}
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input 
                  label="Delivery Note Ref." 
                  placeholder="DN-XXXXXX" 
                  value={deliveryNote}
                  onChange={(e) => setDeliveryNote(e.target.value)}
                />
                <Input 
                  label="Arrival Date" 
                  type="date" 
                  value={arrivalDate}
                  onChange={(e) => setArrivalDate(e.target.value)}
                />
              </div>
            </div>
          </Card>

          {/* Item Entry Form */}
          <Card className="p-8 border border-outline-variant/10" variant="elevated">
            <div className="flex items-center gap-2 mb-6">
              <PlusCircle className="text-primary" size={20} />
              <h2 className="text-lg font-headline font-bold">Add Inventory Item</h2>
            </div>
            <div className="space-y-5">
              <div className="relative">
                <Input 
                  label="Search Product" 
                  placeholder="SKU or Product Name..." 
                  icon={<Search size={18} />}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {filteredProducts.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-surface-container-lowest border border-outline-variant/20 rounded-sm shadow-xl z-20 overflow-hidden">
                    {filteredProducts.map(product => (
                      <button 
                        key={product.id}
                        onClick={() => addItem(product)}
                        className="w-full flex items-center gap-4 p-4 hover:bg-surface-container transition-colors text-left border-b border-outline-variant/10 last:border-0"
                      >
                        <img src={product.image} alt="" className="w-10 h-10 rounded-sm object-cover" referrerPolicy="no-referrer" />
                        <div className="flex-1">
                          <p className="text-sm font-bold text-on-surface">{product.name}</p>
                          <p className="text-[10px] text-on-surface-variant font-mono">{product.sku}</p>
                        </div>
                        <Plus size={18} className="text-primary ml-2" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input 
                  label="Quantity" 
                  type="number" 
                  value={itemQty}
                  onChange={(e) => setItemQty(parseInt(e.target.value))}
                />
                <Input 
                  label="Unit Cost ($)" 
                  type="number" 
                  placeholder="0.00"
                  value={unitCost}
                  onChange={(e) => setUnitCost(parseFloat(e.target.value))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input label="Batch / Lot Number" placeholder="BATCH-2023-A" />
                <Input label="Expiry Date" type="date" />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest ml-1">Storage Destination</label>
                <select 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-3 bg-surface-container-highest border-none rounded-lg focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all text-sm appearance-none cursor-pointer"
                >
                  <option>Main Warehouse</option>
                  <option>Front Shelf - A1</option>
                  <option>Cold Storage Unit 3</option>
                  <option>Aisle 4 Display</option>
                </select>
              </div>

              <Button 
                variant="secondary" 
                className="w-full py-4 mt-2 font-bold"
                onClick={() => {
                  if (searchQuery) {
                    // Just a dummy add for demo if search is not empty but no product selected
                    addItem(availableProducts[0]);
                  }
                }}
              >
                <PlusCircle size={20} />
                Add to Receipt List
              </Button>
            </div>
          </Card>
        </div>

        {/* Right Column: Table & Summary */}
        <div className="col-span-12 xl:col-span-7 space-y-8">
          <Card className="overflow-hidden flex flex-col h-full min-h-[600px]" variant="elevated">
            <div className="p-6 flex justify-between items-center border-b border-outline-variant/10">
              <h2 className="text-lg font-headline font-bold">Items in Current Session</h2>
              <span className="text-sm text-on-surface-variant font-medium">{receivedItems.length} items selected</span>
            </div>
            
            <div className="flex-1 overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-surface-container-low text-xs font-bold uppercase tracking-wider text-on-surface-variant/60">
                  <tr>
                    <th className="px-6 py-4">Item Details</th>
                    <th className="px-6 py-4">Quantity</th>
                    <th className="px-6 py-4">Location</th>
                    <th className="px-6 py-4 text-right">Unit Cost</th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container">
                  {receivedItems.map(item => (
                    <tr key={item.id} className="hover:bg-surface-container-low/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded bg-surface-container overflow-hidden shrink-0">
                            <img src={item.image} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </div>
                          <div>
                            <div className="font-bold text-sm text-on-surface">{item.name}</div>
                            <div className="text-xs text-on-surface-variant/60 font-mono">{item.sku}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">{item.receivedQty} units</td>
                      <td className="px-6 py-4">
                        <Badge variant="primary" className="text-[10px] uppercase font-bold">{item.location}</Badge>
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-semibold">${item.unitCost.toFixed(2)}</td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="text-on-surface-variant/40 hover:text-error transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {receivedItems.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-20 text-center">
                        <Package size={48} className="mx-auto text-on-surface-variant/20 mb-4" />
                        <p className="text-on-surface-variant font-medium">No items in this session.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Receipt Summary Footer */}
            <div className="p-8 bg-surface-container-low border-t border-outline-variant/20">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-on-surface-variant/60 uppercase tracking-wider">Session Summary</p>
                  <div className="flex gap-6">
                    <div className="flex flex-col">
                      <span className="text-2xl font-headline font-extrabold text-on-surface">{totalUnits}</span>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Total Units</span>
                    </div>
                    <div className="h-10 w-[1px] bg-outline-variant/50 self-center"></div>
                    <div className="flex flex-col">
                      <span className="text-2xl font-headline font-extrabold text-primary">${totalValuation.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Total Valuation</span>
                    </div>
                  </div>
                </div>
                <div className="w-full md:w-auto flex gap-4">
                  <Button variant="outline" className="flex-1 md:flex-none" onClick={() => setReceivedItems([])}>
                    Discard Draft
                  </Button>
                  <Button className="flex-1 md:flex-none px-10" onClick={handleSubmit} disabled={receivedItems.length === 0}>
                    Confirm & Post Receipt
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {isSuccess && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed bottom-10 right-10 bg-primary text-on-primary px-8 py-4 rounded-sm shadow-2xl flex items-center gap-3 z-50"
        >
          <CheckCircle size={24} />
          <div>
            <p className="font-bold">Stock Received Successfully</p>
            <p className="text-xs opacity-80">Inventory levels have been updated.</p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
