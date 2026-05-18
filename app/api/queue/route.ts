import { NextResponse } from 'next/server';
import * as queueService from '@/lib/queue-service';
import { queueEvents, EVENTS } from '@/lib/events';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const shopId = searchParams.get('shopId');
    if (!shopId) return NextResponse.json({ error: 'Shop ID required' }, { status: 400 });

    const queue = await queueService.getQueueByShopId(shopId);
    if (!queue) return NextResponse.json({ error: 'Queue not found' }, { status: 404 });

    const state = await queueService.getFullState(queue.id);
    return NextResponse.json(state);
  } catch (error) {
    console.warn('Database not ready, returning empty state:', error);
    return NextResponse.json({ 
      serving: null,
      waiting: [],
      history: [],
      waitingCount: 0,
      totalToday: 0,
      servedCount: 0,
      nextNumber: '---'
    });
  }
}

export async function POST(req: Request) {
  try {
    const { action, note, shopId } = await req.json();
    if (!shopId) return NextResponse.json({ error: 'Shop ID required' }, { status: 400 });

    const queue = await queueService.getQueueByShopId(shopId);
    if (!queue) return NextResponse.json({ error: 'Queue not found' }, { status: 404 });

    let result;

    switch (action) {
      case 'take':
        result = await queueService.takeTicket(queue.id, note);
        break;
      case 'next':
        result = await queueService.callNext(queue.id);
        break;
      case 'skip':
        result = await queueService.skipCurrent(queue.id);
        break;
      case 'reset':
        await queueService.resetToday(queue.id);
        result = { success: true };
        break;
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    // Emit event to notify SSE clients
    queueEvents.emit(EVENTS.QUEUE_UPDATED);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
