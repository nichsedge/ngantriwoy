import postgres from 'postgres';

const sql = postgres(process.env.DATABASE_URL!);

async function main() {
  console.log('Truncating shops table...');
  try {
    await sql`TRUNCATE TABLE shops CASCADE`;
    console.log('Done!');
  } catch (e) {
    console.error(e);
  }
  process.exit(0);
}

main();
