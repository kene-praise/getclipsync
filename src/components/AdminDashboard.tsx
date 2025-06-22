
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAdminStats } from '@/hooks/useAdminStats';
import { Loader2, Users, FileText, Share2, CreditCard, TrendingUp, Database } from 'lucide-react';

const AdminDashboard = () => {
  const { data: stats, isLoading, error } = useAdminStats();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-8">
        Error loading admin stats. Please try again.
      </div>
    );
  }

  const StatCard = ({ title, value, icon: Icon, description }: any) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
        <p className="text-muted-foreground">
          Monitor your app's performance and user activity.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={stats?.total_users || 0}
          icon={Users}
          description="All registered users"
        />
        <StatCard
          title="Active Subscriptions"
          value={stats?.active_subscriptions || 0}
          icon={CreditCard}
          description="Currently subscribed users"
        />
        <StatCard
          title="Total Clips"
          value={stats?.total_clips || 0}
          icon={FileText}
          description="User-generated clips"
        />
        <StatCard
          title="Temp Shares"
          value={stats?.total_temp_clips || 0}
          icon={Share2}
          description="Anonymous quick shares"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="New Users Today"
          value={stats?.new_users_today || 0}
          icon={TrendingUp}
          description="Users who signed up today"
        />
        <StatCard
          title="Clips Created Today"
          value={stats?.clips_created_today || 0}
          icon={FileText}
          description="New clips created today"
        />
        <StatCard
          title="Storage Usage"
          value={`${Math.round(stats?.storage_usage_mb || 0)} MB`}
          icon={Database}
          description="Total file storage used"
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
