
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, FileUp, Share2, ClipboardCopy, Check } from 'lucide-react';
import { QRCodeSVG as QRCode } from 'qrcode.react';
import AttachedFilePreview from './AttachedFilePreview';

const generateCode = (length = 6) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const QuickShareForm = () => {
  const [textContent, setTextContent] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [sharedClip, setSharedClip] = useState<{ code: string; url: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('File size cannot exceed 5MB.');
        return;
      }
      setFile(selectedFile);
    }
  };

  const clearFile = () => setFile(null);

  const createTemporaryClip = async ({ textContent, file }: { textContent: string; file: File | null }) => {
    const code = generateCode();
    let file_url = null;

    if (file) {
      const filePath = `${Date.now()}_${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('temporary_clips')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from('temporary_clips').getPublicUrl(uploadData.path);
      file_url = urlData.publicUrl;
    }

    const { error: insertError } = await supabase.from('temporary_clips').insert({
      code,
      text_content: textContent || null,
      file_url,
      file_name: file?.name || null,
      content_type: file ? 'file' : 'text',
    });

    if (insertError) throw insertError;

    return { code, url: `${window.location.origin}/share/${code}` };
  };
  
  const mutation = useMutation({
    mutationFn: createTemporaryClip,
    onSuccess: (data) => {
      toast.success('Clip shared successfully!');
      setSharedClip(data);
    },
    onError: (error) => {
      toast.error(`Failed to share clip: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textContent && !file) {
      toast.error('Please enter some text or attach a file to share.');
      return;
    }
    mutation.mutate({ textContent, file });
  };

  const handleCopy = () => {
    if (!sharedClip) return;
    navigator.clipboard.writeText(sharedClip.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (sharedClip) {
    return (
        <Card className="animate-fade-in">
            <CardHeader className="text-center">
                <CardTitle>Share This Clip!</CardTitle>
                <CardDescription>Share this code or link. It will expire in 24 hours.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-6">
                <div className="flex items-center gap-4">
                    <QRCode value={sharedClip.url} size={128} />
                    <div className="text-center">
                        <p className="text-sm text-muted-foreground">Your Code</p>
                        <p className="text-4xl font-bold tracking-widest">{sharedClip.code}</p>
                    </div>
                </div>
                <div className="w-full flex items-center space-x-2">
                    <Input value={sharedClip.url} readOnly />
                    <Button variant="outline" size="icon" onClick={handleCopy}>
                        {copied ? <Check className="h-4 w-4" /> : <ClipboardCopy className="h-4 w-4" />}
                    </Button>
                </div>
                <Button onClick={() => setSharedClip(null)} className="w-full">
                    Share Another Clip
                </Button>
            </CardContent>
        </Card>
    );
  }

  return (
    <Card>
        <CardHeader>
            <CardTitle>Quick Share</CardTitle>
            <CardDescription>Share text or a file instantly. No account needed.</CardDescription>
        </CardHeader>
        <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
                <Textarea
                    placeholder="Paste your text or link here..."
                    value={textContent}
                    onChange={(e) => setTextContent(e.target.value)}
                    rows={4}
                    disabled={mutation.isPending}
                />
                 {file ? (
                    <AttachedFilePreview file={file} onClearFile={clearFile} isPending={mutation.isPending} />
                ) : (
                    <div className="relative">
                        <Button type="button" variant="outline" className="w-full" disabled={mutation.isPending}>
                            <FileUp className="mr-2 h-4 w-4" />
                            Attach a file (max 5MB)
                        </Button>
                        <Input
                            type="file"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            onChange={handleFileChange}
                            disabled={mutation.isPending}
                        />
                    </div>
                )}
                <Button type="submit" className="w-full" disabled={mutation.isPending}>
                    {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    <Share2 className="mr-2 h-4 w-4" />
                    Generate Share Link
                </Button>
            </form>
        </CardContent>
    </Card>
  );
};

export default QuickShareForm;
