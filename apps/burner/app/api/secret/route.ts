import { NextRequest, NextResponse } from 'next/server';

const secrets = new Map<string, any>();

export async function POST(request: NextRequest) {
  try {
    const encrypted = await request.json();
    const id = Math.random().toString(36).substr(2, 9);
    secrets.set(id, encrypted);
    // Expire after 24 hours
    setTimeout(() => secrets.delete(id), 24 * 60 * 60 * 1000);
    return NextResponse.json({ id });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}