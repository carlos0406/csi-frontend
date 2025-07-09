'use client';

import { Button } from '@/components/ui/button';
import { getXlsx } from '@/utils/api';
import { useState } from 'react';

interface DownloadXlsxButtonProps {
  purchaseId: string;
  purchaseName: string;
}

export function DownloadXlsxButton({ purchaseId, purchaseName }: DownloadXlsxButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      const response = await getXlsx(purchaseId);

      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${purchaseName}_relatorio.xlsx`;
      document.body.appendChild(link);
      link.click();

      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (error) {
      console.error('Erro ao baixar arquivo:', error);
      alert('Erro ao baixar o arquivo. Tente novamente.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleDownload}
      disabled={isDownloading}
      className="text-xs"
    >
      {isDownloading ? 'Baixando...' : 'Baixar XLSX'}
    </Button>
  );
}
