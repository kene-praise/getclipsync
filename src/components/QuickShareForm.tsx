import { useState, useEffect } from 'react';
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
  const [files, setFiles] = useState<File[]>([]);
  const [sharedClip, setSharedClip] = useState<{
    code: string;
    url: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    const pasteFromClipboard = async () => {
      // Only paste if there's no text and no files, and the window is focused.
      if (document.hasFocus() && textContent.trim() === '' && files.length === 0) {
        try {
          const text = await navigator.clipboard.readText();
          if (text && text.trim() !== '') {
            setTextContent(text);
            toast.info("Pasted from clipboard");
          }
        } catch (err) {
          // Fail silently if clipboard permission is not granted.
          console.info("Could not read from clipboard on load/focus.", err);
        }
      }
    };

    // Run on initial mount
    pasteFromClipboard();
    // And on window focus
    window.addEventListener('focus', pasteFromClipboard);
    return () => {
      window.removeEventListener('focus', pasteFromClipboard);
    };
  }, [textContent, files]); // Dependencies ensure the handler has fresh state

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files ? Array.from(e.target.files) : [];

    // Validate file sizes (25MB limit)
    const maxSize = 25 * 1024 * 1024; // 25MB in bytes
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

      // Reset the input so the same files can be selected again if needed
      e.target.value = '';
    }
  };
  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };
  const createTemporaryClip = async ({
    textContent,
    files
  }: {
    textContent: string;
    files: File[];
  }) => {
    const code = generateCode();
    let file_url = null;

    // For now, handle only the first file (similar to CreateClipForm)
    const file = files.length > 0 ? files[0] : null;
    if (file) {
      const filePath = `${Date.now()}_${file.name}`;
      const {
        data: uploadData,
        error: uploadError
      } = await supabase.storage.from('temporary_clips').upload(filePath, file);
      if (uploadError) throw uploadError;
      const {
        data: urlData
      } = supabase.storage.from('temporary_clips').getPublicUrl(uploadData.path);
      file_url = urlData.publicUrl;
    }
    const {
      error: insertError
    } = await supabase.from('temporary_clips').insert({
      code,
      text_content: textContent || null,
      file_url,
      file_name: file?.name || null,
      content_type: file ? 'file' : 'text'
    });
    if (insertError) throw insertError;
    return {
      code,
      url: `${window.location.origin}/share/${code}`
    };
  };
  const mutation = useMutation({
    mutationFn: createTemporaryClip,
    onSuccess: data => {
      toast.success('Clip shared successfully!');
      setSharedClip(data);
    },
    onError: error => {
      toast.error(`Failed to share clip: ${error.message}`);
    }
  });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textContent && files.length === 0) {
      toast.error('Please enter some text or attach files to share.');
      return;
    }
    mutation.mutate({
      textContent,
      files
    });
  };
  const handleCopy = () => {
    if (!sharedClip) return;
    navigator.clipboard.writeText(sharedClip.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  if (sharedClip) {
    return <Card className="animate-fade-in">
            <CardHeader className="text-center">
                <CardTitle>Share This Clip!</CardTitle>
                <CardDescription>Share this code or link. It will expire in 1 hour.</CardDescription>
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
                    <Input value={sharedClip.url} readOnly className="border-white/20 bg-background/20" />
                    <Button variant="outline" size="icon" onClick={handleCopy} className="border-white/20 bg-background/20">
                        {copied ? <Check className="h-4 w-4" /> : <ClipboardCopy className="h-4 w-4" />}
                    </Button>
                </div>
                <Button onClick={() => {
          setSharedClip(null);
          setTextContent('');
          setFiles([]);
        }} className="w-full">
                    Share Another Clip
                </Button>
            </CardContent>
        </Card>;
  }
  return <Card>
        <CardHeader>
            <CardTitle className="text-xl">Try Quick Share Now</CardTitle>
            <CardDescription>Share text or files instantly. No account needed.</CardDescription>
        </CardHeader>
        <CardContent className="bg-transparent">
            <form onSubmit={handleSubmit} className="space-y-4">
                <Textarea placeholder="Paste your text or link here..." value={textContent} onChange={e => setTextContent(e.target.value)} rows={4} disabled={mutation.isPending} className="border-white/20 bg-background/20 placeholder:text-muted-foreground/80" />
                
                {files.length > 0 && <div className="space-y-2">
                    {files.map((file, index) => <AttachedFilePreview key={`${file.name}-${index}-${file.lastModified}`} file={file} onClearFile={() => removeFile(index)} isPending={mutation.isPending} />)}
                  </div>}

                <div className="relative">
                  <Button type="button" variant="outline" className="w-full border-white/20 bg-background/20" disabled={mutation.isPending}>
                    <FileUp className="mr-2 h-4 w-4" />
                    Add files (max 25MB each)
                  </Button>
                  <Input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleFileChange} disabled={mutation.isPending} multiple accept="*/*" />
                </div>

                <Button type="submit" className="w-full" disabled={mutation.isPending}>
                    {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    <Share2 className="mr-2 h-4 w-4" />
                    Generate Share Link
                </Button>
            </form>
        </CardContent>
    </Card>;
};
export default QuickShareForm;