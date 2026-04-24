// components/MermaidDiagram.tsx
"use client";

import { useEffect, useRef } from "react";
import mermaid from "mermaid";

export default function MermaidDiagram({ chart }: { chart: string }) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        try {
            mermaid.initialize({
                startOnLoad: false,
                theme: "dark",
            });

            if (ref.current) {
                ref.current.textContent = chart;
                mermaid.run({
                    nodes: [ref.current],
                }).catch(console.error);
            }
        } catch (error) {
            console.error("Mermaid initialization failed:", error);
        }
    }, []);

    return (
        <div className="bg-slate-900 border border-slate-700 p-4 rounded-xl overflow-x-auto">
            <div ref={ref} />
        </div>
    );
}