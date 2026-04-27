import { z } from 'zod';
import { FLOW_TYPES, getFlowTypeForSlug } from '@/lib/diagnosticFlows';

export const HsdSchema = z
  .object({
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
      flow_type: z.enum(FLOW_TYPES),
      diagnostic_flow: z.any().nullable().optional(),
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
  })
  .superRefine((data, ctx) => {
    const expectedFlowType = getFlowTypeForSlug(data.slug);
    if (data.content.flow_type !== expectedFlowType) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `flow_type must be ${expectedFlowType} for ${data.slug}`,
        path: ["content", "flow_type"]
      });
    }
  });

export function validateHsdSchema(data: unknown) {
  return HsdSchema.parse(data);
}

export const PROMPT_VERSION = "hsd_v3_graphic_lock_scale_v2";

export const MASTER_PROMPT_TEMPLATE = `RETURN FORMAT (MANDATORY):

You MUST return a JSON object with EXACT structure:

{
  "slug": "...",
  "page_type": "city",
  "schema_version": "hsd_v3_graphic",
  "content": { ... }
}

DO NOT omit ANY field.
DO NOT return partial JSON.
DO NOT return text outside JSON.

If you cannot produce valid JSON → retry internally.

You are a senior {{TRADE}} diagnostic technician.

Generate a structured diagnostic page for:
Symptom: {{SYMPTOM}}
Location: {{CITY}}, {{STATE}}

Return ONLY valid JSON using schema: hsd_v3_graphic

---

CRITICAL RULES:

- Output ONLY JSON
- No markdown
- No explanation
- No extra text

schema_version MUST be: "hsd_v3_graphic"

---

JSON SHAPE (server validator — omit nothing):

Return an object with slug, page_type, schema_version, and content. content includes: hero { headline, subhead, urgency }, quick_triage (string array), flow_type (string), diagnostic_flow (null), top_causes (exactly 4), stop_diy, repair_vs_replace (array of strings), local_factors, internal_links { related_symptoms, system_pages }.

top_causes[].severity must be exactly "low", "moderate", or "high".

---

TRADE LOCK:

{{TRADE}} ONLY.

HVAC → airflow, refrigerant, compressor
Plumbing → pressure, flow, drainage, leaks
Electrical → voltage, breakers, wiring

DO NOT mix trades.

---

HERO:

- clear headline
- urgency: high

---

QUICK_TRIAGE:

4–5 observable checks

---

FLOW TYPE CLASSIFICATION (CRITICAL CHANGE):

You are NO LONGER responsible for generating the full diagnostic_flow.

Instead, you must assign a FLOW TYPE based on the symptom.

---

OUTPUT REQUIREMENT:

Inside content, include:

"flow_type": "<FLOW_TYPE>"

Set:
"diagnostic_flow": null

---

VALID FLOW TYPES:

PLUMBING:
- DRAIN_FLOW
- LEAK_FLOW
- PRESSURE_FLOW
- HIGH_PRESSURE_FLOW
- FIXTURE_FLOW
- SEWER_FLOW

HVAC:
- COOLING_FLOW
- AIRFLOW_FLOW
- HVAC_ELECTRICAL_FLOW
- THERMOSTAT_FLOW

ELECTRICAL:
- POWER_FLOW
- BREAKER_FLOW
- OUTLET_FLOW
- WIRING_FLOW
- POWER_SURGE_FLOW

---

MAPPING RULES:

You MUST choose the correct flow type:

PLUMBING:

- clogged-drain → DRAIN_FLOW
- shower-not-draining → DRAIN_FLOW
- sewer-backup → SEWER_FLOW
- pipe-leak → LEAK_FLOW
- water-heater-leaking → LEAK_FLOW
- low-water-pressure → PRESSURE_FLOW
- high-water-pressure → HIGH_PRESSURE_FLOW
- faucet / toilet / disposal → FIXTURE_FLOW

HVAC:

- ac-not-cooling → COOLING_FLOW
- weak-airflow → AIRFLOW_FLOW
- ac-wont-turn-on → HVAC_ELECTRICAL_FLOW
- thermostat issues → THERMOSTAT_FLOW

ELECTRICAL:

- breaker-keeps-tripping → BREAKER_FLOW
- outlets-not-working → OUTLET_FLOW
- gfci-wont-reset → OUTLET_FLOW
- sparks-from-outlet → OUTLET_FLOW
- power-outage → POWER_FLOW
- main-panel-buzzing → WIRING_FLOW
- sparks / burning smell → WIRING_FLOW
- power-surges → POWER_SURGE_FLOW
- surge / storm issues → POWER_SURGE_FLOW

---

STRICT RULE:

- DO NOT generate diagnostic_flow nodes or edges
- DO NOT include generic or incorrect flows
- If flow_type does not match the symptom, fix it internally before returning JSON

---

TOP_CAUSES:

EXACTLY 4

Each must include:

- cause
- mechanism (2 lines)
- signal (2 lines)
- escalation (1–2 lines)
- severity: exactly one of "low", "moderate", "high"

---

stop_diy:

5–6 warnings
Must include safety + damage risk

---

REPAIR_VS_REPLACE:

Must be a JSON array of 3–5 strings (not one long string).
Include this idea in one line:
what starts as a minor issue can become a multi-thousand-dollar failure

---

LOCAL_FACTORS:

3–4 bullets
Include humidity + storms + usage stress

---

FINAL CHECK:

- flow_type matches the symptom exactly
- diagnostic_flow is null
- exactly 4 causes; each severity is "low", "moderate", or "high"
- trade is correct

If not → fix internally

---

OUTPUT ONLY JSON`;

