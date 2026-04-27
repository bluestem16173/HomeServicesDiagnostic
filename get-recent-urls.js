const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL 
});

async function run() {
  try {
    const res = await pool.query(`
      SELECT slug, created_at 
      FROM pages 
      WHERE created_at >= NOW() - INTERVAL '24 hours'
      ORDER BY created_at DESC
    `);
    console.log(`Found ${res.rows.length} pages created in the last 24 hours:`);
    res.rows.forEach(r => {
      console.log(`- ${r.slug} (Created: ${r.created_at})`);
    });
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

run();
