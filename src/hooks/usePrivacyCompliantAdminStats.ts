
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const usePrivacyCompliantAdminStats = () => {
  return useQuery({
    queryKey: ['privacy-compliant-admin-stats'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_privacy_compliant_admin_stats');
      if (error) throw error;
      return data;
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });
};
