
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useSubscription = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const subscription = useQuery({
    queryKey: ['subscription', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('subscribers')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const createSubscription = useMutation({
    mutationFn: async ({ tier }: { tier: string }) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('subscribers')
        .upsert({
          user_id: user.id,
          email: user.email!,
          subscription_tier: tier,
          subscribed: true,
          subscription_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription', user?.id] });
    },
  });

  return {
    subscription: subscription.data,
    isLoading: subscription.isLoading,
    createSubscription: createSubscription.mutate,
    isCreating: createSubscription.isPending,
  };
};
