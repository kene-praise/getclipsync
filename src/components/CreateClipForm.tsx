import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Upload, Send, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const CreateClipForm = () => {
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const { user } = useAuth();
  const queryClient = useQueryClient();

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
      toast.success("Your clip has been sent!");
      queryClient.invalidateQueries({ queryKey: ['clips', user?.id] });
      setText('');
      setFile(null);
    },
    onError: (error: any) => {
      console.error('Error sending clip:', error);
      toast.error(error.message || 'Failed to send clip. Please try again.');
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
        setFile(null); // Clear file when text is entered
    }
  }

  return (
    <Card className="w-full max-w-md animate-fade-in">
      <CardHeader>
        <CardTitle>Send a Clip</CardTitle>
        <CardDescription>
          Paste text or upload a file to sync it across your devices.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Paste your text or link here..."
          value={text}
          onChange={handleTextChange}
          className="min-h-[120px] resize-none"
          disabled={createClipMutation.isPending}
        />
        <div className="text-center text-muted-foreground my-2">OR</div>
        <div className="relative">
          <label
            htmlFor="file-upload"
            className="flex items-center justify-center w-full h-24 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-secondary transition-colors"
          >
            {file ? (
              <span className="text-foreground">{file.name}</span>
            ) : (
              <div className="flex flex-col items-center justify-center">
                <Upload className="h-8 w-8 text-muted-foreground" />
                <span className="mt-2 text-sm text-muted-foreground">
                  Click to upload a file
                </span>
              </div>
            )}
          </label>
          <Input 
            id="file-upload" 
            type="file" 
            className="sr-only" 
            onChange={handleFileChange}
            disabled={createClipMutation.isPending}
          />
        </div>
        <Button onClick={handleSend} className="w-full" disabled={createClipMutation.isPending || (!text && !file)}>
          {createClipMutation.isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Send Clip
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default CreateClipForm;
