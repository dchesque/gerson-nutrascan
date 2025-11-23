import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getPersonalizedRecommendations } from '@/lib/openai'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      )
    }

    const { goal } = await request.json()
    
    if (!goal) {
      return NextResponse.json(
        { message: 'Goal is required' },
        { status: 400 }
      )
    }

    const recommendation = await getPersonalizedRecommendations(goal)
    return NextResponse.json({ recommendation })
  } catch (error: any) {
    return NextResponse.json(
      { message: 'Error getting recommendation: ' + error.message },
      { status: 500 }
    )
  }
}
