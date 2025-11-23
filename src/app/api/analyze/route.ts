import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/server'
import { analyzeSupplementWithAI } from '@/lib/openai'

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

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    const clientIp = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown'

    const supabaseAdmin = createServiceClient()

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
      // Check user's free analyses limit if not premium
      const { data: userProfile } = await supabaseAdmin
        .from('user_profiles')
        .select('is_premium, free_analyses_used')
        .eq('id', user.id)
        .single()

      if (userProfile && !userProfile.is_premium && userProfile.free_analyses_used >= 1) {
        return NextResponse.json(
          { message: 'Free analysis limit reached. Please upgrade to premium.', needsPremium: true },
          { status: 403 }
        )
      }
    }

    // Perform analysis
    const analysisResult = await analyzeSupplementWithAI(content)

    // Save to database
    const { data: analysis, error } = await supabaseAdmin
      .from('analyses')
      .insert({
        user_id: user?.id || null,
        product_name: analysisResult.productName,
        brand: analysisResult.brand,
        score: analysisResult.score,
        input_type: type,
        input_content: content,
        ingredients: analysisResult.ingredients,
        total_savings: Math.round(analysisResult.totalSavings * 100),
        online_alternatives: analysisResult.onlineAlternatives,
        local_alternatives: analysisResult.localAlternatives,
      })
      .select()
      .single()

    if (error) {
      console.error('Failed to save analysis:', error)
    }

    // Increment free analyses count for logged-in non-premium users
    if (user && !error) {
      const { data: userProfile } = await supabaseAdmin
        .from('user_profiles')
        .select('is_premium, free_analyses_used')
        .eq('id', user.id)
        .single()

      if (userProfile && !userProfile.is_premium) {
        await supabaseAdmin
          .from('user_profiles')
          .update({ free_analyses_used: (userProfile.free_analyses_used || 0) + 1 })
          .eq('id', user.id)
      }
    }

    return NextResponse.json({
      analysisId: analysis?.id || 'temp-' + Date.now(),
      ...analysisResult,
      totalSavings: analysisResult.totalSavings,
      isFreeTrial: !user,
    })
  } catch (error: any) {
    console.error('Analysis error:', error)
    return NextResponse.json(
      { message: 'Analysis failed: ' + error.message },
      { status: 500 }
    )
  }
}
