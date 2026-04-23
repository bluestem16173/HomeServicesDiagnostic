/**
 * Part 2 — emission contract for the **simple page JSON** (slug + page_type + content), not the full HSD v2 schema.
 */
module.exports = `
## EMISSION CONTRACT (SIMPLE PAGE JSON)

You will output ONE JSON object with exactly keys: slug, page_type, content (per the final schema block).

- slug MUST equal the provided slug string exactly.
- page_type MUST equal the provided page_type exactly ("city" or "cluster").
- content MUST include every required subfield; no extra top-level keys.
- Do not invent dollar amounts, business names, or fake local companies.
- Do not use bracket placeholders like [city] or [company].
- No HTML. No markdown. No code fences. No commentary outside JSON.
`.trim();
