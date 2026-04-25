const { Pool } = require('pg');
const pool = new Pool({ connectionString: 'postgresql://neondb_owner:npg_gjtxze1kum6N@ep-solitary-darkness-anw3z5fo-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require' });

function sanitizeId(id) {
  const reserved = ['end', 'start', 'graph', 'subgraph'];
  if (reserved.includes(id.toLowerCase())) {
    return id + '_node';
  }
  return id.replace(/[^a-zA-Z0-9_]/g, '_');
}

function buildMermaid(flow, temp, vertical) {
  if (!flow || flow.type !== 'mermaid') return '';
  let chart = 'graph ' + (flow.direction || 'LR') + '\n';
  const nodesToHighlight = [];

  if (flow.nodes) {
    flow.nodes.forEach((n) => { 
      const safeId = sanitizeId(n.id);
      const safeLabel = n.label.replace(/"/g, "'");
      chart += '  ' + safeId + '["' + safeLabel + '"]\n'; 
      if (temp !== null && temp !== undefined) {
        const lowerLabel = safeLabel.toLowerCase();
        if (vertical === 'hvac') {
          if (temp > 85 && (lowerLabel.includes('refrigerant') || lowerLabel.includes('airflow') || lowerLabel.includes('overload') || lowerLabel.includes('compressor') || lowerLabel.includes('capacitor') || lowerLabel.includes('heat load'))) {
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
      const label = e.label ? '|' + e.label.replace(/"/g, "'") + '|' : '';
      chart += '  ' + from + ' -->' + label + ' ' + to + '\n'; 
    });
  }

  if (nodesToHighlight.length > 0) {
    chart += '\n  %% Dynamic Weather Highlighting\n';
    chart += '  classDef weatherHighlight fill:#fee2e2,stroke:#ef4444,stroke-width:3px,color:#991b1b,stroke-dasharray: 5 5;\n';
    nodesToHighlight.forEach(id => {
      chart += '  class ' + id + ' weatherHighlight;\n';
    });
  }
  return chart;
}

pool.query("SELECT content_json FROM pages WHERE slug = '/hvac/ac-not-cooling/fort-myers-fl' LIMIT 1").then(res => {
  if (res.rows.length > 0) {
    const content = res.rows[0].content_json.content;
    console.log(buildMermaid(content.diagnostic_flow, 92, 'hvac'));
  } else {
    console.log("No data found");
  }
  process.exit(0);
});
