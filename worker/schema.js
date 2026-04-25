// Minimal validation layer — page body validated with Zod when full AI shape is present.
const { parseAiPagePayload } = require("./aiPageSchema");

/** Canonical path for DB (`slug_must_start_with_slash`): `/trade/condition` or `/trade/condition/city`. */
function normalizeSlug(s) {
  if (s == null) return "";
  const trimmed = String(s).trim().replace(/^\/+/, "").replace(/\/+$/, "");
  if (!trimmed) return "";
  return `/${trimmed}`;
}

function derivePageType(slug) {
  if (!slug) return "cluster";

  const parts = slug.split("/").filter(Boolean);

  // /hvac/ac-not-cooling/fort-myers-fl → city (3 segments)
  if (parts.length >= 3) return "city";

  return "cluster";
}

function validatePage(raw) {
  if (!raw || raw.slug == null || String(raw.slug).trim() === "") return null;

  const slug = normalizeSlug(raw.slug);
  if (!slug) return null;

  const page_type_expected = derivePageType(slug);

  const candidate = {
    slug,
    page_type: raw.page_type,
    seo: raw.seo,
    content: raw.content,
  };

  const pr = parseAiPagePayload(candidate);
  if (!pr.success) return null;

  if (pr.data.page_type !== page_type_expected) return null;
  if (normalizeSlug(pr.data.slug) !== slug) return null;

  return {
    slug,
    page_type: page_type_expected,
    content_json: {
      seo: pr.data.seo,
      content: pr.data.content,
      generated_at: new Date().toISOString(),
    },
    status: "done",
  };
}
module.exports = { validatePage, normalizeSlug, derivePageType };