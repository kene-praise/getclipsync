import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import SiteHeader from '@/components/SiteHeader';
import Footer from '@/components/Footer';
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
} from 'lucide-react';
import { toast as sonnerToast } from 'sonner';
import { useState } from 'react';
import SharedFilePreview from '@/components/SharedFilePreview';
import { useAuth } from '@/contexts/AuthContext';

const fetchClip = async (code: string) => {
  const { data, error } = await supabase
    .from('temporary_clips')
    .select('*')
    .eq('code', code)
    .single();

  if (error) {
    console.error('Error fetching clip:', error);
    throw new Error('Failed to fetch clip');
  }

  return data;
};

const SharePage = () => {
  const { code } = useParams<{ code: string }>();
  const [copied, setCopied] = useState(false);
  const { user } = useAuth();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['sharedClip', code],
    queryFn: () => fetchClip(code!),
    enabled: !!code,
    staleTime: 60 * 1000, // 1 minute
  });

  const handleCopyText = () => {
    if (data?.content_type === 'text') {
      navigator.clipboard.writeText(data.text_content || '');
      setCopied(true);
      sonnerToast.success('Text copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const renderContent = () => {
    if (data?.content_type === 'text') {
      return <p className="break-words">{data.text_content}</p>;
    }

    if (data?.content_type === 'file' && data?.file_url) {
      const fileExtension = data.file_name?.split('.').pop() || '';
      const isImage = ['jpg', 'jpeg', 'png', 'gif'].includes(
        fileExtension.toLowerCase()
      );

      return (
        <SharedFilePreview fileUrl={data.file_url} isImage={isImage} fileName={data.file_name} />
      );
    }

    return <p>No content to display.</p>;
  };

  return (
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
                <CardContent>{renderContent()}</CardContent>
                <CardFooter className="flex justify-end gap-2">
                  {data.content_type === 'text' && (
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
                  {data.content_type === 'file' && data.file_url && (
                    <Button variant="outline" size="sm" asChild>
                      <a
                        href={data.file_url}
                        download={data.file_name || 'download'}
                      >
                        <Download className="h-4 w-4" />
                        <span className="ml-2">Download File</span>
                      </a>
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
  );
};

export default SharePage;
