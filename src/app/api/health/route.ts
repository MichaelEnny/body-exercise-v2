import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { HealthMetrics } from '@/types'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    let query = supabase
      .from('health_metrics')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false })

    if (startDate) {
      query = query.gte('date', startDate)
    }

    if (endDate) {
      query = query.lte('date', endDate)
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ data })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { user_id, date, ...metrics } = body

    if (!user_id || !date) {
      return NextResponse.json(
        { error: 'User ID and date are required' },
        { status: 400 }
      )
    }

    // Check if metrics for this date already exist
    const { data: existing } = await supabase
      .from('health_metrics')
      .select('id')
      .eq('user_id', user_id)
      .eq('date', date)
      .single()

    if (existing) {
      // Update existing record
      const { data, error } = await supabase
        .from('health_metrics')
        .update({
          ...metrics,
          source: metrics.source || 'manual'
        })
        .eq('id', existing.id)
        .select()
        .single()

      if (error) {
        return NextResponse.json(
          { error: error.message },
          { status: 500 }
        )
      }

      return NextResponse.json({ data })
    } else {
      // Create new record
      const { data, error } = await supabase
        .from('health_metrics')
        .insert({
          id: crypto.randomUUID(),
          user_id,
          date,
          ...metrics,
          source: metrics.source || 'manual',
          created_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) {
        return NextResponse.json(
          { error: error.message },
          { status: 500 }
        )
      }

      return NextResponse.json({ data }, { status: 201 })
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}