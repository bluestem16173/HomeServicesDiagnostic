// scripts/generatePage.ts

import { query } from '../lib/db';
import { generateHsdPage, validateHsdSchema } from '../src/lib/ai/prompts/generateHsdPage';

async function run() {
    const slug = '/electrical/breaker-keeps-tripping/fort-myers-fl';

    const result = await generateHsdPage({
        vertical: 'electrical',
        symptom: 'breaker keeps tripping',
        city: 'Fort Myers, FL'
    });

    const validated = validateHsdSchema(result);

    await query(`
    INSERT INTO pages (slug, page_type, status, content_json)
    VALUES ('${slug}', 'city', 'published', $1)
    ON CONFLICT (slug) DO UPDATE SET content_json = $1
  `, [validated]);

    console.log("Page generation and database insertion complete!");
}

run();