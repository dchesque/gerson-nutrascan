import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { analyzeSupplementWithAI } from "./ai";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Analyze supplement - NO AUTH, NO DATABASE REQUIRED
  app.post("/api/analyze", async (req, res) => {
    try {
      const { type, content } = req.body;

      if (!content || !type) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Perform AI analysis
      const analysisResult = await analyzeSupplementWithAI(content);

      // Save analysis (no user ID needed)
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

  // Get analysis by ID
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

  const httpServer = createServer(app);
  return httpServer;
}
