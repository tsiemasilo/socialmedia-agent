import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { format } from "date-fns";

export default function UpcomingPosts() {
  const { data: posts, isLoading } = useQuery({
    queryKey: ["/api/posts/upcoming"],
    queryFn: api.getUpcomingPosts,
  });

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <Skeleton className="h-6 w-32 mb-6" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
              <Skeleton className="w-12 h-12 rounded-lg" />
              <div className="flex-1">
                <Skeleton className="h-4 w-20 mb-1" />
                <Skeleton className="h-3 w-24 mb-2" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
          ))}
        </div>
      </div>
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

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Upcoming Posts</h3>
      
      {posts && posts.length > 0 ? (
        <div className="space-y-4">
          {posts.slice(0, 3).map((post: any) => (
            <div key={post.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className={`platform-icon ${getPlatformGradient(post.platforms[0])}`}>
                {post.imageUrl ? (
                  <img 
                    src={post.imageUrl} 
                    alt="Post preview" 
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <i className={getPlatformIcon(post.platforms[0])}></i>
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900 font-medium">
                  {post.platforms[0].charAt(0).toUpperCase() + post.platforms[0].slice(1)}
                </p>
                <p className="text-xs text-gray-500">
                  {post.scheduledFor ? format(new Date(post.scheduledFor), "PPp") : "Not scheduled"}
                </p>
                <p className="text-xs text-gray-600 mt-1 truncate">
                  {post.caption || post.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Calendar className="mx-auto mb-4 text-gray-400" size={48} />
          <p>No upcoming posts scheduled</p>
        </div>
      )}

      <Button variant="outline" className="w-full mt-4">
        View Full Calendar
      </Button>
    </div>
  );
}
