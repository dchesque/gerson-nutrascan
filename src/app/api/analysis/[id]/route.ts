import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabaseAdmin = createServiceClient()
    
    const { data: analysis, error } = await supabaseAdmin
      .from('analyses')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !analysis) {
      return NextResponse.json(
        { message: 'Analysis not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      id: analysis.id,
      productName: analysis.product_name,
      brand: analysis.brand,
      score: analysis.score,
      inputType: analysis.input_type,
      inputContent: analysis.input_content,
      ingredients: analysis.ingredients,
      totalSavings: analysis.total_savings / 100,
      onlineAlternatives: analysis.online_alternatives,
      localAlternatives: analysis.local_alternatives,
      createdAt: analysis.created_at,
    })
  } catch (error: any) {
    return NextResponse.json(
      { message: 'Error fetching analysis: ' + error.message },
      { status: 500 }
    )
  }
}
