import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import * as queueService from '@/lib/queue-service';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const shops = await queueService.getShopsByOwner(session.user.id);
    return NextResponse.json(shops);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { name } = await req.json();
    if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 });

    const result = await queueService.createShop(session.user.id, name);
    return NextResponse.json(result);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
