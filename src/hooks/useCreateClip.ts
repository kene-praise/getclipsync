
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useAnalytics } from '@/hooks/useAnalytics';
import { toast } from 'sonner';

export const useCreateClip = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { trackEvent } = useAnalytics();

  return useMutation({
    mutationFn: async ({ text, file }: { text: string; file: File | null }) => {
      if (!user) throw new Error("You must be logged in to create a clip.");
      if (!text && !file) throw new Error("Nothing to send");

      if (file) {
        const filePath = `${user.id}/${Date.now()}_${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from('clip_files')
          .upload(filePath, file);
        if (uploadError) throw uploadError;

        const { error: dbError } = await supabase.from('clips').insert({
          content_type: 'file',
          file_name: file.name,
          file_path: filePath,
          user_id: user.id,
        });
        if (dbError) throw dbError;

        // Track analytics
        trackEvent({ 
          eventType: 'file_uploaded', 
          eventData: { 
            fileName: file.name, 
            fileSize: file.size,
            contentType: file.type 
          } 
        });
      } else if (text) {
        const { error: dbError } = await supabase.from('clips').insert({
          content_type: 'text',
          text_content: text,
          user_id: user.id,
        });
        if (dbError) throw dbError;

        // Track analytics
        trackEvent({ 
          eventType: 'clip_created', 
          eventData: { 
            textLength: text.length,
            contentType: 'text' 
          } 
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clips', user?.id] });
    },
    onError: (error: any) => {
      console.error('Error syncing clip:', error);
      toast.error(error.message || 'Failed to sync clip. Please try again.');
    }
  });
};
