import { NextResponse } from 'next/server';

// Stub: create/link Google Sheet (read-only for client)
export async function POST() {
  const sheetUrl = 'https://docs.google.com/spreadsheets/d/placeholder';
  return NextResponse.json({
    sheetUrl,
    status: 'created',
    columns: [
      'call_id',
      'timestamp',
      'caller_number',
      'language',
      'handled_by',
      'outcome',
      'duration_sec',
      'agent',
      'number',
      'booking',
      'notes',
    ],
  });
}

