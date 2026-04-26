const { Client } = require('pg');
const client = new Client({ connectionString: process.env.DATABASE_URL });

async function run() {
  await client.connect();
  const res = await client.query("SELECT slug, content_json->>'schema_version' as schema, status FROM pages");
  console.log(res.rows);
  await client.end();
}

run().catch(console.error);
