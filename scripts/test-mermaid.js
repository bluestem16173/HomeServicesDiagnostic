const { Client } = require('pg');
const client = new Client({ connectionString: process.env.DATABASE_URL });

function sanitizeId(id) {
  const reserved = ["end", "start", "graph", "subgraph"];
  if (reserved.includes(id.toLowerCase())) {
    return `${id}_node`;
  }
  return id.replace(/[^a-zA-Z0-9_]/g, "_");
}

function buildMermaid(flow, temp, vertical, citySlug) {
  if (!flow || flow.type !== "mermaid") return "";
  let chart = `graph ${flow.direction || "LR"}\n`;
  const nodesToHighlight = [];

  if (flow.nodes) {
    flow.nodes.forEach((n) => { 
      const safeId = sanitizeId(n.id);
      const safeLabel = n.label.replace(/"/g, "'");
      chart += `  ${safeId}["${safeLabel}"]\n`; 
      
      if (vertical && citySlug && citySlug !== "your area") {
        const urlSlug = safeId.replace(/_/g, '-');
        chart += `  click ${safeId} href "/${vertical}/${urlSlug}/${citySlug}"\n`;
      }

      if (temp !== null && temp !== undefined) {
        const lowerLabel = safeLabel.toLowerCase();
        if (vertical === 'hvac') {
          if (temp > 85 && (lowerLabel.includes("refrigerant") || lowerLabel.includes("airflow") || lowerLabel.includes("overload") || lowerLabel.includes("compressor") || lowerLabel.includes("capacitor") || lowerLabel.includes("heat load"))) {
            nodesToHighlight.push(safeId);
          } else if (temp < 50 && (lowerLabel.includes("defrost") || lowerLabel.includes("heat pump") || lowerLabel.includes("freeze") || lowerLabel.includes("coil"))) {
            nodesToHighlight.push(safeId);
          }
        } else if (vertical === 'plumbing') {
          if (temp < 32 && (lowerLabel.includes("pipe") || lowerLabel.includes("freeze") || lowerLabel.includes("burst") || lowerLabel.includes("insulation"))) {
            nodesToHighlight.push(safeId);
          }
        } else if (vertical === 'electrical') {
          // Fake weather code check
          if (lowerLabel.includes("surge") || lowerLabel.includes("moisture")) {
            nodesToHighlight.push(safeId);
          }
        }
      }
    });
  }
  if (flow.edges) {
    flow.edges.forEach((e) => { 
      const from = sanitizeId(e.from);
      const to = sanitizeId(e.to);
      const label = e.label ? `|${e.label.replace(/"/g, "'")}|` : "";
      chart += `  ${from} -->${label} ${to}\n`; 
    });
  }

  if (nodesToHighlight.length > 0) {
    chart += `\n  %% Dynamic Weather Highlighting\n`;
    chart += `  classDef weatherHighlight fill:#fee2e2,stroke:#ef4444,stroke-width:3px,color:#991b1b,stroke-dasharray: 5 5;\n`;
    nodesToHighlight.forEach(id => {
      chart += `  class ${id} weatherHighlight;\n`;
    });
  }
  return chart;
}

async function run() {
  await client.connect();
  const res = await client.query("SELECT content_json FROM pages WHERE slug = '/plumbing/water-heater-leaking/fort-myers-fl'");
  if (res.rows.length) {
    console.log(buildMermaid(res.rows[0].content_json.content.diagnostic_flow, 90, 'plumbing', 'fort-myers-fl'));
  }
  await client.end();
}

run().catch(console.error);
