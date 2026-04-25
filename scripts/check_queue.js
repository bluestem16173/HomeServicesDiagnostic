const { Pool } = require('pg');
process.loadEnvFile('.env.local');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function checkStatus() {
  const queueRes = await pool.query("SELECT status, count(1) FROM generation_queue GROUP BY status");
  console.log("Queue Status:");
  console.table(queueRes.rows);

  const pagesRes = await pool.query("SELECT slug, status FROM pages ORDER BY created_at DESC LIMIT 10");
  console.log("Recent Pages:");
  console.table(pagesRes.rows);
  
  process.exit(0);
}

checkStatus();
