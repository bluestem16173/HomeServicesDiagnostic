export {};

async function run() {
  try {
    process.loadEnvFile(".env.local");
  } catch {
    try {
      process.loadEnvFile(".env");
    } catch {
      /* no env file */
    }
  }

  const { query } = await import("../lib/db");
  const { TRADE_CANONICAL_SYMPTOMS } = await import("../lib/canonicalSlugs");

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

  let queued = 0;
  let existing = 0;
  let alreadyQueued = 0;

  for (const [trade, symptoms] of Object.entries(TRADE_CANONICAL_SYMPTOMS)) {
    for (const city of cities) {
      for (const symptom of symptoms) {
        const slug = `/${trade}/${symptom}/${city}`;
        const slugWithoutSlash = slug.slice(1);

        const exists = await query(
          `SELECT 1 FROM pages WHERE slug = $1 OR slug = $2 LIMIT 1`,
          [slug, slugWithoutSlash]
        );

        if (exists.rows.length) {
          existing++;
          continue;
        }

        const inserted = await query(
          `INSERT INTO page_queue (slug, page_type, status)
           VALUES ($1, 'city', 'pending')
           ON CONFLICT (slug) DO NOTHING
           RETURNING slug`,
          [slug]
        );

        if (inserted.rows.length) {
          queued++;
          console.log(`🟡 queued ${slug}`);
        } else {
          alreadyQueued++;
        }
      }
    }
  }

  console.log(
    `✅ Queue fill complete. queued=${queued}, existing_pages=${existing}, already_queued=${alreadyQueued}`
  );
}

void run();
