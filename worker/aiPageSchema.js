const { z } = require("zod");

const seoSchema = z.object({
  title: z.string(),
  description: z.string().optional()
});

const contentSchema = z.object({
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
  mermaid_chart: z.string().optional(),
  climate_blurb: z.string(),
  climate_keyword: z.string()
});

const aiPageSchema = z.object({
  slug: z.string().min(1),
  page_type: z.enum(["city", "cluster"]),
  seo: seoSchema,
  content: contentSchema,
});

function parseAiPagePayload(obj) {
  return aiPageSchema.safeParse(obj);
}

module.exports = { parseAiPagePayload, aiPageSchema, contentSchema };
