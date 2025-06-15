
import React from 'react';
import { ImageIcon, FileText } from 'lucide-react';

interface SharedFilePreviewProps {
  fileUrl: string;
  isImage: boolean;
  fileName?: string | null;
}

const SharedFilePreview: React.FC<SharedFilePreviewProps> = ({ fileUrl, isImage, fileName }) => {
  if (isImage) {
    return (
      <div className="flex justify-center">
        <img src={fileUrl} alt={fileName || 'Image preview'} className="max-h-96 rounded-lg object-contain" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-lg border p-8">
      <FileText className="h-16 w-16 text-muted-foreground" />
      <p className="text-muted-foreground">This is not an image file.</p>
      {fileName && <p className="text-sm font-medium">{fileName}</p>}
    </div>
  );
};

export default SharedFilePreview;
