
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
    mutationFn: async ({ text, files }: { text: string; files: File[] }) => {
      if (!user) throw new Error("You must be logged in to create a clip.");
      if (!text && files.length === 0) throw new Error("Nothing to send");

      let contentType = 'text';
      let hasFiles = false;

      // Determine content type
      if (text && files.length > 0) {
        contentType = 'mixed';
        hasFiles = true;
      } else if (files.length > 0) {
        contentType = 'file';
        hasFiles = true;
      }

      // Insert clip into database first
      const { data: clipData, error: clipError } = await supabase
        .from('clips')
        .insert({
          user_id: user.id,
          text_content: text || null,
          content_type: contentType,
          has_files: hasFiles,
        })
        .select()
        .single();

      if (clipError) throw clipError;

      // Upload files and create file records with parallel processing
      if (files.length > 0) {
        const fileUploadPromises = files.map(async (file) => {
          const fileExt = file.name.split('.').pop();
          const uniqueFileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
          const filePath = `${user.id}/${uniqueFileName}`;

          try {
            // Upload file to storage
            const { error: uploadError } = await supabase.storage
              .from('clip_files')
              .upload(filePath, file);

            if (uploadError) throw uploadError;

            // Create file record
            const { error: fileError } = await supabase
              .from('clip_files')
              .insert({
                clip_id: clipData.id,
                file_name: file.name,
                file_path: filePath,
                file_size: file.size,
                content_type: file.type,
              });

            if (fileError) throw fileError;
            
            return { success: true, fileName: file.name };
          } catch (error) {
            console.error(`Failed to upload ${file.name}:`, error);
            return { success: false, fileName: file.name, error };
          }
        });

        // Wait for all uploads to complete
        const results = await Promise.allSettled(fileUploadPromises);
        
        // Count successful and failed uploads
        const successful = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
        const failed = results.filter(r => r.status === 'fulfilled' && !r.value.success).length;
        
        // Show appropriate toasts for upload results
        if (successful > 0 && failed === 0) {
          toast.success(`Successfully uploaded ${successful} file${successful > 1 ? 's' : ''}`);
        } else if (successful > 0 && failed > 0) {
          toast.success(`Uploaded ${successful} file${successful > 1 ? 's' : ''}, ${failed} failed`);
        } else if (failed > 0) {
          toast.error(`Failed to upload ${failed} file${failed > 1 ? 's' : ''}`);
        }

        // Track analytics for files
        trackEvent({ 
          eventType: 'files_uploaded', 
          eventData: { 
            fileCount: files.length,
            totalSize: files.reduce((sum, f) => sum + f.size, 0),
            fileTypes: files.map(f => f.type)
          } 
        });
      }

      if (text) {
        // Track analytics for text
        trackEvent({ 
          eventType: 'clip_created', 
          eventData: { 
            textLength: text.length,
            contentType: contentType,
            hasFiles: hasFiles
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
