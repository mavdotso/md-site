import { NextResponse } from 'next/server';
import { listSitesFromR2 } from '@/lib/cloudflare';

export async function GET() {
  try {
    const sites = await listSitesFromR2();
    
    return NextResponse.json({
      success: true,
      sites,
    });
  } catch (error) {
    console.error('List sites error:', error);
    return NextResponse.json(
      { error: 'Failed to list sites' },
      { status: 500 }
    );
  }
}