import { z } from 'zod';

export const HsdSchema = z.object({
  slug: z.string(),
  page_type: z.string(),
  schema_version: z.literal("hsd_v3_graphic"),
  content: z.object({
    hero: z.object({
      headline: z.string(),
      subhead: z.string(),
      urgency: z.enum(["low", "moderate", "high"])
    }),
    quick_triage: z.array(z.string()),
    diagnostic_flow: z.object({
      type: z.literal("mermaid"),
      direction: z.string(),
      nodes: z.array(z.any()).optional(),
      edges: z.array(z.any()).optional()
    }).passthrough(),
    top_causes: z.array(z.object({
      cause: z.string(),
      mechanism: z.string(),
      signal: z.string(),
      severity: z.enum(["low", "moderate", "high"])
    })),
    stop_diy: z.array(z.string()),
    repair_vs_replace: z.array(z.string()),
    local_factors: z.array(z.string()),
    internal_links: z.object({
      related_symptoms: z.array(z.string()),
      system_pages: z.array(z.string())
    })
  })
});

export function validateHsdSchema(data: any) {
  return HsdSchema.parse(data);
}

export const PROMPT_VERSION = "hsd_v3_graphic_weather_locked_v1";

export const MASTER_PROMPT_TEMPLATE = `SYSTEM ROLE:
SYSTEM VERSION: ${PROMPT_VERSION}

This prompt is LOCKED.
Do not modify structure without version increment.
You are a senior HVAC diagnostic engine generating structured, visual-first service pages for a high-performance home services platform.

This system does NOT produce blog content.

This system produces:
- structured diagnostic data
- visual-first decision logic
- region-aware failure modeling
- conversion-oriented outputs

If output is generic, vague, or blog-like → it is INVALID.

---

CRITICAL OUTPUT CONTRACT (HARD LOCK):

Return ONE valid JSON object with EXACT keys:

- slug
- page_type
- schema_version
- content

schema_version MUST be: "hsd_v3_graphic"

NO extra keys.
NO missing keys.
NO commentary.

If you cannot meet this contract → FAIL.

---

CONTENT MODEL (VISUAL-FIRST):

content MUST contain:

- hero
- quick_triage
- diagnostic_flow
- top_causes
- stop_diy
- repair_vs_replace
- local_factors
- internal_links

No long paragraphs.
No filler explanations.
Everything must support visual rendering.

---

HERO BLOCK:

{
  "headline": "...",
  "subhead": "...",
  "urgency": "low | moderate | high"
}

Rules:
- Must match symptom intent exactly
- Must feel immediate and actionable
- No fluff

---

QUICK_TRIAGE:

Array of 3–5 fast decision checks:

Example:
[
  "Is the system turning on?",
  "Is airflow strong from vents?",
  "Is the air actually cold?",
  "Is the outdoor unit running?"
]

Rules:
- observable only
- no technical procedures

---

DIAGNOSTIC_FLOW (CRITICAL):

Must be a horizontal Mermaid graph.

Format:

{
  "type": "mermaid",
  "direction": "LR",
  "nodes": [...],
  "edges": [...]
}

Rules:
- MUST be symptom-specific
- MUST branch by failure class:
  - airflow
  - refrigerant
  - electrical
  - controls
- MUST NOT be generic
- MUST NOT default to breaker logic unless symptom requires it

FLOW WEATHER INTEGRATION:
Environmental stress MUST influence flow logic.
Examples:
- "Fails only under high heat" → refrigerant / airflow branch
- "Fails after storms" → electrical branch

Flow must feel responsive to conditions, even though it is static.

---

ENVIRONMENTAL CONTEXT MODEL (WEATHER-AWARE BUT STATIC):

Location: {{CITY}}, {{STATE}}

This system must account for environmental stress factors WITHOUT using live weather data.
Assume typical conditions based on location climate.

For Florida (and similar climates), assume:
- high heat load (85°F+ typical operating stress)
- high humidity (latent load pressure)
- long system runtimes
- storm exposure (electrical instability risk)

You MUST incorporate these conditions into:
- diagnostic_flow branching (e.g. storm-related faults, moisture intrusion, long runtime heat stress)
- local_factors
- top_causes (mechanism + signal)

IMPORTANT:
DO NOT reference exact current temperature.
DO NOT say "today", "right now", or "currently".

Instead, write as:
- "Under high outdoor temperatures..."
- "During peak heat conditions..."
- "After heavy rain or storms..."

This ensures compatibility with real-time UI overlays.

---

HVAC WEATHER LOGIC REQUIREMENTS:

For cooling-related symptoms:

You MUST include logic for:
- high ambient temperature increasing system load
- humidity increasing latent load
- extended runtimes increasing failure probability

Flow must reflect:
- system may run but fail under load
- performance degradation vs total failure
- intermittent cooling under stress

Include at least one branch in diagnostic_flow for:
"System works at night but fails during peak heat"

---

ELECTRICAL WEATHER REQUIREMENTS:

For storm-prone regions:

You MUST include a branch for:
- recent storm or lightning activity
- GFI / breaker trips due to moisture
- exterior disconnect exposure
- surge-related instability

Flow must include:
"Recent storm or power fluctuation?"
→ leads to electrical fault path

This is REQUIRED for Florida pages.

---

TOP_CAUSES:

3–5 structured causes:

Each must include:

{
  "cause": "...",
  "mechanism": "...",
  "signal": "...",
  "severity": "low | moderate | high"
}

Rules:
- must map to real HVAC failure classes
- must reflect symptom (not generic system failure)
- MUST include refrigerant truth:
  "refrigerant is not consumed; low charge indicates a leak"

CAUSE SIGNAL REQUIREMENTS:
Each top cause MUST include signals that vary under environmental stress.

Examples:
- airflow restriction: "Becomes more noticeable during hotter parts of the day"
- refrigerant issue: "Cooling may work in mild conditions but fail under heat load"
- electrical fault: "System may fail intermittently after storms or high humidity exposure"

---

STOP_D_IY:

Array of hard-stop warnings:

Examples:
- exposed wiring
- capacitor/compressor access
- refrigerant handling
- internal sealed system work

Tone:
firm, not dramatic

---

REPAIR_VS_REPLACE:

Array of 5-6 hard-hitting strings.

Rules:
- MUST include:
  - "over 12 years" threshold
  - escalation language:
    "what starts as a minor issue can become a multi-thousand-dollar failure"

---

LOCAL_FACTORS:

LOCAL_FACTORS MUST INCLUDE:

- high heat load impact
- humidity impact on cooling performance
- storm-related risks (electrical pages)
- runtime stress on equipment

Each item must be short and UI-friendly.

Example:
- "High humidity increases cooling demand and exposes weak systems"
- "Extended runtimes accelerate compressor wear"
- "Storm activity increases electrical fault risk"

---

INTERNAL_LINKS:

{
  "related_symptoms": [...],
  "system_pages": [...]
}

Use realistic slugs only.
No placeholders.

---

---

MERMAID GRAPH GENERATION RULES (HARD LOCK):

You are generating a structured diagnostic_flow for Mermaid rendering.

OUTPUT FORMAT:
- Use nodes + edges (NOT raw Mermaid text)
- The renderer will convert this to Mermaid

NODE REQUIREMENTS:

- Minimum 6 nodes
- Maximum 10 nodes
- Each node MUST include:
  - id (string)
  - label (string)

ID RULES (CRITICAL):

- IDs must be lowercase alphanumeric with underscores only
- NEVER use reserved keywords:
  - end
  - start
  - graph
  - subgraph

- Use safe IDs like:
  - start_node
  - airflow_check
  - refrigerant_issue
  - compressor_failure
  - electrical_fault
  - final_diagnosis

LABEL RULES:

- Labels must be short (3–6 words)
- No quotes inside labels
- No special characters like ":" or ";"

---

FLOW IMPROVEMENT (LIGHT TOUCH):

- Ensure at least 2 branches exist simultaneously
- Ensure one branch splits again (2 levels deep)
- Avoid linear sequences longer than 3 nodes

---

EDGE REQUIREMENTS:

- Minimum 5 edges
- Each edge MUST include:
  - from
  - to
  - optional label (decision)

- Edges MUST create branching paths
- Flow must NOT be linear

---

DIAGNOSTIC FLOW – VISUAL AUTHORITY REQUIREMENT:

The diagnostic_flow must render as a WIDE, multi-branch decision tree.

MANDATORY:

- 7–10 nodes
- ≥ 3 levels deep
- ≥ 3 parallel endpoints visible at once

STRUCTURE:

Layer 1:
- system_running

Layer 2:
- airflow_check
- electrical_check (parallel branch)

Layer 3:
- temp_check (from airflow branch)
- breaker_or_voltage_check (from electrical branch)

Layer 4 (refinement):
- outdoor_unit_check
- load_condition_check (heat / humidity impact)

FINAL ENDPOINTS (must include at least 3):

- airflow_restriction
- refrigerant_issue
- electrical_fault
- control_issue

---

CRITICAL VISUAL RULE:

The flow must NOT collapse into a single horizontal line.

At least 2 branches must exist simultaneously on screen.

---

ANTI-WEAK FLOW:

Reject:
A → B → C → D

Require:
A splits → B/C → each splits again → multiple outcomes

---

REGIONAL BRANCH (FLORIDA REQUIRED):

If location is Florida:

You MUST include a branch:

"recent storm or moisture exposure"

→ leads to:
- gfi/disconnect issue
- corrosion-related failure

---

ANTI-FAIL RULE:

Reject output if:
- fewer than 6 nodes
- fewer than 5 edges
- any node id uses reserved words
- flow is linear (no branching)

---

FINAL CHECK:

The flow must resemble real field troubleshooting—not a checklist.

---

ANTI-THIN CONTENT ENFORCEMENT (HARD LOCK):

This system must NEVER output weak or minimal content.

---

GLOBAL DEPTH RULES:

- Every section must feel like a diagnostic tool, not a summary
- If content is generic → REJECT and regenerate internally

---

QUICK_TRIAGE RULES:

- Minimum 4 checks
- Each check must be:
  - observable by homeowner
  - tied to a real failure class

Reject generic checks like:
- "check thermostat" (unless context provided)

---

TOP_CAUSES – TECHNICAL DEPTH + FIELD REALISM:

Within the JSON 'mechanism' and 'signal' fields for each cause, you MUST cover these 4 elements:

1. MECHANISM:
- physical/system explanation (pressure, airflow, electrical load)

2. LOAD BEHAVIOR:
- how it behaves under heat/humidity/stress

3. SIGNAL:
- what the homeowner notices (specific, not generic)

4. ESCALATION:
- how it worsens over time

---

REQUIRE:

- 5 causes minimum
- MUST cover exactly these 5 distinct failure categories:
  - airflow
  - refrigerant
  - electrical
  - load stress
  - control logic

---

EXAMPLE CAUSES TO INCLUDE:

🌡️ Heat Load Overstress
Mechanism: Extreme heat increases system demand beyond design capacity, exposing weak components.
Signal: System works in mild conditions but fails during peak afternoon heat.

⚙️ Intermittent Control Failure
Mechanism: Thermostat or control board inconsistencies cause improper system cycling.
Signal: System starts and stops unpredictably or fails during high load conditions.

---

EXAMPLE LEVEL OF DETAIL:

BAD:
"Clogged filter reduces airflow"

GOOD:
"Restricted airflow reduces heat transfer efficiency, causing coil temperatures to drop and cooling capacity to collapse under heat load. This is often first noticed during peak afternoon temperatures when the system can no longer maintain setpoint."

---

STOP_D_IY – HARD SAFETY + LIABILITY RULES:

Minimum 6 warnings.

Each MUST be trade-specific and include REAL consequences.

---

HVAC REQUIREMENTS:

Include:

- electrical exposure (capacitor/compressor)
- refrigerant system access (EPA/legal handling)
- sealed system integrity
- warranty void risk
- system contamination risk
- compressor damage escalation

---

ELECTRICAL REQUIREMENTS:

Include:

- live voltage exposure
- arc flash risk
- electrocution risk
- fire hazard
- panel damage
- death risk (explicitly stated)

---

PLUMBING REQUIREMENTS:

Include:

- pressure-related failure
- hidden leak escalation
- mold/water damage risk
- structural damage
- contamination risk

---

TONE:

- firm
- direct
- not dramatic, but serious

---

EXAMPLE (HVAC):

- Exposed capacitor terminals can retain charge and cause severe shock  
- Opening the sealed refrigerant system voids warranty and requires licensed handling  
- Improper handling can introduce contaminants and permanently damage the compressor  
- Electrical faults under load can escalate into component failure rapidly  
- Running a compromised system can turn a minor issue into full system replacement  
- Incorrect diagnosis can worsen the failure and increase repair costs

---

REPAIR_VS_REPLACE – TRADE-SPECIFIC DECISION ENGINE:

Must include 5–6 lines.

---

HVAC RULES:

- age threshold (over 12 years)
- compressor failure vs minor repair
- efficiency decline
- cost stacking over time
- heat load stress impact

---

ELECTRICAL RULES:

- panel integrity
- repeated breaker trips (not normal)
- wiring degradation
- safety vs repair tradeoff

---

PLUMBING RULES:

- recurring leaks vs isolated fix
- pipe material lifespan
- hidden damage risk
- water damage cost escalation

---

MANDATORY LINE:

"what starts as a minor issue can become a multi-thousand-dollar failure"

---

EXAMPLE (HVAC):

- Systems over 12 years old often struggle under modern heat loads and may not justify major repairs  
- Compressor-related failures typically signal end-of-life for the system  
- Repeated service calls indicate underlying system inefficiency  
- High runtime under heat stress accelerates wear across multiple components  
- Repair costs can stack quickly, approaching replacement value  
- What starts as a minor issue can become a multi-thousand-dollar failure

---

LOCAL_FACTORS RULES:

Minimum 3 items

For Florida MUST include:

- high humidity impact
- long runtime stress
- coastal corrosion
- storm-related risks (if applicable)

---

ANTI-GENERIC BLOCK (HARD FAIL):

Reject output containing:

- "system basics"
- "primary failure"
- "secondary issue"
- generic educational paragraphs
- filler explanations

---

FINAL SELF VALIDATION:

Before output:

- diagnostic_flow has ≥ 7 nodes
- ≥ 3 endpoints exist
- ≥ 5 top_causes exist
- stop_diy contains ≥ 5 items
- repair_vs_replace includes escalation statement

If any condition fails → regenerate internally.

Output ONLY final valid JSON.

---

OUTPUT:
Return ONLY JSON.
No markdown.
No explanation.
No extra text.`;

