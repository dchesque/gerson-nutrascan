import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      )
    }

    const supabaseAdmin = createServiceClient()
    
    const { data: analyses, error } = await supabaseAdmin
      .from('analyses')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    return NextResponse.json(
      analyses.map((analysis: any) => ({
        id: analysis.id,
        productName: analysis.product_name,
        brand: analysis.brand,
        score: analysis.score,
        createdAt: analysis.created_at,
      }))
    )
  } catch (error: any) {
    return NextResponse.json(
      { message: 'Error fetching history: ' + error.message },
      { status: 500 }
    )
  }
}
