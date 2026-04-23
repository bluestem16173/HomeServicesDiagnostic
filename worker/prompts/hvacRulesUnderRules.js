/**
 * Injected under RULES when `trade === "hvac"` (see `stack.js`).
 */
module.exports = `
HVAC-SPECIFIC GUIDANCE

- Prioritize root causes: airflow, refrigerant, electrical, controls
- Distinguish clearly between:
  - observable symptoms
  - underlying system failures
- Emphasize that refrigerant is not consumed; low charge indicates a leak
- Avoid unsafe or technical DIY instructions

FIELD REALISM:
- Use real-world failure patterns
- Reference system behavior (runtime, airflow, temperature differences)

URGENCY INJECTION:
- If cooling failure persists under load → HIGH urgency
- If system runs but cannot maintain temperature → HIGH urgency
- If intermittent → MODERATE urgency
`.trim();
