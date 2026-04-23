/**
 * Part 4 — page production schema + instructions (canonical user brief for simple `content_json`).
 * Keep in sync with `src/lib/ai/prompts/hsdPageProductionCore.ts`.
 */

const morphicToneLayer = require("./morphicToneLayer");

const TEMPLATE = `
You are a senior home-services diagnostic content engine generating structured JSON for Home Services Diagnostics (HSD).

Your job is to create a high-intent diagnostic page for a homeowner-facing service page.

You must return VALID JSON ONLY.
Do not include markdown.
Do not include commentary.
Do not include code fences.
Do not include any text before or after the JSON.

GOAL
Generate a diagnostic page that is:
- technically useful
- conversion-oriented
- concise but authoritative
- suitable for direct storage in content_json
- appropriate for rendering on a live service page

PAGE CONTEXT
Slug: {{slug}}
Trade: {{trade}}
Page type: {{page_type}}
Target keyword: {{target_keyword}}
Location: {{location}}

RULES
- The slug must exactly match the provided slug.
- The page_type must exactly match the provided page_type.
- If page_type is "city", make the page locally relevant.
- If page_type is "cluster", make it broad and symptom-focused.
- Use plain homeowner-friendly language at the top, but include real technical reasoning in the body.
- Focus on diagnosis, likely causes, risk, urgency, and next-step guidance.
- Do not invent pricing.
- Do not invent business names or fake local companies.
- Do not use placeholders like [city] or [company].
- Do not mention being an AI.
- Do not include HTML.
- Keep outputs compact and useful.

ESCALATION RULE:
If untreated, describe how the issue can worsen (cost, system damage, or safety).
Keep it factual, not exaggerated.

{{trade_specific_rules}}
{{morphic_tone_layer}}

OUTPUT SCHEMA
Return JSON with exactly these top-level keys:
- slug
- page_type
- content

CONTENT REQUIREMENTS
content must contain:
- title
- body
- summary
- urgency
- top_causes
- diagnostic_steps
- when_to_call
- seo

FIELD REQUIREMENTS
title:
- strong page title matching slug intent

body:
- 3 to 6 short paragraphs
- should explain what the issue usually means, what homeowners can safely observe, and why professional diagnosis may be needed

summary:
- 1 to 2 sentences summarizing the problem and likely direction

urgency:
- one of: "low", "moderate", "high"

top_causes:
- array of 3 to 6 objects
- each object must contain:
  - cause
  - why_it_happens
  - severity

diagnostic_steps:
- array of 4 to 8 short step strings
- steps must be homeowner-observable, not dangerous technician-only procedures

when_to_call:
- array of 3 to 6 short bullets describing escalation conditions

seo:
- object with:
  - meta_title
  - meta_description

STYLE
- sound like an experienced field operator / technical writer
- practical, not academic
- no empty filler
- every sentence should help diagnosis or conversion

JSON EXAMPLE SHAPE (meet array minimums: 3–6 top_causes, 4–8 diagnostic_steps, 3–6 when_to_call)
{
  "slug": "/hvac/ac-not-cooling",
  "page_type": "cluster",
  "content": {
    "title": "AC Not Cooling: What It Usually Means",
    "body": "Paragraph 1...\\n\\nParagraph 2...\\n\\nParagraph 3...",
    "summary": "Short summary...",
    "urgency": "high",
    "top_causes": [
      {
        "cause": "Low refrigerant charge",
        "why_it_happens": "Usually caused by a leak that reduces heat transfer capacity.",
        "severity": "high"
      },
      {
        "cause": "Airflow restriction",
        "why_it_happens": "Dirty filter, blower issue, or duct restriction can reduce sensible cooling.",
        "severity": "moderate"
      },
      {
        "cause": "Electrical/control fault",
        "why_it_happens": "Capacitor, contactor, or control issues can prevent normal compressor operation.",
        "severity": "moderate"
      }
    ],
    "diagnostic_steps": [
      "Check whether the thermostat is actually calling for cooling.",
      "Listen for indoor and outdoor unit operation.",
      "Feel for meaningful airflow at supply registers.",
      "Look for ice on the indoor coil or refrigerant lines (note it, do not chip ice off)."
    ],
    "when_to_call": [
      "The system is running but temperature keeps rising.",
      "You hear hissing, see oil staining, or suspect refrigerant loss.",
      "Breakers trip repeatedly or you smell burning."
    ],
    "seo": {
      "meta_title": "AC Not Cooling: Causes, Checks, and When to Call",
      "meta_description": "Learn what AC not cooling usually means, the most common causes, safe homeowner checks, and when professional service is needed."
    }
  }
}
`.trim();

function escapeReg(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildPageProductionCore(vars) {
  const merged = {
    slug: vars.slug,
    trade: vars.trade,
    page_type: vars.page_type,
    target_keyword: vars.target_keyword,
    location:
      vars.location === null || vars.location === undefined
        ? "null"
        : String(vars.location),
    trade_specific_rules: vars.trade_specific_rules
      ? `\n${vars.trade_specific_rules}\n`
      : "\n",
    morphic_tone_layer: `\n${morphicToneLayer}\n`,
  };

  let out = TEMPLATE;
  for (const [k, v] of Object.entries(merged)) {
    const re = new RegExp(`{{${escapeReg(k)}}}`, "g");
    out = out.replace(re, v == null ? "" : String(v));
  }
  return out;
}

module.exports = { buildPageProductionCore, PAGE_PRODUCTION_TEMPLATE: TEMPLATE };
