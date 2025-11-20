import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User accounts with subscription tracking
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  name: text("name"),
  phone: text("phone"),
  passwordHash: text("password_hash"),
  profileImage: text("profile_image"), // Base64 or URL
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  isPremium: boolean("is_premium").notNull().default(false),
  freeAnalysesUsed: integer("free_analyses_used").notNull().default(0),
  
  // Personal health profile
  age: integer("age"),
  weight: integer("weight"), // in kg
  height: integer("height"), // in cm
  gender: text("gender"), // male, female, other
  healthGoals: text("health_goals"), // e.g., "weight loss, muscle gain, immune support"
  allergies: text("allergies"), // comma-separated
  medications: text("medications"), // comma-separated
  activityLevel: text("activity_level"), // sedentary, light, moderate, active, very active
  dietType: text("diet_type"), // omnivore, vegetarian, vegan, keto, etc
  
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const signupSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  passwordHash: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Supplement analyses with full AI results
export const analyses = pgTable("analyses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  productName: text("product_name").notNull(),
  brand: text("brand"),
  score: integer("score").notNull(),
  inputType: text("input_type").notNull(), // photo, text, voice
  inputContent: text("input_content").notNull(),
  
  // AI analysis results stored as JSON
  ingredients: jsonb("ingredients").notNull(), // Array of ingredient analysis objects
  totalSavings: integer("total_savings").notNull().default(0), // in cents
  onlineAlternatives: jsonb("online_alternatives"), // Array of alternative products
  localAlternatives: jsonb("local_alternatives"), // Array of local store alternatives
  
  // User-noted benefits/use cases
  benefits: text("benefits"), // What this supplement helps with (e.g., "Immune support, Energy, Sleep")
  
  // Price monitoring
  monitorPrice: boolean("monitor_price").notNull().default(false),
  targetPrice: integer("target_price"), // in cents - notify when price drops below this
  
  // Product image
  productImage: text("product_image"), // URL to product image
  
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertAnalysisSchema = createInsertSchema(analyses).omit({
  id: true,
  createdAt: true,
});

export type InsertAnalysis = z.infer<typeof insertAnalysisSchema>;
export type Analysis = typeof analyses.$inferSelect;

// Ingredient analysis structure (stored in JSON)
export const ingredientAnalysisSchema = z.object({
  name: z.string(),
  actualDosage: z.string(),
  idealDosage: z.string(),
  percentage: z.number(),
  efficacy: z.enum(["high", "medium", "low"]),
  explanation: z.string(),
});

export type IngredientAnalysis = z.infer<typeof ingredientAnalysisSchema>;

// Alternative product structure (stored in JSON)
export const alternativeProductSchema = z.object({
  name: z.string(),
  brand: z.string(),
  score: z.number(),
  price: z.number(),
  currentPrice: z.number().optional(),
  savings: z.number().optional(),
  location: z.string().optional(),
  distance: z.string().optional(),
  url: z.string().optional(),
});

export type AlternativeProduct = z.infer<typeof alternativeProductSchema>;
