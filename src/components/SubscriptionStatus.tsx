
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSubscription } from '@/hooks/useSubscription';
import { Calendar, CreditCard, Crown } from 'lucide-react';
import { format } from 'date-fns';

const SubscriptionStatus = () => {
  const { subscription, isLoading } = useSubscription();

  if (isLoading) {
    return <div>Loading subscription...</div>;
  }

  if (!subscription || !subscription.subscribed) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Subscription Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Badge variant="secondary">Free Plan</Badge>
            <p className="text-sm text-muted-foreground">
              You're currently on the free plan. Upgrade to unlock more features.
            </p>
            <Button>Upgrade Now</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Crown className="h-5 w-5 text-primary" />
          Subscription Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-medium">Plan</span>
            <Badge className="capitalize">{subscription.subscription_tier}</Badge>
          </div>
          
          {subscription.subscription_end && (
            <div className="flex items-center justify-between">
              <span className="font-medium">Expires</span>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4" />
                {format(new Date(subscription.subscription_end), 'MMM dd, yyyy')}
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <span className="font-medium">Status</span>
            <Badge variant={subscription.subscribed ? 'default' : 'secondary'}>
              {subscription.subscribed ? 'Active' : 'Inactive'}
            </Badge>
          </div>
          
          <Button variant="outline" className="w-full">
            Manage Subscription
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubscriptionStatus;
