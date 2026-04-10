import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  FileText,
  Download,
  Eye,
  Filter,
  ChevronRight,
  ArrowLeft,
  Calendar,
  Building2,
  Package,
  MoreVertical,
  X,
  Printer,
  Share2,
  Trash2,
  CheckCircle2,
  Clock,
  Plus
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { TableHeader, Pagination } from '../../components/table';
import { useStock } from './useStock';
import { StockReceipt } from '../../types';



export function StockReceiptHistory() {
  const { stockReceipts, isLoadingReceipt, errorReceipt } = useStock();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReceipt, setSelectedReceipt] = useState<StockReceipt | null>(null);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  const filteredReceipts = stockReceipts.filter(record => {
    const q = searchQuery.toLowerCase();
    return (
      record.receipt_number?.toLowerCase().includes(q) ||
      record.supplier_name?.toLowerCase().includes(q) ||
      String(record.receipt_id || '').toLowerCase().includes(q)
    );
  });

  const total = filteredReceipts.length;
  const startIndex = (page - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, total);
  const paginatedReceipts = filteredReceipts.slice(startIndex, endIndex);

  // reset to first page when filters change
  useState(() => {
    setPage(1);
  });

  // const history: ReceiptRecord[] = [
  //   {
  //     id: 'SR-2023-0892',
  //     supplier: 'Luxe Fabrics Ltd',
  //     date: '2023-10-25',
  //     totalUnits: 91,
  //     totalValuation: 11921.00,
  //     status: 'Posted',
  //     reference: 'DN-99210',
  //     items: [
  //       { name: 'Modernist Timepiece A1', sku: 'WAT-MD-01', qty: 24, unitCost: 145.00, location: 'Main Warehouse', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAmWRd1hrOaMCnabJnUMFDsqFDmw7vs7K_3Fteqmhmy1j5bsDb2xRNNBG_p_o15MFDt6H48vYpJwephNHUX9PMGbz31fXnQYzefk93SIHQD1uh_GtFpFV8KayalItLuf-zrdey-wxgO4gop6Z8gsVYrwwbTuVXh7CaDZWkFVUlnC7l3DzGG2DbiDhqBw8rEWAX5AT_N-QP4xtF7u6LvUeIRGoefM1Be4o6YuzQzfq-_rdLjX8ofMp7MmNj8U454l8gq9pTZYQcw6fw' },
  //       { name: 'AudioSphere Pro Max', sku: 'AUD-PH-99', qty: 12, unitCost: 320.50, location: 'Front Shelf', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBY5O_BIdKmtDV7PqCcqIs8mh7YiE5mT1KuHVWzHO_AWj6sMSDa3CJwJt1kGpH086lXsKGq4F1Q8iov7Xcln1-3Si6K29ueifPcxYoj3XX6Po4f5aFeQloRhIMK9mysgmYSla1AdIUGSVd7WMAAiQaxPebgp0ahrNOf_hTxEP6sApzc0A6w9GeVlZL7e7aAr18UaEwLqERFYGf8bLfafUjYG09CABfAN1LNSxY7CyhKi7et9DDJJuSwzJoljRpf4mNkck8LxIiAos4' },
  //     ]
  //   },
  //   {
  //     id: 'SR-2023-0891',
  //     supplier: 'Global Logistics',
  //     date: '2023-10-24',
  //     totalUnits: 45,
  //     totalValuation: 5400.00,
  //     status: 'Posted',
  //     reference: 'DN-88211',
  //     items: [
  //       { name: 'Velocity Knit Runner', sku: 'SHO-VEL-02', qty: 45, unitCost: 120.00, location: 'Main Warehouse', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAzkWyb0tax6H6SpREZhq_I33tD8_hZaioKD370_kmhShSCU6UKJ88KU48u1-s_n4iRrYSYDckoOXNeEKKOidPaOuTKcRORGeIJpZKuJHLjHzCMBO-dMsc87gnqzXgnKv-LzULzfmJ-UIJ6wVzhewFTS5f6AyYCtbcadjdcjurYGB2CzTPVMBBGH5BTiphYdDnLLqeghKLmnIruxRV7Bh5QEhzL3zzUzIzgMrex3VOri_mqYXHrVlN3s3oLNHGzs3Pu_fiYPF7DxPA' },
  //     ]
  //   },
  //   {
  //     id: 'SR-2023-0890',
  //     supplier: 'Artisan Supplies',
  //     date: '2023-10-22',
  //     totalUnits: 120,
  //     totalValuation: 8250.00,
  //     status: 'Cancelled',
  //     reference: 'DN-77102',
  //     items: []
  //   },
  //   {
  //     id: 'SR-2023-0889',
  //     supplier: 'Nordic Design Co',
  //     date: '2023-10-20',
  //     totalUnits: 30,
  //     totalValuation: 15000.00,
  //     status: 'Posted',
  //     reference: 'DN-66199',
  //     items: []
  //   }
  // ];

  // const filteredHistory = history.filter(h =>
  //   h.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //   h.supplier.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //   h.reference.toLowerCase().includes(searchQuery.toLowerCase())
  // );

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(history));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "stock_receipt_history.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-headline font-extrabold text-on-surface tracking-tight mb-2">Receipt History</h1>
          <p className="text-on-surface-variant font-medium">Audit trail of all incoming inventory transactions.</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <Button variant="outline" onClick={handleExport}>
            <Download size={18} />
            Export Data
          </Button>
          <Button onClick={() => navigate('/stock/receipt/create')}>
            <Plus size={18} />
            New Receipt
          </Button>
        </div>
      </header>

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
                <th className="px-8 py-4">Receipt ID</th>
                <th className="px-8 py-4">Supplier</th>
                <th className="px-8 py-4">Arrival Date</th>
                <th className="px-8 py-4">Units</th>
                <th className="px-8 py-4">Status</th>
                <th className="px-8 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {paginatedReceipts.map((record) => (
                <tr key={record.receipt_id} className="hover:bg-surface-container-low/50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex flex-col">
                      <span className="font-bold text-on-surface text-sm">{record.receipt_number}</span>
                      {/* <span className="text-[10px] text-on-surface-variant/60 font-mono">Ref: {record.receipt_number}</span> */}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-secondary-container/30 rounded text-secondary">
                        <Building2 size={14} />
                      </div>
                      <span className="text-sm font-semibold text-on-surface">{record.supplier_name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-sm text-on-surface-variant font-medium">{record.created_at}</span>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-sm font-bold text-on-surface">{record.status}</span>
                  </td>
                  {/* <td className="px-8 py-5 text-right">
                    <span className="text-sm font-bold text-primary">${record.total_valuation.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </td> */}
                  <td className="px-8 py-5">
                    <Badge variant={record.status === 'Posted' ? 'primary' : record.status === 'Cancelled' ? 'error' : 'secondary'}>
                      {record.status}
                    </Badge>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => navigate(`/stock/receipt/${record.receipt_id || record.receipt_number}`)}
                        className="p-2 text-on-surface-variant/40 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                        title="Preview Detail"
                      >
                        <Eye size={18} />
                      </button>
                      <button className="p-2 text-on-surface-variant/40 hover:text-on-surface rounded-lg transition-all">
                        <MoreVertical size={18} />
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

      {/* Detail Preview Modal */}
      <AnimatePresence>
        {selectedReceipt && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4 md:p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedReceipt(null)}
              className="absolute inset-0 bg-surface/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-4xl bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/20 overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="p-6 md:p-8 border-b border-outline-variant/10 flex justify-between items-start bg-surface-container-low/50">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-headline font-extrabold text-on-surface">{selectedReceipt.receipt_id}</h2>
                    <Badge variant={selectedReceipt.status === 'Posted' ? 'primary' : 'error'}>{selectedReceipt.status}</Badge>
                  </div>
                  <p className="text-sm text-on-surface-variant font-medium">Recorded on {selectedReceipt.date} • Ref: {selectedReceipt.receipt_number}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-surface-container rounded-full transition-colors"><Printer size={20} /></button>
                  <button className="p-2 hover:bg-surface-container rounded-full transition-colors"><Share2 size={20} /></button>
                  <button
                    onClick={() => setSelectedReceipt(null)}
                    className="p-2 hover:bg-error/10 hover:text-error rounded-full transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
                {/* Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest">Supplier</p>
                    <div className="flex items-center gap-2">
                      <Building2 size={16} className="text-primary" />
                      <p className="font-bold text-on-surface">{selectedReceipt.supplier_name}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest">Total Units</p>
                    <div className="flex items-center gap-2">
                      <Package size={16} className="text-primary" />
                      <p className="font-bold text-on-surface">{selectedReceipt.totalUnits} items</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest">Total Valuation</p>
                    <p className="text-xl font-headline font-extrabold text-primary">${selectedReceipt.totalValuation.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                  </div>
                </div>

                {/* Items Table */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-on-surface uppercase tracking-wider">Received Items</h3>
                  <div className="border border-outline-variant/10 rounded-xl overflow-hidden">
                    <table className="w-full text-left">
                      <thead className="bg-surface-container-low text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60">
                        <tr>
                          <th className="px-6 py-3">Product</th>
                          <th className="px-6 py-3">Quantity</th>
                          <th className="px-6 py-3">Unit Cost</th>
                          <th className="px-6 py-3 text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-outline-variant/10">
                        {selectedReceipt?.stock_receipt_items?.map((item, idx) => (
                          <tr key={idx} className="hover:bg-surface-container-low/30 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded bg-surface-container flex items-center justify-center">
                                  <Package size={16} />
                                </div>
                                <div>
                                  <p className="text-sm font-bold text-on-surface">{(item as any).name || ''}</p>
                                  <p className="text-[10px] text-on-surface-variant/60 font-mono">{(item as any).sku || ''} • {(item as any).area_id || ''}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm font-medium">{(item as any).quantity || 0} units</td>
                            <td className="px-6 py-4 text-sm font-medium">${((item as any).unitCost || 0).toFixed ? (item as any).unitCost.toFixed(2) : ((item as any).unitCost || 0)}</td>
                            <td className="px-6 py-4 text-right text-sm font-bold text-on-surface">
                              ${(((item as any).quantity || 0) * ((item as any).unitCost || 0)).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </td>
                          </tr>
                        ))}
                        {selectedReceipt?.stock_receipt_items?.length === 0 && (
                          <tr>
                            <td colSpan={4} className="px-6 py-12 text-center text-on-surface-variant italic text-sm">
                              No item details available for this record.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Timeline / Audit */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-on-surface uppercase tracking-wider">Transaction Timeline</h3>
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                          <CheckCircle2 size={16} />
                        </div>
                        <div className="w-px h-full bg-outline-variant/20 min-h-5"></div>
                      </div>
                      <div className="pb-4">
                        <p className="text-sm font-bold text-on-surface">Receipt Posted</p>
                        <p className="text-xs text-on-surface-variant">Inventory levels updated successfully by Alex Rivera</p>
                        <p className="text-[10px] text-on-surface-variant/40 mt-1">{selectedReceipt.date} 14:22:10</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-secondary-container/30 text-secondary flex items-center justify-center">
                          <Clock size={16} />
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-on-surface">Draft Created</p>
                        <p className="text-xs text-on-surface-variant">Initial entry recorded from delivery note {selectedReceipt.receipt_number}</p>
                        <p className="text-[10px] text-on-surface-variant/40 mt-1">{selectedReceipt.date} 13:45:02</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 md:p-8 border-t border-outline-variant/10 bg-surface-container-low/30 flex justify-end gap-4">
                <Button variant="outline" onClick={() => setSelectedReceipt(null)}>Close Preview</Button>
                <Button variant="secondary">
                  <Download size={18} />
                  Download PDF
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
