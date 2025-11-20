import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { analyzeSupplementWithAI, getPersonalizedRecommendations } from "./ai";
import Stripe from "stripe";
import { createHash } from "crypto";
import { signupSchema, loginSchema } from "@shared/schema";

// Initialize Stripe if keys are present
const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2025-11-17.clover" })
  : null;

function hashPassword(password: string): string {
  return createHash("sha256").update(password).digest("hex");
}

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Analyze supplement - NO AUTH REQUIRED
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
        totalSavings: Math.round(analysisResult.totalSavings * 100), // convert to cents
        onlineAlternatives: analysisResult.onlineAlternatives as any,
        localAlternatives: analysisResult.localAlternatives as any,
      });

      res.json({
        analysisId: analysis.id,
        ...analysisResult,
        totalSavings: analysisResult.totalSavings, // keep as dollars for frontend
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
        totalSavings: analysis.totalSavings / 100, // convert cents to dollars
      });
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching analysis: " + error.message });
    }
  });

  // Get user's analysis history
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

  // Get user status (premium check, analyses used)
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
        totalSavings: totalSavings / 100, // convert to dollars
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

  // Update user profile (health info)
  app.patch("/api/user/profile", async (req, res) => {
    try {
      const userId = req.session.userId!;
      const { age, weight, height, gender, healthGoals, allergies, medications, activityLevel, dietType } = req.body;

      const updated = await storage.updateUserProfile(userId, {
        age: age ? parseInt(age) : undefined,
        weight: weight ? parseInt(weight) : undefined,
        height: height ? parseInt(height) : undefined,
        gender,
        healthGoals,
        allergies,
        medications,
        activityLevel,
        dietType,
      });

      res.json({
        success: true,
        profile: {
          age: updated.age,
          weight: updated.weight,
          height: updated.height,
          gender: updated.gender,
          healthGoals: updated.healthGoals,
          allergies: updated.allergies,
          medications: updated.medications,
          activityLevel: updated.activityLevel,
          dietType: updated.dietType,
        },
      });
    } catch (error: any) {
      res.status(500).json({ message: "Error updating profile: " + error.message });
    }
  });

  // Update user account info (name, email, phone, profileImage)
  app.patch("/api/user/account", async (req, res) => {
    try {
      const userId = req.session.userId!;
      const { name, email, phone, profileImage } = req.body;

      const updated = await storage.updateUserAccountInfo(userId, {
        name,
        email,
        phone,
        profileImage,
      });

      res.json({
        success: true,
        account: {
          name: updated.name,
          email: updated.email,
          phone: updated.phone,
          profileImage: updated.profileImage,
        },
      });
    } catch (error: any) {
      res.status(500).json({ message: "Error updating account: " + error.message });
    }
  });

  // AI conversation endpoint for personalized recommendations
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

  // Stripe subscription endpoints (if Stripe is configured)
  if (stripe) {
    app.post("/api/create-subscription", async (req, res) => {
      try {
        const userId = req.session.userId!;
        const user = await storage.getUser(userId);
        
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        // If already has subscription, return existing
        if (user.stripeSubscriptionId) {
          const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId, {
            expand: ['latest_invoice.payment_intent']
          });
          const latestInvoice: any = subscription.latest_invoice;
          
          return res.json({
            subscriptionId: subscription.id,
            clientSecret: latestInvoice?.payment_intent?.client_secret,
          });
        }

        // Create new customer and subscription
        const customer = await stripe.customers.create({
          email: user.email,
        });

        // Create a price for the subscription
        const price = await stripe.prices.create({
          currency: "usd",
          unit_amount: 1490, // $14.90 in cents
          recurring: { interval: "month" },
          product_data: {
            name: "NutraScan AI Premium",
          },
        });

        // Create subscription
        const subscription = await stripe.subscriptions.create({
          customer: customer.id,
          items: [{ price: price.id }],
          payment_behavior: "default_incomplete",
          expand: ["latest_invoice.payment_intent"],
        });

        // Update user with Stripe info
        await storage.updateUserStripeInfo(
          userId,
          customer.id,
          subscription.id
        );

        const invoice = subscription.latest_invoice as any;
        res.json({
          subscriptionId: subscription.id,
          clientSecret: invoice.payment_intent.client_secret,
        });
      } catch (error: any) {
        console.error("Subscription error:", error);
        res.status(500).json({ message: "Error creating subscription: " + error.message });
      }
    });

    // Stripe webhook handler for subscription updates
    app.post("/api/stripe/webhook", async (req, res) => {
      const sig = req.headers["stripe-signature"];

      try {
        const event = stripe.webhooks.constructEvent(
          req.body,
          sig!,
          process.env.STRIPE_WEBHOOK_SECRET || ""
        );

        if (event.type === "customer.subscription.updated" || 
            event.type === "customer.subscription.deleted") {
          const subscription = event.data.object as any;
          
          // Find user by subscription ID and update premium status
          const users = Array.from((storage as any).users.values());
          const user = users.find((u: any) => u.stripeSubscriptionId === subscription.id);
          
          if (user) {
            await storage.updateUserPremiumStatus(
              (user as any).id,
              subscription.status === "active"
            );
          }
        }

        res.json({ received: true });
      } catch (error: any) {
        console.error("Webhook error:", error);
        res.status(400).json({ message: "Webhook error: " + error.message });
      }
    });
  }

  const httpServer = createServer(app);
  return httpServer;
}
