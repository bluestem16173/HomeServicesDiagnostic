import mermaid from 'mermaid';

const chart = `graph LR
  start_node["Start Diagnosis"]
  click start_node href "/plumbing/start-node/fort-myers-fl"
  water_flow_check["Check Water Flow"]
  click water_flow_check href "/plumbing/water-flow-check/fort-myers-fl"
  pressure_check["Pressure Normal?"]
  click pressure_check href "/plumbing/pressure-check/fort-myers-fl"
  drainage_check["Drainage Speed"]
  click drainage_check href "/plumbing/drainage-check/fort-myers-fl"
  leak_detection["Detect Leaks"]
  click leak_detection href "/plumbing/leak-detection/fort-myers-fl"
  fixture_check["Check Fixtures"]
  click fixture_check href "/plumbing/fixture-check/fort-myers-fl"
  blockage_issue["Blockage Found"]
  click blockage_issue href "/plumbing/blockage-issue/fort-myers-fl"
  pressure_issue["Pressure Problem"]
  click pressure_issue href "/plumbing/pressure-issue/fort-myers-fl"
  final_diagnosis["Diagnose Issue"]
  click final_diagnosis href "/plumbing/final-diagnosis/fort-myers-fl"
  start_node --> water_flow_check
  water_flow_check -->|Yes| pressure_check
  water_flow_check -->|No| leak_detection
  pressure_check -->|Yes| drainage_check
  pressure_check -->|No| pressure_issue
  drainage_check -->|No| fixture_check
  drainage_check -->|Yes| blockage_issue
  leak_detection -->|Leak Found| final_diagnosis
  fixture_check -->|Faulty Fixture| final_diagnosis`;

async function test() {
  try {
    mermaid.initialize({ startOnLoad: false });
    await mermaid.parse(chart);
    console.log("Valid Mermaid syntax!");
  } catch (e) {
    console.error("Syntax Error:", e.message);
  }
}

test();
