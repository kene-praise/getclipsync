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

      // Use secure function to fetch clip by code
      const { data, error } = await supabase.rpc('get_temporary_clip_by_code', {
        p_code: code
      });

      if (error) {
        console.error('Error fetching clip:', error);
        throw new Error('Failed to fetch clip');
      }

      if (!data) {
        throw new Error('Clip not found or expired');
      }

      // Parse the JSON response from the function
      return data as unknown as TemporaryClip;
    },
    enabled: !!code,
    staleTime: 60 * 1000, // 1 minute
  });
};