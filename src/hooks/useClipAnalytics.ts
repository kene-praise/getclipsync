
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useClipAnalytics = (periodDays: number = 30) => {
  return useQuery({
    queryKey: ['clip-analytics', periodDays],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_clip_analytics', {
        period_days: periodDays
      });
      if (error) throw error;
      return data;
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });
};
