import { useCallback } from 'react';

export function useReportExport() {
  const exportToPDF = useCallback(async (elementId: string, filename: string) => {
    const element = document.getElementById(elementId);
    if (!element) {
      console.error(`Element with id "${elementId}" not found`);
      return;
    }

    // Use window.print() which handles CSS properly
    // Create a print-specific stylesheet
    const printStyles = document.createElement('style');
    printStyles.id = 'print-styles';
    printStyles.innerHTML = `
      @media print {
        body * { visibility: hidden; }
        #${elementId}, #${elementId} * { visibility: visible; }
        #${elementId} {
          position: fixed;
          left: 0;
          top: 0;
          width: 100%;
          padding: 20px;
          background: white;
        }
      }
    `;
    document.head.appendChild(printStyles);

    window.print();

    // Clean up after print
    setTimeout(() => {
      printStyles.remove();
    }, 1000);
  }, []);

  const printReport = useCallback((elementId: string) => {
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
          <title>${filename}</title>
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
