import { useCallback } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatCurrency } from '../../../lib/formatters';

export function useReportExport() {
  const exportToPDF = useCallback(async (elementId: string, title: string = 'Analytics Report', filename?: string) => {
    const element = document.getElementById(elementId);
    if (!element) return;

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
      doc.text(title, 20, 25);

      doc.setFontSize(10);
      doc.setTextColor(lightTextColor[0], lightTextColor[1], lightTextColor[2]);
      doc.setFont('helvetica', 'normal');
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 32);

      // Brand info
      const rightX = 190;
      doc.setFontSize(20);
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.setFont('helvetica', 'bold');
      doc.text('MiniMart Pro', rightX, 25, { align: 'right' });

      doc.setFontSize(11);
      doc.setTextColor(textColor[0], textColor[1], textColor[2]);
      doc.setFont('helvetica', 'normal');
      doc.text('Enterprise Analytics', rightX, 32, { align: 'right' });

      // Horizontal Line
      doc.setDrawColor(238, 238, 238);
      doc.setLineWidth(0.5);
      doc.line(20, 40, 190, 40);

      // --- Summary Section (if cards exist) ---
      const summaryCards = element.querySelectorAll('[data-report-summary]');
      let currentY = 50;

      if (summaryCards.length > 0) {
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'bold');
        doc.text('Performance Summary', 20, currentY);
        currentY += 10;

        const summaryData: string[][] = [];
        summaryCards.forEach(card => {
          const label = card.querySelector('.text-on-surface-variant')?.textContent || '';
          const value = card.querySelector('.text-2xl')?.textContent || '';
          summaryData.push([label, value]);
        });

        autoTable(doc, {
          startY: currentY,
          head: [['Metric', 'Value']],
          body: summaryData,
          theme: 'grid',
          headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0] },
          margin: { left: 20, right: 120 }
        });
        
        currentY = (doc as any).lastAutoTable.finalY + 15;
      }

      // --- Data Table ---
      const tables = element.querySelectorAll('table');
      tables.forEach((table, index) => {
        if (index > 0) currentY += 10;
        
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'bold');
        doc.text(index === 0 ? 'Detailed Data' : `Table ${index + 1}`, 20, currentY);
        currentY += 5;

        autoTable(doc, {
          startY: currentY,
          html: table,
          headStyles: {
            fillColor: [248, 248, 248],
            textColor: [0, 0, 0],
            fontStyle: 'bold',
            lineWidth: 0.1,
            lineColor: [221, 221, 221]
          },
          bodyStyles: {
            textColor: textColor,
            fontSize: 9,
            lineWidth: 0.1,
            lineColor: [238, 238, 238]
          },
          margin: { left: 20, right: 20 }
        });
        
        currentY = (doc as any).lastAutoTable.finalY + 15;
      });

      // Footer
      doc.setFontSize(8);
      doc.setTextColor(170, 170, 170);
      doc.text('Minimart Pro Analytics System • Confidental Report', 105, 285, { align: 'center' });

      const saveName = filename || `${title.toLowerCase().replace(/\s+/g, '-')}-${new Date().getTime()}.pdf`;
      
      // Save directly - the modal will stay visible until the browser triggers the download
      doc.save(saveName);
      
      // Small buffer to ensure the download has initiated before UI release
      setTimeout(() => {
        // Note: setIsLoading(false) is handled by the calling component (ExportButton)
        // by waiting for this async function to finish.
      }, 100);
      
    } catch (err) {
      console.error('Export Error:', err);
      alert('Failed to generate PDF report');
    }
  }, []);

  const printReport = useCallback((elementId: string, title: string = 'Report', filename?: string) => {
    const element = document.getElementById(elementId);
    if (!element) {
      console.error(`Element with id "${elementId}" not found`);
      return;
    }

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to print');
      return;
    }

    // Build print content with inline styles for reliability
    const styles = Array.from(document.styleSheets)
      .map((sheet) => {
        try {
          return Array.from(sheet.cssRules).map((rule) => rule.cssText).join('');
        } catch {
          return '';
        }
      })
      .join('\n');

    // Create a clean print version with print-friendly colors
    const printStyles = `
      <style>
        ${styles}
        * {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          color-adjust: exact !important;
        }
        body {
          padding: 20px;
          font-family: Arial, sans-serif;
          background: white;
        }
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background: #f5f5f5; }
        .card {
          background: white;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 16px;
        }
        .bg-primary { background-color: #006a60 !important; color: white !important; }
        .bg-secondary { background-color: #4a635f !important; }
        .text-primary { color: #006a60 !important; }
      </style>
    `;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${filename || title}</title>
          ${printStyles}
        </head>
        <body>${element.innerHTML}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  }, []);

  return { exportToPDF, printReport };
}
