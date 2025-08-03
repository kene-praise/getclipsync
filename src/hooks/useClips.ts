import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface ClipFile {
  id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  content_type: string;
  created_at: string;
}

export interface Clip {
  id: string;
  text_content: string | null;
  content_type: string;
  has_files: boolean;
  created_at: string;
  expires_at: string;
  files?: ClipFile[];
}

export const useClips = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['clips', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      // Fetch clips
      const { data: clips, error: clipsError } = await supabase
        .from('clips')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (clipsError) throw clipsError;

      // Fetch files for clips that have files
      const clipsWithFiles = await Promise.all(
        clips.map(async (clip) => {
          if (clip.has_files) {
            const { data: files, error: filesError } = await supabase
              .from('clip_files')
              .select('*')
              .eq('clip_id', clip.id)
              .order('created_at', { ascending: false });

            if (filesError) throw filesError;
            return { ...clip, files };
          }
          return { ...clip, files: [] };
        })
      );

      return clipsWithFiles as Clip[];
    },
    enabled: !!user,
  });
};