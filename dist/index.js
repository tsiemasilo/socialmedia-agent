// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
var MemStorage = class {
  users;
  socialAccounts;
  posts;
  contentGenerations;
  analytics;
  dailyPrompts;
  currentUserId;
  currentSocialAccountId;
  currentPostId;
  currentContentGenerationId;
  currentAnalyticsId;
  currentDailyPromptId;
  constructor() {
    this.users = /* @__PURE__ */ new Map();
    this.socialAccounts = /* @__PURE__ */ new Map();
    this.posts = /* @__PURE__ */ new Map();
    this.contentGenerations = /* @__PURE__ */ new Map();
    this.analytics = /* @__PURE__ */ new Map();
    this.dailyPrompts = /* @__PURE__ */ new Map();
    this.currentUserId = 1;
    this.currentSocialAccountId = 1;
    this.currentPostId = 1;
    this.currentContentGenerationId = 1;
    this.currentAnalyticsId = 1;
    this.currentDailyPromptId = 1;
    this.initializeLoadsheddingPrompts();
  }
  initializeLoadsheddingPrompts() {
    const loadsheddingPrompts = [
      {
        id: 1,
        niche: "Loadshedding Solutions",
        dayOfWeek: "sunday",
        category: "Solution Sunday",
        title: "Practical Loadshedding Solution",
        prompt: "Share a practical solution to help South Africans during loadshedding. Focus on affordable options from Noshedding.co.za that can power essential devices like WiFi routers, lights, or keep food fresh.",
        hashtags: ["#LoadSheddingTips", "#NosheddingZA", "#SouthAfricaPower", "#SolarSolutions"],
        tone: "helpful and informative with a touch of humor about the SA situation",
        isActive: true,
        createdAt: /* @__PURE__ */ new Date()
      },
      {
        id: 2,
        niche: "Loadshedding Solutions",
        dayOfWeek: "monday",
        category: "Monday Forecast & News",
        title: "Weekly Loadshedding Update",
        prompt: "Post the weekly loadshedding schedule and share tips on how to prepare. Include updates from Eskom and remind followers about Noshedding.co.za backup solutions.",
        hashtags: ["#LoadSheddingUpdate", "#EskomNews", "#NosheddingZA", "#PowerOutages"],
        tone: "informative but relatable, acknowledging the frustration while offering hope",
        isActive: true,
        createdAt: /* @__PURE__ */ new Date()
      },
      {
        id: 3,
        niche: "Loadshedding Solutions",
        dayOfWeek: "tuesday",
        category: "Tech Tuesday",
        title: "Tech Products & DIY Solutions",
        prompt: "Showcase affordable tech products that help during outages. Review inverters, solar lights, power banks, or DIY solutions. Highlight products available on Noshedding.co.za.",
        hashtags: ["#TechTuesday", "#SolarTech", "#NosheddingZA", "#LoadSheddingGadgets"],
        tone: "excited and practical, like sharing a cool discovery",
        isActive: true,
        createdAt: /* @__PURE__ */ new Date()
      },
      {
        id: 4,
        niche: "Loadshedding Solutions",
        dayOfWeek: "wednesday",
        category: "Watt Wednesday",
        title: "Energy Saving Tips",
        prompt: "Teach followers how to save energy and reduce their Eskom bill. Share tips about energy vampires, geyser settings, and efficient appliances. Mention energy-saving products from Noshedding.co.za.",
        hashtags: ["#WattWednesday", "#EnergySaving", "#EskomBill", "#NosheddingZA"],
        tone: "educational and empowering, helping people take control",
        isActive: true,
        createdAt: /* @__PURE__ */ new Date()
      },
      {
        id: 5,
        niche: "Loadshedding Solutions",
        dayOfWeek: "thursday",
        category: "Tips Thursday",
        title: "User Tips & Throwbacks",
        prompt: "Share funny loadshedding moments or user-submitted survival tips. Create nostalgia content about 'the good old days before loadshedding' or highlight creative solutions from followers.",
        hashtags: ["#TipsThursday", "#LoadSheddingLife", "#SouthAfricaStruggles", "#NosheddingZA"],
        tone: "humorous and community-focused, building solidarity",
        isActive: true,
        createdAt: /* @__PURE__ */ new Date()
      },
      {
        id: 6,
        niche: "Loadshedding Solutions",
        dayOfWeek: "friday",
        category: "Feature Friday",
        title: "Business & Product Spotlight",
        prompt: "Highlight a small business or feature products that help with power outages. Showcase Noshedding.co.za products or partner businesses offering backup solutions.",
        hashtags: ["#FeatureFriday", "#SupportLocal", "#LoadSheddingBusiness", "#NosheddingZA"],
        tone: "supportive and community-minded, celebrating solutions",
        isActive: true,
        createdAt: /* @__PURE__ */ new Date()
      },
      {
        id: 7,
        niche: "Loadshedding Solutions",
        dayOfWeek: "saturday",
        category: "Saturday Polls & Engagement",
        title: "Interactive Content & Polls",
        prompt: "Run polls about loadshedding experiences, survival strategies, or product preferences. Ask engaging questions that get followers talking about their power outage stories.",
        hashtags: ["#SaturdayPolls", "#LoadSheddingLife", "#CommunityChoice", "#NosheddingZA"],
        tone: "interactive and fun, building community engagement",
        isActive: true,
        createdAt: /* @__PURE__ */ new Date()
      }
    ];
    loadsheddingPrompts.forEach((prompt) => {
      this.dailyPrompts.set(prompt.id, prompt);
    });
    this.currentDailyPromptId = 8;
  }
  // Users
  async getUser(id) {
    return this.users.get(id);
  }
  async getUserByEmail(email) {
    return Array.from(this.users.values()).find((user) => user.email === email);
  }
  async createUser(insertUser) {
    const id = this.currentUserId++;
    const user = {
      id,
      username: insertUser.username,
      email: insertUser.email,
      password: insertUser.password,
      niche: insertUser.niche || null,
      postingFrequency: insertUser.postingFrequency || null,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.users.set(id, user);
    return user;
  }
  async updateUser(id, updateUser) {
    const user = this.users.get(id);
    if (!user) return void 0;
    const updatedUser = { ...user, ...updateUser };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  // Social Accounts
  async getSocialAccountsByUserId(userId) {
    return Array.from(this.socialAccounts.values()).filter((account) => account.userId === userId);
  }
  async createSocialAccount(insertAccount) {
    const id = this.currentSocialAccountId++;
    const account = {
      id,
      userId: insertAccount.userId || null,
      platform: insertAccount.platform,
      accountName: insertAccount.accountName,
      followers: insertAccount.followers || null,
      isActive: insertAccount.isActive || null,
      accessToken: insertAccount.accessToken || null,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.socialAccounts.set(id, account);
    return account;
  }
  async updateSocialAccount(id, updateAccount) {
    const account = this.socialAccounts.get(id);
    if (!account) return void 0;
    const updatedAccount = { ...account, ...updateAccount };
    this.socialAccounts.set(id, updatedAccount);
    return updatedAccount;
  }
  async deleteSocialAccount(id) {
    this.socialAccounts.delete(id);
  }
  async getSocialAccountByPlatformAndUserId(platform, userId) {
    return Array.from(this.socialAccounts.values()).find((account) => account.platform === platform && account.userId === userId);
  }
  // Posts
  async getPostsByUserId(userId) {
    return Array.from(this.posts.values()).filter((post) => post.userId === userId);
  }
  async getUpcomingPosts(userId) {
    return Array.from(this.posts.values()).filter((post) => post.userId === userId && post.status === "scheduled").sort((a, b) => new Date(a.scheduledFor).getTime() - new Date(b.scheduledFor).getTime());
  }
  async createPost(insertPost) {
    const id = this.currentPostId++;
    const post = {
      id,
      userId: insertPost.userId || null,
      platforms: insertPost.platforms || null,
      content: insertPost.content,
      caption: insertPost.caption || null,
      imageUrl: insertPost.imageUrl || null,
      hashtags: insertPost.hashtags || null,
      scheduledFor: insertPost.scheduledFor || null,
      postedAt: insertPost.postedAt || null,
      status: insertPost.status || null,
      analytics: insertPost.analytics || null,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.posts.set(id, post);
    return post;
  }
  async updatePost(id, updatePost) {
    const post = this.posts.get(id);
    if (!post) return void 0;
    const updatedPost = { ...post, ...updatePost };
    this.posts.set(id, updatedPost);
    return updatedPost;
  }
  // Content Generation
  async getContentGenerationsByUserId(userId) {
    return Array.from(this.contentGenerations.values()).filter((generation) => generation.userId === userId);
  }
  async createContentGeneration(insertGeneration) {
    const id = this.currentContentGenerationId++;
    const generation = {
      id,
      userId: insertGeneration.userId || null,
      niche: insertGeneration.niche || null,
      prompt: insertGeneration.prompt,
      generatedCaption: insertGeneration.generatedCaption || null,
      generatedImageUrl: insertGeneration.generatedImageUrl || null,
      tone: insertGeneration.tone || null,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.contentGenerations.set(id, generation);
    return generation;
  }
  // Analytics
  async getAnalyticsByUserId(userId) {
    return Array.from(this.analytics.values()).filter((analytics2) => analytics2.userId === userId);
  }
  async getAnalyticsByPostId(postId) {
    return Array.from(this.analytics.values()).filter((analytics2) => analytics2.postId === postId);
  }
  async createAnalytics(insertAnalytics) {
    const id = this.currentAnalyticsId++;
    const analytics2 = {
      id,
      userId: insertAnalytics.userId || null,
      postId: insertAnalytics.postId || null,
      platform: insertAnalytics.platform,
      likes: insertAnalytics.likes || null,
      comments: insertAnalytics.comments || null,
      shares: insertAnalytics.shares || null,
      reach: insertAnalytics.reach || null,
      engagement: insertAnalytics.engagement || null,
      date: insertAnalytics.date || null
    };
    this.analytics.set(id, analytics2);
    return analytics2;
  }
  // Dashboard stats
  async getUserStats(userId) {
    const accounts = await this.getSocialAccountsByUserId(userId);
    const analytics2 = await this.getAnalyticsByUserId(userId);
    const posts2 = await this.getPostsByUserId(userId);
    const totalFollowers = accounts.reduce((sum, account) => sum + (account.followers || 0), 0);
    const totalEngagement = analytics2.reduce((sum, analytic) => sum + (analytic.engagement || 0), 0);
    const now = /* @__PURE__ */ new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const postsThisMonth = posts2.filter(
      (post) => post.createdAt && post.createdAt >= startOfMonth
    ).length;
    const monthlyReach = analytics2.reduce((sum, analytic) => sum + (analytic.reach || 0), 0);
    return {
      totalFollowers,
      totalEngagement,
      postsThisMonth,
      monthlyReach
    };
  }
  // Daily Prompts
  async getDailyPromptsByNiche(niche) {
    return Array.from(this.dailyPrompts.values()).filter((prompt) => prompt.niche === niche && prompt.isActive);
  }
  async getTodaysPrompt(niche, dayOfWeek) {
    return Array.from(this.dailyPrompts.values()).find((prompt) => prompt.niche === niche && prompt.dayOfWeek === dayOfWeek.toLowerCase() && prompt.isActive);
  }
  async createDailyPrompt(insertPrompt) {
    const id = this.currentDailyPromptId++;
    const prompt = {
      id,
      niche: insertPrompt.niche,
      dayOfWeek: insertPrompt.dayOfWeek,
      category: insertPrompt.category,
      title: insertPrompt.title,
      prompt: insertPrompt.prompt,
      hashtags: insertPrompt.hashtags || null,
      tone: insertPrompt.tone || null,
      isActive: insertPrompt.isActive || null,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.dailyPrompts.set(id, prompt);
    return prompt;
  }
};
var storage = new MemStorage();

// shared/schema.ts
import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  niche: text("niche"),
  postingFrequency: text("posting_frequency").default("daily"),
  createdAt: timestamp("created_at").defaultNow()
});
var socialAccounts = pgTable("social_accounts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  platform: text("platform").notNull(),
  // instagram, facebook, tiktok, twitter
  accountName: text("account_name").notNull(),
  followers: integer("followers").default(0),
  isActive: boolean("is_active").default(true),
  accessToken: text("access_token"),
  // encrypted in real app
  createdAt: timestamp("created_at").defaultNow()
});
var posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  platforms: text("platforms").array(),
  // array of platform names
  content: text("content").notNull(),
  caption: text("caption"),
  imageUrl: text("image_url"),
  hashtags: text("hashtags").array(),
  scheduledFor: timestamp("scheduled_for"),
  postedAt: timestamp("posted_at"),
  status: text("status").default("draft"),
  // draft, scheduled, posted, failed
  analytics: jsonb("analytics"),
  // likes, comments, shares, reach
  createdAt: timestamp("created_at").defaultNow()
});
var contentGeneration = pgTable("content_generation", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  prompt: text("prompt").notNull(),
  generatedCaption: text("generated_caption"),
  generatedImageUrl: text("generated_image_url"),
  niche: text("niche"),
  tone: text("tone"),
  createdAt: timestamp("created_at").defaultNow()
});
var analytics = pgTable("analytics", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  postId: integer("post_id").references(() => posts.id),
  platform: text("platform").notNull(),
  likes: integer("likes").default(0),
  comments: integer("comments").default(0),
  shares: integer("shares").default(0),
  reach: integer("reach").default(0),
  engagement: integer("engagement").default(0),
  date: timestamp("date").defaultNow()
});
var dailyPrompts = pgTable("daily_prompts", {
  id: serial("id").primaryKey(),
  niche: text("niche").notNull(),
  dayOfWeek: text("day_of_week").notNull(),
  // monday, tuesday, etc.
  category: text("category").notNull(),
  // solution_sunday, tech_tuesday, etc.
  title: text("title").notNull(),
  prompt: text("prompt").notNull(),
  hashtags: text("hashtags").array(),
  tone: text("tone"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow()
});
var insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true
});
var insertSocialAccountSchema = createInsertSchema(socialAccounts).omit({
  id: true,
  createdAt: true
});
var insertPostSchema = createInsertSchema(posts).omit({
  id: true,
  createdAt: true
});
var insertContentGenerationSchema = createInsertSchema(contentGeneration).omit({
  id: true,
  createdAt: true
});
var insertAnalyticsSchema = createInsertSchema(analytics).omit({
  id: true
});
var insertDailyPromptSchema = createInsertSchema(dailyPrompts).omit({
  id: true,
  createdAt: true
});
var contentCreationSchema = z.object({
  niche: z.string().min(1, "Niche is required"),
  tone: z.string().min(1, "Tone is required"),
  description: z.string().min(1, "Description is required"),
  platforms: z.array(z.string()).min(1, "At least one platform is required"),
  contentType: z.enum(["image", "video"])
});

