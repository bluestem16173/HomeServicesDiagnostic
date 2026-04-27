// components/MermaidDiagram.tsx
"use client";

import { useEffect, useRef } from "react";
import mermaid from "mermaid";

let initialized = false;

export default function MermaidDiagram({ chart }: { chart: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!initialized) {
      mermaid.initialize({
        startOnLoad: false,
        securityLevel: "loose",
        flowchart: { htmlLabels: true },
      });
      initialized = true;
    }

    const el = ref.current;
    if (!el) return;

    let cancelled = false;

    void (async () => {
      try {
        const id = `m-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
        const { svg } = await mermaid.render(id, chart);
        if (!cancelled && ref.current) {
          ref.current.innerHTML = svg;
        }
      } catch (e) {
        if (!cancelled && ref.current) {
          ref.current.innerText = "Diagram failed to render";
        }
        console.error(e);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [chart]);

  return <div className="mermaid mermaid-container" ref={ref} />;
}
