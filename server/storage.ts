import { 
  User, 
  SocialAccount, 
  Post, 
  ContentGeneration, 
  Analytics, 
  DailyPrompt,
  InsertUser,
  InsertSocialAccount,
  InsertPost,
  InsertContentGeneration,
  InsertAnalytics,
  InsertDailyPrompt
} from "../shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined>;

  // Social Accounts
  getSocialAccountsByUserId(userId: number): Promise<SocialAccount[]>;
  createSocialAccount(account: InsertSocialAccount): Promise<SocialAccount>;
  updateSocialAccount(id: number, account: Partial<InsertSocialAccount>): Promise<SocialAccount | undefined>;
  deleteSocialAccount(id: number): Promise<void>;
  getSocialAccountByPlatformAndUserId(platform: string, userId: number): Promise<SocialAccount | undefined>;

  // Posts
  getPostsByUserId(userId: number): Promise<Post[]>;
  getUpcomingPosts(userId: number): Promise<Post[]>;
  createPost(post: InsertPost): Promise<Post>;
  updatePost(id: number, post: Partial<InsertPost>): Promise<Post | undefined>;

  // Content Generation
  getContentGenerationsByUserId(userId: number): Promise<ContentGeneration[]>;
  createContentGeneration(generation: InsertContentGeneration): Promise<ContentGeneration>;

  // Analytics
  getAnalyticsByUserId(userId: number): Promise<Analytics[]>;
  getAnalyticsByPostId(postId: number): Promise<Analytics[]>;
  createAnalytics(analytics: InsertAnalytics): Promise<Analytics>;

  // Dashboard stats
  getUserStats(userId: number): Promise<{
    totalFollowers: number;
    totalEngagement: number;
    postsThisMonth: number;
    monthlyReach: number;
  }>;

  // Daily Prompts
  getDailyPromptsByNiche(niche: string): Promise<DailyPrompt[]>;
  getTodaysPrompt(niche: string, dayOfWeek: string): Promise<DailyPrompt | undefined>;
  createDailyPrompt(prompt: InsertDailyPrompt): Promise<DailyPrompt>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private socialAccounts: Map<number, SocialAccount>;
  private posts: Map<number, Post>;
  private contentGenerations: Map<number, ContentGeneration>;
  private analytics: Map<number, Analytics>;
  private dailyPrompts: Map<number, DailyPrompt>;
  private currentUserId: number;
  private currentSocialAccountId: number;
  private currentPostId: number;
  private currentContentGenerationId: number;
  private currentAnalyticsId: number;
  private currentDailyPromptId: number;

  constructor() {
    this.users = new Map();
    this.socialAccounts = new Map();
    this.posts = new Map();
    this.contentGenerations = new Map();
    this.analytics = new Map();
    this.dailyPrompts = new Map();
    this.currentUserId = 1;
    this.currentSocialAccountId = 1;
    this.currentPostId = 1;
    this.currentContentGenerationId = 1;
    this.currentAnalyticsId = 1;
    this.currentDailyPromptId = 1;

    // Initialize only the daily prompts system
    this.initializeLoadsheddingPrompts();
  }

  private initializeLoadsheddingPrompts() {
    const loadsheddingPrompts: DailyPrompt[] = [
      {
        id: 1,
        niche: "Loadshedding Solutions",
        dayOfWeek: "sunday",
        category: "Solution Sunday",
        title: "Entertaining Question + Daily Product",
        prompt: "Create an entertaining post combining a fun question with today's featured product. Examples: 'What's the weirdest thing you've done in the dark during loadshedding? 🕯️ Speaking of staying powered up, today's hero is the EcoFlow River Mini - perfect for keeping your WiFi alive!' or 'If Eskom was a person, what would you say to them? 😅 While we wait for answers, check out this portable power station that doesn't leave you hanging!' Feature real products from noshedding.co.za with practical explanations.",
        hashtags: ["#LoadSheddingLife", "#NosheddingZA", "#PowerSolutions", "#SouthAfricaVibes"],
        tone: "fun and relatable with practical value - like chatting with a friend who has great advice",
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: 2,
        niche: "Loadshedding Solutions",
        dayOfWeek: "monday",
        category: "Monday Motivation + Tips",
        title: "Week Starter with Static Tip",
        prompt: "Start the week with motivation and a practical static tip. Examples: 'New week, new opportunity to outsmart loadshedding! 💪 Pro tip: Boil water and store it in a flask before the power goes - hot drinks and instant meals sorted!' or 'Monday motivation: You survived last week's outages, you've got this! ⚡ Remember to charge your inverter during off-peak hours to save on Eskom bills.' Include encouragement plus actionable advice.",
        hashtags: ["#MondayMotivation", "#LoadSheddingTips", "#NosheddingZA", "#PowerPlanning"],
        tone: "motivational and encouraging with practical wisdom",
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: 3,
        niche: "Loadshedding Solutions",
        dayOfWeek: "tuesday",
        category: "Tech Tuesday - Product Spotlight",
        title: "Featured Product Deep Dive",
        prompt: "Spotlight a specific real product from noshedding.co.za with detailed explanation. Rotate between: 300W Solar Power Bank (R5,799) - perfect for phones/tablets/WiFi, Ultra Tec 800 Lumen LED Lantern with Powerbank (R615) - lights plus charging, SNADI 500W Solar Generator (R38,600) - home backup power, or 20A Solar Charge Controller (R500) - DIY solar setups. Format: '🔋 Today's Power Hero: [Product Name] - Here's why it's perfect for SA homes during loadshedding: [practical benefits and real use cases]'",
        hashtags: ["#TechTuesday", "#ProductSpotlight", "#NosheddingZA", "#LoadSheddingGear"],
        tone: "informative and enthusiastic, like a tech reviewer who gets excited about practical solutions",
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: 4,
        niche: "Loadshedding Solutions",
        dayOfWeek: "wednesday",
        category: "Watt Wednesday - Educational Content",
        title: "Educational Question + Practical Tip",
        prompt: "Combine an educational question with energy wisdom. Examples: 'Quick poll: What appliance uses the most electricity in your home? 🤔 (Hint: That geyser is probably 40% of your bill!) Pro tip: Lower your geyser to 55°C and save up to 20%' or 'Share your ultimate loadshedding survival tip! ⚡ Here's mine: Unplug energy vampires - TV boxes, microwaves on standby drain power 24/7!' or 'What's your biggest loadshedding frustration? Mine used to be losing WiFi - until I got a UPS for my router!'",
        hashtags: ["#WattWednesday", "#EnergySaving", "#LoadSheddingHacks", "#NosheddingZA"],
        tone: "educational but conversational, like teaching a friend something cool",
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: 5,
        niche: "Loadshedding Solutions",
        dayOfWeek: "thursday",
        category: "Tips Thursday - Practical Hacks",
        title: "Static Tips & User Wisdom",
        prompt: "Share practical static tips mixed with user-generated content. Examples: 'Pro hack: Boil water and store in a flask before loadshedding - hot drinks and instant meals sorted! ☕' or 'Life hack: Charge your devices in this order of priority - phone first, then laptop, then tablet. What's your charging priority order?' Include static tips like 'Freeze water bottles during power-on time, use as ice packs to keep fridge cold longer' or 'Keep torch and powerbank in same drawer - you'll thank yourself at 6pm!'",
        hashtags: ["#TipsThursday", "#LoadSheddingHacks", "#SouthAfricaLife", "#NosheddingZA"],
        tone: "practical and community-focused, sharing wisdom like helpful neighbors",
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: 6,
        niche: "Loadshedding Solutions",
        dayOfWeek: "friday",
        category: "Feature Friday - Product Showcase",
        title: "Weekly Product Feature",
        prompt: "Deep dive into a specific noshedding.co.za product with price and practical benefits. Examples: 'Feature Friday: AC 230V Surge Protector (R570) - Your appliances' best friend! 🛡️ This little hero saves your TV, fridge, and electronics from power surges when electricity comes back. Much cheaper than replacing damaged equipment!' or 'Spotlight: Outdoor Solar Security Alarm Lamp (R555) - Motion detection + solar charging + bright light = perfect for securing your property during outages!'",
        hashtags: ["#FeatureFriday", "#ProductReview", "#NosheddingZA", "#LoadSheddingGear"],
        tone: "detailed and helpful, like a product expert explaining value",
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: 7,
        niche: "Loadshedding Solutions",
        dayOfWeek: "saturday",
        category: "Saturday Fun - Interactive Content",
        title: "Entertaining Polls & Questions",
        prompt: "Create entertaining, engaging content that gets conversations going. Examples: 'Saturday poll: What's the weirdest thing you've done in the dark during loadshedding? 🕯️ A) Brushed teeth with phone flashlight B) Cooked with car headlights C) Played board games by candlelight D) Other (tell us!)' or 'If Eskom was a person, what would you say to them today? 😅 Let's keep it fun!' Mix humor with community building.",
        hashtags: ["#SaturdayFun", "#LoadSheddingLife", "#SouthAfricaVibes", "#CommunityChat"],
        tone: "fun and entertaining, building community through shared experiences",
        isActive: true,
        createdAt: new Date(),
      },
    ];

    loadsheddingPrompts.forEach(prompt => {
      this.dailyPrompts.set(prompt.id, prompt);
    });
    this.currentDailyPromptId = 8;
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = {
      id,
      username: insertUser.username,
      email: insertUser.email,
      password: insertUser.password,
      niche: insertUser.niche || null,
      postingFrequency: insertUser.postingFrequency || null,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, updateUser: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updateUser };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Social Accounts
  async getSocialAccountsByUserId(userId: number): Promise<SocialAccount[]> {
    return Array.from(this.socialAccounts.values()).filter(account => account.userId === userId);
  }

  async createSocialAccount(insertAccount: InsertSocialAccount): Promise<SocialAccount> {
    const id = this.currentSocialAccountId++;
    const account: SocialAccount = {
      id,
      userId: insertAccount.userId || null,
      platform: insertAccount.platform,
      accountName: insertAccount.accountName,
      followers: insertAccount.followers || null,
      isActive: insertAccount.isActive || null,
      accessToken: insertAccount.accessToken || null,
      createdAt: new Date(),
    };
    this.socialAccounts.set(id, account);
    return account;
  }

  async updateSocialAccount(id: number, updateAccount: Partial<InsertSocialAccount>): Promise<SocialAccount | undefined> {
    const account = this.socialAccounts.get(id);
    if (!account) return undefined;
    
    const updatedAccount = { ...account, ...updateAccount };
    this.socialAccounts.set(id, updatedAccount);
    return updatedAccount;
  }

  async deleteSocialAccount(id: number): Promise<void> {
    this.socialAccounts.delete(id);
  }

  async getSocialAccountByPlatformAndUserId(platform: string, userId: number): Promise<SocialAccount | undefined> {
    return Array.from(this.socialAccounts.values())
      .find(account => account.platform === platform && account.userId === userId);
  }

  // Posts
  async getPostsByUserId(userId: number): Promise<Post[]> {
    return Array.from(this.posts.values()).filter(post => post.userId === userId);
  }

  async getUpcomingPosts(userId: number): Promise<Post[]> {
    return Array.from(this.posts.values())
      .filter(post => post.userId === userId && post.status === "scheduled")
      .sort((a, b) => new Date(a.scheduledFor!).getTime() - new Date(b.scheduledFor!).getTime());
  }

  async createPost(insertPost: InsertPost): Promise<Post> {
    const id = this.currentPostId++;
    const post: Post = {
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
      createdAt: new Date(),
    };
    this.posts.set(id, post);
    return post;
  }

  async updatePost(id: number, updatePost: Partial<InsertPost>): Promise<Post | undefined> {
    const post = this.posts.get(id);
    if (!post) return undefined;
    
    const updatedPost = { ...post, ...updatePost };
    this.posts.set(id, updatedPost);
    return updatedPost;
  }

  // Content Generation
  async getContentGenerationsByUserId(userId: number): Promise<ContentGeneration[]> {
    return Array.from(this.contentGenerations.values()).filter(gen => gen.userId === userId);
  }

  async createContentGeneration(insertGeneration: InsertContentGeneration): Promise<ContentGeneration> {
    const id = this.currentContentGenerationId++;
    const generation: ContentGeneration = {
      id,
      userId: insertGeneration.userId || null,
      prompt: insertGeneration.prompt,
      generatedCaption: insertGeneration.generatedCaption || null,
      generatedImageUrl: insertGeneration.generatedImageUrl || null,
      createdAt: new Date(),
    };
    this.contentGenerations.set(id, generation);
    return generation;
  }

  // Analytics
  async getAnalyticsByUserId(userId: number): Promise<Analytics[]> {
    return Array.from(this.analytics.values()).filter(analytics => analytics.userId === userId);
  }

  async getAnalyticsByPostId(postId: number): Promise<Analytics[]> {
    return Array.from(this.analytics.values()).filter(analytics => analytics.postId === postId);
  }

  async createAnalytics(insertAnalytics: InsertAnalytics): Promise<Analytics> {
    const id = this.currentAnalyticsId++;
    const analytics: Analytics = {
      id,
      userId: insertAnalytics.userId || null,
      postId: insertAnalytics.postId || null,
      platform: insertAnalytics.platform,
      likes: insertAnalytics.likes || null,
      comments: insertAnalytics.comments || null,
      shares: insertAnalytics.shares || null,
      reach: insertAnalytics.reach || null,
      engagement: insertAnalytics.engagement || null,
      createdAt: new Date(),
    };
    this.analytics.set(id, analytics);
    return analytics;
  }

  // Dashboard stats
  async getUserStats(userId: number): Promise<{
    totalFollowers: number;
    totalEngagement: number;
    postsThisMonth: number;
    monthlyReach: number;
  }> {
    const accounts = await this.getSocialAccountsByUserId(userId);
    const totalFollowers = accounts.reduce((sum, account) => sum + (account.followers || 0), 0);
    
    const analytics = await this.getAnalyticsByUserId(userId);
    const totalEngagement = analytics.reduce((sum, a) => sum + (a.likes || 0) + (a.comments || 0) + (a.shares || 0), 0);
    
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthlyAnalytics = analytics.filter(a => {
      if (!a.createdAt) return false;
      const date = new Date(a.createdAt);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });
    
    const postsThisMonth = monthlyAnalytics.length;
    const monthlyReach = monthlyAnalytics.reduce((sum, a) => sum + (a.reach || 0), 0);

    return {
      totalFollowers,
      totalEngagement,
      postsThisMonth,
      monthlyReach,
    };
  }

  // Daily Prompts
  async getDailyPromptsByNiche(niche: string): Promise<DailyPrompt[]> {
    return Array.from(this.dailyPrompts.values()).filter(prompt => prompt.niche === niche && prompt.isActive);
  }

  async getTodaysPrompt(niche: string, dayOfWeek: string): Promise<DailyPrompt | undefined> {
    return Array.from(this.dailyPrompts.values())
      .find(prompt => prompt.niche === niche && prompt.dayOfWeek === dayOfWeek && prompt.isActive);
  }

  async createDailyPrompt(insertPrompt: InsertDailyPrompt): Promise<DailyPrompt> {
    const id = this.currentDailyPromptId++;
    const prompt: DailyPrompt = {
      id,
      niche: insertPrompt.niche,
      dayOfWeek: insertPrompt.dayOfWeek,
      category: insertPrompt.category || null,
      title: insertPrompt.title,
      prompt: insertPrompt.prompt,
      hashtags: insertPrompt.hashtags || null,
      tone: insertPrompt.tone || null,
      isActive: insertPrompt.isActive || null,
      createdAt: new Date(),
    };
    this.dailyPrompts.set(id, prompt);
    return prompt;
  }
}

export const storage = new MemStorage();