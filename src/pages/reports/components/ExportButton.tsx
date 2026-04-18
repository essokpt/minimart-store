import { useState } from 'react';
import { Printer, Loader } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { useReportExport } from '../hooks/useReportExport';

interface ExportButtonProps {
  elementId: string;
}

export function ExportButton({ elementId }: ExportButtonProps) {
  const { exportToPDF } = useReportExport();
  const [isLoading, setIsLoading] = useState(false);

  const handleExportPDF = async () => {
    setIsLoading(true);
    try {
      await exportToPDF(elementId);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="primary"
      size="sm"
      onClick={handleExportPDF}
      disabled={isLoading}
    >
      {isLoading ? <Loader size={16} className="animate-spin" /> : <Printer size={16} />}
      {isLoading ? 'Preparing...' : 'Export PDF'}
    </Button>
  );
}
