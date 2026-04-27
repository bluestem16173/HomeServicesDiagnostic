import { safeId } from "./buildMermaid";

export type DecisionTreeValidation = { ok: true } | { ok: false; errors: string[] };

/**
 * Ensures diagnostic_flow is a decision tree (branching), not a linear sequence.
 * Used by HsdSchema.superRefine — fail fast so bad AI output is rejected / regenerated.
 */
export function validateDecisionTreeFlow(flow: unknown): DecisionTreeValidation {
  const errors: string[] = [];

  if (!flow || typeof flow !== "object") {
    return { ok: false, errors: ["diagnostic_flow must be an object"] };
  }

  const f = flow as Record<string, unknown>;
  if (f.type != null && f.type !== "mermaid") {
    return { ok: false, errors: ['diagnostic_flow.type must be "mermaid" when set'] };
  }

  const nodes = Array.isArray(f.nodes) ? f.nodes : [];
  const edges = Array.isArray(f.edges) ? f.edges : [];

  if (nodes.length < 2) {
    errors.push("diagnostic_flow needs at least 2 nodes");
  }

  const nodeIds = new Set<string>();
  const labelsById = new Map<string, string>();

  for (const n of nodes) {
    if (!n || typeof n !== "object") continue;
    const raw = (n as { id?: unknown }).id;
    const sid = safeId(raw == null ? undefined : String(raw));
    if (nodeIds.has(sid)) {
      errors.push(`duplicate node id after normalization: ${sid}`);
    }
    nodeIds.add(sid);
    labelsById.set(sid, String((n as { label?: unknown }).label ?? ""));
  }

  if (nodeIds.size === 0) {
    return { ok: false, errors: [...errors, "no valid node ids"] };
  }

  const out = new Map<string, { to: string; label: string }[]>();
  const addOut = (from: string, to: string, label: string) => {
    const list = out.get(from) ?? [];
    list.push({ to, label });
    out.set(from, list);
  };

  for (const e of edges) {
    if (!e || typeof e !== "object") continue;
    const fromS = safeId((e as { from?: unknown }).from == null ? undefined : String((e as { from?: unknown }).from));
    const toS = safeId((e as { to?: unknown }).to == null ? undefined : String((e as { to?: unknown }).to));
    const label = String((e as { label?: unknown }).label ?? "");
    if (!label.trim()) {
      errors.push(
        `edge ${fromS} → ${toS} must have a non-empty label (e.g. "Yes" / "No" or "Strong" / "Weak")`
      );
    }
    if (!nodeIds.has(fromS)) {
      errors.push(`edge from unknown node: ${fromS}`);
    }
    if (!nodeIds.has(toS)) {
      errors.push(`edge to unknown node: ${toS}`);
    }
    addOut(fromS, toS, label);
  }

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  /** Nodes with at least two distinct child targets (real branch, not duplicate edge). */
  const branchNodeIds: string[] = [];
  for (const id of nodeIds) {
    const outs = out.get(id) ?? [];
    const distinctTo = new Set(outs.map((x) => x.to));
    if (distinctTo.size >= 2) {
      branchNodeIds.push(id);
    }
    if (outs.length >= 2 && distinctTo.size < 2) {
      errors.push(
        `node ${id} has multiple outgoing edges but they do not split to different targets — invalid decision branch`
      );
    }
  }

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  if (branchNodeIds.length < 1) {
    errors.push(
      "INVALID: linear or single-path flow — need at least one decision node with two different outcomes (two edges to different targets)"
    );
  }

  if (branchNodeIds.length < 2) {
    errors.push(
      "INVALID: missing secondary decision — need a second node that branches into at least two distinct targets (nested decision tree)"
    );
  }

  /** Terminal outcomes: listed nodes with no outgoing edges. */
  const leaves: string[] = [];
  for (const id of nodeIds) {
    const outs = out.get(id) ?? [];
    if (outs.length === 0) {
      leaves.push(id);
    }
  }

  if (leaves.length < 3) {
    errors.push(
      `INVALID: need at least 3 distinct final outcome nodes (leaves); found ${leaves.length}`
    );
  }

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  return { ok: true };
}
