const { Pool } = require('pg');
process.loadEnvFile('.env.local');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function reset() {
  const res = await pool.query("UPDATE generation_queue SET status = 'pending' WHERE status IN ('completed', 'done', 'generated', 'failed')");
  console.log(`Reset ${res.rowCount} rows`);
  process.exit(0);
}

reset();
