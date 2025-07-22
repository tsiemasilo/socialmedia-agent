import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { contentCreationSchema } from "@shared/schema";
import { generateCaption, generateImage, generateHashtags } from "./services/openai";
import { instagramService } from "./services/instagram";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get user profile - create one if doesn't exist
  app.get("/api/user/profile", async (req, res) => {
    try {
      let user = await storage.getUser(1);
      if (!user) {
        // Create a basic user if none exists
        user = await storage.createUser({
          username: "User",
          email: "user@example.com",
          password: "default",
          niche: null,
          postingFrequency: null,
        });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user profile" });
    }
  });

  // Update user profile
  app.patch("/api/user/profile", async (req, res) => {
    try {
      const { niche, postingFrequency } = req.body;
      const user = await storage.updateUser(1, { niche, postingFrequency });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to update user profile" });
    }
  });

  // Get dashboard stats
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const stats = await storage.getUserStats(1);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch dashboard stats" });
    }
  });

  // Get connected social accounts
  app.get("/api/accounts", async (req, res) => {
    try {
      const accounts = await storage.getSocialAccountsByUserId(1);
      res.json(accounts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch accounts" });
    }
  });

  // Connect Instagram account
  app.post("/api/accounts/instagram/connect", async (req, res) => {
    try {
      const { accessToken } = req.body;
      
      if (!accessToken) {
        return res.status(400).json({ error: "Access token is required" });
      }

      // Get account info from Instagram API
      const accountInfo = await instagramService.getAccountInfo(accessToken);
      
      // Check if account already exists
      const existingAccount = await storage.getSocialAccountByPlatformAndUserId("instagram", 1);
      
      if (existingAccount) {
        // Update existing account
        const updatedAccount = await storage.updateSocialAccount(existingAccount.id, {
          accountName: accountInfo.username,
          followers: accountInfo.followersCount,
          accessToken: accessToken,
          isActive: true,
        });
        res.json(updatedAccount);
      } else {
        // Create new account
        const newAccount = await storage.createSocialAccount({
          userId: 1,
          platform: "instagram",
          accountName: accountInfo.username,
          followers: accountInfo.followersCount,
          accessToken: accessToken,
          isActive: true,
        });
        res.json(newAccount);
      }
    } catch (error) {
      console.error("Instagram connection error:", error);
      res.status(400).json({ error: "Failed to connect Instagram account" });
    }
  });

  // Disconnect account
  app.delete("/api/accounts/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteSocialAccount(parseInt(id));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to disconnect account" });
    }
  });

  // Generate content with AI
  app.post("/api/content/generate", async (req, res) => {
    try {
      const result = contentCreationSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid request data", details: result.error });
      }

      const { prompt, niche, tone, platform } = result.data;

      // Generate content
      const [caption, imageUrl, hashtags] = await Promise.all([
        generateCaption(prompt, { niche, tone, platform }),
        generateImage(prompt),
        generateHashtags(prompt, niche)
      ]);

      // Store the generation
      const generation = await storage.createContentGeneration({
        userId: 1,
        prompt,
        generatedCaption: caption,
        generatedImageUrl: imageUrl,
        niche,
        tone,
      });

      res.json({
        id: generation.id,
        caption,
        imageUrl,
        hashtags,
      });
    } catch (error) {
      console.error("Content generation error:", error);
      res.status(500).json({ error: "Failed to generate content" });
    }
  });

  // Get content generations
  app.get("/api/content/generations", async (req, res) => {
    try {
      const generations = await storage.getContentGenerationsByUserId(1);
      res.json(generations);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch content generations" });
    }
  });

  // Get posts
  app.get("/api/posts", async (req, res) => {
    try {
      const posts = await storage.getPostsByUserId(1);
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch posts" });
    }
  });

  // Get upcoming posts
  app.get("/api/posts/upcoming", async (req, res) => {
    try {
      const posts = await storage.getUpcomingPosts(1);
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch upcoming posts" });
    }
  });

  // Create post
  app.post("/api/posts", async (req, res) => {
    try {
      const post = await storage.createPost({
        userId: 1,
        ...req.body,
      });
      res.json(post);
    } catch (error) {
      res.status(500).json({ error: "Failed to create post" });
    }
  });

  // Get analytics
  app.get("/api/analytics", async (req, res) => {
    try {
      const analytics = await storage.getAnalyticsByUserId(1);
      res.json(analytics);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch analytics" });
    }
  });

  // Get daily prompts by niche
  app.get("/api/prompts/:niche", async (req, res) => {
    try {
      const { niche } = req.params;
      const prompts = await storage.getDailyPromptsByNiche(niche);
      res.json(prompts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch daily prompts" });
    }
  });

  // Get today's prompt
  app.get("/api/prompts/:niche/today", async (req, res) => {
    try {
      const { niche } = req.params;
      const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
      const prompt = await storage.getTodaysPrompt(niche, today);
      res.json(prompt);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch today's prompt" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}