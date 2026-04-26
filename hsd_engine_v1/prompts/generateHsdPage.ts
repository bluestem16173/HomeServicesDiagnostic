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
      mechanism: z.array(z.string()),
      signal: z.array(z.string()),
      escalation: z.array(z.string()),
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
You are a senior {{TRADE}} diagnostic engine generating structured, visual-first service pages for a high-performance home services platform.

TRADE CONTEXT (HARD LOCK):

Trade: {{TRADE}}

You MUST ONLY generate content relevant to this trade.

---

If Trade = HVAC:
- Use airflow, refrigerant, compressor, coils, thermostat

If Trade = Plumbing:
- Use pressure, flow, drainage, fixtures, valves, leaks, supply lines

If Trade = Electrical:
- Use voltage, circuits, breakers, wiring, load, panels, GFI

---

STRICT RULE:

DO NOT mix trades.

Reject any output that includes systems outside the current trade.

Examples:

- Plumbing page MUST NOT mention refrigerant or airflow
- Electrical page MUST NOT mention coils or compressors
- HVAC page MUST NOT mention pipes or water leaks as primary failures

---

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

You MUST build a realistic, visual diagnostic flowchart.
IMPORTANT VISUAL RULE: You MUST explicitly include the exact symptom (e.g. "{{SYMPTOM}}") in the label of the very first node. Our UI searches for this exact string and highlights it in red. If you do not include it word-for-word, the visual highlight will fail!

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
  - primary flow/transfer (airflow, pressure)
  - component integrity (refrigerant, leaks)
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

HVAC DIAGNOSTIC FLOW RULES:

If Trade = HVAC:

Branches MUST form a true decision tree (not a straight line) and MUST include:
- Airflow check (Yes/No)
- Compressor / Outdoor unit check (Yes/No)
- Peak heat stress check (Yes/No)

Example HVAC structure:

{{SYMPTOM}} Start
→ Next → Thermostat / Power issue
→ Next → Airflow Strong?

Airflow Strong?
→ No → Filter / Blower issue
→ Yes → Cools During Peak Heat?

Cools During Peak Heat?
→ No → Refrigerant / Compressor Stress
→ Yes → Thermostat / Sensor issue

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

PLUMBING DIAGNOSTIC FLOW RULES:

If Trade = Plumbing:

Flow must include:

- water flow check
- pressure check
- leak detection
- drainage behavior
- fixture vs system-level failure

Branches MUST form a true decision tree (not a straight line) and MUST include:

- pressure issue
- blockage / clog
- leak or pipe failure
- fixture malfunction

---

Example Plumbing structure:

{{SYMPTOM}} Start
→ Next → supply issue
→ Next → pressure check

Pressure Normal?
→ No → pressure regulator / supply issue
→ Yes → drainage check

Drainage Slow?
→ Yes → clog / blockage
→ No → fixture failure

---

ELECTRICAL DIAGNOSTIC FLOW RULES:

If Trade = Electrical:

Flow must include:

- power presence check
- breaker/panel behavior
- circuit load evaluation
- outlet/device response

Branches MUST form a true decision tree (not a straight line) and MUST include:

- breaker trip / overload
- wiring fault
- GFI / safety trip
- component failure

---

Example Electrical structure:

{{SYMPTOM}} Start
→ Next → supply / panel issue
→ Next → breaker check

Breaker Tripping?
→ Yes → overload or short
→ No → outlet/device check

Outlet Working?
→ No → wiring fault
→ Yes → intermittent control issue

---

TOP_CAUSES – EXACT COUNT REQUIREMENT (HARD LOCK):

You MUST output EXACTLY 4 top causes.

NOT 3  
NOT 5  
NOT a range  

Exactly 4.

Each cause MUST contain MULTI-LINE structured detail (as an array of strings).

{
  "cause": "...",
  "mechanism": ["...", "..."],
  "signal": ["...", "..."],
  "escalation": ["...", "..."],
  "severity": "low | moderate | high"
}

MECHANISM REQUIREMENTS (Load + Progression):
Must explain:
- what physically fails
- why it happens during usage patterns
- what conditions make it worse

