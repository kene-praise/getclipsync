
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useState } from 'react';
import { useSignupAnalytics } from '@/hooks/useSignupAnalytics';
import { useClipAnalytics } from '@/hooks/useClipAnalytics';
import { useContentTypeDistribution } from '@/hooks/useContentTypeDistribution';
import { TrendingUp, Users, FileText, PieChart as PieChartIcon } from 'lucide-react';

interface SignupData {
  date: string;
  signups: number;
}

interface ClipData {
  date: string;
  clips: number;
}

interface ContentTypeData {
  type: string;
  count: number;
  percentage: number;
}

const AdminAnalyticsCharts = () => {
  const [signupPeriod, setSignupPeriod] = useState(30);
  const [clipPeriod, setClipPeriod] = useState(30);

  const { data: rawSignupData, isLoading: signupLoading } = useSignupAnalytics(signupPeriod);
  const { data: rawClipData, isLoading: clipLoading } = useClipAnalytics(clipPeriod);
  const { data: rawContentTypeData, isLoading: contentTypeLoading } = useContentTypeDistribution();

  // Type guards and data transformation
  const signupData: SignupData[] = Array.isArray(rawSignupData) ? rawSignupData as unknown as SignupData[] : [];
  const clipData: ClipData[] = Array.isArray(rawClipData) ? rawClipData as unknown as ClipData[] : [];
  const contentTypeData: ContentTypeData[] = Array.isArray(rawContentTypeData) ? rawContentTypeData as unknown as ContentTypeData[] : [];

  const chartConfig = {
    signups: {
      label: "Signups",
      color: "hsl(var(--primary))",
    },
    clips: {
      label: "Clips",
      color: "hsl(var(--primary))",
    },
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const periodOptions = [
    { value: 7, label: '7 Days' },
    { value: 30, label: '30 Days' },
    { value: 90, label: '90 Days' },
    { value: 365, label: '1 Year' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        {/* User Signups Chart */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              User Signups
            </CardTitle>
            <Select value={signupPeriod.toString()} onValueChange={(value) => setSignupPeriod(Number(value))}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {periodOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value.toString()}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[200px]">
              <LineChart data={signupData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={formatDate}
                  fontSize={12}
                />
                <YAxis fontSize={12} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line 
                  type="monotone" 
                  dataKey="signups" 
                  stroke="var(--color-signups)" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Clip Creation Chart */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Clip Creation
            </CardTitle>
            <Select value={clipPeriod.toString()} onValueChange={(value) => setClipPeriod(Number(value))}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {periodOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value.toString()}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[200px]">
              <LineChart data={clipData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={formatDate}
                  fontSize={12}
                />
                <YAxis fontSize={12} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line 
                  type="monotone" 
                  dataKey="clips" 
                  stroke="var(--color-clips)" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Content Type Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChartIcon className="h-5 w-5" />
            Content Type Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={contentTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ type, percentage }) => `${type}: ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {contentTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <ChartTooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAnalyticsCharts;
