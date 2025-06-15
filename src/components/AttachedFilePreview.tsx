
import React from 'react';
import { Button } from '@/components/ui/button';
import { Paperclip, X } from 'lucide-react';

interface AttachedFilePreviewProps {
  file: File;
  onClearFile: () => void;
  isPending: boolean;
}

const AttachedFilePreview: React.FC<AttachedFilePreviewProps> = ({ file, onClearFile, isPending }) => {
  return (
    <div className="flex items-center justify-between text-sm rounded-md border p-2 bg-muted/50">
      <div className="flex items-center gap-2 truncate">
        <Paperclip className="h-4 w-4 flex-shrink-0" />
        <span className="truncate text-muted-foreground">{file.name}</span>
      </div>
      <Button variant="ghost" size="icon" onClick={onClearFile} className="h-6 w-6" disabled={isPending}>
        <X className="h-4 w-4" />
        <span className="sr-only">Remove file</span>
      </Button>
    </div>
  );
};

export default AttachedFilePreview;
