import { NextResponse } from 'next/server';
import * as queueService from '@/lib/queue-service';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  if (!code) return NextResponse.json({ error: 'Code required' }, { status: 400 });

  try {
    const shop = await queueService.findShopByShortCode(code);
    if (!shop) return NextResponse.json({ error: 'Shop not found' }, { status: 404 });
    return NextResponse.json(shop);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
