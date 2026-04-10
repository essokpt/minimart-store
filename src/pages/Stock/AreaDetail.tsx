import { motion } from 'motion/react';
import { ArrowLeft, Package, Edit2, Archive, Copy, Barcode, TrendingUp, AlertTriangle } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { Loading } from '../../components/ui/Loading';
import { ErrorState } from '../../components/ui/ErrorState';

import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { StockArea } from '../../types';

export function AreaDetail() {
  const { id } = useParams();
  const detail_id = id || '';
  // const navigate = useNavigate();
  const { data: areaDetails, isLoading, error } = useQuery({
    queryKey: ['area-detail', id],
    queryFn: async function () {
      const { data, error } = await supabase
        .from('areas')
        .select('*, stock_receipt_items(*, products(*))')
        .eq('area_id', detail_id);
      // .order('created_at', { ascending: false });

      if (error) {
        console.log('error', `Failed to load stock receipt details: ${error.message}`);
        throw error;
      }
      return data as unknown as StockArea;
    }
  });
  if (isLoading) return <Loading />;
  //console.log('Receipt ID from URL:', id, stockReceiptDetails);
  //const { stockReceiptDetails } = useStock(id);
  const area = Array.isArray(areaDetails) ? areaDetails[0] : areaDetails;
  console.log('Fetched stock receipt details:', areaDetails);
  // const receipt = stockReceiptDetails.find(r => String(r.receipt_id) === String(id) || String(r.receipt_number) === String(id));

  // if (!area) {
  //   return (
  //     <Card className="p-8">
  //       <p className="text-on-surface-variant">Receipt not found.</p>
  //       <div className="flex items-center gap-4">
  //         <Link to="/stock-areas">
  //           <Button variant="ghost" size="icon" className="w-10 h-10 rounded-full bg-surface-container hover:bg-surface-container-high border border-outline-variant/20">
  //             <ArrowLeft size={20} />
  //           </Button>
  //         </Link>
  //       </div>

  //     </Card>
  //   );
  // }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/stock-areas">
            <Button variant="ghost" size="icon" className="w-10 h-10 rounded-full bg-surface-container hover:bg-surface-container-high border border-outline-variant/20">
              <ArrowLeft size={20} />
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-8">
          <Card className="p-2 overflow-hidden bg-surface-container-lowest border-outline-variant/20">
            <p>area Chart</p>
          </Card>

          <Card className="p-6 bg-surface-container border-outline-variant/10">
            <h3 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-4">Identification</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-surface-container-lowest rounded-sm border border-outline-variant/20">
                <div>
                  <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest">Barcode / SKU</p>
                  <p className="font-mono font-bold text-on-surface mt-0.5"> 'N/A'</p>
                </div>
                <button className="text-primary hover:text-primary-container p-2 rounded-md transition-colors"><Copy size={16} /></button>
              </div>
              <div className="p-6 bg-surface-container-lowest rounded-sm border border-outline-variant/20 flex flex-col items-center justify-center gap-2">
                <Barcode size={64} className="text-on-surface opacity-80" strokeWidth={1} />
                <p className="font-mono text-[10px] tracking-[0.2em] font-medium text-on-surface-variant">N/A</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <Card className="p-8 bg-surface-container-lowest border-outline-variant/20" variant="elevated">
            <h3 className="text-xl font-headline font-bold mb-6">Area : {area?.name}</h3>
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Capacity</p>
                  <p className="text-4xl font-mono font-extrabold text-primary">${area?.capacity}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Cost Margin</p>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-on-surface">${area?.currentUsage}</span>
                    <Badge variant="success" className="text-[8px]">{0}% MARGIN</Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-6 pl-8 border-l border-outline-variant/20">
                <div>
                  <div className="flex justify-between items-end mb-1">
                    <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Stock Level</p>
                    <span className="font-mono font-bold text-on-surface">{area?.stock_receipt_items?.length || 0} Unit</span>
                  </div>
                  <div className="h-2 w-full bg-surface-container rounded-sm overflow-hidden mb-2">
                    <div
                      className={`h-full ${area?.currentUsage > area?.capacity ? 'bg-error' : 'bg-primary'}`}
                      style={{ width: `${(area?.currentUsage / area?.capacity) * 100}%` }}
                    ></div>
                  </div>
                  {area?.currentUsage < area?.capacity ? (
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-error uppercase tracking-widest">
                      <AlertTriangle size={12} /> Low stock warning
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                      <TrendingUp size={12} className="text-primary" /> Stock is healthy
                    </div>
                  )}
                </div>

                <div>
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Area Type</p>
                  <div className="flex items-center gap-2">
                    <Package size={16} className="text-secondary" />
                    <span className="font-headline font-semibold text-sm">{area?.type}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-8 bg-surface-container-lowest border-outline-variant/20">
            <h3 className="text-xl font-headline font-bold mb-6">Area Description</h3>
            <p className="text-on-surface-variant leading-relaxed">
              {area?.description || 'No detailed description available for this product.'}
            </p>
          </Card>

          <Card className="p-0 overflow-hidden bg-surface-container-lowest border-outline-variant/20">
            <div className="p-6 border-b border-outline-variant/10 flex items-center justify-between">
              <h3 className="text-xl font-headline font-bold">Recent History</h3>
              <Button variant="ghost" size="sm">View All Logs</Button>
            </div>
            <table className="w-full text-left text-sm">
              <tbody className="divide-y divide-outline-variant/10">
                {area?.stock_receipt_items?.map((item: any) => (
                  <tr key={String(item.receipt_item_id)} className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-on-surface-variant">{item.created_at}</td>
                    <td className="px-6 py-4 font-medium">{item?.products?.name}</td>
                    <td className="px-6 py-4"><Badge variant="primary">{item?.quantity}</Badge></td>

                  </tr>

                ))
                }
              </tbody>
            </table>
          </Card>
        </div>
      </div>

    </motion.div>
  );
}
