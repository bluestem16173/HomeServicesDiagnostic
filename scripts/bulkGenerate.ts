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

  if (!process.env.DATABASE_URL || typeof process.env.DATABASE_URL !== "string") {
    console.error("❌ DATABASE_URL missing");
    process.exit(1);
  }

  const { query } = await import("../lib/db");
  const { normalizeCanonicalSlug, normalizeSymptom } = await import(
    "../lib/canonicalSlugs"
  );
  const { generateHsdPage, validateHsdSchema } = await import(
    "../src/lib/ai/prompts/generateHsdPage"
  );

  // 🔥 LIMIT CONTROL
  const limitArgIndex = process.argv.indexOf("--limit");
  const limit =
    limitArgIndex > -1
      ? parseInt(process.argv[limitArgIndex + 1], 10)
      : 45;

  const tradesArgIndex = process.argv.indexOf("--trades");
  const trades =
    tradesArgIndex > -1
      ? process.argv[tradesArgIndex + 1]
          .split(",")
          .map((trade) => trade.trim().toLowerCase())
          .filter(Boolean)
      : [];

  // 🔥 LOAD FROM DB (THIS IS THE KEY CHANGE)
  const { rows } = await query(
    `
    SELECT slug
    FROM page_queue
    WHERE status = 'pending'
      AND (
        cardinality($2::text[]) = 0
        OR split_part(trim(leading '/' from slug), '/', 1) = ANY($2::text[])
      )
    ORDER BY priority DESC NULLS LAST
    LIMIT $1
  `,
    [limit, trades]
  );

  if (!rows.length) {
    console.log("⚠️ No pending pages found.");
    return;
  }

  console.log(
    `🚀 Generating ${rows.length} pages${trades.length ? ` for ${trades.join(", ")}` : ""}...`
  );

  function normalizeSlug(slug: string) {
    return slug.startsWith("/") ? slug : `/${slug}`;
  }

  function parseSlug(slug: string) {
    const parts = normalizeCanonicalSlug(normalizeSlug(slug)).split("/");

    return {
      vertical: parts[1],
      symptom: normalizeSymptom(parts[1], parts[2]).replace(/-/g, " "),
      city: parts[3]
        .replace(/-/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase())
    };
  }

  for (const row of rows) {
    const queueSlug = normalizeSlug(row.slug);
    const slug = normalizeCanonicalSlug(queueSlug);

    try {
      const { vertical, symptom, city } = parseSlug(slug);

      console.log(`\n⚡ ${vertical.toUpperCase()} → ${symptom} (${city})`);

      const result = await generateHsdPage({
        vertical,
        symptom,
        city
      });

      // 🔒 HARD GUARDS (CRITICAL)
      if (result.schema_version !== "hsd_v3_graphic") {
        throw new Error("WRONG SCHEMA VERSION");
      }

      const validated = validateHsdSchema(result);

      const content = validated.content;

      if (
        !content?.flow_type ||
        content.diagnostic_flow !== null ||
        content.top_causes.length !== 4 ||
        content.stop_diy.length < 5
      ) {
        throw new Error("WEAK OR INVALID OUTPUT");
      }

      // 💾 SAVE + PUBLISH
      await query(
        `
        INSERT INTO pages (slug, page_type, status, content_json)
        VALUES ($1, 'city', 'published', $2)
        ON CONFLICT (slug)
        DO UPDATE SET content_json = $2, status = 'published'
      `,
        [slug, validated]
      );

      // 🔄 MARK QUEUE COMPLETE
      await query(
        `
        UPDATE page_queue
        SET status = 'done', last_error = NULL
        WHERE slug = $1 OR slug = $2
      `,
        [queueSlug, queueSlug.slice(1)]
      );

      console.log(`✅ Published: ${slug}`);

      // ⚡ RATE LIMIT SAFE (FAST)
      await new Promise((r) => setTimeout(r, 800));

    } catch (error) {
      console.error(`❌ Failed: ${slug}`, error);

      await query(
        `
        UPDATE page_queue
        SET status = 'failed', last_error = $2
        WHERE slug = $1
      `,
        [slug, String(error)]
      );
    }
  }

  console.log("\n🔥 DONE — Pages generated and live");
}

void run();