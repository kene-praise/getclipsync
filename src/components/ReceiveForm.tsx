
import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Loader2, Download, Clipboard, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type ReceivedDataType = {
  type: 'text' | 'file';
  content: string;
  fileName?: string;
}

type ReceiveFormProps = {
  initialCode?: string | null;
};

const ReceiveForm = ({ initialCode }: ReceiveFormProps) => {
  const [code, setCode] = useState(initialCode || '');
  const [isLoading, setIsLoading] = useState(!!initialCode);
  const [receivedData, setReceivedData] = useState<ReceivedDataType | null>(null);
  const [error, setError] = useState('');

  const fetchClip = useCallback(async (clipCode: string) => {
    if (clipCode.length < 6) {
      setError('Please enter a 6-digit code.');
      setIsLoading(false);
      return;
    }
    setError('');
    setIsLoading(true);

    try {
      const { data: clip, error: fetchError } = await supabase
        .from('clips')
        .select('*')
        .eq('code', clipCode)
        .single();

      if (fetchError || !clip) {
        throw new Error('Invalid or expired code. Please try again.');
      }
      
      if (new Date(clip.expires_at) < new Date()) {
        setError('This code has expired.');
        toast.error('This code has expired.');

        // Cleanup expired file from storage
        if (clip.file_path) {
          await supabase.storage.from('clip_files').remove([clip.file_path]);
        }
        await supabase.from('clips').delete().eq('id', clip.id);
        setIsLoading(false);
        return;
      }

      if (clip.content_type === 'text' && clip.text_content) {
        setReceivedData({ type: 'text', content: clip.text_content });
      } else if (clip.content_type === 'file' && clip.file_path) {
        const { data: fileData } = supabase.storage
          .from('clip_files')
          .getPublicUrl(clip.file_path);

        if (!fileData) {
          throw new Error('Could not retrieve file. It may have been deleted.');
        }
        
        setReceivedData({
          type: 'file',
          content: fileData.publicUrl,
          fileName: clip.file_name || 'download',
        });
      } else {
        throw new Error('Clip data is corrupted or incomplete.');
      }
      toast.success('Clip received successfully!');

      // Self-destruct after read for privacy
      try {
        if (clip.file_path) {
          await supabase.storage.from('clip_files').remove([clip.file_path]);
        }
        await supabase.from('clips').delete().eq('id', clip.id);
      } catch (e: any) {
        console.error("Failed to cleanup clip after retrieval", e.message);
        // Do not bother user with this error. They got their data.
      }

    } catch (error: any) {
      setError(error.message);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initialCode) {
      fetchClip(initialCode);
    }
  }, [initialCode, fetchClip]);

  useEffect(() => {
    if (code.length === 6 && !isLoading && !receivedData) {
      fetchClip(code);
    }
  }, [code, fetchClip, isLoading, receivedData]);
  
  const handleReset = () => {
    setCode('');
    setReceivedData(null);
    setError('');
    if (initialCode) {
      window.history.pushState({}, '', '/');
    }
  };

  const copyToClipboard = () => {
    if(receivedData?.type === 'text') {
      navigator.clipboard.writeText(receivedData.content);
      toast.success("Text copied to clipboard!");
    }
  }

  if (receivedData) {
    return (
      <Card className="w-full max-w-md animate-fade-in">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Clip Received!</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <div className="p-4 bg-muted rounded-lg w-full">
            {receivedData.type === 'text' ? (
              <>
                <FileText className="h-12 w-12 mx-auto text-primary"/>
                <p className="mt-4 text-center break-words">{receivedData.content}</p>
                <Button className="w-full mt-4" onClick={copyToClipboard}>
                  <Clipboard className="mr-2 h-4 w-4" /> Copy to Clipboard
                </Button>
              </>
            ) : (
              <>
                <Download className="h-12 w-12 mx-auto text-primary"/>
                <p className="mt-4 text-center break-words">{receivedData.fileName}</p>
                 <a href={receivedData.content} download={receivedData.fileName} className="w-full">
                  <Button className="w-full mt-4">
                    <Download className="mr-2 h-4 w-4" /> Download File
                  </Button>
                </a>
              </>
            )}
          </div>
          <Button onClick={handleReset} variant="outline">Receive another clip</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md animate-fade-in">
      <CardHeader>
        <CardTitle>Receive a Clip</CardTitle>
        <CardDescription>
          {isLoading
            ? 'Verifying code and fetching your clip...'
            : 'Enter the 6-digit code from your other device.'}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        <InputOTP maxLength={6} value={code} onChange={(value) => setCode(value)}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button onClick={() => fetchClip(code)} className="w-full" disabled={isLoading || code.length < 6}>
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <>Receive Clip</>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ReceiveForm;
