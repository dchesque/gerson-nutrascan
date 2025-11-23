// src/lib/n8n.ts
import type { IngredientAnalysis, AlternativeProduct } from "@/types"

interface AnalysisRequest {
  // Tipo de input
  type: "text" | "image" | "audio"

  // Conteúdo (texto, base64 da imagem, ou base64 do áudio)
  content: string

  // Dados do usuário (opcional, para personalização)
  user?: {
    id: string
    email?: string
    isPremium?: boolean
    healthProfile?: {
      age?: number
      weight?: number
      height?: number
      goals?: string[]
      allergies?: string[]
      medications?: string[]
      activityLevel?: string
      dietType?: string
    }
  }
}

interface AnalysisData {
  productName: string
  brand: string
  score: number
  ingredients: IngredientAnalysis[]
  totalSavings: number
  onlineAlternatives: AlternativeProduct[]
  localAlternatives: AlternativeProduct[]
}

interface AnalysisResponse {
  success: boolean
  data?: AnalysisData
  error?: string
}

export async function analyzeSupplementViaWebhook(
  request: AnalysisRequest
): Promise<AnalysisData> {
  const webhookUrl = process.env.N8N_WEBHOOK_URL

  if (!webhookUrl) {
    throw new Error("N8N_WEBHOOK_URL not configured")
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: request.type,
        content: request.content,
        user: request.user || null,
        timestamp: new Date().toISOString(),
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Webhook error: ${response.status} - ${errorText}`)
    }

    const result: AnalysisResponse = await response.json()

    if (!result.success || !result.data) {
      throw new Error(result.error || "Analysis failed")
    }

    // Validar e normalizar o score
    result.data.score = Math.max(0, Math.min(100, result.data.score || 0))

    // Garantir arrays vazios se não existirem
    if (!result.data.ingredients) result.data.ingredients = []
    if (!result.data.onlineAlternatives) result.data.onlineAlternatives = []
    if (!result.data.localAlternatives) result.data.localAlternatives = []

    return result.data
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    console.error("N8N webhook error:", errorMessage)
    throw new Error(`Supplement analysis failed: ${errorMessage}`)
  }
}

// Função para recomendações personalizadas (também via n8n se necessário)
export async function getPersonalizedRecommendations(goal: string): Promise<string> {
  const webhookUrl = process.env.N8N_WEBHOOK_URL

  if (!webhookUrl) {
    return "Configure seu perfil de saúde para receber recomendações personalizadas."
  }

  try {
    // Pode usar o mesmo webhook ou criar um endpoint separado no n8n
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "recommendation",
        content: goal,
        timestamp: new Date().toISOString(),
      }),
    })

    if (!response.ok) {
      throw new Error("Recommendation request failed")
    }

    const result = await response.json()
    return result.recommendation || "Tente analisar um suplemento para receber recomendações personalizadas."
  } catch {
    return "Tente analisar um suplemento para receber recomendações personalizadas."
  }
}
