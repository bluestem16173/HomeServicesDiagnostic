const { Pool } = require('pg');

const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL 
});

async function run() {
  try {
    const res = await pool.query("SELECT slug, created_at, content_json FROM pages WHERE created_at >= '2026-04-24T00:00:00Z' AND created_at < '2026-04-25T00:00:00Z' ORDER BY created_at DESC LIMIT 3");
    console.log(`Found ${res.rows.length} pages:`);
    res.rows.forEach(r => {
      console.log(`\n--- ${r.slug} ---`);
      console.log(`Created: ${r.created_at}`);
      console.log(JSON.stringify(r.content_json, null, 2));
    });
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

run();
