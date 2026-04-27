/**
 * JSON diagnostic_flow → Mermaid source. Defensive so bad rows don’t crash the page.
 */

export function safeId(raw: string | undefined | null): string {
  const id = String(raw ?? "node")
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, "_")
    .replace(/^_+|_+$/g, "");
  const base = id.length > 0 ? id : "node";
  return base.replace(/^(end|start|graph|subgraph)$/, (m) => `${m}_node`);
}

export type MermaidFlowNode = { id?: string | null; label?: string | null };
export type MermaidFlowEdge = { from?: string | null; to?: string | null; label?: string | null };

export type MermaidFlowInput = {
  type?: string;
  direction?: string;
  nodes?: MermaidFlowNode[] | null;
  edges?: MermaidFlowEdge[] | null;
};

export function buildMermaid(flow: MermaidFlowInput | null | undefined): string {
  if (!flow || typeof flow !== "object") return "";
  if (flow.type != null && flow.type !== "mermaid") return "";

  const nodes = Array.isArray(flow.nodes) ? flow.nodes : [];
  const edges = Array.isArray(flow.edges) ? flow.edges : [];
  if (nodes.length === 0 && edges.length === 0) return "";

  const direction = flow.direction === "TD" || flow.direction === "BT" || flow.direction === "RL" ? flow.direction : "LR";
  let str = `graph ${direction}\n`;

  for (const n of nodes) {
    const id = safeId(n?.id);
    const label = String(n?.label ?? "").replace(/"/g, "'");
    str += `  ${id}["${label}"]\n`;
  }

  for (const e of edges) {
    const from = safeId(e?.from);
    const to = safeId(e?.to);
    const edgeLabel = e?.label != null && String(e.label).length > 0 ? `|${String(e.label).replace(/"/g, "'")}|` : "";
    str += `  ${from} -->${edgeLabel} ${to}\n`;
  }

  return str;
}
