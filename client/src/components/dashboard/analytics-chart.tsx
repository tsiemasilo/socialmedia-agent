import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ChartLine } from "lucide-react";

export default function AnalyticsChart() {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ["/api/analytics"],
    queryFn: api.getAnalytics,
  });

  if (isLoading) {
    return (
      <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-6 w-48" />
          <div className="flex space-x-2">
            <Skeleton className="h-8 w-12" />
            <Skeleton className="h-8 w-12" />
            <Skeleton className="h-8 w-12" />
          </div>
        </div>
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
    );
  }

  const chartData = analytics?.map((item: any, index: number) => ({
    name: item.platform,
    likes: item.likes,
    comments: item.comments,
    shares: item.shares,
  })) || [];

  const avgLikes = analytics?.reduce((sum: number, item: any) => sum + item.likes, 0) / (analytics?.length || 1) || 0;
  const avgComments = analytics?.reduce((sum: number, item: any) => sum + item.comments, 0) / (analytics?.length || 1) || 0;
  const avgShares = analytics?.reduce((sum: number, item: any) => sum + item.shares, 0) / (analytics?.length || 1) || 0;

  return (
    <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Performance Analytics</h3>
        <div className="flex items-center space-x-2">
          <Button variant="default" size="sm">7D</Button>
          <Button variant="outline" size="sm">30D</Button>
          <Button variant="outline" size="sm">90D</Button>
        </div>
      </div>
      
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={256}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="likes" fill="hsl(214, 100%, 64%)" />
            <Bar dataKey="comments" fill="hsl(142, 76%, 36%)" />
            <Bar dataKey="shares" fill="hsl(262, 83%, 58%)" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="chart-container flex items-center justify-center">
          <div className="text-center">
            <ChartLine className="text-4xl text-primary mb-4 mx-auto" size={48} />
            <p className="text-gray-600">No analytics data available</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="engagement-metric">
          <p className="engagement-value">{Math.round(avgLikes).toLocaleString()}</p>
          <p className="engagement-label">Avg. Likes</p>
        </div>
        <div className="engagement-metric">
          <p className="engagement-value">{Math.round(avgComments).toLocaleString()}</p>
          <p className="engagement-label">Avg. Comments</p>
        </div>
        <div className="engagement-metric">
          <p className="engagement-value">{Math.round(avgShares).toLocaleString()}</p>
          <p className="engagement-label">Avg. Shares</p>
        </div>
      </div>
    </div>
  );
}
