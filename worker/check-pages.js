const { Pool } = require('pg');
const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_gjtxze1kum6N@ep-solitary-darkness-anw3z5fo-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
});

async function run() {
  const slugs = [
    '/electrical/breaker-keeps-tripping/fort-myers-fl',
    '/electrical/burning-smell-from-electrical/fort-myers-fl',
    '/electrical/outlet-sparking/fort-myers-fl',
    '/electrical/panel-overheating/fort-myers-fl',
    '/plumbing/water-heater-leaking/fort-myers-fl',
    '/plumbing/low-water-pressure/fort-myers-fl',
    '/plumbing/drain-clogged/fort-myers-fl',
    '/electrical/lights-flickering/fort-myers-fl',
    '/electrical/power-out-in-one-room/fort-myers-fl'
  ];

  for (const slug of slugs) {
    const res = await pool.query('SELECT * FROM pages WHERE slug = $1', [slug]);
    if (res.rows.length > 0) {
      console.log('✅ Found:', slug);
      console.log(JSON.stringify(res.rows[0].content, null, 2));
      console.log('\n=========================\n');
    } else {
      console.log('❌ Missing:', slug);
    }
  }
  pool.end();
}

run();
