import { pgTable, text, timestamp, integer, uuid, primaryKey, boolean } from 'drizzle-orm/pg-core';
import type { AdapterAccountType } from 'next-auth/adapters';

// --- Auth Tables ---
export const users = pgTable('user', {
  id: text('id').notNull().primaryKey(),
  name: text('name'),
  email: text('email').notNull(),
  emailVerified: timestamp('emailVerified', { mode: 'date' }),
  image: text('image'),
});

export const accounts = pgTable(
  'account',
  {
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').$type<AdapterAccountType>().notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('providerAccountId').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const sessions = pgTable('session', {
  sessionToken: text('sessionToken').notNull().primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
});

export const verificationTokens = pgTable(
  'verificationToken',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);

// --- App Tables ---
export const shops = pgTable('shops', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').unique(),
  shortCode: text('short_code').unique(),
  ownerId: text('owner_id').references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const queues = pgTable('queues', {
  id: uuid('id').defaultRandom().primaryKey(),
  shopId: uuid('shop_id').references(() => shops.id, { onDelete: 'cascade' }),
  prefix: text('prefix').default('A'),
  lastSequence: integer('last_sequence').default(0).notNull(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const tickets = pgTable('tickets', {
  id: uuid('id').primaryKey().defaultRandom(),
  queueId: uuid('queue_id').references(() => queues.id).notNull(),
  number: text('number').notNull(),
  sequence: integer('sequence').notNull(),
  note: text('note'),
  status: text('status', { enum: ['waiting', 'serving', 'completed', 'skipped'] }).notNull().default('waiting'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  servedAt: timestamp('served_at'),
  completedAt: timestamp('completed_at'),
});
