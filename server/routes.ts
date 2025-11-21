import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { analyzeSupplementWithAI, getPersonalizedRecommendations } from "./ai";
import Stripe from "stripe";
import { createHash } from "crypto";
import { signupSchema, loginSchema } from "@shared/schema";

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2025-11-17.clover" })
  : null;

function hashPassword(password: string): string {
  return createHash("sha256").update(password).digest("hex");
}

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Auth routes
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const validated = signupSchema.parse(req.body);
      const existingUser = await storage.getUserByEmail(validated.email);
      if (existingUser) {
        return res.status(400).json({ message: "Email already exists" });
      }
      
      const user = await storage.createUser({
        email: validated.email,
        passwordHash: hashPassword(validated.password),
      });
      
      req.session.userId = user.id;
      res.json({ success: true, userId: user.id });
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Signup failed" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const validated = loginSchema.parse(req.body);
      const user = await storage.getUserByEmail(validated.email);
      if (!user || !user.passwordHash) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      const isValid = await storage.verifyPassword(user.id, validated.password);
      if (!isValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      req.session.userId = user.id;
      res.json({ success: true, userId: user.id });
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Login failed" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) return res.status(500).json({ message: "Logout failed" });
      res.json({ success: true });
    });
  });

  app.get("/api/auth/status", (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ authenticated: false });
    }
    res.json({ authenticated: true, userId: req.session.userId });
  });

  // Analyze supplement - Allow 1 free analysis without auth
  app.post("/api/analyze", async (req, res) => {
    try {
      const { type, content } = req.body;
      if (!content || !type) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const userId = req.session.userId;
      
      // Track free analyses per session
      if (!userId) {
        if (!req.session.freeAnalysesCount) {
          req.session.freeAnalysesCount = 0;
        }
        
        if (req.session.freeAnalysesCount >= 1) {
          return res.status(403).json({ 
            message: "Free analysis limit reached. Please sign up or login to continue.",
            needsAuth: true 
          });
        }
        
        req.session.freeAnalysesCount += 1;
      }

      const user = userId ? await storage.getUser(userId) : null;

      const analysisResult = await analyzeSupplementWithAI(content);
      const analysis = await storage.createAnalysis({
        userId: userId || undefined,
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
        isFreeTrial: !userId,
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

  // Get history
  app.get("/api/history", async (req, res) => {
    try {
      const userId = req.session.userId!;
      const analyses = await storage.getUserAnalyses(userId);
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

  // Get user status
  app.get("/api/user/status", async (req, res) => {
    try {
      const userId = req.session.userId!;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const analyses = await storage.getUserAnalyses(userId);
      const totalSavings = analyses.reduce((sum, a) => sum + a.totalSavings, 0);

      res.json({
        isPremium: user.isPremium,
        freeAnalysesUsed: user.freeAnalysesUsed,
        totalAnalyses: analyses.length,
        totalSavings: totalSavings / 100,
        account: {
          name: user.name,
          email: user.email,
          phone: user.phone,
          profileImage: user.profileImage,
        },
        profile: {
          age: user.age,
          weight: user.weight,
          height: user.height,
          gender: user.gender,
          healthGoals: user.healthGoals,
          allergies: user.allergies,
          medications: user.medications,
          activityLevel: user.activityLevel,
          dietType: user.dietType,
        },
      });
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching user status: " + error.message });
    }
  });

  // AI recommendation
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
