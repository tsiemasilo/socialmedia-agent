import { Users, Heart, CalendarCheck, ChartLine } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

export default function StatsCards() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
    queryFn: api.getDashboardStats,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="stat-card">
            <Skeleton className="h-12 w-12 rounded-lg mb-4" />
            <Skeleton className="h-8 w-20 mb-2" />
            <Skeleton className="h-4 w-24" />
          </div>
        ))}
      </div>
    );
  }

  const cards = [
    {
      icon: Users,
      value: stats?.totalFollowers?.toLocaleString() || "0",
      label: "Total Followers",
      change: "+12.5%",
      gradient: "gradient-primary",
    },
    {
      icon: Heart,
      value: `${((stats?.totalEngagement || 0) / 1000).toFixed(1)}K`,
      label: "Total Engagement",
      change: "+8.2%",
      gradient: "gradient-secondary",
    },
    {
      icon: CalendarCheck,
      value: stats?.postsThisMonth?.toString() || "0",
      label: "Posts This Month",
      change: "+15.3%",
      gradient: "gradient-accent",
    },
    {
      icon: ChartLine,
      value: `${((stats?.monthlyReach || 0) / 1000).toFixed(0)}K`,
      label: "Monthly Reach",
      change: "+22.7%",
      gradient: "gradient-primary",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div key={index} className="stat-card">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${card.gradient} rounded-lg flex items-center justify-center`}>
                <Icon className="text-white" size={20} />
              </div>
              <span className="text-sm font-medium text-secondary">{card.change}</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{card.value}</h3>
            <p className="text-gray-500 text-sm">{card.label}</p>
          </div>
        );
      })}
    </div>
  );
}
