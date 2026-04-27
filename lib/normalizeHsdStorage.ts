import { safeId } from "./buildMermaid";
import { getFlowTypeForSlug } from "./diagnosticFlows";

/**
 * Coerce known `content_json` shape drift from generators / stubs so `HsdSchema.safeParse` succeeds.
 */

/** Remove lone decorative "… Start" / start_node hop so the graph opens on the first real question. */
function pruneRedundantFlowEntry(flow: Record<string, unknown>): void {
  if (flow.type !== "mermaid") return;
  const nodes = flow.nodes;
  const edges = flow.edges;
  if (!Array.isArray(nodes) || !Array.isArray(edges) || nodes.length === 0) return;

  const nodeRows = nodes as { id?: unknown; label?: unknown }[];
  const edgeRows = edges as { from?: unknown; to?: unknown }[];

  const ids = new Set(nodeRows.map((n) => safeId(n?.id == null ? undefined : String(n.id))));
  const inC = new Map<string, number>();
  const outC = new Map<string, number>();
  for (const id of ids) {
    inC.set(id, 0);
    outC.set(id, 0);
  }
  for (const e of edgeRows) {
    const f = safeId(e?.from == null ? undefined : String(e.from));
    const t = safeId(e?.to == null ? undefined : String(e.to));
    if (ids.has(f) && ids.has(t)) {
      outC.set(f, (outC.get(f) ?? 0) + 1);
      inC.set(t, (inC.get(t) ?? 0) + 1);
    }
  }

  const removable = nodeRows.filter((n) => {
    const sid = safeId(n?.id == null ? undefined : String(n.id));
    const label = String(n?.label ?? "").trim();
    const inn = inC.get(sid) ?? 0;
    const out = outC.get(sid) ?? 0;
    if (inn !== 0 || out !== 1) return false;
    if (sid === "start_node") return true;
    if (/\bstart\s*$/i.test(label)) return true;
    return false;
  });

  if (removable.length !== 1) return;

  const victimId = safeId(removable[0]?.id == null ? undefined : String(removable[0].id));
  flow.nodes = nodeRows.filter((n) => safeId(n?.id == null ? undefined : String(n.id)) !== victimId);
  flow.edges = edgeRows.filter((e) => safeId(e?.from == null ? undefined : String(e.from)) !== victimId);
}

/**
 * Legacy rows often omit `label` on edges; `validateDecisionTreeFlow` requires non-empty labels.
 * Fill blanks in a stable way so pages render without regenerating every slug.
 */
function ensureDiagnosticFlowEdgeLabels(flow: Record<string, unknown>): void {
  if (flow.type !== "mermaid") return;
  const edges = flow.edges;
  if (!Array.isArray(edges)) return;

  type EdgeRow = { from?: unknown; to?: unknown; label?: unknown };
  const edgeRows = edges as EdgeRow[];

  const byFrom = new Map<string, EdgeRow[]>();
  for (const e of edgeRows) {
    const fromS = safeId(e?.from == null ? undefined : String(e.from));
    if (!fromS) continue;
    const list = byFrom.get(fromS) ?? [];
    list.push(e);
    byFrom.set(fromS, list);
  }

  const defaults = ["Yes", "No", "Other"];
  for (const [, group] of byFrom) {
    const sorted = [...group].sort((a, b) =>
      safeId(a?.to == null ? undefined : String(a.to)).localeCompare(
        safeId(b?.to == null ? undefined : String(b.to))
      )
    );
    sorted.forEach((e, i) => {
      if (String(e.label ?? "").trim()) return;
      e.label = defaults[Math.min(i, defaults.length - 1)]!;
    });
  }
}

function asStringArray(v: unknown): string[] {
  if (v == null) return [];
  if (Array.isArray(v)) return v.map((x) => String(x)).filter(Boolean);
  if (typeof v === "string" && v.trim()) return [v.trim()];
  return [];
}

const SEVERITY_ALLOWED = new Set(["low", "moderate", "high"]);

