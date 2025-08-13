import { NextRequest, NextResponse } from 'next/server';
import { deleteFromR2 } from '@/lib/cloudflare';

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const siteName = searchParams.get('siteName');

    if (!siteName) {
      return NextResponse.json(
        { error: 'Site name is required' },
        { status: 400 }
      );
    }

    await deleteFromR2(siteName);
    
    return NextResponse.json({
      success: true,
      message: `Site ${siteName} deleted successfully`,
    });
  } catch (error) {
    console.error('Delete site error:', error);
    return NextResponse.json(
      { error: 'Failed to delete site' },
      { status: 500 }
    );
  }
}