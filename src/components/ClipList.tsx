import { useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Trash2, FileText, Download, Clipboard, File, FolderDown } from 'lucide-react';
import { toast } from 'sonner';
import { useClips, type Clip } from '@/hooks/useClips';
import { downloadAllAsZip } from '@/lib/download-all';

const ClipList = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: clips, isLoading } = useClips();

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('clips-changes')
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
      // First, delete associated files from storage if they exist
      const clipToDelete = clips?.find(c => c.id === clipId);
      if (clipToDelete?.files && clipToDelete.files.length > 0) {
        const filePaths = clipToDelete.files.map(f => f.file_path);
        const { error: storageError } = await supabase.storage.from('clip_files').remove(filePaths);
        if (storageError) {
          // Log error but proceed to delete DB record, as it's the source of truth
          console.error('Failed to delete files from storage:', storageError.message);
        }
      }

      // Delete file records from database
      const { error: fileDeleteError } = await supabase
        .from('clip_files')
        .delete()
        .eq('clip_id', clipId);
      if (fileDeleteError) {
        console.error('Failed to delete file records:', fileDeleteError.message);
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
        .createSignedUrl(filePath, 60, {
          download: fileName
        });

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

  const handleDownloadAll = async (clip: Clip) => {
    if (!clip.files || clip.files.length === 0) {
      toast.error('No files to download');
      return;
    }

    try {
      const filesToDownload = await Promise.allSettled(
        clip.files.map(async (file) => {
          const { data, error } = await supabase.storage
            .from('clip_files')
            .createSignedUrl(file.file_path, 120);
          
          if (error) throw new Error(`Failed to get URL for ${file.file_name}`);
          
          return {
            url: data.signedUrl,
            name: file.file_name
          };
        })
      );

      const successful = filesToDownload
        .filter((result): result is PromiseFulfilledResult<{ url: string; name: string }> => 
          result.status === 'fulfilled')
        .map(result => result.value);

      if (successful.length === 0) {
        toast.error('Failed to prepare files for download');
        return;
      }

      await downloadAllAsZip(successful, `clip-${clip.id.slice(0, 8)}.zip`);
    } catch (error) {
      console.error('Error preparing download:', error);
      toast.error('Failed to prepare files for download');
    }
  };

  const renderClipContent = (clip: Clip) => {
    if (clip.content_type === 'text') {
      return (
        <div className="flex items-center gap-4 overflow-hidden">
          <FileText className="h-6 w-6 text-primary flex-shrink-0" />
          <div className="truncate">
            <p className="font-medium truncate">{clip.text_content}</p>
            <p className="text-xs text-muted-foreground">
              {new Date(clip.created_at).toLocaleString()}
            </p>
          </div>
        </div>
      );
    }

    if (clip.content_type === 'file' && clip.files && clip.files.length > 0) {
      return (
        <div className="flex items-center gap-4 overflow-hidden">
          <File className="h-6 w-6 text-primary flex-shrink-0" />
          <div className="truncate">
            <p className="font-medium truncate">
              {clip.files.length === 1 
                ? clip.files[0].file_name 
                : `${clip.files.length} files`}
            </p>
            <p className="text-xs text-muted-foreground">
              {new Date(clip.created_at).toLocaleString()}
            </p>
          </div>
        </div>
      );
    }

    if (clip.content_type === 'mixed') {
      return (
        <div className="flex items-center gap-4 overflow-hidden">
          <FileText className="h-6 w-6 text-primary flex-shrink-0" />
          <div className="truncate">
            <p className="font-medium truncate">{clip.text_content}</p>
            <p className="text-xs text-muted-foreground">
              {clip.files && clip.files.length > 0 && `+ ${clip.files.length} file${clip.files.length > 1 ? 's' : ''} • `}
              {new Date(clip.created_at).toLocaleString()}
            </p>
          </div>
        </div>
      );
    }

    return null;
  };

  const renderClipActions = (clip: Clip) => {
    return (
      <div className="flex items-center flex-shrink-0 gap-2 flex-wrap">
        {(clip.content_type === 'text' || clip.content_type === 'mixed') && clip.text_content && (
          <Button variant="ghost" size="icon" onClick={() => copyToClipboard(clip.text_content!)} title="Copy text">
            <Clipboard className="h-5 w-5" />
          </Button>
        )}
        {clip.files && clip.files.length > 1 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => handleDownloadAll(clip)} 
            title="Download all files as zip"
          >
            <FolderDown className="h-4 w-4" />
            <span className="ml-1 hidden sm:inline">Download All</span>
          </Button>
        )}
        {clip.files && clip.files.length > 0 && (
          <>
            {clip.files.map((file, index) => (
              <Button 
                key={file.id}
                variant="ghost" 
                size="icon" 
                onClick={() => handleDownload(file.file_path, file.file_name)} 
                title={`Download ${file.file_name}`}
              >
                <Download className="h-5 w-5" />
              </Button>
            ))}
          </>
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
    );
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
            {renderClipContent(clip)}
            {renderClipActions(clip)}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ClipList;
