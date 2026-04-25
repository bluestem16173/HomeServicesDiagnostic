const { Pool } = require('pg');

const updates = [
  {
    slug: '/electrical/breaker-keeps-tripping/fort-myers-fl',
    mermaid_chart: "graph TD\n  A[Breaker Trips] --> B{When does it trip?}\n  B -- Instantly --> C[Short Circuit - Stop DIY]\n  B -- After 10 mins --> D[Overload - Unplug Devices]\n  B -- \"<b style='color:red'>frequent heavy storms</b>\" --> E[\"<b style='color:red'>frequent heavy storms</b> GFCI Water Intrusion\"]\n  C --> F[Call Electrician]\n  D --> F\n  E --> F\n  style E fill:#fee2e2,stroke:#ef4444,stroke-width:2px"
  }
];

async function run() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  try {
    for (const update of updates) {
      const res = await pool.query("SELECT content_json FROM pages WHERE slug = $1", [update.slug]);
      if (res.rows.length > 0) {
        let data = res.rows[0].content_json;
        data.content.mermaid_chart = update.mermaid_chart;
        await pool.query("UPDATE pages SET content_json = $1 WHERE slug = $2", [data, update.slug]);
        console.log(`Updated test Mermaid chart for ${update.slug}`);
      }
    }
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

run();
