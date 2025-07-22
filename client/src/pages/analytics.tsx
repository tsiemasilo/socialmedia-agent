import Topbar from "@/components/layout/topbar";
import AnalyticsChart from "@/components/dashboard/analytics-chart";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Users, Heart, MessageCircle, Share } from "lucide-react";

export default function Analytics() {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ["/api/analytics"],
    queryFn: api.getAnalytics,
  });

  const { data: posts } = useQuery({
    queryKey: ["/api/posts"],
    queryFn: api.getPosts,
  });

  if (isLoading) {
    return (
      <div>
        <Topbar 
          title="Analytics" 
          subtitle="Track your social media performance"
        />
        <div className="p-4 md:p-8">
          <Skeleton className="h-64 w-full mb-6 md:mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const totalEngagement = analytics?.reduce((sum: number, item: any) => sum + item.engagement, 0) || 0;
  const totalReach = analytics?.reduce((sum: number, item: any) => sum + item.reach, 0) || 0;
  const totalLikes = analytics?.reduce((sum: number, item: any) => sum + item.likes, 0) || 0;
  const totalComments = analytics?.reduce((sum: number, item: any) => sum + item.comments, 0) || 0;
  const totalShares = analytics?.reduce((sum: number, item: any) => sum + item.shares, 0) || 0;

  const engagementRate = totalReach > 0 ? ((totalEngagement / totalReach) * 100).toFixed(1) : "0";

  return (
    <div>
      <Topbar 
        title="Analytics" 
        subtitle="Track your social media performance"
      />
      
      <div className="p-4 md:p-8">
        {/* Main Chart */}
        <div className="mb-6 md:mb-8">
          <AnalyticsChart />
        </div>

        {/* Detailed Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Engagement</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalEngagement.toLocaleString()}</div>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span className="text-green-500">+12.5%</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Reach</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalReach.toLocaleString()}</div>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span className="text-green-500">+8.3%</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{engagementRate}%</div>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span className="text-green-500">+2.1%</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{posts?.length || 0}</div>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span className="text-green-500">+5.2%</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Platform Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Platform Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics && analytics.length > 0 ? (
                  analytics.map((item: any) => (
                    <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            {item.platform.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 capitalize">{item.platform}</p>
                          <p className="text-sm text-gray-500">{item.reach.toLocaleString()} reach</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{item.engagement.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">engagement</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-state">
                    <p>No analytics data available yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Engagement Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Heart className="h-5 w-5 text-red-500" />
                    <span className="text-sm font-medium">Likes</span>
                  </div>
                  <span className="text-sm font-bold">{totalLikes.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <MessageCircle className="h-5 w-5 text-blue-500" />
                    <span className="text-sm font-medium">Comments</span>
                  </div>
                  <span className="text-sm font-bold">{totalComments.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Share className="h-5 w-5 text-green-500" />
                    <span className="text-sm font-medium">Shares</span>
                  </div>
                  <span className="text-sm font-bold">{totalShares.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
