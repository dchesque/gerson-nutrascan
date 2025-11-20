// API helper functions for NutraScan AI
import { apiRequest } from "./queryClient";

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
  const response = await apiRequest("POST", "/api/analyze", { type, content });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Analysis failed");
  }
  return response.json();
}

export async function getAnalysisAPI(id: string): Promise<AnalysisResult> {
  const response = await apiRequest("GET", `/api/analysis/${id}`, undefined);
  if (!response.ok) {
    throw new Error("Failed to fetch analysis");
  }
  return response.json();
}

export async function getUserStatusAPI(): Promise<UserStatus> {
  const response = await apiRequest("GET", "/api/user/status", undefined);
  if (!response.ok) {
    throw new Error("Failed to fetch user status");
  }
  return response.json();
}

export async function getHistoryAPI(): Promise<HistoryItem[]> {
  const response = await apiRequest("GET", "/api/history", undefined);
  if (!response.ok) {
    throw new Error("Failed to fetch history");
  }
  const data = await response.json();
  return data.map((item: any) => ({
    ...item,
    createdAt: new Date(item.createdAt),
  }));
}

export async function getAIRecommendationAPI(goal: string): Promise<string> {
  const response = await apiRequest("POST", "/api/ai/recommend", { goal });
  if (!response.ok) {
    throw new Error("Failed to get recommendation");
  }
  const data = await response.json();
  return data.recommendation;
}
