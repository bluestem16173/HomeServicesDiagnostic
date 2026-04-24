import { buildHsdV2VeteranTechnicianPrompt } from './diagnostic-engine-json';
import { z } from 'zod';
export const HsdSchema = z.object({
  seo: z.object({
    title: z.string(),
    description: z.string().optional()
  }),
  content: z.object({
    field_triage: z.string(),
    top_causes: z.array(z.object({
      title: z.string(),
      description: z.string()
    })),
    diagnostic_flow: z.array(z.string()),
    quick_checks: z.array(z.string()),
    stop_diy: z.string(),
    repair_vs_replace: z.string(),
    cta: z.string(),
    mermaid_chart: z.string().max(500)
  })
});

export function validateHsdSchema(data: any) {
  return HsdSchema.parse(data);
}

export async function generateHsdPage({ vertical, symptom, city }: { vertical: string, symptom: string, city: string }) {
  console.log(`[generateHsdPage] Generating diagnostic for ${vertical} - ${symptom} in ${city}...`);
  
  const prompt = buildHsdV2VeteranTechnicianPrompt(symptom, city, 'FL'); // Assuming FL for now based on Fort Myers, FL
  
  // Try to use OpenAI API if key exists, otherwise return a strong stub
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.warn('[generateHsdPage] No OPENAI_API_KEY found, returning stub payload.');
    return generateStubPayload(symptom, city);
  }

  console.log('[generateHsdPage] Calling OpenAI...');
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4-turbo', // or gpt-4o
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: 'You are a veteran technical writer and diagnostic engineer. Respond with exactly the required JSON structure.' },
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
  // Enforce schema validation
  return validateHsdSchema(parsedJson);
}

function generateStubPayload(symptom: string, city: string) {
  return {
    seo: {
      title: `${symptom} in ${city}: Expert Diagnostic & Troubleshooting`
    },
    content: {
      field_triage: `When a ${symptom.toLowerCase()} happens, it requires immediate attention to prevent further damage or safety risks. This is a common issue in ${city} due to local conditions. Stop using the system and prepare for basic safe isolation checks.`,
      top_causes: [
        {
          title: "Primary Load Failure",
          description: "The most common field pattern, often resulting from excessive stress under peak demand."
        },
        {
          title: "Secondary Component Imbalance",
          description: "A cascade failure from another part of the system that initially presents identically."
        }
      ],
      diagnostic_flow: [
        "Confirm the issue is consistent and not intermittent.",
        "Check basic safety overrides and filters.",
        "IF resets fail, THEN isolate the system to prevent damage."
      ],
      quick_checks: [
        "Verify thermostat is set correctly.",
        "Check filter for excessive debris.",
        "Ensure no obstructions block airflow or water flow."
      ],
      stop_diy: "Stop if you encounter exposed wiring or need to access internal sealed components. Call a professional.",
      repair_vs_replace: "Minor component failures typically warrant a repair, but recurring issues on units over 10 years old may lean toward replacement.",
      cta: "Schedule a diagnostic visit with our expert technicians today.",
      mermaid_chart: `graph TD
  A[Breaker Trips Immediately] --> B[Short Circuit Likely]
  A --> C[Check Wiring]
  D[Trips After Load] --> E[Overload Condition]
  E --> F[Reduce Load / Circuit Split]`
    }
  };
}