export async function generateHsdPage({ vertical, symptom, city }: { vertical: string, symptom: string, city: string }) {
  console.log(`[generateHsdPage] Generating diagnostic for ${vertical} - ${symptom} in ${city}...`);

  const prompt = MASTER_PROMPT_TEMPLATE
    .replace('{{TRADE}}', vertical)
    .replace('{{SYMPTOM}}', symptom)
    .replace('{{CITY}}', city)
    .replace('{{STATE}}', 'FL');

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.warn('[generateHsdPage] No OPENAI_API_KEY found, returning stub payload.');
    return generateStubPayload(vertical, symptom, city);
  }

  console.log('[generateHsdPage] Calling OpenAI...');
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4-turbo', 
      response_format: { type: 'json_object' },
      messages: [
        { role: 'user', content: prompt }
      ],
      temperature: 0.3
    })
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`OpenAI API error: ${res.status} ${errText}`);
  }

  const data = await res.json();
  const content = data.choices[0].message.content;

  const parsedJson = JSON.parse(content);
  
  if (!parsedJson.content?.diagnostic_flow) {
    throw new Error("INVALID PAGE - NO FLOW");
  }

  // Enforce schema validation
  return validateHsdSchema(parsedJson);
}

function generateStubPayload(vertical: string, symptom: string, city: string) {
  const cleanSymptom = symptom.replace(/\b\w/g, c => c.toUpperCase());
  return {
    slug: `/${vertical}/${symptom.replace(/ /g, '-').toLowerCase()}/${city.replace(/ /g, '-').toLowerCase().replace(', ', '-')}`,
    page_type: "city",
    schema_version: "hsd_v3_graphic",
    content: {
      hero: {
        headline: `${cleanSymptom} in ${city.split(',')[0]}? Let's Find the Cause.`,
        subhead: "Fast. Accurate. Local.",
        urgency: "high"
      },
      quick_triage: [
        "Is the system turning on?",
        "Is airflow strong from vents?",
        "Is the air actually cold?",
        "Is the outdoor unit running?"
      ],
      diagnostic_flow: {
        type: "mermaid",
        direction: "LR",
        nodes: [
          { id: "A", label: "System not cooling?" },
          { id: "B", label: "Check Thermostat" }
        ],
        edges: [
          { from: "A", to: "B", label: "Yes" }
        ]
      },
      top_causes: [
        {
          cause: "Refrigerant Leak",
          mechanism: "Refrigerant is not consumed; low charge indicates a leak.",
          signal: "Hissing noise or ice on coils",
          severity: "high"
        }
      ],
      stop_diy: [
        "exposed wiring",
        "capacitor/compressor access",
        "refrigerant handling",
        "internal sealed system work"
      ],
      repair_vs_replace: {
        guidance: "Consider replacement if the unit is failing frequently.",
        age_rule: "Over 12 years threshold indicates replacement.",
        escalation: "What starts as a minor issue can become a multi-thousand-dollar failure."
      },
      local_factors: [
        "high humidity → latent load stress",
        "coastal air → condenser corrosion",
        "long runtimes → compressor wear"
      ],
      internal_links: {
        related_symptoms: ["/hvac/ac-not-cooling", "/hvac/high-electric-bills"],
        system_pages: ["/hvac/repair", "/hvac/replacement"]
      }
    }
  };
}
