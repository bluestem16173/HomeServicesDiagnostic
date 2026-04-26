const { Client } = require('pg');
const client = new Client({ connectionString: process.env.DATABASE_URL });

async function run() {
  await client.connect();
  const slugs = [
    '/hvac/ac-not-cooling/fort-myers-fl',
    '/plumbing/water-heater-leaking/fort-myers-fl',
    '/electrical/breaker-tripping/fort-myers-fl'
  ];

  for (const slug of slugs) {
    const res = await client.query("SELECT content_json FROM pages WHERE slug = $1", [slug]);
    console.log(`\n=== Output for ${slug} ===\n`);
    if (res.rows.length > 0) {
      console.log(Object.keys(res.rows[0].content_json.content || {}));
    } else {
      console.log("No data found");
    }
  }
  await client.end();
}

run().catch(err => {
  console.error(err);
  client.end();
});
