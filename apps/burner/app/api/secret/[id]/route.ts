import { NextRequest, NextResponse } from 'next/server';

const secrets = new Map<string, any>();

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const secret = secrets.get(id);
  if (secret) {
    secrets.delete(id); // Burn after reading
    return NextResponse.json(secret);
  }
  return NextResponse.json({ error: 'Secret not found or already burned' }, { status: 404 });
}