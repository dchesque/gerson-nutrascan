// API helper functions for NutraScan AI
import { supabase, getSupabaseToken } from "./supabase";

export interface AnalysisResult {
  analysisId: string;
  productName: string;
  brand: string;
  score: number;
  ingredients: Array<{
    name: string;
    actualDosage: string;
    idealDosage: string;
    percentage: number;
    efficacy: "high" | "medium" | "low";
    explanation: string;
  }>;
  totalSavings: number;
  onlineAlternatives: Array<{
    name: string;
    brand: string;
    score: number;
    price: number;
    currentPrice?: number;
    savings?: number;
    url?: string;
  }>;
  localAlternatives: Array<{
    name: string;
    brand: string;
    score: number;
    price: number;
    location?: string;
    distance?: string;
  }>;
}

export interface UserStatus {
  isPremium: boolean;
  freeAnalysesUsed: number;
  totalAnalyses: number;
  totalSavings: number;
  account?: {
    name: string | null;
    email: string | null;
    phone: string | null;
    profileImage: string | null;
  };
  profile?: {
    age: number | null;
    weight: number | null;
    height: number | null;
    gender: string | null;
    healthGoals: string | null;
    allergies: string | null;
    medications: string | null;
    activityLevel: string | null;
    dietType: string | null;
  };
}

export interface HistoryItem {
  id: string;
  productName: string;
  brand: string;
  score: number;
  createdAt: Date;
}

export async function analyzeSupplementAPI(
  type: "photo" | "text" | "voice",
  content: string
): Promise<AnalysisResult> {
  const token = await getSupabaseToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch("/api/analyze", {
    method: "POST",
    headers,
    body: JSON.stringify({ type, content }),
  });

  if (!response.ok) {
    const error = await response.json();
    if (error.needsAuth) {
      throw new Error("Free analysis limit reached. Please sign up or login.");
    }
    throw new Error(error.message || "Analysis failed");
  }
  return response.json();
}

export async function getAnalysisAPI(id: string): Promise<AnalysisResult> {
  // Try to get from Supabase directly
  const { data, error } = await supabase
    .from('analyses')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    // Fallback to API
    const response = await fetch(`/api/analysis/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch analysis");
    }
    return response.json();
  }

  return {
    analysisId: data.id,
    productName: data.product_name,
    brand: data.brand,
    score: data.score,
    ingredients: data.ingredients as any,
    totalSavings: data.total_savings / 100,
    onlineAlternatives: data.online_alternatives as any,
    localAlternatives: data.local_alternatives as any,
  };
}

export async function getUserStatusAPI(): Promise<UserStatus> {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Not authenticated");
  }

  // Get user profile from Supabase
  const { data: profile, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) {
    console.error("Failed to get user profile:", error);
    throw new Error("Failed to fetch user status");
  }

  // Get user's analyses count and total savings
  const { data: analyses } = await supabase
    .from('analyses')
    .select('total_savings')
    .eq('user_id', user.id);

  const totalAnalyses = analyses?.length || 0;
  const totalSavings = analyses?.reduce((sum, a) => sum + (a.total_savings || 0), 0) || 0;

  return {
    isPremium: profile?.is_premium || false,
    freeAnalysesUsed: profile?.free_analyses_used || 0,
    totalAnalyses,
    totalSavings: totalSavings / 100,
    account: {
      name: profile?.name || null,
      email: user.email || null,
      phone: profile?.phone || null,
      profileImage: profile?.profile_image || null,
    },
    profile: {
      age: profile?.age || null,
      weight: profile?.weight || null,
      height: profile?.height || null,
      gender: profile?.gender || null,
      healthGoals: profile?.health_goals || null,
      allergies: profile?.allergies || null,
      medications: profile?.medications || null,
      activityLevel: profile?.activity_level || null,
      dietType: profile?.diet_type || null,
    },
  };
}

export async function getHistoryAPI(): Promise<HistoryItem[]> {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Not authenticated");
  }

  const { data, error } = await supabase
    .from('analyses')
    .select('id, product_name, brand, score, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error("Failed to fetch history");
  }

  return (data || []).map((item) => ({
    id: item.id,
    productName: item.product_name,
    brand: item.brand,
    score: item.score,
    createdAt: new Date(item.created_at),
  }));
}

export async function updateUserProfileAPI(profile: {
  age?: number;
  weight?: number;
  height?: number;
  gender?: string;
  healthGoals?: string;
  allergies?: string;
  medications?: string;
  activityLevel?: string;
  dietType?: string;
}): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Not authenticated");
  }

  const { error } = await supabase
    .from('user_profiles')
    .update({
      age: profile.age,
      weight: profile.weight,
      height: profile.height,
      gender: profile.gender,
      health_goals: profile.healthGoals,
      allergies: profile.allergies,
      medications: profile.medications,
      activity_level: profile.activityLevel,
      diet_type: profile.dietType,
    })
    .eq('id', user.id);

  if (error) {
    throw new Error("Failed to update profile");
  }
}

export async function updateUserAccountAPI(account: {
  name?: string;
  email?: string;
  phone?: string;
  profileImage?: string | null;
}): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Not authenticated");
  }

  const { error } = await supabase
    .from('user_profiles')
    .update({
      name: account.name,
      phone: account.phone,
      profile_image: account.profileImage,
    })
    .eq('id', user.id);

  if (error) {
    throw new Error("Failed to update account");
  }
}

export async function getAIRecommendationAPI(goal: string): Promise<string> {
  const token = await getSupabaseToken();

  if (!token) {
    throw new Error("Not authenticated");
  }

  const response = await fetch("/api/ai/recommend", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({ goal }),
  });

  if (!response.ok) {
    throw new Error("Failed to get recommendation");
  }
  const data = await response.json();
  return data.recommendation;
}
