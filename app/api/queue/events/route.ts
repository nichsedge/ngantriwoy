import { queueEvents, EVENTS } from '@/lib/events';
import * as queueService from '@/lib/queue-service';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const shopId = searchParams.get('shopId');
  if (!shopId) return new Response('Shop ID required', { status: 400 });

  const encoder = new TextEncoder();
  let isClosed = false;

  const stream = new ReadableStream({
    async start(controller) {
      const queue = await queueService.getQueueByShopId(shopId);
      if (!queue) {
        controller.close();
        return;
      }

      const sendUpdate = async () => {
        if (isClosed) return;
        try {
          const state = await queueService.getFullState(queue.id);
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(state)}\n\n`));
        } catch (e) {
          console.error('SSE Error:', e);
        }
      };

      const listener = () => sendUpdate();
      queueEvents.on(EVENTS.QUEUE_UPDATED, listener);

      // Initial send
      await sendUpdate();

      // Keep alive
      const keepAlive = setInterval(() => {
        if (isClosed) {
          clearInterval(keepAlive);
          return;
        }
        try {
          controller.enqueue(encoder.encode(': keep-alive\n\n'));
        } catch (e) {
          isClosed = true;
          clearInterval(keepAlive);
        }
      }, 30000);

      req.signal.addEventListener('abort', () => {
        isClosed = true;
        clearInterval(keepAlive);
        queueEvents.off(EVENTS.QUEUE_UPDATED, listener);
        try { controller.close(); } catch (e) {}
      });
    },
    cancel() {
      isClosed = true;
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
