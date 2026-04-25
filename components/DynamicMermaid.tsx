"use client";

import dynamic from "next/dynamic";

const MermaidDiagram = dynamic(() => import("./MermaidDiagram"), {
  ssr: false
});

export default function DynamicMermaid({ chart, keyword }: { chart: string, keyword?: string }) {
  try {
    return <MermaidDiagram chart={chart} keyword={keyword} />;
  } catch (error) {
    console.error("DynamicMermaid wrapper caught an error:", error);
    return null;
  }
}
