"use client";

import dynamic from "next/dynamic";

const MermaidDiagram = dynamic(() => import("./MermaidDiagram"), {
  ssr: false
});

export default function DynamicMermaid({ chart }: { chart: string }) {
  try {
    return <MermaidDiagram chart={chart} />;
  } catch (error) {
    console.error("DynamicMermaid wrapper caught an error:", error);
    return null;
  }
}
