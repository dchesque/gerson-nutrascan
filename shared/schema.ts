import { z } from "zod";

// Validation schemas
export const signupSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string(),
});

// User profile type (matches Supabase user_profiles table)
export interface UserProfile {
  id: string;
  email: string | null;
  name: string | null;
  phone: string | null;
  profile_image: string | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  is_premium: boolean;
  free_analyses_used: number;
  age: number | null;
  weight: number | null;
  height: number | null;
  gender: string | null;
  health_goals: string | null;
  allergies: string | null;
  medications: string | null;
  activity_level: string | null;
  diet_type: string | null;
  created_at: string;
  updated_at: string;
}

// Analysis type (matches Supabase analyses table)
export interface Analysis {
  id: string;
  user_id: string | null;
  product_name: string;
  brand: string | null;
  score: number;
  input_type: string;
  input_content: string;
  ingredients: unknown;
  total_savings: number;
  online_alternatives: unknown;
  local_alternatives: unknown;
  benefits: string | null;
  monitor_price: boolean;
  target_price: number | null;
  product_image: string | null;
  created_at: string;
}

// Insert types for creating new records
export interface InsertUserProfile {
  id: string;
  email?: string | null;
  name?: string | null;
  phone?: string | null;
  profile_image?: string | null;
  stripe_customer_id?: string | null;
  stripe_subscription_id?: string | null;
  is_premium?: boolean;
  free_analyses_used?: number;
  age?: number | null;
  weight?: number | null;
  height?: number | null;
  gender?: string | null;
  health_goals?: string | null;
  allergies?: string | null;
  medications?: string | null;
  activity_level?: string | null;
  diet_type?: string | null;
}

export interface InsertAnalysis {
  user_id?: string | null;
  product_name: string;
  brand?: string | null;
  score: number;
  input_type: string;
  input_content: string;
  ingredients: unknown;
  total_savings?: number;
  online_alternatives?: unknown;
  local_alternatives?: unknown;
  benefits?: string | null;
  monitor_price?: boolean;
  target_price?: number | null;
  product_image?: string | null;
}

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
