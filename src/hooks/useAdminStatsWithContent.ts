
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useAdminStatsWithContent = () => {
  return useQuery({
    queryKey: ['admin-stats-with-content'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_admin_stats_with_content');
      if (error) throw error;
      return data;
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });
};
