const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
pool.query('SELECT content_json FROM pages WHERE slug = $1', ['/hvac/ac-not-cooling/fort-myers-fl'])
  .then(res => {
    console.log(JSON.stringify(res.rows[0].content_json, null, 2));
    pool.end();
  });
