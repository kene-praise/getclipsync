
import React from 'react';
import { ImageIcon, FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SharedFilePreviewProps {
  fileUrl: string;
  isImage: boolean;
  fileName?: string | null;
  onDownload?: () => void;
}

const SharedFilePreview: React.FC<SharedFilePreviewProps> = ({ fileUrl, isImage, fileName, onDownload }) => {
  if (isImage) {
    return (
      <div className="space-y-2">
        <div className="flex justify-center">
          <img src={fileUrl} alt={fileName || 'Image preview'} className="max-h-96 rounded-lg object-contain" />
        </div>
        {onDownload && fileName && (
          <div className="flex justify-center">
            <Button variant="outline" size="sm" onClick={onDownload}>
              <Download className="h-4 w-4" />
              <span className="ml-2">Download</span>
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-col items-center justify-center gap-4 rounded-lg border p-8">
        <FileText className="h-16 w-16 text-muted-foreground" />
        <p className="text-muted-foreground">This is not an image file.</p>
        {fileName && <p className="text-sm font-medium">{fileName}</p>}
      </div>
      {onDownload && fileName && (
        <div className="flex justify-center">
          <Button variant="outline" size="sm" onClick={onDownload}>
            <Download className="h-4 w-4" />
            <span className="ml-2">Download</span>
          </Button>
        </div>
      )}
    </div>
  );
};

export default SharedFilePreview;
