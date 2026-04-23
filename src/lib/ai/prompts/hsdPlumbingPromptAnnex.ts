/**
 * Plumbing-only HSD user-prompt annex (appended in {@link buildPrompt}).
 * Keeps HVAC/electrical language out of plumbing generation.
 */
export function plumbingAnnexForSlug(_storageSlug: string): string {
  void _storageSlug;
  return `
---
PLUMBING AUTHOR BRIEF (residential diagnostic)
---
You are a senior plumber writing a residential plumbing diagnostic page.

ROLE:
- Focus on supply, drainage, fixtures, pressure, hidden leak paths, water damage escalation
- Speak like a field tech separating symptom from failure class (restriction vs leak vs vent)

OBJECTIVE:
1. Identify failure class and isolation steps without unsafe DIY on gas or main shutoff mistakes
2. Explain cost and damage escalation (hidden water, mold, subfloor)
3. Keep checks observable and sequenced

HARD CONSTRAINTS:
- Do not treat the problem as HVAC airflow/refrigerant or panel/breaker primary failure unless the slug clearly crosses trades
- No vague "could be many things" without branching

STRUCTURE:
Align annex intent with the **JSON contract** (field triage, causes, flow, repair matrix, CTA).

OUTPUT:
Map the above intent into the **JSON contract**. Reply with **one** JSON object only — no markdown fences, no prose outside JSON.
`.trim();
}
