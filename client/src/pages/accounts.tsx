import Topbar from "@/components/layout/topbar";
import ConnectedAccounts from "@/components/accounts/connected-accounts";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Settings, Bell, Clock, Target } from "lucide-react";

export default function Accounts() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ["/api/user/profile"],
    queryFn: api.getUserProfile,
  });

  const updateProfileMutation = useMutation({
    mutationFn: api.updateUserProfile,
    onSuccess: () => {
      toast({
        title: "Settings Updated",
        description: "Your preferences have been saved successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/user/profile"] });
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update settings.",
        variant: "destructive",
      });
    },
  });

  const handleNicheChange = (niche: string) => {
    updateProfileMutation.mutate({ niche });
  };

  const handleFrequencyChange = (frequency: string) => {
    updateProfileMutation.mutate({ postingFrequency: frequency });
  };

  return (
    <div>
      <Topbar 
        title="Connected Accounts" 
        subtitle="Manage your social media connections and settings"
      />
      
      <div className="p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8 mb-6 md:mb-8">
          <ConnectedAccounts />
          
          {/* Account Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings size={20} />
                <span>Account Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Niche Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content Niche
                </label>
                <Select 
                  value={user?.niche || "Fitness & Wellness"} 
                  onValueChange={handleNicheChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your niche" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Fitness & Wellness">Fitness & Wellness</SelectItem>
                    <SelectItem value="Forex Trading">Forex Trading</SelectItem>
                    <SelectItem value="Motivation">Motivation</SelectItem>
                    <SelectItem value="Technology">Technology</SelectItem>
                    <SelectItem value="Travel">Travel</SelectItem>
                    <SelectItem value="Fashion">Fashion</SelectItem>
                    <SelectItem value="Food & Cooking">Food & Cooking</SelectItem>
                    <SelectItem value="Business">Business</SelectItem>
                    <SelectItem value="Education">Education</SelectItem>
                    <SelectItem value="Entertainment">Entertainment</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Posting Frequency */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Posting Frequency
                </label>
                <div className="flex space-x-2">
                  {["daily", "twice-daily", "weekly"].map((freq) => (
                    <Button
                      key={freq}
                      variant={user?.postingFrequency === freq ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleFrequencyChange(freq)}
                    >
                      {freq === "daily" && "Daily"}
                      {freq === "twice-daily" && "2x Daily"}
                      {freq === "weekly" && "Weekly"}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Notifications */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notifications
                </label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Bell size={16} />
                      <span className="text-sm">Post reminders</span>
                    </div>
                    <Badge variant="secondary">Enabled</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Target size={16} />
                      <span className="text-sm">Performance alerts</span>
                    </div>
                    <Badge variant="secondary">Enabled</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Clock size={16} />
                      <span className="text-sm">Optimal time suggestions</span>
                    </div>
                    <Badge variant="secondary">Enabled</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Connection Guide */}
        <Card>
          <CardHeader>
            <CardTitle>How to Connect Your Accounts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Instagram</h4>
                <p className="text-sm text-gray-600 mb-2">
                  Connect your Instagram Business account to enable automated posting and analytics.
                </p>
                <Button variant="outline" size="sm" disabled>
                  Instagram Business API (Coming Soon)
                </Button>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Facebook</h4>
                <p className="text-sm text-gray-600 mb-2">
                  Link your Facebook Page to schedule posts and track engagement metrics.
                </p>
                <Button variant="outline" size="sm" disabled>
                  Facebook Graph API (Coming Soon)
                </Button>
              </div>
              <div>
                <h4 className="font-semibold mb-2">TikTok</h4>
                <p className="text-sm text-gray-600 mb-2">
                  Upload videos and schedule TikTok posts with trending hashtags.
                </p>
                <Button variant="outline" size="sm" disabled>
                  TikTok API (Coming Soon)
                </Button>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Twitter/X</h4>
                <p className="text-sm text-gray-600 mb-2">
                  Post tweets and threads with optimal timing for maximum engagement.
                </p>
                <Button variant="outline" size="sm" disabled>
                  Twitter API (Coming Soon)
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