function normalizeSeverity(v: unknown): "low" | "moderate" | "high" {
  const s = String(v ?? "")
    .trim()
    .toLowerCase();
  if (SEVERITY_ALLOWED.has(s)) return s as "low" | "moderate" | "high";
  if (s === "medium" || s === "med") return "moderate";
  if (s === "critical" || s === "severe") return "high";
  if (s === "minor") return "low";
  return "moderate";
}

function normalizeTopCause(c: Record<string, unknown>): Record<string, unknown> {
  const out = { ...c };
  out.mechanism = asStringArray(out.mechanism);
  out.signal = asStringArray(out.signal);
  out.escalation = asStringArray(out.escalation);
  if (typeof out.cause !== "string") out.cause = String(out.cause ?? "Unknown cause");
  out.severity = normalizeSeverity(out.severity);
  return out;
}

function normalizeRepairVsReplace(v: unknown): string[] {
  if (Array.isArray(v)) return v.map((x) => String(x)).filter(Boolean);
  if (v && typeof v === "object") {
    return Object.values(v as Record<string, unknown>)
      .map((x) => (typeof x === "string" ? x : x == null ? "" : String(x)))
      .filter(Boolean);
  }
  if (typeof v === "string" && v.trim()) return [v.trim()];
  return [];
}

export function normalizeHsdStorageJson(raw: unknown): unknown {
  if (!raw || typeof raw !== "object") return raw;
  const data = JSON.parse(JSON.stringify(raw)) as Record<string, unknown>;
  const content = data.content;
  if (!content || typeof content !== "object") return data;

  const c = content as Record<string, unknown>;
  const slug = typeof data.slug === "string" ? data.slug : "";

  if (slug.includes("high-water-pressure")) {
    c.flow_type = "HIGH_PRESSURE_FLOW";
  }

  if (c.flow_type === "SURGE_FLOW") {
    c.flow_type = "POWER_SURGE_FLOW";
  }

  if (typeof c.flow_type !== "string" && slug) {
    c.flow_type = getFlowTypeForSlug(slug);
  }

  if (c.hero && typeof c.hero === "object") {
    const h = c.hero as Record<string, unknown>;
    if (typeof h.headline !== "string") h.headline = String(h.headline ?? "");
    if (typeof h.subhead !== "string") h.subhead = String(h.subhead ?? "");
    h.urgency = normalizeSeverity(h.urgency);
  }

  if (!Array.isArray(c.quick_triage)) {
    c.quick_triage = [];
  }

  if (Array.isArray(c.top_causes)) {
    c.top_causes = (c.top_causes as unknown[]).map((item) =>
      item && typeof item === "object"
        ? normalizeTopCause(item as Record<string, unknown>)
        : item
    );
  }

  c.repair_vs_replace = normalizeRepairVsReplace(c.repair_vs_replace);

  if (!Array.isArray(c.stop_diy)) {
    if (typeof c.stop_diy === "string") c.stop_diy = [c.stop_diy];
    else if (c.stop_diy && typeof c.stop_diy === "object")
      c.stop_diy = Object.values(c.stop_diy as Record<string, unknown>).map(String);
    else c.stop_diy = [];
  }

  if (!Array.isArray(c.local_factors)) {
    c.local_factors = [];
  }

  if (!c.internal_links || typeof c.internal_links !== "object") {
    c.internal_links = { related_symptoms: [], system_pages: [] };
  } else {
    const il = c.internal_links as Record<string, unknown>;
    if (!Array.isArray(il.related_symptoms)) il.related_symptoms = [];
    if (!Array.isArray(il.system_pages)) il.system_pages = [];
  }

  if (c.diagnostic_flow && typeof c.diagnostic_flow === "object") {
    const flow = c.diagnostic_flow as Record<string, unknown>;
    pruneRedundantFlowEntry(flow);
    ensureDiagnosticFlowEdgeLabels(flow);
  }

  return data;
}
