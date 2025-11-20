import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { analyzeSupplementWithAI, getPersonalizedRecommendations } from "./ai";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Analyze supplement - NO AUTH REQUIRED
  app.post("/api/analyze", async (req, res) => {
    try {
      const { type, content } = req.body;

      if (!content || !type) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const analysisResult = await analyzeSupplementWithAI(content);
      const analysis = await storage.createAnalysis({
        productName: analysisResult.productName,
        brand: analysisResult.brand,
        score: analysisResult.score,
        inputType: type,
        inputContent: content,
        ingredients: analysisResult.ingredients as any,
        totalSavings: Math.round(analysisResult.totalSavings * 100),
        onlineAlternatives: analysisResult.onlineAlternatives as any,
        localAlternatives: analysisResult.localAlternatives as any,
      });

      res.json({
        analysisId: analysis.id,
        ...analysisResult,
        totalSavings: analysisResult.totalSavings,
      });
    } catch (error: any) {
      console.error("Analysis error:", error);
      res.status(500).json({ message: "Analysis failed: " + error.message });
    }
  });

  // Get analysis by ID - NO AUTH REQUIRED
  app.get("/api/analysis/:id", async (req, res) => {
    try {
      const analysis = await storage.getAnalysis(req.params.id);
      if (!analysis) {
        return res.status(404).json({ message: "Analysis not found" });
      }

      res.json({
        ...analysis,
        totalSavings: analysis.totalSavings / 100,
      });
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching analysis: " + error.message });
    }
  });

  // Get all analyses for history - NO AUTH REQUIRED
  app.get("/api/history", async (req, res) => {
    try {
      const analyses = await storage.getAllAnalyses();
      res.json(
        analyses.map((a) => ({
          id: a.id,
          productName: a.productName,
          brand: a.brand,
          score: a.score,
          createdAt: a.createdAt,
        }))
      );
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching history: " + error.message });
    }
  });

  // Get user status - NO AUTH REQUIRED
  app.get("/api/user/status", async (req, res) => {
    try {
      res.json({
        isPremium: false,
        freeAnalysesUsed: 0,
        totalAnalyses: 0,
        totalSavings: 0,
        account: {
          name: null,
          email: null,
          phone: null,
          profileImage: null,
        },
        profile: {
          age: null,
          weight: null,
          height: null,
          gender: null,
          healthGoals: null,
          allergies: null,
          medications: null,
          activityLevel: null,
          dietType: null,
        },
      });
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching user status: " + error.message });
    }
  });

  // AI recommendation - NO AUTH REQUIRED
  app.post("/api/ai/recommend", async (req, res) => {
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
