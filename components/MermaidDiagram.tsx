// components/MermaidDiagram.tsx
"use client";

import { useEffect, useRef } from "react";
import mermaid from "mermaid";

export default function MermaidDiagram({ chart, keyword }: { chart: string, keyword?: string }) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!ref.current) return;

        const renderChart = async () => {
            try {
                mermaid.initialize({
                    startOnLoad: false,
                    securityLevel: 'loose',
                    flowchart: {
                        useMaxWidth: true,
                        htmlLabels: true,
                        nodeSpacing: 100,
                        rankSpacing: 120
                    },
                    themeVariables: {
                        fontSize: '16px',
                        fontFamily: 'inherit'
                    }
                });
                
                // Clear previous render
                ref.current!.innerHTML = '';
                const id = `mermaid-chart-${Math.random().toString(36).substring(2, 9)}`;
                
                // Force horizontal rendering
                const horizontalChart = chart.replace(/graph TD/g, "graph LR").replace(/flowchart TD/g, "flowchart LR");
                
                const { svg } = await mermaid.render(id, horizontalChart);
                
                if (ref.current) {
                    ref.current.innerHTML = svg;

                    // Dynamically highlight the keyword in red wherever it appears in the SVG (nodes and arrows)
                    if (keyword) {
                        const searchKeyword = keyword.toLowerCase();
                        // Find all text elements and spans in the SVG
                        const elements = ref.current.querySelectorAll('span, p, div, text, tspan');
                        elements.forEach(el => {
                            if (el.children.length === 0 && el.textContent && el.textContent.toLowerCase().includes(searchKeyword)) {
                                // For SVG <text> or <tspan> elements
                                if (el.tagName.toLowerCase() === 'text' || el.tagName.toLowerCase() === 'tspan') {
                                    el.setAttribute('fill', '#dc2626');
                                    el.setAttribute('font-weight', 'bold');
                                } else {
                                    // For HTML elements inside <foreignObject>
                                    (el as HTMLElement).style.color = '#dc2626';
                                    (el as HTMLElement).style.fontWeight = 'bold';
                                    
                                    // Fix cutoff caused by bolding text (which increases width beyond mermaid's calculation)
                                    let parent = el.parentElement;
                                    while (parent && parent.tagName.toLowerCase() !== 'svg') {
                                        if (parent.tagName.toLowerCase() === 'foreignobject' || parent.classList.contains('label') || parent.classList.contains('edgeLabel')) {
                                            parent.style.overflow = 'visible';
                                        }
                                        parent = parent.parentElement;
                                    }
                                }
                            }
                        });
                    }
                }
            } catch (error) {
                console.error("Mermaid initialization failed:", error);
                if (ref.current) {
                    ref.current.textContent = "Failed to render flowchart. Syntax error.";
                }
            }
        };

        renderChart();
    }, [chart, keyword]);

    return (
        <div className="mermaid overflow-x-auto w-full flex justify-center items-center p-4">
            <div ref={ref} className="[&>svg]:min-w-[600px] [&>svg]:max-w-none" />
        </div>
    );
}