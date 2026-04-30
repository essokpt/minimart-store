import { useState } from 'react';
import { Printer, Loader, FileDown } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { useReportExport } from '../hooks/useReportExport';
import { Modal } from '../../../components/ui/Modal';

interface ExportButtonProps {
  elementId: string;
  title?: string;
}

export function ExportButton({ elementId, title = 'Report' }: ExportButtonProps) {
  const { exportToPDF } = useReportExport();
  const [isLoading, setIsLoading] = useState(false);

  const handleExportPDF = async () => {
    setIsLoading(true);
    // Add a tiny delay to ensure the modal renders before heavy JS processing
    await new Promise(resolve => setTimeout(resolve, 100));
    
    try {
      await exportToPDF(elementId, title);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="primary"
        size="sm"
        onClick={handleExportPDF}
        disabled={isLoading}
      >
        {isLoading ? <Loader size={16} className="animate-spin" /> : <Printer size={16} />}
        {isLoading ? 'Preparing...' : 'Export PDF'}
      </Button>

      <Modal
        isOpen={isLoading}
        onClose={() => {}} // Disable closing while exporting
        title="Generating Report"
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
            <h3 className="text-xl font-headline font-bold text-on-surface">Please wait a moment</h3>
            <p className="text-sm text-on-surface-variant max-w-[280px]">
              We are compiling your <span className="font-bold text-primary">{title}</span> and preparing it for download.
            </p>
          </div>

          <div className="flex items-center gap-3 px-4 py-2 bg-surface-container rounded-full">
            <Loader size={18} className="text-primary animate-spin" />
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
              Processing Analytics...
            </span>
          </div>
        </div>
      </Modal>
    </>
  );
}
