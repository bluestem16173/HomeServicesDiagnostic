try { process.loadEnvFile('.env.local'); } catch(e) {}
import { query } from '../lib/db';
import { generateHsdPage, validateHsdSchema } from '../src/lib/ai/prompts/generateHsdPage';

async function run() {
  const slugArg = process.argv[2];
  if (!slugArg) {
    console.error("Please provide a slug, e.g. /hvac/ac-not-cooling/fort-myers-fl");
    process.exit(1);
  }

  // Ensure slug starts with /
  const slug = slugArg.startsWith('/') ? slugArg : '/' + slugArg;
  
  // Parse slug components
  const parts = slug.split('/').filter(Boolean); // ['hvac', 'ac-not-cooling', 'fort-myers-fl']
  if (parts.length < 3) {
    console.error("Invalid slug format. Expected /vertical/symptom/city-state");
    process.exit(1);
  }

  const vertical = parts[0];
  const symptom = parts[1].replace(/-/g, ' ');
  const citySlug = parts[2];
  const citySearchQuery = citySlug.split('-').slice(0, -1).join(' ').replace(/\b\w/g, l => l.toUpperCase()); // fort myers
  const stateCode = citySlug.split('-').pop()?.toUpperCase() || 'FL'; // FL
  const city = `${citySearchQuery}, ${stateCode}`;

  console.log(`\n========================================`);
  console.log(`Generating ${slug}...`);
  console.log(`Vertical: ${vertical} | Symptom: ${symptom} | City: ${city}`);
  
  try {
    const result = await generateHsdPage({
        vertical,
        symptom,
        city
    });

    const validated = validateHsdSchema(result);

    await query(`
      INSERT INTO pages (slug, page_type, status, content_json)
      VALUES ($1, 'city', 'published', $2)
      ON CONFLICT (slug) DO UPDATE SET content_json = $2
    `, [slug, validated]);

    console.log(`✅ Success: ${slug}`);
    console.log(`\n--- MERMAID JSON DUMP ---`);
    console.log(JSON.stringify(validated.content.diagnostic_flow, null, 2));
    console.log(`-------------------------\n`);
  } catch (err) {
    console.error(`❌ Failed: ${slug}`, err);
  }
  
  process.exit(0);
}

run();
