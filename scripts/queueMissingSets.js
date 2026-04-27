const { Pool } = require("pg");

process.loadEnvFile(".env.local");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const CANONICAL = {
  electrical: [
    "breaker-keeps-tripping",
    "outlets-not-working",
    "lights-flickering",
    "main-panel-buzzing",
    "power-outage-one-room",
    "gfci-wont-reset",
    "smell-burning-plastic",
    "sparks-from-outlet",
    "generator-wont-start",
    "ceiling-fan-wobbly",
    "outlet-hot-to-touch",
    "partial-power-outage",
    "electrical-shock-outlet",
    "light-switch-not-working",
    "power-surges",
  ],
  plumbing: [
    "water-heater-leaking",
    "no-hot-water",
    "toilet-wont-flush",
    "clogged-drain",
    "low-water-pressure",
    "garbage-disposal-jammed",
    "pipe-burst",
    "running-toilet",
    "sewer-backup",
    "water-softener-issues",
    "pipe-leak",
    "leaky-faucet",
    "drain-smell",
    "shower-not-draining",
    "high-water-pressure",
  ],
  hvac: [
    "ac-not-cooling",
    "ac-blowing-warm-air",
    "ac-freezing-up",
    "ac-making-loud-noise",
    "ac-wont-turn-on",
    "ac-short-cycling",
    "ac-leaking-water",
    "ac-smells-bad",
    "thermostat-blank",
    "high-electric-bill",
    "weak-airflow",
    "ac-running-constantly",
    "outdoor-unit-not-running",
    "hvac-tripping-breaker",
    "ac-not-turning-off",
  ],
};

const cities = [
  "fort-myers-fl",
  "cape-coral-fl",
  "naples-fl",
  "estero-fl",
  "lehigh-acres-fl",
  "bonita-springs-fl",
  "punta-gorda-fl",
  "sanibel-fl",
  "port-charlotte-fl",
  "fort-myers-beach-fl",
];

async function run() {
  let queued = 0;
  let skippedExistingPage = 0;
  let skippedQueued = 0;

  for (const [trade, symptoms] of Object.entries(CANONICAL)) {
    for (const city of cities) {
      for (const symptom of symptoms) {
        const slug = `/${trade}/${symptom}/${city}`;
        const slugWithoutSlash = slug.slice(1);

        const exists = await pool.query(
          `SELECT 1 FROM pages WHERE slug = $1 OR slug = $2 LIMIT 1`,
          [slug, slugWithoutSlash]
        );

        if (exists.rows.length) {
          skippedExistingPage++;
          continue;
        }

        const queuedAlready = await pool.query(
          `SELECT 1 FROM page_queue WHERE slug = $1 OR slug = $2 LIMIT 1`,
          [slug, slugWithoutSlash]
        );

        if (queuedAlready.rows.length) {
          skippedQueued++;
          continue;
        }

        await pool.query(
          `INSERT INTO page_queue (slug, page_type, status)
           VALUES ($1, 'city', 'pending')`,
          [slug]
        );

        queued++;
        console.log(`🟡 Queued missing: ${slug}`);
      }
    }
  }

  console.log(
    `Done. queued=${queued}, existing_pages=${skippedExistingPage}, already_queued=${skippedQueued}`
  );
}

run()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
