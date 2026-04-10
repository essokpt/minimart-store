import { motion } from 'motion/react';
import { ArrowLeft, Download, Printer, Share2, CheckCircle2, Clock, Package, Building2, X } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { useStock } from './useStock';
import { StockReceipt } from '../../types';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { Loading } from '../../components/ui/Loading';

export function StockReceiptDetail() {
  const { id } = useParams();
  const detail_id = id || '';
  const navigate = useNavigate();
  const { data: stockReceiptDetails, isLoading, error } = useQuery({
    queryKey: ['receipt-detail', id],
    queryFn: async function () {
      const { data, error } = await supabase
        .from('stock_receipts')
        .select('*,stock_receipt_items(*,product(*),area(*))')
        .eq('receipt_id', detail_id)
        .single();

      if (error) {
        console.log('error', `Failed to load stock receipt details: ${error.message}`);
        throw error;
      }
      return data as StockReceipt;
    }
  });
  if (isLoading) return <Loading />;
  //console.log('Receipt ID from URL:', id, stockReceiptDetails);
  //const { stockReceiptDetails } = useStock(id);
  const receipt = Array.isArray(stockReceiptDetails) ? stockReceiptDetails[0] : stockReceiptDetails;
 // console.log('Fetched stock receipt details:', receipt);
  // const receipt = stockReceiptDetails.find(r => String(r.receipt_id) === String(id) || String(r.receipt_number) === String(id));

  if (!receipt) {
    return (
      <Card className="p-8">
        <p className="text-on-surface-variant">Receipt not found.</p>
        <div className="mt-4">
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </Card>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft size={18} />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-headline font-extrabold">{receipt.receipt_number}</h1>
            <p className="text-sm text-on-surface-variant">{receipt.supplier_name}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">Print</Button>
          <Button variant="secondary">Download</Button>
        </div>
      </header>

      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest">Supplier</p>
            <div className="flex items-center gap-2">
              <Building2 size={16} className="text-primary" />
              <p className="font-bold text-on-surface">{receipt.supplier_name}</p>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest">Total Units</p>
            <div className="flex items-center gap-2">
              <Package size={16} className="text-primary" />
              <p className="font-bold text-on-surface">{receipt.stock_receipt_items?.length || 0} items</p>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest">Status</p>
            <Badge variant={receipt.status === 'Posted' ? 'primary' : receipt.status === 'Cancelled' ? 'error' : 'secondary'}>
              {receipt.status}
            </Badge>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-sm font-bold uppercase tracking-wider mb-4">Received Items</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-surface-container-low text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60">
              <tr>
                <th className="px-6 py-3">Product</th>
                <th className="px-6 py-3">Quantity</th>
                <th className="px-6 py-3">Unit Cost</th>
                <th className="px-6 py-3 w-[120px]">Area</th>
                <th className="px-6 py-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {receipt.stock_receipt_items?.map((item: any) => (
                <tr key={String(item.receipt_item_id)} className="hover:bg-surface-container-low/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-md bg-surface-container-high overflow-hidden border border-outline-variant/20">
                        <img src={item.product.image_url || item.product.image} alt={item.product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div>
                        <Link to={`/inventory/product/${item.product.product_id}`} className="hover:underline">
                          <p className="text-sm font-bold text-on-surface">{item.product.name}</p>
                        </Link>
                        <p className="text-[10px] text-on-surface-variant font-medium line-clamp-1">{item.product.brand} {item.product.model}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">{(item as any).quantity || 0} units</td>
                  <td className="px-6 py-4 text-sm font-medium">${(item as any).unit_cost?.toFixed ? (item as any).unit_cost.toFixed(2) : ((item as any).unit_cost || 0)}</td>
                  <td className="px-6 py-4">
                    <Badge variant="primary" className="text-[10px] uppercase font-bold">{item.area?.name}</Badge>
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-bold text-on-surface">${(((item as any).quantity || 0) * ((item as any).unit_cost || 0)).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                </tr>
              ))}
              {(!receipt.stock_receipt_items || receipt.stock_receipt_items.length === 0) && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-on-surface-variant italic text-sm">No item details available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </motion.div>
  );
}

export default StockReceiptDetail;
