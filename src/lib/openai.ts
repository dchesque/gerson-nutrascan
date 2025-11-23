import OpenAI from "openai"
import type { IngredientAnalysis, AlternativeProduct } from "@/types"

let openaiClient: OpenAI | null = null

function getOpenAI(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new Error("OpenAI API key not configured")
  }
  
  if (!openaiClient) {
    openaiClient = new OpenAI({ apiKey })
  }
  
  return openaiClient
}

interface SupplementAnalysisResult {
  productName: string
  brand: string
  score: number
  ingredients: IngredientAnalysis[]
  totalSavings: number
  onlineAlternatives: AlternativeProduct[]
  localAlternatives: AlternativeProduct[]
}

function getMockAnalysisResult(inputContent: string): SupplementAnalysisResult {
  const productName = inputContent.includes("Vitamin") ? "Vitamin Complex" : 
                     inputContent.includes("Protein") ? "Protein Powder" : "Supplement"
  
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
        explanation: "This dosage is within the clinically recommended range."
      },
      {
        name: "Secondary Ingredient",
        actualDosage: "100mg",
        idealDosage: "150-300mg",
        percentage: 55,
        efficacy: "medium",
        explanation: "This ingredient is slightly underdosed."
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
      }
    ]
  }
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
      "explanation": "string - scientific explanation"
    }
  ],
  "totalSavings": number (estimated savings in dollars),
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
}`

    const openai = getOpenAI()
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a supplement analysis expert. Respond only with valid JSON.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
      max_tokens: 2000,
    })

    const result = JSON.parse(response.choices[0].message.content || "{}")
    result.score = Math.max(0, Math.min(100, result.score || 0))
    
    if (!result.ingredients) result.ingredients = []
    if (!result.onlineAlternatives) result.onlineAlternatives = []
    if (!result.localAlternatives) result.localAlternatives = []
    
    return result as SupplementAnalysisResult
  } catch (error: any) {
    if (error.status === 429 || error.message?.includes("quota")) {
      console.warn("OpenAI quota exceeded, using mock data")
      return getMockAnalysisResult(inputContent)
    }
    console.error("OpenAI API error:", error.message)
    throw new Error(`Supplement analysis failed: ${error.message}`)
  }
}

export async function getPersonalizedRecommendations(goal: string): Promise<string> {
  const prompt = `A user wants help with: "${goal}"

Provide a brief, friendly response (2-3 sentences) with:
1. Acknowledgment of their goal
2. Top 1-2 most effective supplements with specific dosages
3. Encouragement to scan products to verify quality`

  try {
    const openai = getOpenAI()
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a helpful supplement advisor. Be friendly and concise.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 256,
    })

    return response.choices[0].message.content || "Try scanning a supplement to get personalized recommendations."
  } catch (error: any) {
    if (error.status === 429 || error.message?.includes("quota")) {
      return "Great question! Try analyzing a few supplements with NutraScan to see which ones align best with your goals."
    }
    return "I'd love to help! Try scanning a supplement to get personalized recommendations."
  }
}
