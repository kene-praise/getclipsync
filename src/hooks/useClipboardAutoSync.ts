
import { useEffect } from 'react';
import { useQueryClient, type UseMutationResult } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

interface UseClipboardAutoSyncProps {
  createClipMutation: UseMutationResult<void, any, { text: string; files: File[]; }, unknown>;
  autoSyncOnFocus: boolean;
  text: string;
  file: File | null;
}

export const useClipboardAutoSync = ({
  createClipMutation,
  autoSyncOnFocus,
  text,
  file,
}: UseClipboardAutoSyncProps) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleWindowFocus = async () => {
      if (!document.hasFocus() || !autoSyncOnFocus) return;

      try {
        const clipboardText = await navigator.clipboard.readText();
        if (clipboardText && clipboardText.trim() !== '') {
          if (text.trim() === '' && file === null) {
            const clips = queryClient.getQueryData<any[]>(['clips', user?.id]);
            const latestClipText = clips?.[0]?.text_content;

            if (latestClipText?.trim() !== clipboardText.trim()) {
              createClipMutation.mutate({ text: clipboardText, files: [] }, {
                onSuccess: () => {
                  toast.info("Auto-synced from clipboard.");
                }
              });
            }
          }
        }
      } catch (error) {
        console.log('Clipboard read access denied or not available.');
      }
    };

    window.addEventListener('focus', handleWindowFocus);

    return () => {
      window.removeEventListener('focus', handleWindowFocus);
    };
  }, [autoSyncOnFocus, text, file, user?.id, queryClient, createClipMutation]);
};
