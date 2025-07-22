import { apiRequest } from "./queryClient";

export const api = {
  // User
  getUserProfile: () => 
    fetch("/api/user/profile").then(res => res.json()),

  updateUserProfile: (data: { niche?: string; postingFrequency?: string }) =>
    apiRequest("PATCH", "/api/user/profile", data).then(res => res.json()),

  // Dashboard
  getDashboardStats: () =>
    fetch("/api/dashboard/stats").then(res => res.json()),

  // Accounts
  getConnectedAccounts: () =>
    fetch("/api/accounts").then(res => res.json()),

  // Posts
  getPosts: () =>
    fetch("/api/posts").then(res => res.json()),

  getUpcomingPosts: () =>
    fetch("/api/posts/upcoming").then(res => res.json()),

  createPost: (data: {
    platforms: string[];
    content: string;
    caption: string;
    imageUrl?: string;
    hashtags: string[];
    scheduledFor?: string;
  }) =>
    apiRequest("POST", "/api/posts", data).then(res => res.json()),

  // Content Generation
  generateContent: (data: {
    niche: string;
    tone: string;
    description: string;
    platforms: string[];
    contentType: "image" | "video";
  }) =>
    apiRequest("POST", "/api/content/generate", data).then(res => res.json()),

  getContentHistory: () =>
    fetch("/api/content/history").then(res => res.json()),

  // Analytics
  getAnalytics: () =>
    fetch("/api/analytics").then(res => res.json()),

  // Daily Prompts
  getDailyPrompts: (niche: string) =>
    fetch(`/api/prompts/${encodeURIComponent(niche)}`).then(res => res.json()),

  getTodaysPrompt: (niche: string) =>
    fetch(`/api/prompts/${encodeURIComponent(niche)}/today`).then(res => res.json()),
};
