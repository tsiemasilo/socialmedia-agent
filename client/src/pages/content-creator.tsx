import { useState } from "react";
import Topbar from "@/components/layout/topbar";
import ContentCreatorForm from "@/components/content/content-creator-form";
import ContentPreview from "@/components/content/content-preview";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

export default function ContentCreator() {
  const [generatedContent, setGeneratedContent] = useState(null);

  const { data: contentHistory, isLoading } = useQuery({
    queryKey: ["/api/content/history"],
    queryFn: api.getContentHistory,
  });

  const handleContentGenerated = (content: any) => {
    setGeneratedContent(content);
  };

  return (
    <div>
      <Topbar 
        title="Content Creator" 
        subtitle="Create engaging content with AI assistance"
      />
      
      <div className="p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8 mb-8">
          <ContentCreatorForm onContentGenerated={handleContentGenerated} />
          <ContentPreview content={generatedContent} />
        </div>

        {/* Content History */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Content Generation</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <Skeleton className="h-16 w-full mb-2" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                ))}
              </div>
            ) : contentHistory && contentHistory.length > 0 ? (
              <div className="space-y-4">
                {contentHistory.slice(0, 5).map((item: any) => (
                  <div key={item.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium text-gray-900">{item.niche}</span>
                      <span className="text-sm text-gray-500">
                        {format(new Date(item.createdAt), "MMM d, yyyy")}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{item.prompt}</p>
                    {item.generatedCaption && (
                      <p className="text-xs text-gray-500 truncate">
                        {item.generatedCaption}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>No content generated yet. Create your first AI-powered content!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
