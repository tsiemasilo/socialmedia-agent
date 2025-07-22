import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  niche: text("niche"),
  postingFrequency: text("posting_frequency").default("daily"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const socialAccounts = pgTable("social_accounts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  platform: text("platform").notNull(), // instagram, facebook, tiktok, twitter
  accountName: text("account_name").notNull(),
  followers: integer("followers").default(0),
  isActive: boolean("is_active").default(true),
  accessToken: text("access_token"), // encrypted in real app
  createdAt: timestamp("created_at").defaultNow(),
});

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  platforms: text("platforms").array(), // array of platform names
  content: text("content").notNull(),
  caption: text("caption"),
  imageUrl: text("image_url"),
  hashtags: text("hashtags").array(),
  scheduledFor: timestamp("scheduled_for"),
  postedAt: timestamp("posted_at"),
  status: text("status").default("draft"), // draft, scheduled, posted, failed
  analytics: jsonb("analytics"), // likes, comments, shares, reach
  createdAt: timestamp("created_at").defaultNow(),
});

export const contentGeneration = pgTable("content_generation", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  prompt: text("prompt").notNull(),
  generatedCaption: text("generated_caption"),
  generatedImageUrl: text("generated_image_url"),
  niche: text("niche"),
  tone: text("tone"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const analytics = pgTable("analytics", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  postId: integer("post_id").references(() => posts.id),
  platform: text("platform").notNull(),
  likes: integer("likes").default(0),
  comments: integer("comments").default(0),
  shares: integer("shares").default(0),
  reach: integer("reach").default(0),
  engagement: integer("engagement").default(0),
  date: timestamp("date").defaultNow(),
});

export const dailyPrompts = pgTable("daily_prompts", {
  id: serial("id").primaryKey(),
  niche: text("niche").notNull(),
  dayOfWeek: text("day_of_week").notNull(), // monday, tuesday, etc.
  category: text("category").notNull(), // solution_sunday, tech_tuesday, etc.
  title: text("title").notNull(),
  prompt: text("prompt").notNull(),
  hashtags: text("hashtags").array(),
  tone: text("tone"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertSocialAccountSchema = createInsertSchema(socialAccounts).omit({
  id: true,
  createdAt: true,
});

export const insertPostSchema = createInsertSchema(posts).omit({
  id: true,
  createdAt: true,
});

export const insertContentGenerationSchema = createInsertSchema(contentGeneration).omit({
  id: true,
  createdAt: true,
});

export const insertAnalyticsSchema = createInsertSchema(analytics).omit({
  id: true,
  date: true,
});

export const insertDailyPromptSchema = createInsertSchema(dailyPrompts).omit({
  id: true,
  createdAt: true,
});

// Content creation request schema
export const contentCreationSchema = z.object({
  niche: z.string().min(1, "Niche is required"),
  tone: z.string().min(1, "Tone is required"),
  description: z.string().min(1, "Description is required"),
  platforms: z.array(z.string()).min(1, "At least one platform is required"),
  contentType: z.enum(["image", "video"]),
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type SocialAccount = typeof socialAccounts.$inferSelect;
export type InsertSocialAccount = z.infer<typeof insertSocialAccountSchema>;
export type Post = typeof posts.$inferSelect;
export type InsertPost = z.infer<typeof insertPostSchema>;
export type ContentGeneration = typeof contentGeneration.$inferSelect;
export type InsertContentGeneration = z.infer<typeof insertContentGenerationSchema>;
export type Analytics = typeof analytics.$inferSelect;
export type InsertAnalytics = z.infer<typeof insertAnalyticsSchema>;
export type DailyPrompt = typeof dailyPrompts.$inferSelect;
export type InsertDailyPrompt = z.infer<typeof insertDailyPromptSchema>;
export type ContentCreationRequest = z.infer<typeof contentCreationSchema>;
