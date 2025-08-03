import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface TemporaryClipFile {
  id: string;
  file_name: string;
  file_url: string;
  file_size: number;
  content_type: string;
  created_at: string;
}

export interface TemporaryClip {
  id: string;
  code: string;
  text_content: string | null;
  content_type: string;
  has_files: boolean;
  created_at: string;
  expires_at: string;
  files?: TemporaryClipFile[];
}

export const useTemporaryClip = (code: string) => {
  return useQuery({
    queryKey: ['sharedClip', code],
    queryFn: async () => {
      if (!code) throw new Error('Code is required');

      // Fetch temporary clip
      const { data: clip, error: clipError } = await supabase
        .from('temporary_clips')
        .select('*')
        .eq('code', code)
        .single();

      if (clipError) {
        console.error('Error fetching clip:', clipError);
        throw new Error('Failed to fetch clip');
      }

      // Fetch files for the clip if it has files
      if (clip.has_files) {
        const { data: files, error: filesError } = await supabase
          .from('temporary_clip_files')
          .select('*')
          .eq('temporary_clip_id', clip.id)
          .order('created_at', { ascending: false });

        if (filesError) {
          console.error('Error fetching clip files:', filesError);
          throw new Error('Failed to fetch clip files');
        }

        return { ...clip, files } as TemporaryClip;
      }

      return { ...clip, files: [] } as TemporaryClip;
    },
    enabled: !!code,
    staleTime: 60 * 1000, // 1 minute
  });
};