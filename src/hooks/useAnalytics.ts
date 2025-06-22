
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useAnalytics = () => {
  const { user } = useAuth();

  const trackEvent = useMutation({
    mutationFn: async ({ eventType, eventData }: { eventType: string; eventData?: any }) => {
      if (!user) return;

      const { error } = await supabase.rpc('track_user_event', {
        p_user_id: user.id,
        p_event_type: eventType,
        p_event_data: eventData || null,
      });

      if (error) throw error;
    },
  });

  return {
    trackEvent: trackEvent.mutate,
    isTracking: trackEvent.isPending,
  };
};
