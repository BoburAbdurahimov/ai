import { NextResponse } from 'next/server';

// Stub: configure Telegram bot alerts and daily summary
export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const { botToken, chatId } = body;
  if (!botToken || !chatId) {
    return NextResponse.json({ error: 'botToken and chatId are required' }, { status: 400 });
  }

  return NextResponse.json({
    status: 'configured',
    alerts: ['new_booking', 'missed_call', 'human_transfer', 'payment_past_due'],
    daily_summary_time: '07:00',
  });
}

