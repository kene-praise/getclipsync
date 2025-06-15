import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Trash2, FileText, Download, Clipboard } from 'lucide-react';
import { toast } from 'sonner';

const ClipList = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: clips, isLoading } = useQuery({
    queryKey: ['clips', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('clips')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!user,
  });

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel(`realtime-clips:${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'clips',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log('Realtime event:', payload);
          if (payload.eventType === 'INSERT') {
            toast.info("New clip received!");
          } else if (payload.eventType === 'DELETE') {
            toast.info("A clip was deleted on another device.");
          }
          queryClient.invalidateQueries({ queryKey: ['clips', user.id] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, queryClient]);

  const deleteMutation = useMutation({
    mutationFn: async (clipId: string) => {
      // First, delete the associated file from storage if it exists
      const clipToDelete = clips?.find(c => c.id === clipId);
      if (clipToDelete?.file_path) {
        const { error: storageError } = await supabase.storage.from('clip_files').remove([clipToDelete.file_path]);
        if (storageError) {
          // Log error but proceed to delete DB record, as it's the source of truth
          console.error('Failed to delete file from storage:', storageError.message);
        }
      }

      // Then, delete the clip record from the database
      const { error: dbError } = await supabase.from('clips').delete().eq('id', clipId);
      if (dbError) throw new Error(dbError.message);
    },
    onSuccess: () => {
      toast.success('Clip deleted!');
      queryClient.invalidateQueries({ queryKey: ['clips', user?.id] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete clip: ${error.message}`);
    },
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Text copied to clipboard!");
  }

  const handleDownload = async (filePath: string, fileName: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('clip_files')
        .createSignedUrl(filePath, 60); // The link will be valid for 60 seconds

      if (error) throw error;

      // This creates a temporary link and clicks it to trigger the download
      const link = document.createElement('a');
      link.href = data.signedUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Your download has started!");

    } catch (error: any) {
      console.error('Error downloading file:', error);
      toast.error(error.message || 'Failed to download file.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!clips || clips.length === 0) {
    return (
      <Card className="mt-6 animate-fade-in">
        <CardHeader>
          <CardTitle className="text-center">No clips yet!</CardTitle>
          <CardDescription className="text-center">
            Use the form above to send your first clip to your devices.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="mt-6 space-y-4 animate-fade-in">
      {clips.map((clip) => (
        <Card key={clip.id}>
          <CardContent className="p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 overflow-hidden">
              {clip.content_type === 'text' ? (
                <FileText className="h-6 w-6 text-primary flex-shrink-0" />
              ) : (
                <Download className="h-6 w-6 text-primary flex-shrink-0" />
              )}
              <div className="truncate">
                <p className="font-medium truncate">
                  {clip.content_type === 'text' ? clip.text_content : clip.file_name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(clip.created_at).toLocaleString()}
                </p>
              </div>
            </div>
            <div className="flex items-center flex-shrink-0 gap-2">
              {clip.content_type === 'text' && clip.text_content && (
                <Button variant="ghost" size="icon" onClick={() => copyToClipboard(clip.text_content!)} title="Copy text">
                  <Clipboard className="h-5 w-5" />
                </Button>
              )}
              {clip.content_type === 'file' && clip.file_path && clip.file_name && (
                <Button variant="ghost" size="icon" onClick={() => handleDownload(clip.file_path!, clip.file_name!)} title="Download file">
                  <Download className="h-5 w-5" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteMutation.mutate(clip.id)}
                disabled={deleteMutation.isPending}
                title="Delete clip"
              >
                <Trash2 className="h-5 w-5 text-destructive" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ClipList;
