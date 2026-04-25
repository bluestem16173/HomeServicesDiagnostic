const { Pool } = require('pg');

const updates = [
  {
    slug: '/hvac/ac-not-cooling/fort-myers-fl',
    mermaid_chart: "graph TD\n  A[Warm Air at Vents] --> B{Is Outdoor Unit Running?}\n  B -- Yes --> C{Check Humidity Load}\n  C -- High Humidity --> D[Suspect Frozen Coil or Clogged Drain]\n  C -- Normal --> E[Check Refrigerant Leak]\n  B -- No --> F[Check Salt-Air Corrosion at Contactor]\n  D --> G[Call HVAC Pro]\n  E --> G\n  F --> G"
  },
  {
    slug: '/electrical/breaker-keeps-tripping/fort-myers-fl',
    mermaid_chart: "graph TD\n  A[Breaker Trips] --> B{When does it trip?}\n  B -- Instantly --> C[Short Circuit - Stop DIY]\n  B -- After 10 mins --> D[Overload - Unplug Devices]\n  B -- Heavy Rain --> E[Check Exterior GFCI for Water Intrusion]\n  C --> F[Call Electrician]\n  D --> F\n  E --> F"
  },
  {
    slug: '/plumbing/no-hot-water/fort-myers-fl',
    mermaid_chart: "graph TD\n  A[No Hot Water] --> B{Gas or Electric?}\n  B -- Electric --> C{Check Tank Base}\n  C -- Florida Hard Water Scaling --> D[Suspect Burnt Element]\n  C -- Leaking --> E[Corroded Tank Breach]\n  B -- Gas --> F[Check Pilot & Gas Valve]\n  D --> G[Call Plumber]\n  E --> G\n  F --> G"
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
        console.log(`Updated Mermaid chart for ${update.slug}`);
      }
    }
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

run();