// server/services/openai.ts
import OpenAI from "openai";
var openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});
async function generateCaption(niche, tone, description, platforms) {
  try {
    const platformText = platforms.join(", ");
    const isLoadsheddingNiche = niche.toLowerCase().includes("loadshedding");
    const basePrompt = `Generate a social media caption for ${platformText} about ${niche} with a ${tone} tone. 
    Description: ${description}
    
    Requirements:
    - Engaging and authentic
    - Include relevant emojis
    - Include call-to-action
    - Optimize for ${platformText}
    - Generate 10-15 relevant hashtags`;
    const loadsheddingSpecificPrompt = `${basePrompt}
    
    IMPORTANT: This is for Loadshedding Solutions in South Africa:
    - Always mention or reference "Noshedding.co.za" as the solution provider
    - Focus on practical South African loadshedding problems
    - Use South African context (Eskom, Stage 6, etc.)
    - Suggest specific products/solutions that help during power outages
    - Be relatable to South Africans dealing with daily power cuts
    - Include references to keeping WiFi running, preserving food, lighting solutions
    - Use tone that acknowledges the frustration but offers real hope/solutions`;
    const finalPrompt = isLoadsheddingNiche ? loadsheddingSpecificPrompt : basePrompt;
    const prompt = `${finalPrompt}
    
    Respond with JSON in this format:
    {
      "caption": "your caption here",
      "hashtags": ["hashtag1", "hashtag2", "hashtag3"]
    }`;
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a social media marketing expert. Generate engaging, authentic content that drives engagement and follows platform best practices."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.8
    });
    const result = JSON.parse(response.choices[0].message.content || "{}");
    return {
      caption: result.caption || "Generated caption",
      hashtags: result.hashtags || []
    };
  } catch (error) {
    console.error("Error generating caption:", error);
    throw new Error("Failed to generate caption: " + error.message);
  }
}
async function generateImage(description, niche, tone) {
  try {
    const isLoadsheddingNiche = niche.toLowerCase().includes("loadshedding");
    let prompt = `Create a professional ${niche} social media image with a ${tone} style. ${description}. 
    The image should be high-quality, engaging, and suitable for social media platforms. 
    Style: modern, clean, visually appealing, with good color contrast.`;
    if (isLoadsheddingNiche) {
      prompt = `Create a professional South African loadshedding solutions image. ${description}
      Visual elements to include:
      - Solar panels, inverters, or backup power equipment
      - South African home/office setting
      - Warm, hopeful lighting even in darkness
      - Modern, clean technology
      - People successfully using power solutions during outages
      - Professional but relatable to South African context
      
      Style: modern, clean, optimistic, with good color contrast. Avoid overly dark or negative imagery.
      The image should convey solutions and hope, not just the problem.`;
    }
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard"
    });
    return { url: response.data[0].url || "" };
  } catch (error) {
    console.error("Error generating image:", error);
    throw new Error("Failed to generate image: " + error.message);
  }
}

