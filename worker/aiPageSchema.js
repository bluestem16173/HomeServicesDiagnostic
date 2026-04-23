const { z } = require("zod");

const contentSchema = z.object({
  title: z.string().min(1),
  body: z.string().min(1),
  summary: z.string().min(1),
  urgency: z.enum(["low", "moderate", "high"]),
  top_causes: z
    .array(
      z.object({
        cause: z.string().min(1),
        why_it_happens: z.string().min(1),
        severity: z.string().min(1),
      })
    )
    .min(3)
    .max(6),
  diagnostic_steps: z.array(z.string().min(1)).min(4).max(8),
  when_to_call: z.array(z.string().min(1)).min(3).max(6),
  seo: z.object({
    meta_title: z.string().min(1),
    meta_description: z.string().min(1),
  }),
});

const aiPageSchema = z.object({
  slug: z.string().min(1),
  page_type: z.enum(["city", "cluster"]),
  content: contentSchema,
});

function parseAiPagePayload(obj) {
  return aiPageSchema.safeParse(obj);
}

module.exports = { parseAiPagePayload, aiPageSchema, contentSchema };
