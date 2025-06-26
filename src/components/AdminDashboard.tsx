
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePrivacyCompliantAdminStats } from '@/hooks/usePrivacyCompliantAdminStats';
import { Loader2, Users, FileText, Share2, TrendingUp, Database, Shield } from 'lucide-react';
import AdminAnalyticsCharts from './AdminAnalyticsCharts';

interface PrivacyCompliantAdminStats {
  total_users: number;
  total_clips: number;
  total_temp_clips: number;
  new_users_today: number;
  clips_created_today: number;
  temp_clips_created_today: number;
  storage_usage_mb: number;
  content_type_stats: {
    text_clips: number;
    file_clips: number;
    text_temp_clips: number;
    file_temp_clips: number;
  };
}

const AdminDashboard = () => {
  const { data: rawStats, isLoading, error } = usePrivacyCompliantAdminStats();

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

  const stats = (rawStats as unknown) as PrivacyCompliantAdminStats;

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
      <div className="flex items-center gap-2">
        <Shield className="h-6 w-6 text-primary" />
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
          <p className="text-muted-foreground">
            Privacy-compliant analytics and system monitoring.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={stats?.total_users || 0}
          icon={Users}
          description="All registered users"
        />
        <StatCard
          title="Total Clips"
          value={stats?.total_clips || 0}
          icon={FileText}
          description="User-generated clips"
        />
        <StatCard
          title="Quick Shares"
          value={stats?.total_temp_clips || 0}
          icon={Share2}
          description="Anonymous quick shares"
        />
        <StatCard
          title="Storage Usage"
          value={`${Math.round(stats?.storage_usage_mb || 0)} MB`}
          icon={Database}
          description="Total file storage used"
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
          title="Quick Shares Today"
          value={stats?.temp_clips_created_today || 0}
          icon={Share2}
          description="Quick shares created today"
        />
      </div>

      {/* Content Type Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Text Clips"
          value={stats?.content_type_stats?.text_clips || 0}
          icon={FileText}
          description="Regular text clips"
        />
        <StatCard
          title="File Clips"
          value={stats?.content_type_stats?.file_clips || 0}
          icon={Database}
          description="Regular file clips"
        />
        <StatCard
          title="Text Quick Shares"
          value={stats?.content_type_stats?.text_temp_clips || 0}
          icon={Share2}
          description="Anonymous text shares"
        />
        <StatCard
          title="File Quick Shares"
          value={stats?.content_type_stats?.file_temp_clips || 0}
          icon={Database}
          description="Anonymous file shares"
        />
      </div>

      {/* Analytics Charts */}
      <AdminAnalyticsCharts />
    </div>
  );
};

export default AdminDashboard;
