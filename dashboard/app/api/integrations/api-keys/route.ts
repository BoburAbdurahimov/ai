import { NextResponse } from 'next/server';

// Stub: list API keys
export async function GET() {
  return NextResponse.json({
    keys: [
      { id: '1', provider: 'yandex', label: 'SpeechKit Prod', payer: 'platform', cap_per_day: 10000, used_today: 1200 },
      { id: '2', provider: 'openai', label: 'LLM BYO', payer: 'byo', cap_per_day: 5000, used_today: 300 },
    ],
  });
}

// Stub: add API key
export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const { provider, label, key, payer, cap_per_day } = body;
  if (!provider || !label || !key || !payer) {
    return NextResponse.json({ error: 'provider, label, key, payer are required' }, { status: 400 });
  }
  return NextResponse.json({
    status: 'saved',
    provider,
    label,
    payer,
    cap_per_day: cap_per_day ?? null,
  });
}