SIGNAL REQUIREMENTS (Situational Context):
Must describe:
- what the homeowner actually notices
- when, under what condition, and what changed
- how it progresses

SIGNAL ENRICHMENT RULE:

Each signal must include:
- WHEN the issue occurs (under load, after storms, during use)
- WHAT triggers it (appliance use, weather, time of day)

Reject signals that are generic descriptions only.

ESCALATION REQUIREMENTS (Timeline + Consequence Clarity):
Must explain:
- what happens if ignored
- how it gets there
- how cost or damage increases and how quickly it worsens

FORMAT RULE:
Each field (mechanism, signal, escalation) must contain multiple short lines (array of strings), not one sentence.

Rules:
- must reflect symptom (not generic system failure)
- MUST include trade-specific physical truths (e.g., refrigerant is not consumed; low charge indicates a leak)

CAUSE COVERAGE RULE:

The 4 causes MUST cover distinct failure classes.

For HVAC:
1. Airflow Restriction
2. Refrigerant Issue
3. Electrical / Control Failure
4. Load / System Stress (heat, runtime, environment)

For Plumbing:
1. Leak / Pipe Failure
2. Clog / Blockage
3. Pressure Imbalance
4. Fixture / Valve Failure

For Electrical:
1. Breaker / Overload
2. Wiring Fault
3. Component Failure
4. Environmental / Surge Issue

---

DISTINCTNESS RULE:

Each cause must represent a DIFFERENT failure category.

Reject outputs where:
- causes overlap
- causes describe the same issue differently

Example of invalid:
- "Low Refrigerant"
- "Refrigerant Leak"
- "Refrigerant Problem"

Example of valid:
- Airflow Restriction
- Refrigerant Issue
- Electrical Failure
- Heat Load Stress

---

REJECTION RULE:

If output contains:
- fewer than 4 causes → FAIL
- more than 4 causes → FAIL

Regenerate until exactly 4 are present.

---

Reject causes that do not belong to the active trade.

TRADE-SPECIFIC DETAIL REQUIREMENT:

PLUMBING causes MUST include:
- pressure behavior (drops, fluctuations)
- flow behavior (slow, blocked, inconsistent)
- leak progression or blockage buildup

HVAC causes MUST include:
- system performance under heat load
- airflow or heat transfer impact
- runtime behavior

ELECTRICAL causes MUST include:
- circuit behavior under load
- breaker or voltage response
- intermittent vs full failure patterns

---

Reject causes that do not include system behavior under real-world conditions.

---

STOP_D_IY:

Array of hard-stop warnings:

STOP_D_IY MUST BE TRADE-SPECIFIC:

HVAC:
- refrigerant handling
- compressor access
- electrical shock risk

Plumbing:
- pressure release risk
- hidden leak damage
- structural water damage

Electrical:
- electrocution risk
- arc flash
- fire hazard

---

Reject generic safety lists.

Tone:
firm, not dramatic

---

REPAIR_VS_REPLACE:

Array of 5-6 hard-hitting strings.

REPAIR_VS_REPLACE MUST MATCH TRADE:

HVAC:
- age (12+ years)
- compressor failure
- efficiency decline

Plumbing:
- recurring leaks
- pipe material lifespan
- hidden damage risk

Electrical:
- panel age
- repeated breaker trips
- wiring degradation

---

Reject generic repair advice.

Rules:
- MUST include escalation language:
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
  - primary_system_check
  - pressure_or_flow_issue
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
- system_running / primary_failure_check

Layer 2:
- primary_system_check (e.g., airflow for HVAC, pressure for Plumbing)
- electrical_or_supply_check (parallel branch)

Layer 3:
- performance_check
- safety_or_load_check

Layer 4 (refinement):
- external_factor_check
- environmental_impact_check

FINAL ENDPOINTS (must include at least 3 relevant to the trade):

- primary_component_failure (e.g., refrigerant_issue, burst_pipe)
- secondary_component_failure (e.g., airflow_restriction, clogged_drain)
- electrical_fault / power_loss
- control_issue / fixture_failure

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

