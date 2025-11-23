import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/server'
import { analyzeSupplementViaWebhook } from '@/lib/n8n'

// Track free analyses by IP for anonymous users
const anonymousAnalyses = new Map<string, number>()

export async function POST(request: NextRequest) {
  try {
    const { type, content } = await request.json()

    if (!content || !type) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validar tipo
    if (!['text', 'image', 'audio'].includes(type)) {
      return NextResponse.json(
        { message: 'Invalid type. Must be: text, image, or audio' },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const clientIp = request.headers.get('x-forwarded-for') ||
                     request.headers.get('x-real-ip') ||
                     'unknown'

    const supabaseAdmin = createServiceClient()

    // Preparar dados do usuário para enviar ao webhook
    let userData = null
    let userProfile = null

    // Check free analysis limit for anonymous users
    if (!user) {
      const currentCount = anonymousAnalyses.get(clientIp) || 0
      if (currentCount >= 1) {
        return NextResponse.json(
          { message: 'Free analysis limit reached. Please sign up.', needsAuth: true },
          { status: 403 }
        )
      }
      anonymousAnalyses.set(clientIp, currentCount + 1)
    } else {
      // Buscar perfil do usuário
      const { data: profile } = await supabaseAdmin
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      userProfile = profile

      if (profile && !profile.is_premium && profile.free_analyses_used >= 1) {
        return NextResponse.json(
          { message: 'Free analysis limit reached. Please upgrade to premium.', needsUpgrade: true },
          { status: 403 }
        )
      }

      // Preparar dados do usuário para o webhook
      userData = {
        id: user.id,
        email: user.email,
        isPremium: profile?.is_premium || false,
        healthProfile: profile ? {
          age: profile.age,
          weight: profile.weight,
          height: profile.height,
          goals: profile.goals,
          allergies: profile.allergies,
          medications: profile.medications,
          activityLevel: profile.activity_level,
          dietType: profile.diet_type,
        } : undefined
      }
    }

    // Chamar webhook n8n para análise
    const analysis = await analyzeSupplementViaWebhook({
      type: type as "text" | "image" | "audio",
      content,
      user: userData || undefined,
    })

    // Gerar ID único para a análise
    const analysisId = crypto.randomUUID()

    // Salvar no banco se usuário está logado
    if (user) {
      await supabaseAdmin
        .from('analyses')
        .insert({
          id: analysisId,
          user_id: user.id,
          product_name: analysis.productName,
          brand: analysis.brand,
          score: analysis.score,
          input_type: type,
          input_content: content.substring(0, 1000), // Limitar tamanho do conteúdo salvo
          ingredients: analysis.ingredients,
          total_savings: Math.round(analysis.totalSavings * 100),
          online_alternatives: analysis.onlineAlternatives,
          local_alternatives: analysis.localAlternatives,
        })

      // Incrementar contador de análises gratuitas
      if (userProfile && !userProfile.is_premium) {
        await supabaseAdmin
          .from('user_profiles')
          .update({ free_analyses_used: (userProfile.free_analyses_used || 0) + 1 })
          .eq('id', user.id)
      }
    }

    return NextResponse.json({
      analysisId,
      ...analysis,
    })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Analysis error:', errorMessage)

    // Verificar se é erro de webhook não configurado
    if (errorMessage.includes('N8N_WEBHOOK_URL not configured') ||
        errorMessage.includes('Webhook error') ||
        errorMessage.includes('fetch failed')) {
      return NextResponse.json(
        {
          message: 'Análise temporariamente indisponível. Tente novamente mais tarde.',
          serviceUnavailable: true
        },
        { status: 503 }
      )
    }

    return NextResponse.json(
      { message: errorMessage || 'Analysis failed' },
      { status: 500 }
    )
  }
}
