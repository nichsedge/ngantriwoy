import { db } from '../lib/db';
import { sql } from 'drizzle-orm';

async function main() {
  console.log('Truncating tables...');
  try {
    await db.execute(sql`TRUNCATE TABLE shops CASCADE`);
    console.log('Done!');
  } catch (e) {
    console.error(e);
  }
  process.exit(0);
}

main();
