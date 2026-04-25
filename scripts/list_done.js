const { Pool } = require('pg');
process.loadEnvFile('.env.local');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function listCompleted() {
  try {
    const res = await pool.query(
      "SELECT slug FROM pages ORDER BY id DESC LIMIT 20"
    );
    res.rows.forEach(row => {
      console.log(`✅ https://homeservicediagnostics.com${row.slug}`);
    });
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

listCompleted();
