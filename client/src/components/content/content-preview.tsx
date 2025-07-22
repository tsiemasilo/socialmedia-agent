import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Clock, Send, Copy, Loader2 } from "lucide-react";

interface ContentPreviewProps {
  content: {
    caption: string;
    hashtags: string[];
    imageUrl?: string;
    platforms: string[];
    contentType: string;
  } | null;
}

export default function ContentPreview({ content }: ContentPreviewProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [schedulingOption, setSchedulingOption] = useState("now");
  const [scheduledTime, setScheduledTime] = useState("");

  const createPostMutation = useMutation({
    mutationFn: api.createPost,
    onSuccess: () => {
      if (schedulingOption === "now") {
        toast({
          title: "Post Published!",
          description: "Your content has been published to your connected accounts.",
        });
      } else {
        toast({
          title: "Post Scheduled!",
          description: "Your content has been successfully scheduled.",
        });
      }
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/posts/upcoming"] });
    },
    onError: (error: any) => {
      toast({
        title: schedulingOption === "now" ? "Publishing Failed" : "Scheduling Failed",
        description: error.message || "Failed to process post. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSchedulePost = () => {
    if (!content) return;

    const postData = {
      platforms: content.platforms || [],
      content: content.caption || "",
      caption: content.caption || "",
      imageUrl: content.imageUrl || "",
      hashtags: content.hashtags || [],
      scheduledFor: schedulingOption === "later" ? scheduledTime : undefined,
    };

    createPostMutation.mutate(postData);
  };

  const handleCopyContent = () => {
    if (content && content.caption) {
      navigator.clipboard.writeText(content.caption);
      toast({
        title: "Copied!",
        description: "Content copied to clipboard.",
      });
    }
  };

  if (!content) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="empty-state">
          <p>Generate content to see preview</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Generated Content Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Generated Content Preview</span>
            <Button variant="outline" size="sm" onClick={handleCopyContent}>
              <Copy size={16} className="mr-2" />
              Copy
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Image Preview */}
          {content.imageUrl && (
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h5 className="font-medium text-gray-900 mb-3">Generated Image</h5>
              <img 
                src={content.imageUrl} 
                alt="AI generated content" 
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
          )}

          {/* Caption Preview */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h5 className="font-medium text-gray-900 mb-3">Generated Caption</h5>
            <p className="text-gray-700 mb-3 whitespace-pre-wrap">{content.caption}</p>
            <div className="flex flex-wrap gap-2">
              {content.hashtags && content.hashtags.length > 0 && content.hashtags.slice(0, 6).map((hashtag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {hashtag.startsWith('#') ? hashtag : `#${hashtag}`}
                </Badge>
              ))}
              {content.hashtags && content.hashtags.length > 6 && (
                <Badge variant="outline" className="text-xs">
                  +{content.hashtags.length - 6} more
                </Badge>
              )}
            </div>
          </div>

          {/* Platform Tags */}
          <div className="flex flex-wrap gap-2">
            {content.platforms && content.platforms.map((platform) => (
              <Badge key={platform} variant="outline" className="capitalize">
                {platform}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Scheduling Options */}
      <Card>
        <CardHeader>
          <CardTitle>Scheduling Options</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={schedulingOption} onValueChange={setSchedulingOption}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="now" id="now" />
              <Label htmlFor="now">Post Now</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="later" id="later" />
              <Label htmlFor="later">Schedule for Later</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="optimal" id="optimal" />
              <Label htmlFor="optimal">Post at Optimal Time</Label>
            </div>
          </RadioGroup>

          {schedulingOption === "later" && (
            <div className="mt-4">
              <Label htmlFor="scheduledTime">Select Date and Time</Label>
              <input
                id="scheduledTime"
                type="datetime-local"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                className="form-input mt-1"
                min={new Date().toISOString().slice(0, 16)}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3">
        <Button variant="outline">
          Save as Draft
        </Button>
        <Button 
          onClick={handleSchedulePost}
          disabled={createPostMutation.isPending}
          className="btn-primary"
        >
          {createPostMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {schedulingOption === "now" ? "Publishing..." : "Scheduling..."}
            </>
          ) : (
            <>
              {schedulingOption === "now" ? <Send className="mr-2 h-4 w-4" /> : <Calendar className="mr-2 h-4 w-4" />}
              {schedulingOption === "now" ? "Publish to Connected Accounts" : "Schedule Post"}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
