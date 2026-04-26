const { Client } = require('pg');
const client = new Client({ connectionString: process.env.DATABASE_URL });

async function run() {
  await client.connect();
  const res = await client.query("SELECT slug, content_json FROM pages WHERE slug LIKE '/hvac/%' LIMIT 10");
  const nodes = res.rows.map(r => ({
    slug: r.slug,
    firstNode: r.content_json.content.diagnostic_flow.nodes[0]
  }));
  console.log(JSON.stringify(nodes, null, 2));
  await client.end();
}

run().catch(console.error);
