import { Users, Heart, CalendarCheck, TrendingUp } from "lucide-react";
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 border border-slate-200">
            <Skeleton className="h-14 w-14 rounded-xl mb-4" />
            <Skeleton className="h-8 w-24 mb-2" />
            <Skeleton className="h-4 w-28" />
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
      bgGradient: "from-blue-500 to-cyan-500",
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-600",
    },
    {
      icon: Heart,
      value: `${((stats?.totalEngagement || 0) / 1000).toFixed(1)}K`,
      label: "Total Engagement",
      change: "+8.2%",
      bgGradient: "from-pink-500 to-rose-500",
      iconBg: "bg-pink-500/10",
      iconColor: "text-pink-600",
    },
    {
      icon: CalendarCheck,
      value: stats?.postsThisMonth?.toString() || "0",
      label: "Posts This Month",
      change: "+15.3%",
      bgGradient: "from-purple-500 to-indigo-500",
      iconBg: "bg-purple-500/10",
      iconColor: "text-purple-600",
    },
    {
      icon: TrendingUp,
      value: `${((stats?.monthlyReach || 0) / 1000).toFixed(0)}K`,
      label: "Monthly Reach",
      change: "+22.7%",
      bgGradient: "from-emerald-500 to-teal-500",
      iconBg: "bg-emerald-500/10",
      iconColor: "text-emerald-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div 
            key={index} 
            className="group bg-white rounded-2xl p-6 border border-slate-200 hover:border-slate-300 hover:shadow-xl transition-all duration-300 cursor-pointer"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-14 h-14 ${card.iconBg} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                <Icon className={card.iconColor} size={24} strokeWidth={2} />
              </div>
              <div className="flex items-center space-x-1 text-emerald-600 font-semibold text-sm">
                <TrendingUp size={14} strokeWidth={3} />
                <span>{card.change}</span>
              </div>
            </div>
            <h3 className="text-3xl font-bold text-slate-800 mb-1">{card.value}</h3>
            <p className="text-slate-500 text-sm font-medium">{card.label}</p>
          </div>
        );
      })}
    </div>
  );
}