export async function generateHsdPage({ vertical, symptom, city }: { vertical: string, symptom: string, city: string }) {
  console.log(`[generateHsdPage] ${PROMPT_VERSION} — ${vertical} / ${symptom} / ${city}`);
  const expectedSlug = `/${slugify(vertical)}/${slugify(symptom)}/${slugify(city)}`;

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

  const MAX_ATTEMPTS = 3;
  let correction = "";

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const userMessage =
      attempt === 0
        ? prompt
        : `${prompt}\n\n---\nFIX PREVIOUS OUTPUT — validation failed:\n${correction}\n\nReturn the COMPLETE page JSON again. Satisfy Zod for every path above, including hero.subhead and internal_links. content.flow_type must match the symptom exactly, and diagnostic_flow must be null. repair_vs_replace must be an array of strings. top_causes: exactly 4 items; severity only low|moderate|high; mechanism, signal, escalation as string arrays.\n`;

    if (attempt > 0) {
      console.warn(`[generateHsdPage] Retry ${attempt + 1}/${MAX_ATTEMPTS} after schema failure`);
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
        messages: [{ role: 'user', content: userMessage }],
        temperature: attempt > 0 ? 0.45 : 0.3
      })
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`OpenAI API error: ${res.status} ${errText}`);
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("EMPTY OPENAI RESPONSE");
    }

    let parsedJson;

    try {
      parsedJson = JSON.parse(content);
    } catch {
      console.error("RAW RESPONSE:", content);
      throw new Error("INVALID JSON RESPONSE");
    }

    if (
      !parsedJson ||
      !parsedJson.slug ||
      !parsedJson.page_type ||
      !parsedJson.schema_version ||
      !parsedJson.content
    ) {
      console.error("❌ BAD OPENAI OUTPUT:");
      console.error(JSON.stringify(parsedJson, null, 2));
      correction = "Missing required top-level fields: slug, page_type, schema_version, content";
      continue;
    }

    parsedJson.slug = expectedSlug;
    coerceGeneratedContent(parsedJson);

    const parsed = HsdSchema.safeParse(parsedJson);
    if (parsed.success) {
      return parsed.data;
    }

    correction = parsed.error.issues
      .map((i) => `${i.path.join('.')}: ${i.message}`)
      .join('\n');
  }

  throw new Error(
    `[generateHsdPage] Schema failed after ${MAX_ATTEMPTS} OpenAI attempts:\n${correction}`
  );
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function asStringArray(value: unknown) {
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  if (typeof value === "string" && value.trim()) return [value.trim()];
  return [];
}

