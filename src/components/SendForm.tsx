import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Upload, Link, Loader2, Copy } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const SendForm = () => {
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [code, setCode] = useState('');

  const handleSend = async () => {
    if (!text && !file) {
      toast.error("Nothing to send");
      return;
    }
    setIsLoading(true);

    let generatedCode = '';
    let isCodeUnique = false;
    try {
      while (!isCodeUnique) {
        generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
        const { data, error } = await supabase
          .from('clips')
          .select('code')
          .eq('code', generatedCode)
          .maybeSingle();

        if (error) throw error;
        if (!data) isCodeUnique = true;
      }

      if (file) {
        const filePath = `${generatedCode}/${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from('clip_files')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { error: dbError } = await supabase.from('clips').insert({
          code: generatedCode,
          content_type: 'file',
          file_name: file.name,
          file_path: filePath,
        });

        if (dbError) throw dbError;
      } else if (text) {
        const { error: dbError } = await supabase.from('clips').insert({
          code: generatedCode,
          content_type: 'text',
          text_content: text,
        });

        if (dbError) throw dbError;
      }

      setCode(generatedCode);
      toast.success("Your code has been generated!");
    } catch (error: any) {
      console.error('Error sending clip:', error);
      toast.error(error.message || 'Failed to send clip. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setText('');
    setFile(null);
    setCode('');
  };

  const copyCodeToClipboard = () => {
    navigator.clipboard.writeText(code);
    toast.success("Code copied to clipboard!");
  };

  if (code) {
    return (
      <Card className="w-full max-w-md animate-fade-in">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Your Code</CardTitle>
          <CardDescription className="text-center">
            Enter this code on your other device to receive your data.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <div className="text-6xl font-bold tracking-widest bg-muted p-4 rounded-lg flex items-center gap-4">
            <span>{code}</span>
            <Button variant="ghost" size="icon" onClick={copyCodeToClipboard}>
              <Copy className="h-8 w-8" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">This code will expire in 24 hours.</p>
          <Button onClick={handleReset} variant="outline">Send another clip</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md animate-fade-in">
      <CardHeader>
        <CardTitle>Send a Clip</CardTitle>
        <CardDescription>
          Paste text or upload a file to transfer it.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Paste your text or link here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="min-h-[120px] resize-none"
          disabled={isLoading}
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
            onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
            disabled={isLoading}
          />
        </div>
        <Button onClick={handleSend} className="w-full" disabled={isLoading || (!text && !file)}>
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Link className="mr-2 h-4 w-4" />
          )}
          Generate Code
        </Button>
      </CardContent>
    </Card>
  );
};

export default SendForm;
