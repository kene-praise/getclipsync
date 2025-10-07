import { useParams, Link } from 'react-router-dom';
import SiteHeader from '@/components/SiteHeader';
import Footer from '@/components/Footer';
import { Helmet } from 'react-helmet-async';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Copy,
  FileText,
  Check,
  Download,
  Image as ImageIcon,
  ArrowLeft,
  File,
} from 'lucide-react';
import { toast as sonnerToast } from 'sonner';
import { useState } from 'react';
import SharedFilePreview from '@/components/SharedFilePreview';
import { useAuth } from '@/contexts/AuthContext';
import { useTemporaryClip, type TemporaryClip } from '@/hooks/useTemporaryClip';
import { downloadAllAsZip } from '@/lib/download-all';

const SharePage = () => {
  const { code } = useParams<{ code: string }>();
  const [copied, setCopied] = useState(false);
  const { user } = useAuth();

  const { data, isLoading, isError } = useTemporaryClip(code || '');

  const handleCopyText = () => {
    if ((data?.content_type === 'text' || data?.content_type === 'mixed') && data?.text_content) {
      navigator.clipboard.writeText(data.text_content);
      setCopied(true);
      sonnerToast.success('Text copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadAll = async () => {
    if (!data?.files || data.files.length === 0) {
      sonnerToast.error('No files to download');
      return;
    }

    const filesToDownload = data.files.map(file => ({
      url: file.file_url,
      name: file.file_name
    }));

    await downloadAllAsZip(filesToDownload, `shared-${code}.zip`);
  };

  const renderContent = (data: TemporaryClip) => {
    if (data.content_type === 'text' && data.text_content) {
      return <p className="break-words">{data.text_content}</p>;
    }

    if (data.content_type === 'file' && data.files && data.files.length > 0) {
      return (
        <div className="space-y-4">
          {data.files.map((file) => {
            const fileExtension = file.file_name.split('.').pop() || '';
            const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(
              fileExtension.toLowerCase()
            );
            return (
              <SharedFilePreview 
                key={file.id}
                fileUrl={file.file_url} 
                isImage={isImage} 
                fileName={file.file_name}
                onDownload={() => {
                  const link = document.createElement('a');
                  link.href = `${file.file_url}?download=${encodeURIComponent(file.file_name)}`;
                  link.download = file.file_name;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
              />
            );
          })}
        </div>
      );
    }

    if (data.content_type === 'mixed') {
      return (
        <div className="space-y-4">
          {data.text_content && (
            <div>
              <h4 className="font-medium mb-2">Text Content:</h4>
              <p className="break-words">{data.text_content}</p>
            </div>
          )}
          {data.files && data.files.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Files ({data.files.length}):</h4>
              <div className="space-y-2">
                {data.files.map((file) => {
                  const fileExtension = file.file_name.split('.').pop() || '';
                  const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(
                    fileExtension.toLowerCase()
                  );
                  return (
                    <SharedFilePreview 
                      key={file.id}
                      fileUrl={file.file_url} 
                      isImage={isImage} 
                      fileName={file.file_name}
                      onDownload={() => {
                        const link = document.createElement('a');
                        link.href = `${file.file_url}?download=${encodeURIComponent(file.file_name)}`;
                        link.download = file.file_name;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      }}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </div>
      );
    }

    return <p>No content to display.</p>;
  };

  return (
    <>
      <Helmet>
        <title>Shared Clip | ClipSync - View Shared Content</title>
        <meta name="description" content="View shared content via ClipSync. Quick shares expire after 1 hour for your privacy and security." />
        <link rel="canonical" href={`https://clipsync.app/share/${code}`} />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
      <main className="flex-1">
        <div className="container flex h-full items-center justify-center py-8">
          {isLoading ? (
            <Skeleton className="h-[200px] w-full max-w-2xl" />
          ) : isError || !data ? (
            <Card className="w-full max-w-2xl">
              <CardHeader>
                <CardTitle>Clip Not Found</CardTitle>
                <CardDescription>
                  This clip may have expired or never existed.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Quick shares expire after 1 hour. For longer retention, sign
                  up for a free account.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="w-full max-w-2xl space-y-4">
              <Card className="w-full max-w-2xl animate-fade-in">
                <CardHeader>
                  <CardTitle>Shared Clip</CardTitle>
                  <CardDescription>
                    This clip was shared via ClipSync. It expires 1 hour after
                    creation.
                  </CardDescription>
                </CardHeader>
                <CardContent>{renderContent(data)}</CardContent>
                <CardFooter className="flex justify-end gap-2">
                  {(data.content_type === 'text' || data.content_type === 'mixed') && data.text_content && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopyText}
                    >
                      {copied ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                      <span className="ml-2">
                        {copied ? 'Copied!' : 'Copy Text'}
                      </span>
                    </Button>
                  )}
                  {data.files && data.files.length > 1 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDownloadAll}
                    >
                      <Download className="h-4 w-4" />
                      <span className="ml-2">Download All</span>
                    </Button>
                  )}
                </CardFooter>
              </Card>

              {user && (
                <Button asChild variant="outline">
                  <Link to="/app" className="flex items-center">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to App
                  </Link>
                </Button>
              )}
            </div>
          )}
        </div>
      </main>
        <Footer />
      </div>
    </>
  );
};

export default SharePage;