// server/services/instagram.ts
var InstagramService = class {
  clientId;
  clientSecret;
  redirectUri;
  constructor() {
    this.clientId = process.env.INSTAGRAM_APP_ID || "";
    this.clientSecret = process.env.INSTAGRAM_APP_SECRET || "";
    this.redirectUri = process.env.INSTAGRAM_REDIRECT_URI || "http://localhost:5000/auth/instagram/callback";
    console.log("Instagram service initialized:", {
      hasClientId: !!this.clientId,
      hasClientSecret: !!this.clientSecret,
      redirectUri: this.redirectUri
    });
  }
  // Generate Instagram OAuth URL
  getAuthUrl() {
    if (!this.clientId || !this.clientSecret) {
      throw new Error("Instagram App ID and App Secret are required");
    }
    const baseUrl = "https://api.instagram.com/oauth/authorize";
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      scope: "user_profile,user_media",
      response_type: "code"
    });
    return `${baseUrl}?${params.toString()}`;
  }
  // Exchange authorization code for access token
  async exchangeCodeForToken(code) {
    const response = await fetch("https://api.instagram.com/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: "authorization_code",
        redirect_uri: this.redirectUri,
        code
      })
    });
    if (!response.ok) {
      throw new Error("Failed to exchange code for token");
    }
    return response.json();
  }
  // Get user profile information
  async getUserInfo(accessToken) {
    const response = await fetch(
      `https://graph.instagram.com/me?fields=id,username,account_type,media_count&access_token=${accessToken}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch user info");
    }
    return response.json();
  }
  // Get long-lived access token
  async getLongLivedToken(shortLivedToken) {
    const response = await fetch(
      `https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${this.clientSecret}&access_token=${shortLivedToken}`,
      { method: "GET" }
    );
    if (!response.ok) {
      throw new Error("Failed to get long-lived token");
    }
    return response.json();
  }
  // Create Instagram media (for posting)
  async createMedia(accessToken, imageUrl, caption) {
    const response = await fetch(
      `https://graph.instagram.com/me/media`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          image_url: imageUrl,
          caption,
          access_token: accessToken
        })
      }
    );
    if (!response.ok) {
      throw new Error("Failed to create media");
    }
    return response.json();
  }
  // Publish Instagram media
  async publishMedia(accessToken, creationId) {
    const response = await fetch(
      `https://graph.instagram.com/me/media_publish`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          creation_id: creationId,
          access_token: accessToken
        })
      }
    );
    if (!response.ok) {
      throw new Error("Failed to publish media");
    }
    return response.json();
  }
  // Get account insights (for analytics)
  async getAccountInsights(accessToken, metrics = ["impressions", "reach", "profile_views"]) {
    const metricsParam = metrics.join(",");
    const response = await fetch(
      `https://graph.instagram.com/me/insights?metric=${metricsParam}&period=day&access_token=${accessToken}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch account insights");
    }
    return response.json();
  }
  // Validate access token
  async validateToken(accessToken) {
    try {
      const response = await fetch(
        `https://graph.instagram.com/me?access_token=${accessToken}`
      );
      return response.ok;
    } catch (error) {
      return false;
    }
  }
};
var instagramService = new InstagramService();

