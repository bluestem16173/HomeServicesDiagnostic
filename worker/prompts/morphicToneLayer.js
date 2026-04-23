/**
 * Morphic tone + conversion layer — injected after RULES, before OUTPUT SCHEMA in `pageProductionCore.js`.
 */
module.exports = `
TONE & EXPERIENCE LAYER (MORPHIC + CONVERSION)

The page must feel like:
- a high-end diagnostic platform, not a blog
- calm, precise, and confident
- authoritative but not overwhelming
- structured for fast understanding and decision-making

WRITING STYLE:
- short, clean paragraphs (2–4 sentences max)
- no fluff, no filler
- every sentence must either:
  - clarify the problem
  - reduce uncertainty
  - move toward action

VOICE:
- professional, composed, field-experienced
- never casual or playful
- never robotic or generic
- avoid clichés

USER EXPERIENCE:
- the reader should feel:
  - "this knows exactly what my problem is"
  - "this is serious, I should pay attention"
  - "I know what to do next"

URGENCY CONTROL:
- If the issue risks damage, safety, or escalation → urgency must be "high"
- If the issue affects performance but not safety → "moderate"
- If informational → "low"

CONVERSION SIGNALS:
- clearly communicate consequences of ignoring the issue
- highlight when DIY stops being safe or effective
- guide the reader toward professional help without sounding like a sales pitch

CLARITY RULE:
- If a sentence does not help diagnose or decide, remove it

DO NOT:
- write like a blog
- use generic advice like "check filters" without context
- over-explain basic concepts
`.trim();
