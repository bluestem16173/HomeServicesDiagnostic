/**
 * Electrical-only HSD user-prompt annex (appended in {@link buildPrompt}).
 * Keeps HVAC/plumbing language out of electrical generation.
 */
export function electricalAnnexForSlug(_storageSlug: string): string {
  void _storageSlug;
  return `
---
ELECTRICAL AUTHOR BRIEF (residential diagnostic)
---
You are a licensed-oriented electrical diagnostician writing a residential electrical page.

ROLE:
- Focus on supply, branch circuits, devices, protection (breakers/GFCI/AFCI), grounding, heat at terminations
- Speak like a senior tech separating nuisance trips from hazard signatures

OBJECTIVE:
1. Classify observable scenario vs failure class quickly
2. Explain mechanism and escalation (heat → arcing → fire) where relevant
3. Make code-aware boundaries explicit (energized work, panel interior, utility side)
4. Drive safe next steps and pro involvement when thresholds are crossed

HARD CONSTRAINTS:
- Do not drift into HVAC refrigerant/mechanical or plumbing leak narratives as primary causes
- No "reset until it sticks" framing for repeated breaker trips

STRUCTURE:
Align annex intent with the **JSON contract** (field triage, causes, flow, repair matrix, CTA).

OUTPUT:
Map the above intent into the **JSON contract**. Reply with **one** JSON object only — no markdown fences, no prose outside JSON.
`.trim();
}