function coerceGeneratedContent(payload: { content?: unknown }) {
  if (!payload.content || typeof payload.content !== "object") return;
  const content = payload.content as Record<string, unknown>;

  content.diagnostic_flow = null;

  if (!Array.isArray(content.top_causes)) return;
  content.top_causes = content.top_causes.map((item) => {
    if (!item || typeof item !== "object") return item;
    const cause = item as Record<string, unknown>;
    return {
      ...cause,
      mechanism: asStringArray(cause.mechanism),
      signal: asStringArray(cause.signal),
      escalation: asStringArray(cause.escalation),
    };
  });
}

function generateStubPayload(vertical: string, symptom: string, city: string) {
  const cleanSymptom = symptom.replace(/\b\w/g, c => c.toUpperCase());
  const slug = `/${slugify(vertical)}/${slugify(symptom)}/${slugify(city)}`;
  return {
    slug,
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
        "Is the outdoor unit running?",
        "Is the thermostat calling for cool and showing the right mode?"
      ],
      flow_type: getFlowTypeForSlug(slug),
      diagnostic_flow: null,
      top_causes: [
        {
          cause: "Refrigerant Leak",
          mechanism: [
            "Refrigerant is not consumed; low charge indicates a leak in the closed system.",
            "Compressor runs longer to compensate for poor heat transfer."
          ],
          signal: [
            "Hissing noise or ice building up on evaporator coils.",
            "System runs continuously but vents blow room-temperature air."
          ],
          escalation: [
            "Running a severely low system will permanently burn out the compressor.",
            "What starts as a leak repair becomes a full system replacement."
          ],
          severity: "high"
        },
        {
          cause: "Airflow Restriction",
          mechanism: [
            "Blocked filter or collapsed duct chokes return air and starves the coil.",
            "Blower cannot move enough air across the evaporator for heat exchange."
          ],
          signal: [
            "Weak airflow at registers even with the fan on high.",
            "Filter extremely dirty or recently changed with no improvement."
          ],
          escalation: [
            "Prolonged low airflow can crack the heat exchanger or slug the compressor.",
            "Ice damage can flood the drain pan and ceiling below the air handler."
          ],
          severity: "moderate"
        },
        {
          cause: "Electrical or Control Fault",
          mechanism: [
            "Loose high-voltage connections raise resistance and heat at terminals.",
            "Failed capacitor or contactor prevents compressor or condenser fan start."
          ],
          signal: [
            "Outdoor unit hums but neither fan nor compressor starts.",
            "Breaker trips when cooling engages."
          ],
          escalation: [
            "Repeated start attempts without rotation can burn windings.",
            "Arcing at the disconnect poses shock and fire risk."
          ],
          severity: "high"
        },
        {
          cause: "Peak Load Stress",
          mechanism: [
            "Extreme outdoor temperature pushes head pressure and amperage high.",
            "Long runtimes without relief wear contactors and motors faster."
          ],
          signal: [
            "Comfort drops only on the hottest afternoons.",
            "High utility spikes aligned with heat waves."
          ],
          escalation: [
            "Chronic overload ages the compressor before end of rated life.",
            "What starts as afternoon lag can become full no-cool failure."
          ],
          severity: "moderate"
        }
      ],
      stop_diy: [
        "exposed line-voltage wiring and live capacitor terminals",
        "refrigerant recovery, charging, or brazing on a sealed system",
        "compressor or inverter board replacement without proper tools",
        "warranty void if factory seals are broken by unlicensed work",
        "risk of refrigerant burns, electrical shock, and equipment damage"
      ],
      repair_vs_replace: [
        "Consider replacement if the unit is failing frequently.",
        "Units over 12 years with repeat failures often favor replacement.",
        "what starts as a minor issue can become a multi-thousand-dollar failure"
      ],
      local_factors: [
        "high humidity → latent load stress on coils and drains",
        "coastal storms → power blips, surge damage, corrosion at condenser",
        "long summer runtimes → compressor and contactor wear"
      ],
      internal_links: {
        related_symptoms: ["/hvac/ac-not-cooling", "/hvac/high-electric-bills"],
        system_pages: ["/hvac/repair", "/hvac/replacement"]
      }
    }
  };
}
