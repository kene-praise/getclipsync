
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
  const [file, setFile] = useState<File | null>(null);
  const [autoSyncOnFocus, setAutoSyncOnFocus] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const createClipMutation = useCreateClip();

  useClipboardAutoSync({
    createClipMutation,
    autoSyncOnFocus,
    text,
    file,
  });

  const handleSend = () => {
    createClipMutation.mutate({ text, file }, {
        onSuccess: () => {
          toast.success("Your clip has been synced!");
          setText('');
          handleClearFile();
        },
    });
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    if (selectedFile) {
        setFile(selectedFile);
        setText('');
    }
  }
  
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    if (e.target.value) {
        handleClearFile();
    }
  }

  const handleClearFile = () => {
    setFile(null);
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full max-w-lg animate-fade-in space-y-4">
      <div className="text-center">
        <h2 className="text-2xl font-semibold tracking-tight">Sync your clipboard</h2>
        <p className="text-sm text-muted-foreground">
          Paste text or upload a file to sync it across your devices.
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
            hasContent={!!text || !!file}
            fileInputRef={fileInputRef}
          />
        </div>

        {file && (
          <AttachedFilePreview
            file={file}
            onClearFile={handleClearFile}
            isPending={createClipMutation.isPending}
          />
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
