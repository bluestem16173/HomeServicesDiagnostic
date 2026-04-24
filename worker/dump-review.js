const { Pool } = require('pg');
const fs = require('fs');

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_gjtxze1kum6N@ep-solitary-darkness-anw3z5fo-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
});

async function run() {
  const slugs = [
    '/electrical/breaker-keeps-tripping/fort-myers-fl',
    '/electrical/burning-smell-from-electrical/fort-myers-fl',
    '/electrical/outlet-sparking/fort-myers-fl',
    '/electrical/panel-overheating/fort-myers-fl'
  ];

  let output = '# Smoke Test Review: HIGH $$$ Pages\n\n';

  for (const slug of slugs) {
    const res = await pool.query('SELECT * FROM pages WHERE slug = $1', [slug.replace(/^\//, '')]); // Sometimes slug doesn't have leading slash in DB
    const res2 = await pool.query('SELECT * FROM pages WHERE slug = $1', [slug]);

    const row = res.rows[0] || res2.rows[0];

    if (row && row.content_json) {
      const data = row.content_json;
      output += `## 📄 ${slug}\n\n`;
      output += `**Title:** ${data.title}\n`;
      output += `**City:** ${data.city}\n`;
      output += `**Summary (30s):** ${data.summary_30s?.headline}\n`;
      output += `**Core Truth:** ${data.summary_30s?.core_truth}\n`;
      output += `**City Context:**\n- ${data.cityContext?.join('\n- ')}\n`;
      output += `**What this means:** ${data.what_this_means}\n`;
      output += `**Top Causes:**\n`;
      if(data.summary_30s?.top_causes) {
          data.summary_30s.top_causes.forEach(c => {
             output += `  - ${c.name}: ${c.description} (Severity: ${c.severity})\n`;
          });
      }
      output += `**Repair Matrix (first 2):**\n`;
      if(data.repair_matrix) {
          data.repair_matrix.slice(0,2).forEach(r => {
             output += `  - ${r.repair}: ${r.cost} (${r.time})\n`;
          });
      }
      output += `\n---\n\n`;
    } else {
      output += `## ❌ Missing in DB: ${slug}\n\n`;
    }
  }

  fs.writeFileSync('smoke_test_review.md', output);
  console.log('Wrote to smoke_test_review.md');
  pool.end();
}

run();
