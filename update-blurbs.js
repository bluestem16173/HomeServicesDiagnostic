const { Pool } = require('pg');

const updates = [
  {
    slug: '/hvac/ac-not-cooling/fort-myers-fl',
    climate_blurb: "Note: This diagnostic path is adapted for Fort Myers, FL where high coastal humidity commonly causes rapid condensate drain clogs and frozen evaporator coils."
  },
  {
    slug: '/electrical/breaker-keeps-tripping/fort-myers-fl',
    climate_blurb: "Note: This diagnostic path is adapted for Fort Myers, FL where frequent heavy storms and salt-air corrosion commonly cause exterior GFCI water intrusion and breaker trips."
  },
  {
    slug: '/plumbing/no-hot-water/fort-myers-fl',
    climate_blurb: "Note: This diagnostic path is adapted for Fort Myers, FL where high mineral scaling from Florida hard water commonly causes premature heating element burnout."
  }
];

async function run() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  try {
    for (const update of updates) {
      const res = await pool.query("SELECT content_json FROM pages WHERE slug = $1", [update.slug]);
      if (res.rows.length > 0) {
        let data = res.rows[0].content_json;
        data.content.climate_blurb = update.climate_blurb;
        await pool.query("UPDATE pages SET content_json = $1 WHERE slug = $2", [data, update.slug]);
        console.log(`Updated climate_blurb for ${update.slug}`);
      }
    }
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

run();
