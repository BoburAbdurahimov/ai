import { NextResponse } from 'next/server';

// Stub: handle Click payment webhooks
export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const { event_id, event_type, subscription_id, plan, status } = body;

  if (!event_id || !event_type) {
    return NextResponse.json({ error: 'invalid event' }, { status: 400 });
  }

  // TODO: persist idempotency, update subscription status in DB
  return NextResponse.json({
    received: true,
    event: { event_id, event_type, subscription_id, plan, status },
  });
}

