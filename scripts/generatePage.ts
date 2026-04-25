// scripts/generatePage.ts
try { process.loadEnvFile('.env.local'); } catch(e) {}
import { query } from '../lib/db';
import { generateHsdPage, validateHsdSchema } from '../src/lib/ai/prompts/generateHsdPage';

async function run() {
    const targets = [
      { slug: '/hvac/ac-not-cooling/fort-myers-fl', vertical: 'hvac', symptom: 'ac not cooling', city: 'Fort Myers, FL' },
      { slug: '/electrical/breaker-tripping/cape-coral-fl', vertical: 'electrical', symptom: 'breaker tripping', city: 'Cape Coral, FL' },
      { slug: '/plumbing/water-heater-leaking/estero-fl', vertical: 'plumbing', symptom: 'water heater leaking', city: 'Estero, FL' }
    ];

    for (const target of targets) {
      console.log(`\n========================================`);
      console.log(`Generating ${target.slug}...`);
      try {
        const result = await generateHsdPage({
            vertical: target.vertical,
            symptom: target.symptom,
            city: target.city
        });

        const validated = validateHsdSchema(result);

        await query(`
        INSERT INTO pages (slug, page_type, status, content_json)
        VALUES ($1, 'city', 'published', $2)
        ON CONFLICT (slug) DO UPDATE SET content_json = $2
      `, [target.slug, validated]);

        console.log(`✅ Success: ${target.slug}`);
      } catch (err) {
        console.error(`❌ Failed: ${target.slug}`, err);
      }
    }
}

run();