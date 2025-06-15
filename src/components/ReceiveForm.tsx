
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Loader2, Download, Clipboard, FileText } from 'lucide-react';

type ReceivedDataType = {
  type: 'text' | 'file';
  content: string;
  fileName?: string;
}

const ReceiveForm = () => {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [receivedData, setReceivedData] = useState<ReceivedDataType | null>(null);
  const [error, setError] = useState('');

  const handleReceive = async () => {
    if (code.length < 6) {
      setError('Please enter a 6-digit code.');
      return;
    }
    setError('');
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500)); 
    if (code === '123456') {
      setReceivedData({ type: 'text', content: 'This is a test message from another device!' });
    } else if (code === '789012') {
      setReceivedData({ type: 'file', content: 'data:text/plain;base64,SGVsbG8sIFdvcmxkIQ==', fileName: 'example_document.pdf' });
    } else {
      setError('Invalid code. Please try again.');
    }
    setIsLoading(false);
  };
  
  const handleReset = () => {
    setCode('');
    setReceivedData(null);
    setError('');
  };

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
                <Button className="w-full mt-4" onClick={() => navigator.clipboard.writeText(receivedData.content)}>
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
          Enter the 6-digit code from your other device.
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
        <Button onClick={handleReceive} className="w-full" disabled={isLoading || code.length < 6}>
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
