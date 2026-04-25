import { query } from '../lib/db';
import { generateHsdPage, validateHsdSchema } from '../src/lib/ai/prompts/generateHsdPage';

const pagesToGenerate = [
  // HVAC - 10 Pages
  { slug: '/hvac/ac-not-cooling/fort-myers-fl', vertical: 'hvac', symptom: 'ac not cooling', city: 'Fort Myers, FL' },
  { slug: '/hvac/ac-blowing-warm-air/naples-fl', vertical: 'hvac', symptom: 'ac blowing warm air', city: 'Naples, FL' },
  { slug: '/hvac/ac-freezing-up/cape-coral-fl', vertical: 'hvac', symptom: 'ac freezing up', city: 'Cape Coral, FL' },
  { slug: '/hvac/ac-making-loud-noise/bonita-springs-fl', vertical: 'hvac', symptom: 'ac making loud noise', city: 'Bonita Springs, FL' },
  { slug: '/hvac/ac-wont-turn-on/lehigh-acres-fl', vertical: 'hvac', symptom: 'ac wont turn on', city: 'Lehigh Acres, FL' },
  { slug: '/hvac/ac-short-cycling/punta-gorda-fl', vertical: 'hvac', symptom: 'ac short cycling', city: 'Punta Gorda, FL' },
  { slug: '/hvac/ac-leaking-water/fort-myers-beach-fl', vertical: 'hvac', symptom: 'ac leaking water', city: 'Fort Myers Beach, FL' },
  { slug: '/hvac/ac-smells-bad/estero-fl', vertical: 'hvac', symptom: 'ac smells bad', city: 'Estero, FL' },
  { slug: '/hvac/thermostat-blank/sanibel-fl', vertical: 'hvac', symptom: 'thermostat blank', city: 'Sanibel, FL' },
  { slug: '/hvac/high-electric-bill/port-charlotte-fl', vertical: 'hvac', symptom: 'high electric bill', city: 'Port Charlotte, FL' },

  // Plumbing - 10 Pages
  { slug: '/plumbing/water-heater-leaking/fort-myers-fl', vertical: 'plumbing', symptom: 'water heater leaking', city: 'Fort Myers, FL' },
  { slug: '/plumbing/no-hot-water/naples-fl', vertical: 'plumbing', symptom: 'no hot water', city: 'Naples, FL' },
  { slug: '/plumbing/toilet-wont-flush/cape-coral-fl', vertical: 'plumbing', symptom: 'toilet wont flush', city: 'Cape Coral, FL' },
  { slug: '/plumbing/clogged-drain/bonita-springs-fl', vertical: 'plumbing', symptom: 'clogged drain', city: 'Bonita Springs, FL' },
  { slug: '/plumbing/low-water-pressure/lehigh-acres-fl', vertical: 'plumbing', symptom: 'low water pressure', city: 'Lehigh Acres, FL' },
  { slug: '/plumbing/garbage-disposal-jammed/punta-gorda-fl', vertical: 'plumbing', symptom: 'garbage disposal jammed', city: 'Punta Gorda, FL' },
  { slug: '/plumbing/pipe-burst/fort-myers-beach-fl', vertical: 'plumbing', symptom: 'pipe burst', city: 'Fort Myers Beach, FL' },
  { slug: '/plumbing/running-toilet/estero-fl', vertical: 'plumbing', symptom: 'running toilet', city: 'Estero, FL' },
  { slug: '/plumbing/sewer-backup/sanibel-fl', vertical: 'plumbing', symptom: 'sewer backup', city: 'Sanibel, FL' },
  { slug: '/plumbing/water-softener-issues/port-charlotte-fl', vertical: 'plumbing', symptom: 'water softener issues', city: 'Port Charlotte, FL' },

  // Electrical - 10 Pages
  { slug: '/electrical/breaker-keeps-tripping/fort-myers-fl', vertical: 'electrical', symptom: 'breaker keeps tripping', city: 'Fort Myers, FL' },
  { slug: '/electrical/outlets-not-working/naples-fl', vertical: 'electrical', symptom: 'outlets not working', city: 'Naples, FL' },
  { slug: '/electrical/lights-flickering/cape-coral-fl', vertical: 'electrical', symptom: 'lights flickering', city: 'Cape Coral, FL' },
  { slug: '/electrical/main-panel-buzzing/bonita-springs-fl', vertical: 'electrical', symptom: 'main panel buzzing', city: 'Bonita Springs, FL' },
  { slug: '/electrical/power-outage-one-room/lehigh-acres-fl', vertical: 'electrical', symptom: 'power outage one room', city: 'Lehigh Acres, FL' },
  { slug: '/electrical/gfci-wont-reset/punta-gorda-fl', vertical: 'electrical', symptom: 'gfci wont reset', city: 'Punta Gorda, FL' },
  { slug: '/electrical/smell-burning-plastic/fort-myers-beach-fl', vertical: 'electrical', symptom: 'smell burning plastic', city: 'Fort Myers Beach, FL' },
  { slug: '/electrical/sparks-from-outlet/estero-fl', vertical: 'electrical', symptom: 'sparks from outlet', city: 'Estero, FL' },
  { slug: '/electrical/generator-wont-start/sanibel-fl', vertical: 'electrical', symptom: 'generator wont start', city: 'Sanibel, FL' },
  { slug: '/electrical/ceiling-fan-wobbly/port-charlotte-fl', vertical: 'electrical', symptom: 'ceiling fan wobbly', city: 'Port Charlotte, FL' }
];

async function run() {
  console.log(`Starting bulk generation of ${pagesToGenerate.length} SEO pages...`);
  
  for (const page of pagesToGenerate) {
    try {
      console.log(`\nProcessing: ${page.slug}`);
      const result = await generateHsdPage({
          vertical: page.vertical,
          symptom: page.symptom,
          city: page.city
      });

      const validated = validateHsdSchema(result);

      await query(`
        INSERT INTO pages (slug, page_type, status, content_json)
        VALUES ($1, 'city', 'published', $2)
        ON CONFLICT (slug) DO UPDATE SET content_json = $2, status = 'published'
      `, [page.slug, validated]);

      console.log(`✅ Successfully saved: ${page.slug}`);
      
      // Delay to avoid hitting OpenAI rate limits
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      console.error(`❌ Failed to process ${page.slug}:`, error);
    }
  }

  console.log("\nBulk page generation complete!");
}

run();
