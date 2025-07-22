import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Link2, Plus, Trash2 } from "lucide-react";
import InstagramConnect from "./instagram-connect";
import { apiRequest } from "@/lib/queryClient";

export default function ConnectedAccounts() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: accounts, isLoading } = useQuery({
    queryKey: ["/api/accounts"],
    queryFn: api.getConnectedAccounts,
  });

  const disconnectMutation = useMutation({
    mutationFn: (accountId: number) => apiRequest("DELETE", `/api/accounts/${accountId}`),
    onSuccess: () => {
      toast({
        title: "Account Disconnected",
        description: "Your social media account has been disconnected.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/accounts"] });
    },
    onError: (error: any) => {
      toast({
        title: "Disconnection Failed",
        description: error.message || "Failed to disconnect account",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Connected Accounts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Skeleton className="w-10 h-10 rounded-lg" />
                  <div>
                    <Skeleton className="h-4 w-24 mb-1" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
                <Skeleton className="h-6 w-16" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "instagram":
        return "fab fa-instagram";
      case "facebook":
        return "fab fa-facebook";
      case "tiktok":
        return "fab fa-tiktok";
      case "twitter":
        return "fab fa-twitter";
      default:
        return "fas fa-share-alt";
    }
  };

  const getPlatformGradient = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "instagram":
        return "platform-instagram";
      case "facebook":
        return "platform-facebook";
      case "tiktok":
        return "platform-tiktok";
      case "twitter":
        return "platform-twitter";
      default:
        return "gradient-primary";
    }
  };

  const connectedAccounts = accounts || [];
  const availablePlatforms = [
    { id: "twitter", name: "Twitter/X", connected: false },
    { id: "youtube", name: "YouTube", connected: false },
    { id: "linkedin", name: "LinkedIn", connected: false },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Connected Accounts</span>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus size={16} className="mr-2" />
                Add Account
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Connect Social Media Account</DialogTitle>
              </DialogHeader>
              <InstagramConnect />
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Connected Accounts */}
          {connectedAccounts.map((account: any) => (
            <div key={account.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`platform-icon ${getPlatformGradient(account.platform)}`}>
                  <i className={getPlatformIcon(account.platform)}></i>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{account.accountName}</p>
                  <p className="text-sm text-gray-500">{account.followers?.toLocaleString() || 0} followers</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`status-indicator ${account.isActive ? 'status-active' : 'status-inactive'}`}></div>
                <span className="text-sm text-secondary">
                  {account.isActive ? 'Active' : 'Inactive'}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => disconnectMutation.mutate(account.id)}
                  disabled={disconnectMutation.isPending}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          ))}

          {/* Available Platforms */}
          {availablePlatforms.map((platform) => (
            <div key={platform.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg opacity-50">
              <div className="flex items-center space-x-3">
                <div className={`platform-icon ${getPlatformGradient(platform.id)}`}>
                  <i className={getPlatformIcon(platform.id)}></i>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{platform.name}</p>
                  <p className="text-sm text-gray-500">Not connected</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Link2 size={16} className="mr-2" />
                Connect
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
