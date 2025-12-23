import { NextResponse } from 'next/server';

// Stub: create Click invoice/checkout for subscription
export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const { plan, workspaceId } = body;

  if (!plan || !workspaceId) {
    return NextResponse.json({ error: 'plan and workspaceId are required' }, { status: 400 });
  }

  // Placeholder checkout URL
  const checkoutUrl = `https://click.example/checkout?plan=${plan}&ws=${workspaceId}`;

  return NextResponse.json({
    checkoutUrl,
    plan,
    workspaceId,
    status: 'pending',
  });
}

