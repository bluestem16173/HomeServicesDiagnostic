export {};

// Load env before any module that constructs pg Pool (imports are hoisted otherwise).
try {
  process.loadEnvFile(".env.local");
} catch {
  try {
    process.loadEnvFile(".env");
  } catch {
    /* no bundled env file */
  }
}

async function run() {
  const { query } = await import("../lib/db");
  const { normalizeCanonicalSlug, normalizeSymptom } = await import(
    "../lib/canonicalSlugs"
  );
  const { generateHsdPage, validateHsdSchema } = await import(
    "../src/lib/ai/prompts/generateHsdPage"
  );

  const slugArg = process.argv[2];
  if (!slugArg) {
    console.error("Please provide a slug, e.g. /hvac/ac-not-cooling/fort-myers-fl");
    process.exit(1);
  }

  const inputSlug = slugArg.startsWith("/") ? slugArg : "/" + slugArg;
  const slug = normalizeCanonicalSlug(inputSlug);
  const parts = slug.split("/").filter(Boolean);
  if (parts.length < 3) {
    console.error("Invalid slug format. Expected /vertical/symptom/city-state");
    process.exit(1);
  }

  const vertical = parts[0];
  const symptomSlug = normalizeSymptom(vertical, parts[1]);
  const symptom = symptomSlug.replace(/-/g, " ");
  const citySlug = parts[2];
  const citySearchQuery = citySlug
    .split("-")
    .slice(0, -1)
    .join(" ")
    .replace(/\b\w/g, (l) => l.toUpperCase());
  const stateCode = citySlug.split("-").pop()?.toUpperCase() || "FL";
  const city = `${citySearchQuery}, ${stateCode}`;

  console.log(`\n========================================`);
  console.log(`Generating ${slug}...`);
  if (slug !== inputSlug) {
    console.log(`Canonicalized from ${inputSlug}`);
  }
  console.log(`Vertical: ${vertical} | Symptom: ${symptom} | City: ${city}`);

  if (!process.env.DATABASE_URL || typeof process.env.DATABASE_URL !== "string") {
    console.error("❌ DATABASE_URL is missing or not a string after loading .env.local");
    process.exit(1);
  }

  try {
    const result = await generateHsdPage({
      vertical,
      symptom,
      city,
    });

    const validated = validateHsdSchema(result);

    await query(
      `
      INSERT INTO pages (slug, page_type, status, content_json)
      VALUES ($1, 'city', 'published', $2)
      ON CONFLICT (slug) DO UPDATE SET content_json = $2
    `,
      [slug, validated]
    );

    console.log(`✅ Success: ${slug}`);
    console.log(`\n--- MERMAID JSON DUMP ---`);
    console.log(JSON.stringify(validated.content.diagnostic_flow, null, 2));
    console.log(`-------------------------\n`);
  } catch (err) {
    console.error(`❌ Failed: ${slug}`, err);
  }

  process.exit(0);
}

void run();
