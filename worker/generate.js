/**
 * Page generation pipeline (worker):
 *   job → buildPromptContext(slug) → buildStackedUserPrompt(ctx) → model (JSON) → parse (see openai.js) → parseAiPagePayload → validatePage → INSERT pages
 *
 * Stub path (no OPENAI_API_KEY): skip the model; return Zod-valid JSON for local testing.
 */
const { normalizeSlug, derivePageType } = require("./schema");
const { buildStackedUserPrompt } = require("./prompts/stack");
const { completeChatJsonObject } = require("./openai");
const { parseAiPagePayload } = require("./aiPageSchema");

const stubHvacAcNotCoolingCluster = require("./stubs/hvac-ac-not-cooling.cluster.json");
const stubHvacAcNotCoolingFortMyersCity = require("./stubs/hvac-ac-not-cooling-fort-myers-fl.city.json");

const SYSTEM =
  "You are Home Services Diagnostics (HSD) content engine. Follow the user prompt exactly. Output a single valid JSON object only.";

function tradeFromSlug(path) {
  const first = path.split("/").filter(Boolean)[0]?.toLowerCase();
  if (first === "plumbing" || first === "electrical" || first === "hvac") return first;
  return "hvac";
}

function slugTailToLocationLabel(slugTail) {
  if (!slugTail) return null;
  const parts = String(slugTail).split("-").filter(Boolean);
  if (parts.length >= 2) {
    const maybeState = parts[parts.length - 1];
    if (maybeState.length === 2 && /^[a-z]{2}$/i.test(maybeState)) {
      const cityWords = parts.slice(0, -1);
      const city = cityWords.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");
      return `${city}, ${maybeState.toUpperCase()}`;
    }
  }
  return slugTail.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Keyword line for prompts: drop trade segment; hyphen → space (e.g. ac not cooling, ac not cooling fort myers fl). */
function targetKeywordFromPath(path) {
  const parts = path.split("/").filter(Boolean);
  if (parts.length <= 1) return (parts[0] || "").replace(/-/g, " ").trim();
  return parts
    .slice(1)
    .map((p) => p.replace(/-/g, " "))
    .join(" ")
    .trim();
}

function buildPromptContext(path) {
  const parts = path.split("/").filter(Boolean);
  const page_type = derivePageType(path);
  const trade = tradeFromSlug(path);
  const target_keyword = targetKeywordFromPath(path);
  const location =
    page_type === "city" && parts.length >= 3 ? slugTailToLocationLabel(parts[2]) : null;

  return {
    slug: path,
    trade,
    page_type,
    target_keyword,
    location,
  };
}

function stubPagePayload(path) {
  if (path === "/hvac/ac-not-cooling") {
    return JSON.parse(JSON.stringify(stubHvacAcNotCoolingCluster));
  }
  if (path === "/hvac/ac-not-cooling/fort-myers-fl") {
    return JSON.parse(JSON.stringify(stubHvacAcNotCoolingFortMyersCity));
  }

  const display = path.replace(/^\/+/, "") || path;
  const page_type = derivePageType(path);
  return {
    slug: path,
    page_type,
    content: {
      title: `${display.replace(/\//g, " — ")}: what it usually means`,
      body: [
        `Homeowners often notice this pattern on **${display}** before a hard failure shows up.`,
        "Start with what you can observe safely: runtime sounds, airflow at registers, thermostat behavior, and any tripping safety controls.",
        "Many causes share the same outward symptom; the goal is to separate likely failure classes before guessing at parts or adding refrigerant.",
        "When limits are unclear or energy is involved beyond normal homeowner checks, professional diagnosis protects equipment and safety.",
      ].join("\n\n"),
      summary: `If you are seeing this on ${display}, the priority is to classify the failure class and stop conditions that can damage equipment or create safety risk.`,
      urgency: "moderate",
      top_causes: [
        {
          cause: "Primary load or control issue",
          why_it_happens: "Most common field pattern for this symptom class under typical residential use.",
          severity: "moderate",
        },
        {
          cause: "Secondary restriction or imbalance",
          why_it_happens: "Often confused with the primary fault because outward signs overlap early.",
          severity: "moderate",
        },
        {
          cause: "Wear-related component drift",
          why_it_happens: "Progresses with runtime hours and can look intermittent until it stabilizes as a clear fault.",
          severity: "low",
        },
      ],
      diagnostic_steps: [
        "Confirm the symptom is present under normal operating conditions (not a one-off thermostat mistake).",
        "Observe whether the issue is continuous vs only under load (helps separate classes).",
        "Check the simplest user-safe isolations recommended for this trade (filters, obvious obstructions, resets within labeling).",
        "Note any new sounds, smells, or trips that started at the same time as the symptom change.",
        "If anything suggests energized work, refrigerant handling, or gas line work, stop and call a licensed pro.",
      ],
      when_to_call: [
        "You cannot confidently classify the failure class after the basic safe checks.",
        "The condition is worsening run-to-run (temperature drift, new trips, new noises).",
        "You see signs that imply safety risk (burning smell, arcing, flooding, gas odor).",
      ],
      seo: {
        meta_title: `${display} — causes, checks, and when to call`,
        meta_description: `Practical guidance for ${display}: likely directions, safe homeowner observations, and when to bring in a professional.`,
      },
    },
  };
}

async function generatePage(slugInput) {
  const path = normalizeSlug(slugInput);
  const ctx = buildPromptContext(path);

  if (!process.env.OPENAI_API_KEY) {
    console.warn("[generate] OPENAI_API_KEY missing — using deterministic stub payload");
    return stubPagePayload(path);
  }

  const user = buildStackedUserPrompt(ctx);
  const raw = await completeChatJsonObject({ system: SYSTEM, user });
  const parsed = parseAiPagePayload(raw);
  if (!parsed.success) {
    const msg = parsed.error?.issues?.map((i) => i.message).join("; ") || "invalid AI payload";
    throw new Error(`AI JSON failed validation: ${msg}`);
  }

  const data = parsed.data;
  if (normalizeSlug(data.slug) !== path) {
    throw new Error(`AI slug mismatch: expected ${path}, got ${data.slug}`);
  }
  if (data.page_type !== ctx.page_type) {
    throw new Error(`AI page_type mismatch: expected ${ctx.page_type}, got ${data.page_type}`);
  }

  return data;
}

module.exports = {
  generatePage,
  buildPromptContext,
  stubPagePayload,
  targetKeywordFromPath,
};
