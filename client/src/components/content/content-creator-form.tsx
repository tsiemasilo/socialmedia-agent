import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { contentCreationSchema, type ContentCreationRequest } from "@shared/schema";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Wand2, Image, Video, Loader2, Calendar, Lightbulb } from "lucide-react";

interface ContentCreatorFormProps {
  onContentGenerated: (content: any) => void;
}

export default function ContentCreatorForm({ onContentGenerated }: ContentCreatorFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["instagram"]);
  const [contentType, setContentType] = useState<"image" | "video">("image");

  const form = useForm<ContentCreationRequest>({
    resolver: zodResolver(contentCreationSchema),
    defaultValues: {
      niche: "Loadshedding Solutions",
      tone: "helpful and informative with a touch of humor about the SA situation",
      description: "",
      platforms: ["instagram"],
      contentType: "image",
    },
  });

  // Watch the selected niche to conditionally load daily prompts
  const selectedNiche = form.watch("niche");
  const isLoadsheddingNiche = selectedNiche === "Loadshedding Solutions";

  // Get today's prompt only for Loadshedding Solutions niche
  const { data: todaysPrompt, isLoading: isLoadingPrompt } = useQuery({
    queryKey: ["/api/prompts/Loadshedding Solutions/today"],
    queryFn: () => api.getTodaysPrompt("Loadshedding Solutions"),
    enabled: isLoadsheddingNiche, // Only fetch when Loadshedding Solutions is selected
    refetchOnWindowFocus: false,
  });

  // Update form with today's prompt when it loads (only for Loadshedding Solutions)
  useEffect(() => {
    if (todaysPrompt && isLoadsheddingNiche) {
      form.setValue("tone", todaysPrompt.tone || "helpful and informative with a touch of humor about the SA situation");
      form.setValue("description", todaysPrompt.prompt);
      setSelectedPlatforms(["instagram"]); // Default to Instagram for Loadshedding Solutions
    }
  }, [todaysPrompt, isLoadsheddingNiche, form]);

  const generateContentMutation = useMutation({
    mutationFn: api.generateContent,
    onSuccess: (data) => {
      toast({
        title: "Content Generated!",
        description: "Your AI-powered content has been created successfully.",
      });
      onContentGenerated(data);
      queryClient.invalidateQueries({ queryKey: ["/api/content/history"] });
    },
    onError: (error: any) => {
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate content. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ContentCreationRequest) => {
    const requestData = {
      ...data,
      platforms: selectedPlatforms,
      contentType,
    };
    generateContentMutation.mutate(requestData);
  };

  const platforms = [
    { id: "instagram", label: "Instagram", icon: "fab fa-instagram" },
    { id: "facebook", label: "Facebook", icon: "fab fa-facebook" },
    { id: "tiktok", label: "TikTok", icon: "fab fa-tiktok" },
    { id: "twitter", label: "Twitter/X", icon: "fab fa-twitter" },
  ];

  const niches = [
    "Loadshedding Solutions",
    "Fitness & Wellness",
    "Forex Trading",
    "Motivation",
    "Technology",
    "Travel",
    "Fashion",
    "Food & Cooking",
    "Business",
    "Education",
    "Entertainment",
  ];

  const tones = [
    "helpful and informative with a touch of humor about the SA situation",
    "informative but relatable, acknowledging the frustration while offering hope",
    "excited and practical, like sharing a cool discovery",
    "educational and empowering, helping people take control",
    "humorous and community-focused, building solidarity",
    "supportive and community-minded, celebrating solutions",
    "interactive and fun, building community engagement",
    "Motivational",
    "Professional",
    "Casual",
    "Inspirational",
    "Educational",
    "Humorous",
    "Serious",
    "Friendly",
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <h3 className="text-lg font-semibold text-gray-900">AI Content Creator</h3>
        <div className="flex items-center space-x-2">
          <div className="status-indicator status-active"></div>
          <span className="text-sm text-secondary">AI Active</span>
        </div>
      </div>

      {/* Today's Prompt Section - Only show for Loadshedding Solutions */}
      {todaysPrompt && isLoadsheddingNiche && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-6 border border-blue-200">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Calendar className="w-4 h-4 text-white" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-gray-900 mb-1">
                Today's Prompt: {todaysPrompt.category}
              </h4>
              <p className="text-sm text-gray-700 mb-2">{todaysPrompt.title}</p>
              <p className="text-xs text-gray-600 leading-relaxed">{todaysPrompt.prompt}</p>
              {todaysPrompt.hashtags && todaysPrompt.hashtags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {todaysPrompt.hashtags.map((hashtag, index) => (
                    <span key={index} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                      {hashtag}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => {
                form.setValue("description", todaysPrompt.prompt);
                form.setValue("tone", todaysPrompt.tone || "helpful and informative");
              }}
              className="flex-shrink-0 p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
              title="Use this prompt"
            >
              <Lightbulb className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 md:space-y-6">
          {/* Content Type Selection */}
          <div className="form-section">
            <label className="form-label">Content Type</label>
            <div className="grid grid-cols-2 gap-2 md:gap-3">
              <button
                type="button"
                className={`p-3 md:p-4 border-2 rounded-lg text-center transition-colors ${
                  contentType === "image" 
                    ? "border-primary bg-primary/5" 
                    : "border-gray-300 hover:border-gray-400"
                }`}
                onClick={() => setContentType("image")}
              >
                <Image className={`mx-auto mb-1 md:mb-2 ${contentType === "image" ? "text-primary" : "text-gray-600"}`} size={20} />
                <p className={`text-xs md:text-sm font-medium ${contentType === "image" ? "text-primary" : "text-gray-600"}`}>
                  Image Post
                </p>
              </button>
              <button
                type="button"
                className={`p-3 md:p-4 border-2 rounded-lg text-center transition-colors ${
                  contentType === "video" 
                    ? "border-primary bg-primary/5" 
                    : "border-gray-300 hover:border-gray-400"
                }`}
                onClick={() => setContentType("video")}
              >
                <Video className={`mx-auto mb-1 md:mb-2 ${contentType === "video" ? "text-primary" : "text-gray-600"}`} size={20} />
                <p className={`text-xs md:text-sm font-medium ${contentType === "video" ? "text-primary" : "text-gray-600"}`}>
                  Video Post
                </p>
              </button>
            </div>
          </div>

          {/* Platforms Selection */}
          <div className="form-section">
            <label className="form-label">Platforms</label>
            <div className="grid grid-cols-2 md:flex md:flex-wrap gap-2 md:gap-4">
              {platforms.map((platform) => (
                <label key={platform.id} className="flex items-center space-x-2 cursor-pointer">
                  <Checkbox
                    checked={selectedPlatforms.includes(platform.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedPlatforms([...selectedPlatforms, platform.id]);
                      } else {
                        setSelectedPlatforms(selectedPlatforms.filter(p => p !== platform.id));
                      }
                    }}
                  />
                  <span className="text-xs md:text-sm">{platform.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Niche Selection */}
          <FormField
            control={form.control}
            name="niche"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select Niche</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose your niche" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {niches.map((niche) => (
                      <SelectItem key={niche} value={niche}>
                        {niche}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Tone Selection */}
          <FormField
            control={form.control}
            name="tone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tone & Style</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select tone" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {tones.map((tone) => (
                      <SelectItem key={tone} value={tone}>
                        {tone}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe what you want to create..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            className="w-full btn-primary"
            disabled={generateContentMutation.isPending}
          >
            {generateContentMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Content...
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-4 w-4" />
                Generate New Content
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
