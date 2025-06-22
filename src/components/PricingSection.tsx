
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const PricingSection = () => {
  const { user } = useAuth();
  const { subscription, createSubscription, isCreating } = useSubscription();

  const handleSubscribe = (tier: string) => {
    if (!user) {
      toast.error('Please sign in to subscribe');
      return;
    }

    createSubscription({ tier }, {
      onSuccess: () => {
        toast.success(`Successfully subscribed to ${tier} plan!`);
      },
      onError: (error: any) => {
        toast.error(error.message || 'Failed to create subscription');
      },
    });
  };

  const plans = [
    {
      name: 'Free',
      price: '$0',
      description: 'Perfect for getting started',
      features: [
        'Quick share (1 hour expiry)',
        'Basic clipboard sync',
        '5 saved clips',
        'Community support'
      ],
      tier: 'free',
      current: !subscription?.subscribed,
    },
    {
      name: 'Pro',
      price: '$9',
      description: 'For power users and professionals',
      features: [
        'Everything in Free',
        'Unlimited saved clips',
        '30-day clip retention',
        'Auto-sync clipboard',
        'Priority support',
        'Advanced analytics'
      ],
      tier: 'pro',
      current: subscription?.subscription_tier === 'pro',
      popular: true,
    },
    {
      name: 'Team',
      price: '$29',
      description: 'For teams and organizations',
      features: [
        'Everything in Pro',
        'Team sharing',
        'Admin dashboard',
        'User management',
        'API access',
        'Custom retention',
        'Dedicated support'
      ],
      tier: 'team',
      current: subscription?.subscription_tier === 'team',
    },
  ];

  return (
    <div className="py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold tracking-tight">Choose Your Plan</h2>
        <p className="text-lg text-muted-foreground mt-2">
          Unlock powerful features with our subscription plans
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
        {plans.map((plan) => (
          <Card key={plan.name} className={`relative ${plan.popular ? 'border-primary' : ''}`}>
            {plan.popular && (
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
            )}
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <div className="text-4xl font-bold">
                {plan.price}
                {plan.price !== '$0' && <span className="text-lg text-muted-foreground">/month</span>}
              </div>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                className="w-full"
                variant={plan.current ? 'secondary' : 'default'}
                disabled={plan.current || isCreating || plan.tier === 'free'}
                onClick={() => handleSubscribe(plan.tier)}
              >
                {plan.current ? 'Current Plan' : plan.tier === 'free' ? 'Free Forever' : `Subscribe to ${plan.name}`}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PricingSection;
