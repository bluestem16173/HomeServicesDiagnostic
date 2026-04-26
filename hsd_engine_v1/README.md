# HSD Engine v1

## Components

- **Prompt Engine**: \`prompts/generateHsdPage.ts\`
- **Renderer**: Next.js dynamic route (\`renderer/page.tsx\`)
- **Mermaid**: Flow visualization component (\`components/MermaidDiagram.tsx\`)
- **Schema**: JSON validation schema (\`schema/hsd_v3_graphic.schema.json\`)

## Contract

- \`schema_version\` must equal: \`hsd_v3_graphic\`
- \`diagnostic_flow\` must contain ≥ 7 nodes
- \`top_causes\` must contain ≥ 5 entries

## Rules

- No fallback rendering
- No generic content
- No schema drift
- Strict environmental logic enforcement

## How to Test

Run the test harness to verify the prompt constraints and Mermaid outputs are still executing properly:

\`\`\`bash
npx tsx hsd_engine_v1/test_harness.ts
\`\`\`
