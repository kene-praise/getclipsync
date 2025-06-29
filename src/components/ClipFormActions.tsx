
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Paperclip, Zap, Loader2 } from 'lucide-react';

interface ClipFormActionsProps {
  onSend: () => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isPending: boolean;
  hasContent: boolean;
  fileInputRef: React.RefObject<HTMLInputElement>;
  multiple?: boolean;
}

const ClipFormActions: React.FC<ClipFormActionsProps> = ({ 
  onSend, 
  onFileChange, 
  isPending, 
  hasContent, 
  fileInputRef,
  multiple = false 
}) => {
  return (
    <div className="flex items-center justify-between border-t border-input bg-muted/30 p-2 px-3">
      <div>
        <Input
          id="file-upload"
          type="file"
          className="sr-only"
          onChange={onFileChange}
          disabled={isPending}
          ref={fileInputRef}
          multiple={multiple}
          accept="*/*"
        />
        <Button asChild variant="ghost" size="sm" disabled={isPending}>
          <label htmlFor="file-upload" className="cursor-pointer flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <Paperclip className="h-4 w-4" />
            <span className="text-sm font-medium">
              {multiple ? 'Add files (max 25MB each)' : 'Attach file (max 25MB)'}
            </span>
          </label>
        </Button>
      </div>

      <Button onClick={onSend} disabled={isPending || !hasContent} size="sm">
        {isPending ? (
          <Loader2 className="animate-spin" />
        ) : (
          <Zap />
        )}
        Start sync
      </Button>
    </div>
  );
};

export default ClipFormActions;
