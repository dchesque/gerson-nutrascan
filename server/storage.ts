import { type User, type InsertUser, type Analysis, type InsertAnalysis } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User management
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserStripeInfo(userId: string, customerId: string, subscriptionId: string): Promise<User>;
  updateUserPremiumStatus(userId: string, isPremium: boolean): Promise<User>;
  incrementFreeAnalyses(userId: string): Promise<User>;
  
  // Analysis management
  createAnalysis(analysis: InsertAnalysis): Promise<Analysis>;
  getAnalysis(id: string): Promise<Analysis | undefined>;
  getUserAnalyses(userId: string): Promise<Analysis[]>;
  deleteAnalysis(id: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private analyses: Map<string, Analysis>;

  constructor() {
    this.users = new Map();
    this.analyses = new Map();
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      isPremium: false,
      freeAnalysesUsed: 0,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserStripeInfo(userId: string, customerId: string, subscriptionId: string): Promise<User> {
    const user = this.users.get(userId);
    if (!user) throw new Error("User not found");
    
    const updated = { 
      ...user, 
      stripeCustomerId: customerId, 
      stripeSubscriptionId: subscriptionId,
      isPremium: true,
    };
    this.users.set(userId, updated);
    return updated;
  }

  async updateUserPremiumStatus(userId: string, isPremium: boolean): Promise<User> {
    const user = this.users.get(userId);
    if (!user) throw new Error("User not found");
    
    const updated = { ...user, isPremium };
    this.users.set(userId, updated);
    return updated;
  }

  async incrementFreeAnalyses(userId: string): Promise<User> {
    const user = this.users.get(userId);
    if (!user) throw new Error("User not found");
    
    const updated = { ...user, freeAnalysesUsed: user.freeAnalysesUsed + 1 };
    this.users.set(userId, updated);
    return updated;
  }

  // Analysis methods
  async createAnalysis(insertAnalysis: InsertAnalysis): Promise<Analysis> {
    const id = randomUUID();
    const analysis: Analysis = {
      id,
      userId: insertAnalysis.userId ?? null,
      productName: insertAnalysis.productName,
      brand: insertAnalysis.brand ?? null,
      score: insertAnalysis.score,
      inputType: insertAnalysis.inputType,
      inputContent: insertAnalysis.inputContent,
      ingredients: insertAnalysis.ingredients,
      totalSavings: insertAnalysis.totalSavings ?? 0,
      onlineAlternatives: insertAnalysis.onlineAlternatives ?? null,
      localAlternatives: insertAnalysis.localAlternatives ?? null,
      createdAt: new Date(),
    };
    this.analyses.set(id, analysis);
    return analysis;
  }

  async getAnalysis(id: string): Promise<Analysis | undefined> {
    return this.analyses.get(id);
  }

  async getUserAnalyses(userId: string): Promise<Analysis[]> {
    return Array.from(this.analyses.values())
      .filter((analysis) => analysis.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async deleteAnalysis(id: string): Promise<void> {
    this.analyses.delete(id);
  }
}

export const storage = new MemStorage();
