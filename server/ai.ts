// OpenAI integration for NutraScan AI
// Reference: blueprint:javascript_openai

import OpenAI from "openai";
import type { IngredientAnalysis, AlternativeProduct } from "@shared/schema";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing required OpenAI secret: OPENAI_API_KEY");
}

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface SupplementAnalysisResult {
  productName: string;
  brand: string;
  score: number;
  ingredients: IngredientAnalysis[];
  totalSavings: number;
  onlineAlternatives: AlternativeProduct[];
  localAlternatives: AlternativeProduct[];
}

export async function analyzeSupplementWithAI(
  inputContent: string
): Promise<SupplementAnalysisResult> {
  const prompt = `You are an expert supplement analyst with deep knowledge of clinical research, FDA guidelines, and evidence-based dosing.

Analyze the following supplement ingredients and provide a comprehensive evaluation:

${inputContent}

Respond with JSON in exactly this format:
{
  "productName": "string - the product name or 'Unknown Product' if not specified",
  "brand": "string - the brand name or 'Generic Brand' if not specified",
  "score": number (0-100 overall quality score based on dosages and efficacy),
  "ingredients": [
    {
      "name": "string - ingredient name",
      "actualDosage": "string - actual dosage with units",
      "idealDosage": "string - clinically effective dosage range",
      "percentage": number (0-100 - how close actual is to ideal),
      "efficacy": "high" | "medium" | "low",
      "explanation": "string - scientific explanation of why this dosage is effective/ineffective"
    }
  ],
  "totalSavings": number (estimated savings in dollars if switching to better product),
  "onlineAlternatives": [
    {
      "name": "string - superior product name",
      "brand": "string",
      "score": number (higher score, 75-95 range),
      "price": number (realistic price in dollars),
      "currentPrice": number (original price),
      "savings": number (difference),
      "url": "https://amazon.com" or "https://iherb.com"
    }
  ],
  "localAlternatives": [
    {
      "name": "string - available product",
      "brand": "string",
      "score": number,
      "price": number,
      "location": "Walgreens" | "CVS Pharmacy" | "GNC" | "Walmart",
      "distance": "0.3 mi" | "0.5 mi" | "1.2 mi"
    }
  ]
}

Rules:
1. Score 0-40 = severely underdosed/ineffective (red)
2. Score 41-70 = moderately effective (yellow)
3. Score 71-100 = clinically effective dosages (green)
4. Base dosage analysis on peer-reviewed research
5. Provide 2-3 online alternatives and 2-3 local alternatives
6. Be honest about underdosing - most supplements are severely underdosed
7. Calculate realistic savings based on price differences
8. Use real brand names for alternatives (Nature Made, Garden of Life, Now Foods, Nordic Naturals, Doctor's Best, etc.)`;

  const response = await openai.chat.completions.create({
    model: "gpt-5",
    messages: [
      {
        role: "system",
        content:
          "You are a supplement analysis expert. Analyze ingredients with scientific rigor and provide honest, evidence-based evaluations. Respond only with valid JSON.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    response_format: { type: "json_object" },
    max_completion_tokens: 4096,
  });

  const result = JSON.parse(response.choices[0].message.content || "{}");
  
  // Ensure score is within bounds
  result.score = Math.max(0, Math.min(100, result.score));
  
  return result as SupplementAnalysisResult;
}

export async function getPersonalizedRecommendations(
  goal: string
): Promise<string> {
  const prompt = `A user wants help with: "${goal}"

Provide a brief, friendly response (2-3 sentences) with:
1. Acknowledgment of their goal
2. Top 1-2 most effective supplements for this goal with specific dosages
3. Encouragement to scan products to verify quality

Be conversational, helpful, and evidence-based. No medical claims.`;

  const response = await openai.chat.completions.create({
    model: "gpt-5",
    messages: [
      {
        role: "system",
        content:
          "You are a helpful supplement advisor. Provide evidence-based recommendations without making medical claims. Be friendly and concise.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    max_completion_tokens: 256,
  });

  return response.choices[0].message.content || "Thanks for sharing! I'd recommend scanning any supplements you're considering to ensure they have effective dosages.";
}
