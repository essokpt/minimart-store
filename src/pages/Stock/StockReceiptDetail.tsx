import React from 'react';
import { motion } from 'motion/react';
import { Card } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { FileDown, Loader, ArrowLeft, Download, Printer, Share2, CheckCircle2, Clock, Package, Building2, X, Barcode } from 'lucide-react';
import { useStock } from './useStock';
import { StockReceipt } from '../../types';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { Loading } from '../../components/ui/Loading';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatCurrency } from '../../lib/formatters';
import { Button } from '@/src/components/ui/Button';
import { Badge } from '@/src/components/ui/Badge';
import { Link, useNavigate, useParams } from 'react-router-dom';

export function StockReceiptDetail() {
  const { id } = useParams();
  const detail_id = id || '';
  const navigate = useNavigate();
  const [isExporting, setIsExporting] = React.useState(false);
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

  const handlePrintBarcodes = () => {
    if (!receipt || !receipt.stock_receipt_items) return;

    const itemsData = receipt.stock_receipt_items.map((item: any) => ({
      name: item.product?.name || 'Product',
      barcode: item.product?.barcode || item.product?.product_id || '',
      quantity: item.quantity || 0
    }));

    // Create a hidden iframe for printing
    let iframe = document.getElementById('print-iframe') as HTMLIFrameElement;
    if (!iframe) {
      iframe = document.createElement('iframe');
      iframe.id = 'print-iframe';
      iframe.style.position = 'absolute';
      iframe.style.width = '0px';
      iframe.style.height = '0px';
      iframe.style.border = 'none';
      document.body.appendChild(iframe);
    }

    const doc = iframe.contentWindow?.document || iframe.contentDocument;
    if (!doc) return;

    doc.open();
    doc.write(`
      <html>
        <head>
          <title>${(receipt.receipt_number || 'Barcodes') + '-barcode'}</title>
          <style>
            @page { 
              size: auto; 
              margin: 2mm; 
            }
            html, body {
              margin: 0;
              padding: 0;
              background: white;
            }
            body { 
              font-family: 'Inter', sans-serif; 
            }
            #labels-container { 
              display: grid; 
              grid-template-columns: repeat(4, 1fr); 
              gap: 0; 
              width: 100%;
              line-height: 0;
            }
            .barcode-card {
              width: 100%; 
              height: 70px;
              padding: 2px; 
              border: 0.1mm solid #f0f0f0;
              display: flex; 
              flex-direction: column; 
              align-items: center;
              justify-content: center;
              page-break-inside: avoid; 
              box-sizing: border-box;
              overflow: hidden;
              line-height: normal; /* Restore for text */
            }
            .product-name {
              font-size: 7px; 
              font-weight: 700; 
              text-align: center; 
              margin-bottom: 2px;
              display: -webkit-box; 
              -webkit-line-clamp: 1; 
              -webkit-box-orient: vertical;
              overflow: hidden; 
              line-height: 1.1;
              height: 10px;
              width: 100%;
            }
            svg { 
              width: 90%; 
              height: 45px !important;
              display: block;
            }
          </style>
          <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js"></script>
        </head>
        <body>
          <div id="labels-container"></div>
          <script>
            (function() {
              const items = ${JSON.stringify(itemsData)};
              const container = document.getElementById('labels-container');
              
              items.forEach(item => {
                for (let i = 0; i < item.quantity; i++) {
                  const card = document.createElement('div');
                  card.className = 'barcode-card';
                  card.innerHTML = \`
                    <div class="product-name">\${item.name.length > 20 ? item.name.substring(0, 20) + '...' : item.name}</div>
                    <svg class="barcode"></svg>
                  \`;
                  container.appendChild(card);
                  
                  JsBarcode(card.querySelector('.barcode'), item.barcode, {
                    format: "CODE128", 
                    width: 1.2, 
                    height: 40, 
                    displayValue: true, 
                    fontSize: 10, 
                    margin: 0
                  });
                }
              });
              
              window.onload = () => {
                // We trigger print from the parent to better control timing and titles
              };
            })();
          </script>
        </body>
      </html>
    `);
    const originalTitle = document.title;
    document.title = (receipt.receipt_number || 'Barcodes') + '-barcode';

    doc.close();

    // Print the iframe
    setTimeout(() => {
      iframe.contentWindow?.print();
      // Restore title after print dialog triggers
      setTimeout(() => {
        document.title = originalTitle;
      }, 1000);
    }, 500);
  };

  const handlePrint = () => {
    if (!receipt) return;
    const originalTitle = document.title;
    document.title = receipt.receipt_number || 'Receipt';
    window.print();
    // Use a small delay before restoring title to ensure print dialog captures it
    setTimeout(() => {
      document.title = originalTitle;
    }, 1000);
  };

  const handleExportPDF = async () => {
    if (!receipt) return;

    setIsExporting(true);

    // UI delay for loading state
    await new Promise(resolve => setTimeout(resolve, 100));

    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Colors
      const primaryColor: [number, number, number] = [0, 106, 96]; // #006a60
      const textColor: [number, number, number] = [68, 68, 68];
      const lightTextColor: [number, number, number] = [102, 102, 102];

      // --- Header ---
      doc.setFontSize(24);
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.setFont('helvetica', 'bold');
      doc.text('Stock Receipt', 20, 25);

      doc.setFontSize(12);
      doc.setTextColor(textColor[0], textColor[1], textColor[2]);
      doc.text(receipt.receipt_number || '', 20, 35);

      doc.setFontSize(10);
      doc.setTextColor(lightTextColor[0], lightTextColor[1], lightTextColor[2]);
      doc.setFont('helvetica', 'normal');
      doc.text(`Date: ${new Date(receipt.created_at).toLocaleString()}`, 20, 42);

      // Brand/Warehouse info
      const rightX = 190;
      doc.setFontSize(20);
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.setFont('helvetica', 'bold');
      doc.text('MiniMart Pro', rightX, 25, { align: 'right' });

      doc.setFontSize(11);
      doc.setTextColor(textColor[0], textColor[1], textColor[2]);
      doc.setFont('helvetica', 'normal');
      doc.text('Main Warehouse Hub', rightX, 32, { align: 'right' });

      doc.setFontSize(9);
      doc.setTextColor(lightTextColor[0], lightTextColor[1], lightTextColor[2]);
      doc.text('Terminal #04, Logistics Sector', rightX, 38, { align: 'right' });

      // Horizontal Line
      doc.setDrawColor(238, 238, 238);
      doc.setLineWidth(0.5);
      doc.line(20, 55, 190, 55);

      // --- Supplier Section ---
      doc.setFontSize(10);
      doc.setTextColor(lightTextColor[0], lightTextColor[1], lightTextColor[2]);
      doc.text('SUPPLIER', 20, 65);

      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'bold');
      doc.text(receipt.supplier_name || 'N/A', 20, 72);

      doc.setFontSize(10);
      doc.setTextColor(lightTextColor[0], lightTextColor[1], lightTextColor[2]);
      doc.setFont('helvetica', 'normal');
      doc.text('STATUS', 120, 65);

      doc.setFontSize(14);
      doc.setTextColor(receipt.status === 'Posted' ? primaryColor[0] : 100, receipt.status === 'Posted' ? primaryColor[1] : 100, receipt.status === 'Posted' ? primaryColor[2] : 100);
      doc.setFont('helvetica', 'bold');
      doc.text(receipt.status || 'N/A', 120, 72);

      // --- Table ---
      const tableData = receipt.stock_receipt_items?.map((item: any) => [
        {
          content: `${item.product?.name || 'Unknown'}\nArea: ${item.area?.name || 'N/A'}`,
          styles: { fontStyle: 'normal' }
        },
        item.quantity,
        `$${item.unit_cost?.toFixed(2)}`,
        `$${(item.quantity * item.unit_cost).toLocaleString(undefined, { minimumFractionDigits: 2 })}`
      ]) || [];

      autoTable(doc, {
        startY: 85,
        head: [['Product', 'Qty', 'Unit Cost', 'Total']],
        body: tableData,
        headStyles: {
          fillColor: [248, 248, 248],
          textColor: [0, 0, 0],
          fontStyle: 'bold',
          lineWidth: 0.1,
          lineColor: [221, 221, 221]
        },
        bodyStyles: {
          textColor: textColor,
          fontSize: 10,
          lineWidth: 0.1,
          lineColor: [238, 238, 238]
        },
        columnStyles: {
          3: { halign: 'right', fontStyle: 'bold' }
        },
        margin: { left: 20, right: 20 }
      });

      // --- Signatures ---
      const finalY = (doc as any).lastAutoTable.finalY + 40;
      doc.setDrawColor(153, 153, 153);
      doc.setLineWidth(0.2);

      // Warehouse Inspector
      doc.line(20, finalY, 80, finalY);
      doc.setFontSize(9);
      doc.setTextColor(lightTextColor[0], lightTextColor[1], lightTextColor[2]);
      doc.setFont('helvetica', 'normal');
      doc.text('Warehouse Inspector Signature', 50, finalY + 5, { align: 'center' });

      // Logistics Manager
      doc.line(130, finalY, 190, finalY);
      doc.text('Authorized Logistics Manager', 160, finalY + 5, { align: 'center' });

      // Footer
      doc.setFontSize(8);
      doc.setTextColor(170, 170, 170);
      doc.text(`Minimart Pro Inventory Systems • SR Report Exported on ${new Date().toLocaleString()}`, 105, 285, { align: 'center' });

      const fileName = `${receipt.receipt_number || 'receipt'}.pdf`;
      
      // Save directly - modal stays visible
      doc.save(fileName);
      
      // Close modal after save trigger
      setIsExporting(false);

    } catch (err) {
      setIsExporting(false);
      console.error('PDF Error:', err);
      alert('Failed to generate PDF');
    }
  };

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
          <Button variant="outline" onClick={handlePrintBarcodes}>
            <Barcode size={18} className="mr-2" />
            Print Barcodes
          </Button>
          <Button variant="outline" onClick={handlePrint}>
            <Printer size={18} className="mr-2" />
            Print
          </Button>
          <Button variant="secondary" onClick={handleExportPDF} loading={isExporting}>
            <Download size={18} className="mr-2" />
            Download PDF
          </Button>
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
                <th className="px-6 py-3 w-[120px]">Sold-Out</th>
                <th className="px-6 py-3">Status</th>
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
                  <td className="px-6 py-4 text-sm font-medium">{(item as any).sale_out_qty || 0}</td>

                  <td className="px-6 py-4">
                    <Badge variant="primary" className="text-[12px] uppercase font-bold">{item.status}</Badge>
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

      <Modal
        isOpen={isExporting}
        onClose={() => { }}
        title="Generating Stock Report"
        maxWidth="max-w-md"
      >
        <div className="py-8 flex flex-col items-center justify-center text-center space-y-6">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
            <div className="relative bg-primary/10 p-6 rounded-full">
              <FileDown size={48} className="text-primary animate-bounce" />
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-headline font-bold text-on-surface">Compiling inventory data</h3>
            <p className="text-sm text-on-surface-variant max-w-[280px]">
              We are generating the stock receipt report for <span className="font-bold text-primary">{receipt.receipt_number}</span>.
            </p>
          </div>

          <div className="flex items-center gap-3 px-4 py-2 bg-surface-container rounded-full">
            <Loader size={18} className="text-primary animate-spin" />
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
              Processing Records...
            </span>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
}

export default StockReceiptDetail;
