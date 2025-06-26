
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useContentTypeDistribution = () => {
  return useQuery({
    queryKey: ['content-type-distribution'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_content_type_distribution');
      if (error) throw error;
      return data;
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });
};
