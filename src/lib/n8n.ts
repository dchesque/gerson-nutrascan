// src/lib/n8n.ts
import type { IngredientAnalysis, AlternativeProduct } from "@/types"

export interface AnalysisRequest {
  // Tipo de input: text, image ou audio
  type: "text" | "image" | "audio"

  // Conteúdo:
  // - text: texto com ingredientes do suplemento
  // - image: base64 da imagem do rótulo
  // - audio: base64 do arquivo de áudio
  content: string

  // Dados do usuário (opcional, para personalização da análise)
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

  // Metadados adicionais (opcional)
  metadata?: {
    clientIp?: string
    userAgent?: string
    locale?: string
  }
}

export interface AnalysisData {
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

/**
 * Envia análise de suplemento para o webhook n8n
 *
 * O webhook recebe um POST com:
 * - type: "text" | "image" | "audio"
 * - content: string (texto, base64 imagem, ou base64 áudio)
 * - user: dados do usuário (opcional)
 * - metadata: informações adicionais (opcional)
 * - timestamp: ISO string da data/hora
 *
 * E deve retornar:
 * - success: boolean
 * - data: { productName, brand, score, ingredients, totalSavings, onlineAlternatives, localAlternatives }
 * - error: string (se success=false)
 */
export async function analyzeSupplementViaWebhook(
  request: AnalysisRequest
): Promise<AnalysisData> {
  const webhookUrl = process.env.N8N_WEBHOOK_URL

  if (!webhookUrl) {
    throw new Error("N8N_WEBHOOK_URL not configured")
  }

  try {
    // Preparar payload para o webhook
    const payload = {
      // Tipo de análise
      type: request.type,

      // Conteúdo (texto, base64 da imagem ou base64 do áudio)
      content: request.content,

      // Informações do usuário para personalização
      user: request.user || null,

      // Metadados adicionais
      metadata: request.metadata || null,

      // Timestamp da requisição
      timestamp: new Date().toISOString(),
    }

    console.log(`[N8N Webhook] Sending ${request.type} analysis request...`)

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`[N8N Webhook] Error response: ${response.status} - ${errorText}`)
      throw new Error(`Webhook error: ${response.status} - ${errorText}`)
    }

    const result: AnalysisResponse = await response.json()

    if (!result.success || !result.data) {
      throw new Error(result.error || "Analysis failed")
    }

    console.log(`[N8N Webhook] Analysis successful for: ${result.data.productName}`)

    // Validar e normalizar o score (0-100)
    result.data.score = Math.max(0, Math.min(100, result.data.score || 0))

    // Garantir arrays vazios se não existirem
    if (!result.data.ingredients) result.data.ingredients = []
    if (!result.data.onlineAlternatives) result.data.onlineAlternatives = []
    if (!result.data.localAlternatives) result.data.localAlternatives = []

    return result.data
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    console.error("[N8N Webhook] Error:", errorMessage)
    throw new Error(`Supplement analysis failed: ${errorMessage}`)
  }
}

/**
 * Obtém recomendações personalizadas via webhook n8n
 */
export async function getPersonalizedRecommendations(goal: string): Promise<string> {
  const webhookUrl = process.env.N8N_WEBHOOK_URL

  if (!webhookUrl) {
    return "Configure seu perfil de saúde para receber recomendações personalizadas."
  }

  try {
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
