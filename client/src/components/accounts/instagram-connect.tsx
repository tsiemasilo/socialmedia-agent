import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { ExternalLink, Instagram, Loader2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

export default function InstagramConnect() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [accessToken, setAccessToken] = useState("");
  const [showTokenInput, setShowTokenInput] = useState(false);

  const getAuthUrlMutation = useMutation({
    mutationFn: () => fetch("/api/auth/instagram").then(res => res.json()),
    onSuccess: (data) => {
      if (data.authUrl) {
        window.open(data.authUrl, "_blank");
      }
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to get Instagram authorization URL",
        variant: "destructive",
      });
    },
  });

  const connectAccountMutation = useMutation({
    mutationFn: (token: string) => apiRequest("POST", "/api/accounts/connect/instagram", { accessToken: token }),
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Your Instagram account has been connected successfully.",
      });
      setAccessToken("");
      setShowTokenInput(false);
      queryClient.invalidateQueries({ queryKey: ["/api/accounts"] });
    },
    onError: (error: any) => {
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect Instagram account",
        variant: "destructive",
      });
    },
  });

  const handleOAuthConnect = () => {
    getAuthUrlMutation.mutate();
  };

  const handleTokenConnect = () => {
    if (!accessToken.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid access token",
        variant: "destructive",
      });
      return;
    }
    connectAccountMutation.mutate(accessToken);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Instagram className="text-pink-600" size={20} />
          <span>Connect Instagram Account</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Quick Test Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">Quick Test Connection</h3>
          <p className="text-blue-800 mb-4">
            Test the Instagram connection feature without setting up a full Instagram app
          </p>
          <div className="space-y-4">
            <div>
              <Label htmlFor="testToken" className="text-blue-900">Enter "demo_token" to test</Label>
              <Input
                id="testToken"
                type="text"
                placeholder="demo_token"
                value={accessToken}
                onChange={(e) => setAccessToken(e.target.value)}
                className="mt-1 bg-white"
              />
            </div>
            <Button 
              onClick={handleTokenConnect}
              disabled={connectAccountMutation.isPending}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {connectAccountMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Instagram className="mr-2 h-4 w-4" />
                  Connect Test Account
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Real Instagram Connection */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">Real Instagram Connection</h3>
          <Alert className="mb-4">
            <AlertDescription>
              To connect your real Instagram account, you need to set up an Instagram Business app through Meta Developer platform.
            </AlertDescription>
          </Alert>
          
          <div className="space-y-4">
            <Button 
              onClick={handleOAuthConnect}
              disabled={getAuthUrlMutation.isPending}
              variant="outline"
              className="w-full"
            >
              {getAuthUrlMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Auth URL...
                </>
              ) : (
                <>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Connect Real Instagram Account
                </>
              )}
            </Button>
            
            {/* Manual Token for Real Account */}
            <div className="pt-4 border-t">
              <p className="text-sm text-gray-600 mb-2">
                Or enter your Instagram access token directly:
              </p>
              <div className="space-y-3">
                <Input
                  type="password"
                  placeholder="Instagram access token (not demo_token)"
                  value={accessToken}
                  onChange={(e) => setAccessToken(e.target.value)}
                />
                <Button 
                  onClick={handleTokenConnect}
                  disabled={connectAccountMutation.isPending || accessToken === "demo_token"}
                  variant="outline"
                  className="w-full"
                >
                  Connect with Token
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Setup Instructions */}
        <div className="space-y-4 pt-4 border-t">
          <h4 className="font-semibold">Instagram App Setup Guide</h4>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm space-y-3">
              <p><strong>1.</strong> Go to <a href="https://developers.facebook.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">developers.facebook.com</a> and create developer account</p>
              <p><strong>2.</strong> Create new app → Select "Consumer" → Add "Instagram Basic Display" product</p>
              <p><strong>3.</strong> Configure OAuth redirect URI: <code className="bg-white px-2 py-1 rounded text-xs">http://localhost:5000/auth/instagram/callback</code></p>
              <p><strong>4.</strong> Add your Instagram username as test user in "Roles" → "Instagram Testers"</p>
              <p><strong>5.</strong> Accept the test invite on Instagram and use OAuth connection above</p>
            </div>
          </div>
          
          <Alert>
            <AlertDescription className="text-sm">
              <strong>Troubleshooting:</strong> "Invalid platform app" = Instagram Basic Display not configured properly
            </AlertDescription>
          </Alert>
        </div>
      </CardContent>
    </Card>
  );
}