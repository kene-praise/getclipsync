
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, AlertTriangle, FileText, Download, Copy } from 'lucide-react';
import SiteHeader from '@/components/SiteHeader';
import Footer from '@/components/Footer';
import { toast } from 'sonner';

const fetchTemporaryClip = async (code: string) => {
    const { data, error } = await supabase
        .from('temporary_clips')
        .select('*')
        .eq('code', code.toUpperCase())
        .maybeSingle();

    if (error) throw new Error(error.message);
    return data;
};

const SharePage = () => {
    const { code } = useParams<{ code: string }>();

    const { data: clip, isLoading, isError, error } = useQuery({
        queryKey: ['temporary_clip', code],
        queryFn: () => fetchTemporaryClip(code!),
        enabled: !!code,
    });

    const handleCopyText = () => {
        if (clip?.text_content) {
            navigator.clipboard.writeText(clip.text_content)
                .then(() => {
                    toast.success("Text copied to clipboard!");
                })
                .catch(err => {
                    console.error('Failed to copy text: ', err);
                    toast.error("Failed to copy text.");
                });
        }
    };

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex flex-col items-center justify-center gap-4 text-muted-foreground py-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                    <p>Loading clip...</p>
                </div>
            );
        }

        if (isError) {
            return (
                <div className="flex flex-col items-center justify-center gap-4 text-destructive py-8">
                    <AlertTriangle className="h-8 w-8" />
                    <p>Error loading clip: {error.message}</p>
                </div>
            );
        }

        if (!clip) {
            return (
                <div className="flex flex-col items-center justify-center gap-4 text-muted-foreground py-8">
                    <AlertTriangle className="h-8 w-8" />
                    <p>Clip not found or has expired.</p>
                    <Button asChild>
                        <Link to="/">Share a new clip</Link>
                    </Button>
                </div>
            );
        }
        
        return (
            <div className="space-y-4 w-full">
                {clip.text_content && (
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold">Text Content</h3>
                            <Button variant="ghost" size="sm" onClick={handleCopyText}>
                                <Copy className="mr-2 h-4 w-4" />
                                Copy
                            </Button>
                        </div>
                        <pre className="p-4 bg-muted rounded-md text-sm whitespace-pre-wrap font-sans">{clip.text_content}</pre>
                    </div>
                )}
                {clip.file_url && (
                    <div className="space-y-2">
                        <h3 className="font-semibold">Attached File</h3>
                        <div className="flex items-center justify-between rounded-md border p-3">
                            <div className="flex items-center gap-2 truncate">
                                <FileText className="h-5 w-5 flex-shrink-0" />
                                <span className="truncate">{clip.file_name || 'Attached File'}</span>
                            </div>
                            <Button asChild>
                                <a href={clip.file_url} target="_blank" rel="noopener noreferrer" download={clip.file_name || true}>
                                    <Download className="mr-2 h-4 w-4" />
                                    Download
                                </a>
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        )
    };
    
    return (
        <div className="flex flex-col min-h-screen">
            <SiteHeader />
            <main className="flex-1 flex items-center justify-center container mx-auto px-4 py-8">
                <Card className="w-full max-w-2xl animate-fade-in">
                    <CardHeader>
                        <CardTitle>Shared Clip</CardTitle>
                        <CardDescription>This clip was shared via ClipSync. It expires 1 hour after creation.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {renderContent()}
                    </CardContent>
                </Card>
            </main>
            <Footer />
        </div>
    );
};

export default SharePage;
