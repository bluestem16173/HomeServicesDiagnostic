const { Client } = require('pg');
const client = new Client({ connectionString: process.env.DATABASE_URL });

async function run() {
  await client.connect();
  const res = await client.query("SELECT slug, status FROM pages WHERE slug LIKE '%electrical%' OR slug LIKE '%breaker%'");
  console.log(res.rows);
  await client.end();
}

run().catch(console.error);
