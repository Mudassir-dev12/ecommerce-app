import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const startTime = Date.now();

    // Query lightweight table to keep Supabase DB active and prevent auto-pausing
    const { data, error } = await supabase
      .from('products')
      .select('id')
      .limit(1);

    const latencyMs = Date.now() - startTime;

    if (error) {
      console.error('[Supabase Keep-Alive] Query error:', error.message);
      return NextResponse.json(
        {
          success: false,
          error: error.message,
          timestamp: new Date().toISOString(),
        },
        { status: 500 }
      );
    }

    console.log(`[Supabase Keep-Alive] Ping successful! Latency: ${latencyMs}ms`);

    return NextResponse.json({
      success: true,
      message: 'Supabase keep-alive ping successful. Database is active 24/7!',
      latencyMs,
      recordCount: data?.length || 0,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('[Supabase Keep-Alive] Unexpected error:', err.message);
    return NextResponse.json(
      {
        success: false,
        error: err.message || 'Keep-alive ping failed',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
