
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useAdminCheck = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['admin-check', user?.email],
    queryFn: async () => {
      if (!user?.email) return false;
      
      const { data, error } = await supabase.rpc('is_admin', {
        user_email: user.email
      });
      
      if (error) {
        console.error('Admin check error:', error);
        return false;
      }
      
      return data;
    },
    enabled: !!user?.email,
  });
};
