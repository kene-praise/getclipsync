
import { useState, useEffect, useRef } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Paperclip, Zap, Loader2, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const CreateClipForm = () => {
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleWindowFocus = async () => {
      if (!document.hasFocus()) return;

      try {
        const clipboardText = await navigator.clipboard.readText();
        if (clipboardText && clipboardText.trim() !== '') {
          setText(currentText => {
            if (clipboardText.trim() !== currentText.trim()) {
              setFile(null);
              toast.info("Pasted from clipboard.");
              return clipboardText;
            }
            return currentText;
          });
        }
      } catch (error) {
        // Fail silently if clipboard access is denied or not supported.
        console.log('Clipboard read access denied or not available.');
      }
    };

    window.addEventListener('focus', handleWindowFocus);
    // Check on initial load as well
    handleWindowFocus();

    return () => {
      window.removeEventListener('focus', handleWindowFocus);
    };
  }, []);

  const createClipMutation = useMutation({
    mutationFn: async ({ text, file }: { text: string; file: File | null }) => {
      if (!user) throw new Error("You must be logged in to create a clip.");
      if (!text && !file) throw new Error("Nothing to send");

      if (file) {
        // Use a unique name for the file in storage to avoid collisions
        const filePath = `${user.id}/${Date.now()}_${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from('clip_files')
          .upload(filePath, file);
        if (uploadError) throw uploadError;

        const { error: dbError } = await supabase.from('clips').insert({
          content_type: 'file',
          file_name: file.name,
          file_path: filePath,
          user_id: user.id,
        });
        if (dbError) throw dbError;
      } else if (text) {
        const { error: dbError } = await supabase.from('clips').insert({
          content_type: 'text',
          text_content: text,
          user_id: user.id,
        });
        if (dbError) throw dbError;
      }
    },
    onSuccess: () => {
      toast.success("Your clip has been synced!");
      queryClient.invalidateQueries({ queryKey: ['clips', user?.id] });
      setText('');
      handleClearFile();
    },
    onError: (error: any) => {
      console.error('Error syncing clip:', error);
      toast.error(error.message || 'Failed to sync clip. Please try again.');
    }
  });

  const handleSend = () => {
    createClipMutation.mutate({ text, file });
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    if (selectedFile) {
        setFile(selectedFile);
        setText(''); // Clear text when a file is selected
    }
  }
  
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    if (e.target.value) {
        handleClearFile(); // Clear file when text is entered
    }
  }

  const handleClearFile = () => {
    setFile(null);
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  return (
    <Card className="w-full max-w-md animate-fade-in">
      <CardHeader>
        <CardTitle>Sync a Clip</CardTitle>
        <CardDescription>
          Paste text or upload a file to sync it across your devices.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="relative">
            <Textarea
              placeholder="Paste your text or link here..."
              value={text}
              onChange={handleTextChange}
              className="min-h-[120px] resize-none pb-16"
              disabled={createClipMutation.isPending}
            />
            <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center">
              <div>
                <Input
                  id="file-upload"
                  type="file"
                  className="sr-only"
                  onChange={handleFileChange}
                  disabled={createClipMutation.isPending}
                  ref={fileInputRef}
                />
                <Button asChild variant="ghost" size="sm" disabled={createClipMutation.isPending}>
                    <label htmlFor="file-upload" className="cursor-pointer flex items-center gap-2 text-muted-foreground hover:text-foreground">
                        <Paperclip className="h-4 w-4" />
                        <span className="text-xs font-medium">Attach a file</span>
                    </label>
                </Button>
              </div>

              <Button onClick={handleSend} disabled={createClipMutation.isPending || (!text && !file)} size="sm">
                {createClipMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Zap className="mr-2 h-4 w-4" />
                )}
                Sync Clip
              </Button>
            </div>
          </div>

          {file && (
              <div className="flex items-center justify-between text-sm rounded-md border p-2 bg-muted/50">
                  <div className="flex items-center gap-2 truncate">
                      <Paperclip className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate text-muted-foreground">{file.name}</span>
                  </div>
                  <Button variant="ghost" size="icon" onClick={handleClearFile} className="h-6 w-6" disabled={createClipMutation.isPending}>
                      <X className="h-4 w-4" />
                      <span className="sr-only">Remove file</span>
                  </Button>
              </div>
          )}

        </div>
      </CardContent>
    </Card>
  );
};

export default CreateClipForm;