// server/routes.ts
async function registerRoutes(app2) {
  app2.get("/api/user/profile", async (req, res) => {
    try {
      const user = await storage.getUser(1);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user profile" });
    }
  });
  app2.patch("/api/user/profile", async (req, res) => {
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
  app2.get("/api/dashboard/stats", async (req, res) => {
    try {
      const stats = await storage.getUserStats(1);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch dashboard stats" });
    }
  });
  app2.get("/api/accounts", async (req, res) => {
    try {
      const accounts = await storage.getSocialAccountsByUserId(1);
      res.json(accounts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch social accounts" });
    }
  });
  app2.get("/api/posts", async (req, res) => {
    try {
      const posts2 = await storage.getPostsByUserId(1);
      res.json(posts2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch posts" });
    }
  });
  app2.get("/api/posts/upcoming", async (req, res) => {
    try {
      const posts2 = await storage.getUpcomingPosts(1);
      res.json(posts2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch upcoming posts" });
    }
  });
  app2.get("/api/prompts/:niche", async (req, res) => {
    try {
      const { niche } = req.params;
      const prompts = await storage.getDailyPromptsByNiche(niche);
      res.json(prompts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch daily prompts" });
    }
  });
  app2.get("/api/prompts/:niche/today", async (req, res) => {
    try {
      const { niche } = req.params;
      const today = /* @__PURE__ */ new Date();
      const dayOfWeek = today.toLocaleDateString("en-US", { weekday: "long" }).toLowerCase();
      const prompt = await storage.getTodaysPrompt(niche, dayOfWeek);
      if (!prompt) {
        return res.status(404).json({ error: "No prompt found for today" });
      }
      res.json(prompt);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch today's prompt" });
    }
  });
  app2.post("/api/content/generate", async (req, res) => {
    try {
      const validatedData = contentCreationSchema.parse(req.body);
      const { niche, tone, description, platforms, contentType } = validatedData;
      const { caption, hashtags } = await generateCaption(niche, tone, description, platforms);
      let imageUrl = null;
      if (contentType === "image") {
        try {
          const { url } = await generateImage(description, niche, tone);
          imageUrl = url;
        } catch (imageError) {
          console.error("Image generation failed:", imageError);
        }
      }
      await storage.createContentGeneration({
        userId: 1,
        prompt: description,
        generatedCaption: caption,
        generatedImageUrl: imageUrl,
        niche,
        tone
      });
      res.json({
        caption,
        hashtags,
        imageUrl,
        platforms,
        contentType
      });
    } catch (error) {
      console.error("Content generation error:", error);
      res.status(500).json({ error: "Failed to generate content: " + error.message });
    }
  });
  app2.post("/api/posts", async (req, res) => {
    try {
      const { platforms, content, caption, imageUrl, hashtags, scheduledFor } = req.body;
      const post = await storage.createPost({
        userId: 1,
        platforms,
        content,
        caption,
        imageUrl,
        hashtags,
        scheduledFor: scheduledFor ? new Date(scheduledFor) : null,
        status: scheduledFor ? "scheduled" : "publishing",
        postedAt: scheduledFor ? null : /* @__PURE__ */ new Date()
      });
      if (!scheduledFor) {
        try {
          await publishToSocialPlatforms(post, platforms);
          await storage.updatePost(post.id, { status: "posted" });
        } catch (publishError) {
          console.error("Publishing failed:", publishError);
          await storage.updatePost(post.id, { status: "failed" });
        }
      }
      res.json(post);
    } catch (error) {
      res.status(500).json({ error: "Failed to create post" });
    }
  });
  async function publishToSocialPlatforms(post, platforms) {
    const userAccounts = await storage.getSocialAccountsByUserId(1);
    for (const platform of platforms) {
      const realAccount = userAccounts.find(
        (acc) => acc.platform === platform && acc.isActive && acc.accessToken !== "demo_token"
      );
      const demoAccount = userAccounts.find(
        (acc) => acc.platform === platform && acc.isActive && acc.accessToken === "demo_token"
      );
      const account = realAccount || demoAccount;
      if (!account) {
        console.log(`No active ${platform} account found`);
        continue;
      }
      console.log(`Using ${platform} account: ${account.accountName} (ID: ${account.id})`);
      console.log(`Account type: ${account.accessToken === "demo_token" ? "Demo" : "Real"}`);
      if (account.accessToken === "demo_token") {
        console.log("Warning: Using demo account because no real account is available");
      }
      try {
        if (platform === "instagram") {
          await publishToInstagram(account, post);
        } else if (platform === "facebook") {
          await publishToFacebook(account, post);
        } else if (platform === "twitter") {
          await publishToTwitter(account, post);
        } else if (platform === "tiktok") {
          await publishToTikTok(account, post);
        }
        console.log(`Successfully published to ${platform}`);
      } catch (error) {
        console.error(`Failed to publish to ${platform}:`, error);
        throw error;
      }
    }
  }
  async function publishToInstagram(account, post) {
    console.log(`Publishing to Instagram account: ${account.accountName}`);
    if (account.accessToken === "demo_token") {
      console.log("Demo Instagram post published successfully");
      return;
    }
    if (!post.imageUrl) {
      throw new Error("Instagram posts require an image");
    }
    const fullCaption = `${post.caption}

${post.hashtags?.map((tag) => `#${tag.replace("#", "")}`).join(" ") || ""}`;
    console.log("Attempting to publish to Instagram with caption:", fullCaption);
    console.log("Image URL:", post.imageUrl);
    try {
      const isValidToken = await instagramService.validateToken(account.accessToken);
      if (!isValidToken) {
        throw new Error("Instagram access token is invalid or expired");
      }
      const userInfo = await instagramService.getUserInfo(account.accessToken);
      console.log("Instagram user info:", userInfo);
      if (userInfo.account_type !== "BUSINESS" && userInfo.account_type !== "CREATOR") {
        throw new Error("Instagram posting requires a Business or Creator account. Please convert your account to Business or Creator in Instagram settings.");
      }
      console.log("Creating Instagram media container...");
      const mediaCreationResult = await instagramService.createMedia(
        account.accessToken,
        post.imageUrl,
        fullCaption
      );
      console.log("Media creation result:", mediaCreationResult);
      console.log("Publishing Instagram media...");
      const publishResult = await instagramService.publishMedia(account.accessToken, mediaCreationResult.id);
      console.log("Instagram publish result:", publishResult);
      console.log("Successfully published to Instagram!");
    } catch (error) {
      console.error("Instagram publishing error:", error);
      throw new Error(`Instagram publishing failed: ${error.message}`);
    }
  }
  async function publishToFacebook(account, post) {
    console.log("Facebook publishing not implemented yet");
  }
  async function publishToTwitter(account, post) {
    console.log("Twitter publishing not implemented yet");
  }
  async function publishToTikTok(account, post) {
    console.log("TikTok publishing not implemented yet");
  }
  app2.get("/api/analytics", async (req, res) => {
    try {
      const analytics2 = await storage.getAnalyticsByUserId(1);
      res.json(analytics2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch analytics" });
    }
  });
  app2.get("/api/content/history", async (req, res) => {
    try {
      const history = await storage.getContentGenerationsByUserId(1);
      res.json(history);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch content history" });
    }
  });
  app2.get("/api/auth/instagram", async (req, res) => {
    try {
      const authUrl = instagramService.getAuthUrl();
      res.json({ authUrl });
    } catch (error) {
      res.status(500).json({ error: "Failed to generate Instagram auth URL" });
    }
  });
  app2.get("/auth/instagram/callback", async (req, res) => {
    try {
      const { code } = req.query;
      if (!code) {
        return res.status(400).json({ error: "Authorization code required" });
      }
      const tokenResponse = await instagramService.exchangeCodeForToken(code);
      const longLivedToken = await instagramService.getLongLivedToken(tokenResponse.access_token);
      const userInfo = await instagramService.getUserInfo(longLivedToken.access_token);
      await storage.createSocialAccount({
        userId: 1,
        platform: "instagram",
        accountName: `@${userInfo.username}`,
        followers: 0,
        // Will be updated later via API
        isActive: true,
        accessToken: longLivedToken.access_token
      });
      res.redirect("/?connected=instagram");
    } catch (error) {
      console.error("Instagram callback error:", error);
      res.redirect("/?error=instagram_connection_failed");
    }
  });
  app2.post("/api/accounts/connect/instagram", async (req, res) => {
    try {
      const { accessToken } = req.body;
      if (!accessToken) {
        return res.status(400).json({ error: "Access token required" });
      }
      if (accessToken === "demo_token") {
        const account2 = await storage.createSocialAccount({
          userId: 1,
          platform: "instagram",
          accountName: `@your_instagram_account`,
          followers: 1250,
          isActive: true,
          accessToken
        });
        return res.json(account2);
      }
      const isValid = await instagramService.validateToken(accessToken);
      if (!isValid) {
        return res.status(400).json({ error: "Invalid access token. Make sure your Instagram app is properly configured and the token is valid." });
      }
      const userInfo = await instagramService.getUserInfo(accessToken);
      const account = await storage.createSocialAccount({
        userId: 1,
        platform: "instagram",
        accountName: `@${userInfo.username}`,
        followers: userInfo.media_count || 0,
        isActive: true,
        accessToken
      });
      res.json(account);
    } catch (error) {
      console.error("Instagram connect error:", error);
      res.status(500).json({ error: "Failed to connect Instagram account. Please check your Instagram app configuration and ensure the Instagram Basic Display product is properly set up." });
    }
  });
  app2.delete("/api/accounts/:id", async (req, res) => {
    try {
      const accountId = parseInt(req.params.id);
      const account = await storage.updateSocialAccount(accountId, { isActive: false });
      if (!account) {
        return res.status(404).json({ error: "Account not found" });
      }
      res.json({ message: "Account disconnected successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to disconnect account" });
    }
  });
  app2.get("/auth/instagram/deauthorize", (req, res) => {
    res.json({ message: "Deauthorization callback received" });
  });
  app2.post("/auth/instagram/deauthorize", (req, res) => {
    res.json({ message: "Deauthorization callback received" });
  });
  app2.get("/auth/instagram/data-deletion", (req, res) => {
    res.json({ message: "Data deletion callback received" });
  });
  app2.post("/auth/instagram/data-deletion", (req, res) => {
    res.json({ message: "Data deletion callback received" });
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