- EXACTLY 4 causes
- MUST cover distinct failure categories based on the trade rules above.

---

EXAMPLE OF GOOD MULTI-LINE DETAIL (ELECTRICAL):

[
  {
    "cause": "Breaker Overload",
    "signal": [
      "Breaker trips repeatedly when high-load appliances (AC, microwave, dryer) are used together",
      "Power loss occurs in specific areas during peak usage times rather than randomly"
    ],
    "severity": "high",
    "mechanism": [
      "Excessive current draw exceeds circuit capacity, triggering breaker protection to prevent overheating",
      "More common in older electrical systems or when modern appliances exceed original load design"
    ],
    "escalation": [
      "Repeated overload cycles weaken breaker reliability and wiring integrity",
      "What starts as nuisance tripping can escalate into overheating wires and fire risk"
    ]
  },
  {
    "cause": "Wiring Fault",
    "signal": [
      "Buzzing sounds, burning odors, or visible sparking near outlets or panels",
      "Lights flicker or power cuts in and out without a consistent trigger"
    ],
    "severity": "high",
    "mechanism": [
      "Damaged, loose, or degraded wiring disrupts stable current flow and creates resistance heat",
      "Insulation breakdown, corrosion, or physical damage exposes conductors and increases failure risk"
    ],
    "escalation": [
      "Heat buildup from resistance can ignite surrounding materials, leading to electrical fires",
      "Exposure to live wiring significantly increases electrocution risk"
    ]
  },
  {
    "cause": "Component Failure",
    "signal": [
      "Specific outlets, switches, or fixtures stop working while others remain functional",
      "Devices lose power intermittently or fail to operate consistently"
    ],
    "severity": "moderate",
    "mechanism": [
      "Internal failure of switches, outlets, or connections interrupts proper current distribution",
      "Wear over time or poor installation can lead to loose contacts and inconsistent performance"
    ],
    "escalation": [
      "Failing components can create localized overheating and damage connected devices",
      "Left unresolved, the issue can spread to adjacent wiring or circuits"
    ]
  },
  {
    "cause": "Environmental or Surge Damage",
    "signal": [
      "Electrical issues begin immediately after storms, lightning, or power outages",
      "Breakers trip or devices malfunction without a clear internal cause"
    ],
    "severity": "moderate",
    "mechanism": [
      "Voltage spikes from lightning or grid instability overwhelm circuit protection systems",
      "Moisture intrusion or humidity exposure can degrade outdoor electrical components"
    ],
    "escalation": [
      "Repeated surge exposure degrades wiring and sensitive components over time",
      "Increases likelihood of major system failure or hidden electrical faults developing"
    ]
  }
]

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
- exactly 4 top_causes exist
- stop_diy contains ≥ 5 items
- repair_vs_replace includes escalation statement

TOP_CAUSES VALIDATION:

Before output:

- Does each cause have ≥ 2 lines of mechanism?
- Does each cause have ≥ 2 lines of signal?
- Does each cause include escalation?

If not → regenerate internally

FINAL TRADE VALIDATION:

Before output:

- Does every section reflect the correct trade?
- Are any foreign system terms present?

If YES → FAIL and regenerate

---

Examples of failure:

Plumbing page mentioning:
- refrigerant
- airflow

Electrical page mentioning:
- compressor
- coils

---

Output must be PURE to the trade.

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
    .replaceAll('{{TRADE}}', vertical)
    .replaceAll('{{SYMPTOM}}', symptom)
    .replaceAll('{{CITY}}', city)
    .replaceAll('{{STATE}}', 'FL');

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
          mechanism: [
            "Refrigerant is not consumed; low charge indicates a leak in the closed system.",
            "Compressor runs longer to compensate for poor heat transfer.",
            "High heat load accelerates the system failure rate."
          ],
          signal: [
            "Hissing noise or ice building up on evaporator coils.",
            "System runs continuously but vents blow room-temperature air.",
            "Cooling completely fails during peak afternoon heat."
          ],
          escalation: [
            "Running a severely low system will permanently burn out the compressor.",
            "What starts as a leak repair becomes a full system replacement."
          ],
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
