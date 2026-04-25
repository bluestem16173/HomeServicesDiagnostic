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

function stubPagePayload(path, ctx) {
  if (path === "/hvac/ac-not-cooling") {
    return JSON.parse(JSON.stringify(stubHvacAcNotCoolingCluster));
  }
  if (path === "/hvac/ac-not-cooling/fort-myers-fl") {
    return JSON.parse(JSON.stringify(stubHvacAcNotCoolingFortMyersCity));
  }

  const display = path.replace(/^\/+/, "") || path;
  const page_type = derivePageType(path);
  const location = ctx ? ctx.location : null;
  return {
    slug: path,
    page_type,
    seo: {
      title: `${targetKeywordFromPath(path).replace(/\b\w/g, c => c.toUpperCase())} in ${location ? location.split(',')[0] : "Your Area"}? Let's Find the Cause`,
      description: `Local diagnostic details for ${display}. See top causes, quick checks, and when to call a professional.`
    },
    content: {
      field_triage: `If you are dealing with ${display}, it often points to a component drift or control issue. Monitor it closely.`,
      diagnostic_flow: [
        "Check the power source and ensure the breaker hasn't tripped.",
        "Observe the unit for any unusual sounds or smells.",
        "Verify if the issue is intermittent or constant.",
        "If safe, inspect the immediate visible components for damage."
      ],
      climate_keyword: location || "Your Area",
      climate_blurb: `In ${location || "your area"}, humidity and heat can accelerate this type of failure. Look closely at the components exposed to the elements.`,
      top_causes: [
        {
          title: "Primary Load Issue",
          description: "This is the most common field pattern under normal residential use. Wear and tear causes the component to fail over time."
        },
        {
          title: "Secondary Imbalance",
          description: "Often confused with the primary fault because the outward signs overlap early on."
        },
        {
          title: "Wear-related Drift",
          description: "Progresses with runtime hours and can look intermittent until it stabilizes as a clear fault."
        }
      ],
      quick_checks: [
        "Confirm the symptom is present under normal operating conditions.",
        "Check the simplest user-safe isolations (filters, visible resets).",
        "Note any new sounds or smells."
      ],
      stop_diy: "If anything suggests energized work, refrigerant handling, or gas line work, stop immediately and call a licensed pro.",
      repair_vs_replace: "Minor component drift is typically a cheap repair. However, if the underlying system is aged past its service life, a full replacement is safer and more cost-effective.",
      cta: `Need help with your ${display.split(' ')[0]}?`
    }
  };
}

async function generatePage(slugInput) {
  const path = normalizeSlug(slugInput);
  const ctx = buildPromptContext(path);

  if (!process.env.OPENAI_API_KEY) {
    console.warn("[generate] OPENAI_API_KEY missing — using deterministic stub payload");
    return stubPagePayload(path, ctx);
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

  const content = data.content;
  if (!content.diagnostic_flow) {
    throw new Error("INVALID PAGE - NO FLOW");
  }

  return data;
}

module.exports = {
  generatePage,
  buildPromptContext,
  stubPagePayload,
  targetKeywordFromPath,
};
