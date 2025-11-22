import type { Express } from "express";
import { createServer, type Server } from "http";
import { supabaseAdmin } from "./supabase";
import { analyzeSupplementWithAI, getPersonalizedRecommendations } from "./ai";
import { optionalAuth, validateSupabaseToken } from "./middleware/auth";
import Stripe from "stripe";

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2025-11-17.clover" })
  : null;

// Track free analyses by IP for anonymous users
const anonymousAnalyses = new Map<string, number>();

export async function registerRoutes(app: Express): Promise<Server> {

  // Health check endpoint for Docker/EasyPanel
  app.get("/api/health", (_req, res) => {
    res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Analyze supplement - Allow 1 free analysis without auth
  app.post("/api/analyze", optionalAuth, async (req, res) => {
    try {
      const { type, content } = req.body;
      if (!content || !type) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const userId = req.userId;
      const clientIp = req.ip || req.socket.remoteAddress || 'unknown';

      // Check free analysis limit for anonymous users
      if (!userId) {
        const currentCount = anonymousAnalyses.get(clientIp) || 0;

        if (currentCount >= 1) {
          return res.status(403).json({
            message: "Free analysis limit reached. Please sign up or login to continue.",
            needsAuth: true
          });
        }

        anonymousAnalyses.set(clientIp, currentCount + 1);
      } else {
        // Check user's free analyses limit if not premium
        const { data: userProfile } = await supabaseAdmin
          .from('user_profiles')
          .select('is_premium, free_analyses_used')
          .eq('id', userId)
          .single();

        if (userProfile && !userProfile.is_premium && userProfile.free_analyses_used >= 1) {
          return res.status(403).json({
            message: "Free analysis limit reached. Please upgrade to premium.",
            needsAuth: false,
            needsPremium: true
          });
        }
      }

      const analysisResult = await analyzeSupplementWithAI(content);

      // Save analysis to Supabase
      const { data: analysis, error } = await supabaseAdmin
        .from('analyses')
        .insert({
          user_id: userId || null,
          product_name: analysisResult.productName,
          brand: analysisResult.brand,
          score: analysisResult.score,
          input_type: type,
          input_content: content,
          ingredients: analysisResult.ingredients,
          total_savings: Math.round(analysisResult.totalSavings * 100),
          online_alternatives: analysisResult.onlineAlternatives,
          local_alternatives: analysisResult.localAlternatives,
        })
        .select()
        .single();

      if (error) {
        console.error("Failed to save analysis:", error);
      }

      // Increment free analyses count for logged-in non-premium users
      if (userId && !error) {
        const { data: userProfile } = await supabaseAdmin
          .from('user_profiles')
          .select('is_premium, free_analyses_used')
          .eq('id', userId)
          .single();

        if (userProfile && !userProfile.is_premium) {
          await supabaseAdmin
            .from('user_profiles')
            .update({ free_analyses_used: (userProfile.free_analyses_used || 0) + 1 })
            .eq('id', userId);
        }
      }

      res.json({
        analysisId: analysis?.id || 'temp-' + Date.now(),
        ...analysisResult,
        totalSavings: analysisResult.totalSavings,
        isFreeTrial: !userId,
      });
    } catch (error: any) {
      console.error("Analysis error:", error);
      res.status(500).json({ message: "Analysis failed: " + error.message });
    }
  });

  // Get analysis by ID (public - RLS handles access)
  app.get("/api/analysis/:id", async (req, res) => {
    try {
      const { data: analysis, error } = await supabaseAdmin
        .from('analyses')
        .select('*')
        .eq('id', req.params.id)
        .single();

      if (error || !analysis) {
        return res.status(404).json({ message: "Analysis not found" });
      }

      res.json({
        id: analysis.id,
        productName: analysis.product_name,
        brand: analysis.brand,
        score: analysis.score,
        inputType: analysis.input_type,
        inputContent: analysis.input_content,
        ingredients: analysis.ingredients,
        totalSavings: analysis.total_savings / 100,
        onlineAlternatives: analysis.online_alternatives,
        localAlternatives: analysis.local_alternatives,
        createdAt: analysis.created_at,
      });
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching analysis: " + error.message });
    }
  });

  // AI recommendation - requires auth
  app.post("/api/ai/recommend", validateSupabaseToken, async (req, res) => {
    try {
      const { goal } = req.body;
      if (!goal) {
        return res.status(400).json({ message: "Goal is required" });
      }

      const recommendation = await getPersonalizedRecommendations(goal);
      res.json({ recommendation });
    } catch (error: any) {
      res.status(500).json({ message: "Error getting recommendation: " + error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
