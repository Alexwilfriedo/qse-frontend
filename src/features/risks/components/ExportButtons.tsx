import { Button } from '@/components/ui';
import { FileSpreadsheet, FileText, Loader2 } from 'lucide-react';
import { useState } from 'react';

interface ExportButtonsProps {
  onExportPdf: () => Promise<unknown>;
  onExportExcel: () => Promise<unknown>;
  pdfFilename: string;
  excelFilename: string;
}

/**
 * Boutons d'export PDF et Excel pour les rapports risques.
 * Gère le téléchargement blob et l'état de chargement.
 */
export default function ExportButtons({
  onExportPdf,
  onExportExcel,
  pdfFilename,
  excelFilename,
}: ExportButtonsProps) {
  const [loadingPdf, setLoadingPdf] = useState(false);
  const [loadingExcel, setLoadingExcel] = useState(false);

  const download = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handlePdf = async () => {
    setLoadingPdf(true);
    try {
      const blob = (await onExportPdf()) as Blob;
      download(blob, pdfFilename);
    } finally {
      setLoadingPdf(false);
    }
  };

  const handleExcel = async () => {
    setLoadingExcel(true);
    try {
      const blob = (await onExportExcel()) as Blob;
      download(blob, excelFilename);
    } finally {
      setLoadingExcel(false);
    }
  };

  return (
    <div className='flex items-center gap-2'>
      <Button
        variant='secondary'
        size='sm'
        onClick={handlePdf}
        disabled={loadingPdf}>
        {loadingPdf ? (
          <Loader2 className='mr-1.5 h-4 w-4 animate-spin' />
        ) : (
          <FileText className='mr-1.5 h-4 w-4 text-red-500' />
        )}
        PDF
      </Button>
      <Button
        variant='secondary'
        size='sm'
        onClick={handleExcel}
        disabled={loadingExcel}>
        {loadingExcel ? (
          <Loader2 className='mr-1.5 h-4 w-4 animate-spin' />
        ) : (
          <FileSpreadsheet className='mr-1.5 h-4 w-4 text-green-600' />
        )}
        Excel
      </Button>
    </div>
  );
}
