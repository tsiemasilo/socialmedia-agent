import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import Topbar from "@/components/layout/topbar";
import StatsCards from "@/components/dashboard/stats-cards";
import AnalyticsChart from "@/components/dashboard/analytics-chart";
import UpcomingPosts from "@/components/dashboard/upcoming-posts";
import ContentCreatorForm from "@/components/content/content-creator-form";
import ConnectedAccounts from "@/components/accounts/connected-accounts";
import { useState } from "react";

export default function Dashboard() {
  const [generatedContent, setGeneratedContent] = useState(null);

  const { data: user } = useQuery({
    queryKey: ["/api/user/profile"],
    queryFn: api.getUserProfile,
  });

  const handleContentGenerated = (content: any) => {
    setGeneratedContent(content);
  };

  return (
    <div>
      <Topbar 
        title="Dashboard" 
        subtitle="Welcome back! Here's your social media performance"
      />
      
      <div className="p-4 md:p-8">
        {/* Stats Cards */}
        <div className="mb-6 md:mb-8">
          <StatsCards />
        </div>

        {/* Content Creator and Connected Accounts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8 mb-6 md:mb-8">
          <ContentCreatorForm onContentGenerated={handleContentGenerated} />
          <ConnectedAccounts />
        </div>

        {/* Analytics and Upcoming Posts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
          <AnalyticsChart />
          <UpcomingPosts />
        </div>
      </div>
    </div>
  );
}
