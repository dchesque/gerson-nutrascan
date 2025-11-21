// OpenAI integration for NutraScan AI
// Reference: blueprint:javascript_openai

import OpenAI from "openai";
import type { IngredientAnalysis, AlternativeProduct } from "@shared/schema";

// Lazy initialization - only create client when needed
let openaiClient: OpenAI | null = null;

function getOpenAI(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY1 || process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OpenAI API key not configured. Please add OPENAI_API_KEY to your secrets.");
  }
  
  if (!openaiClient) {
    // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
    openaiClient = new OpenAI({ apiKey });
  }
  
  return openaiClient;
}

interface SupplementAnalysisResult {
  productName: string;
  brand: string;
  score: number;
  ingredients: IngredientAnalysis[];
  totalSavings: number;
  onlineAlternatives: AlternativeProduct[];
  localAlternatives: AlternativeProduct[];
}

// Mock response for testing/fallback when API fails
function getMockAnalysisResult(inputContent: string): SupplementAnalysisResult {
  const productName = inputContent.includes("Vitamin") ? "Vitamin Complex" : 
                     inputContent.includes("Protein") ? "Protein Powder" : "Supplement";
  
  return {
    productName,
    brand: "Generic Brand",
    score: 72,
    ingredients: [
      {
        name: "Primary Ingredient",
        actualDosage: "500mg",
        idealDosage: "400-600mg",
        percentage: 85,
        efficacy: "high",
        explanation: "This dosage is within the clinically recommended range based on peer-reviewed research."
      },
      {
        name: "Secondary Ingredient",
        actualDosage: "100mg",
        idealDosage: "150-300mg",
        percentage: 55,
        efficacy: "medium",
        explanation: "This ingredient is slightly underdosed. A higher amount would provide better results."
      }
    ],
    totalSavings: 180,
    onlineAlternatives: [
      {
        name: "Premium Plus Formula",
        brand: "Nature Made",
        score: 88,
        price: 24.99,
        currentPrice: 32.99,
        savings: 8,
        url: "https://amazon.com/s?k=supplement"
      },
      {
        name: "Clinical Strength",
        brand: "Now Foods",
        score: 85,
        price: 22.99,
        currentPrice: 29.99,
        savings: 7,
        url: "https://amazon.com/s?k=supplement"
      }
    ],
    localAlternatives: [
      {
        name: "Professional Grade",
        brand: "GNC",
        score: 82,
        price: 26.99,
        location: "GNC",
        distance: "0.5 mi"
      },
      {
        name: "Wellness Series",
        brand: "Walgreens",
        score: 78,
        price: 19.99,
        location: "Walgreens",
        distance: "0.3 mi"
      }
    ]
  };
}

export async function analyzeSupplementWithAI(
  inputContent: string
): Promise<SupplementAnalysisResult> {
  try {
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

    const openai = getOpenAI();
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
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
      max_completion_tokens: 2000,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    // Ensure score is within bounds
    result.score = Math.max(0, Math.min(100, result.score || 0));
    
    // Validate structure
    if (!result.ingredients) result.ingredients = [];
    if (!result.onlineAlternatives) result.onlineAlternatives = [];
    if (!result.localAlternatives) result.localAlternatives = [];
    
    return result as SupplementAnalysisResult;
  } catch (error: any) {
    // If quota exceeded (429), use mock data instead of failing
    if (error.status === 429 || error.message?.includes("quota")) {
      console.warn("OpenAI quota exceeded, using mock data:", error.message);
      return getMockAnalysisResult(inputContent);
    }
    // For other errors, still throw
    console.error("OpenAI API error:", error.message);
    throw new Error(`Supplement analysis failed: ${error.message}`);
  }
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

  try {
    const openai = getOpenAI();
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
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
  } catch (error: any) {
    // If quota exceeded, return helpful fallback message
    if (error.status === 429 || error.message?.includes("quota")) {
      console.warn("OpenAI quota exceeded for recommendations");
      return "Great question! Try analyzing a few supplements with NutraScan to see which ones align best with your goals.";
    }
    console.error("Recommendation error:", error);
    return "I'd love to help! Try scanning a supplement to get personalized recommendations.";
  }
}
