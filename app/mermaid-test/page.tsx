"use client";

import MermaidDiagram from "@/components/MermaidDiagram";
import { buildMermaid, type MermaidFlowInput } from "@/lib/buildMermaid";
import plumbingDiagnosisFlow from "@/lib/fixtures/plumbingDiagnosisFlow.json";

const chart = buildMermaid(plumbingDiagnosisFlow as MermaidFlowInput);

export default function MermaidTestPage() {
  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <h1 className="text-lg font-semibold text-slate-900 mb-4">
        Mermaid test — JSON → <code className="text-sm font-mono bg-slate-200 px-1 rounded">buildMermaid</code> (plumbing flow)
      </h1>
      <p className="text-sm text-slate-600 mb-4 max-w-3xl">
        Fixture: <code className="font-mono text-xs">lib/fixtures/plumbingDiagnosisFlow.json</code>. Reserved id{" "}
        <code className="font-mono text-xs">start</code> becomes <code className="font-mono text-xs">start_node</code> in
        Mermaid output.
      </p>
      <div className="max-w-5xl mx-auto bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
        <MermaidDiagram chart={chart} />
      </div>
    </main>
  );
}
