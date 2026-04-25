const { Pool } = require('pg');
process.loadEnvFile('.env.local');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function checkJson() {
  const res = await pool.query("SELECT content_json FROM pages WHERE slug = '/electrical/switch-not-working/fort-myers-beach-fl'");
  console.log(JSON.stringify(res.rows[0].content_json, null, 2));
  process.exit(0);
}

checkJson();
