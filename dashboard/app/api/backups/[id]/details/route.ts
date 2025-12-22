import { NextRequest, NextResponse } from 'next/server';
import { getBackupDetails } from '@/lib/cli-wrapper';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const result = await getBackupDetails(params.id);
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      backup: result.backup
    });
  } catch (error: any) {
    console.error('Error getting backup details:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
