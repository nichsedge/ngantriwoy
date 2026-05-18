import { db } from './db';
import { shops, queues, tickets, users } from './schema';
import { eq, and, sql, desc } from 'drizzle-orm';

function checkDb() {
  if (!db) throw new Error('Database not configured');
}

export async function getShopsByOwner(ownerId: string) {
  checkDb();
  return await db.query.shops.findMany({
    where: eq(shops.ownerId, ownerId),
    orderBy: [desc(shops.createdAt)],
  });
}

export async function createShop(ownerId: string, name: string) {
  checkDb();

  // Ensure owner exists
  const existingUser = await db.query.users.findFirst({
    where: eq(users.id, ownerId),
  });

  if (!existingUser) {
    await db.insert(users).values({
      id: ownerId,
      name: 'Developer Admin',
      email: 'admin@antriankita.com',
    });
  }

  // Generate a unique 6-character alphanumeric short code
  let shortCode = '';
  let isUnique = false;
  let attempts = 0;

  while (!isUnique && attempts < 10) {
    shortCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const existing = await db.query.shops.findFirst({
      where: eq(shops.shortCode, shortCode),
    });
    if (!existing) isUnique = true;
    attempts++;
  }

  if (!isUnique) {
    throw new Error('Gagal membuat kode unik untuk toko. Silakan coba lagi.');
  }

  const [shop] = await db.insert(shops).values({
    name,
    ownerId,
    shortCode,
    slug: name.toLowerCase().replace(/ /g, '-'),
  }).returning();

  // Create a default queue for the shop
  const [queue] = await db.insert(queues).values({
    shopId: shop.id,
    prefix: 'A',
    lastSequence: 0,
  }).returning();

  return { shop, queue };
}

export async function findShopByShortCode(code: string) {
  checkDb();
  return await db.query.shops.findFirst({
    where: eq(shops.shortCode, code),
  });
}

export async function getQueueByShopId(shopId: string) {
  checkDb();
  return await db.query.queues.findFirst({
    where: eq(queues.shopId, shopId),
  });
}

export async function getFullState(queueId: string) {
  checkDb();
  
  const serving = await db.query.tickets.findFirst({
    where: and(
      eq(tickets.queueId, queueId),
      eq(tickets.status, 'serving')
    ),
  });

  const waiting = await db.query.tickets.findMany({
    where: and(
      eq(tickets.queueId, queueId),
      eq(tickets.status, 'waiting')
    ),
    orderBy: [tickets.sequence],
  });

  const history = await db.query.tickets.findMany({
    where: and(
      eq(tickets.queueId, queueId),
      sql`${tickets.status} IN ('completed', 'skipped')`
    ),
    orderBy: [desc(tickets.completedAt)],
    limit: 10,
  });

  // Calculate average service time from last 10 completed tickets
  const recentCompleted = await db.query.tickets.findMany({
    where: and(
      eq(tickets.queueId, queueId),
      eq(tickets.status, 'completed'),
      sql`${tickets.servedAt} IS NOT NULL`,
      sql`${tickets.completedAt} IS NOT NULL`
    ),
    orderBy: [desc(tickets.completedAt)],
    limit: 10,
  });

  let avgServiceMinutes = 5; // Default fallback
  if (recentCompleted.length > 0) {
    const totalMs = recentCompleted.reduce((acc, t) => {
      if (t.servedAt && t.completedAt) {
        return acc + (t.completedAt.getTime() - t.servedAt.getTime());
      }
      return acc;
    }, 0);
    const avgMs = totalMs / recentCompleted.length;
    avgServiceMinutes = Math.max(1, Math.round(avgMs / 60000));
  }

  const totalToday = await db.select({ count: sql<number>`count(*)` })
    .from(tickets)
    .where(eq(tickets.queueId, queueId));

  const servedToday = await db.select({ count: sql<number>`count(*)` })
    .from(tickets)
    .where(and(
      eq(tickets.queueId, queueId),
      eq(tickets.status, 'completed')
    ));

  const queue = await db.query.queues.findFirst({
    where: eq(queues.id, queueId),
  });

  if (!queue) throw new Error('Queue not found');

  const shop = await db.query.shops.findFirst({
    where: eq(shops.id, queue.shopId),
  });

  return {
    name: shop?.name || 'Toko',
    serving: serving || null,
    waiting,
    history,
    waitingCount: waiting.length,
    totalToday: Number(totalToday[0].count),
    servedCount: Number(servedToday[0].count),
    nextNumber: `${queue.prefix}-${queue.lastSequence + 1}`,
    avgServiceMinutes,
  };
}

export async function takeTicket(queueId: string, note?: string) {
  checkDb();

  // Update queue sequence atomically
  const [updatedQueue] = await db.update(queues)
    .set({ 
      lastSequence: sql`${queues.lastSequence} + 1`,
      updatedAt: new Date()
    })
    .where(eq(queues.id, queueId))
    .returning();

  if (!updatedQueue) throw new Error('Antrean tidak ditemukan');

  const sequence = updatedQueue.lastSequence;
  const number = `${updatedQueue.prefix}${sequence}`;

  // Create ticket
  const [ticket] = await db.insert(tickets)
    .values({
      queueId: updatedQueue.id,
      number,
      sequence,
      note: note || null,
    })
    .returning();

  return ticket;
}

export async function callNext(queueId: string) {
  checkDb();

  // Complete current
  await db.update(tickets)
    .set({ status: 'completed', completedAt: new Date() })
    .where(and(
      eq(tickets.queueId, queueId),
      eq(tickets.status, 'serving')
    ));

  // Find next waiting
  const nextTicket = await db.query.tickets.findFirst({
    where: and(
      eq(tickets.queueId, queueId),
      eq(tickets.status, 'waiting')
    ),
    orderBy: [tickets.sequence],
  });

  if (nextTicket) {
    await db.update(tickets)
      .set({ status: 'serving', servedAt: new Date() })
      .where(eq(tickets.id, nextTicket.id));
  }

  return nextTicket || null;
}

export async function skipCurrent(queueId: string) {
  checkDb();

  // Skip current
  await db.update(tickets)
    .set({ status: 'skipped', completedAt: new Date() })
    .where(and(
      eq(tickets.queueId, queueId),
      eq(tickets.status, 'serving')
    ));

  // Find next waiting
  const nextTicket = await db.query.tickets.findFirst({
    where: and(
      eq(tickets.queueId, queueId),
      eq(tickets.status, 'waiting')
    ),
    orderBy: [tickets.sequence],
  });

  if (nextTicket) {
    await db.update(tickets)
      .set({ status: 'serving', servedAt: new Date() })
      .where(eq(tickets.id, nextTicket.id));
  }

  return nextTicket || null;
}

export async function resetToday(queueId: string) {
  checkDb();

  await db.update(tickets)
    .set({ status: 'completed' })
    .where(and(
      eq(tickets.queueId, queueId),
      sql`${tickets.status} IN ('waiting', 'serving')`
    ));

  await db.update(queues)
    .set({ lastSequence: 0, updatedAt: new Date() })
    .where(eq(queues.id, queueId));
}
