
import { useState, useRef } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

import { useCreateClip } from '@/hooks/useCreateClip';
import { useClipboardAutoSync } from '@/hooks/useClipboardAutoSync';
import ClipFormActions from './ClipFormActions';
import AttachedFilePreview from './AttachedFilePreview';
import AutoSyncToggle from './AutoSyncToggle';

const CreateClipForm = () => {
  const [text, setText] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [autoSyncOnFocus, setAutoSyncOnFocus] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const createClipMutation = useCreateClip();

  useClipboardAutoSync({
    createClipMutation,
    autoSyncOnFocus,
    text,
    file: files.length > 0 ? files[0] : null,
  });

  const handleSend = () => {
    // Validate file count (max 10 files)
    if (files.length > 10) {
      toast.error("Maximum 10 files allowed per clip");
      return;
    }
    
    createClipMutation.mutate({ text, files }, {
        onSuccess: () => {
          toast.success("Your clip has been synced!");
          setText('');
          handleClearFiles();
        },
    });
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files ? Array.from(e.target.files) : [];
    
    // Validate file sizes (25MB limit) and total count (10 files max)
    const maxSize = 25 * 1024 * 1024; // 25MB in bytes
    const currentFileCount = files.length;
    
    if (currentFileCount + selectedFiles.length > 10) {
      toast.error(`Maximum 10 files allowed. You can add ${10 - currentFileCount} more files.`);
      return;
    }
    
    const validFiles = selectedFiles.filter(file => {
      if (file.size > maxSize) {
        toast.error(`File "${file.name}" exceeds 25MB limit`);
        return false;
      }
      return true;
    });
    
    if (validFiles.length > 0) {
        // Add to existing files instead of replacing
        setFiles(prevFiles => [...prevFiles, ...validFiles]);
        setText('');
        
        // Reset the input so the same files can be selected again if needed
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
    }
  }
  
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    if (e.target.value) {
        handleClearFiles();
    }
  }

  const handleClearFiles = () => {
    setFiles([]);
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
    // Reset file input when removing files
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full max-w-lg animate-fade-in space-y-4">
      <div className="text-center">
        <h2 className="text-2xl font-semibold tracking-tight">Sync your clipboard</h2>
        <p className="text-sm text-muted-foreground">
          Paste text or upload files to sync them across your devices.
        </p>
      </div>
      <div className="space-y-4">
        <div className="overflow-hidden rounded-md border border-input bg-transparent focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background">
          <Textarea
            placeholder="Paste your text or link here..."
            value={text}
            onChange={handleTextChange}
            className="min-h-[120px] w-full resize-none border-0 bg-transparent p-3 shadow-none focus-visible:ring-0"
            disabled={createClipMutation.isPending}
          />
          <ClipFormActions
            onSend={handleSend}
            onFileChange={handleFileChange}
            isPending={createClipMutation.isPending}
            hasContent={!!text || files.length > 0}
            fileInputRef={fileInputRef}
            multiple={true}
          />
        </div>

        {files.length > 0 && (
          <div className="space-y-2">
            {files.map((file, index) => (
              <AttachedFilePreview
                key={`${file.name}-${index}-${file.lastModified}`}
                file={file}
                onClearFile={() => removeFile(index)}
                isPending={createClipMutation.isPending}
              />
            ))}
          </div>
        )}

        <AutoSyncToggle 
          autoSyncOnFocus={autoSyncOnFocus}
          onCheckedChange={setAutoSyncOnFocus}
        />
      </div>
    </div>
  );
};

export default CreateClipForm;
