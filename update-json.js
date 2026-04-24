const { Pool } = require('pg');


const content = {
  seo: {
    title: "Breaker Keeps Tripping in Fort Myers, FL | Expert Electrical Diagnostics",
    description: "Is your circuit breaker constantly tripping in Fort Myers? Discover the root causes—from short circuits to overloaded panels—and learn when it's time to call a professional electrician."
  },
  content: {
    field_triage: "When a breaker keeps tripping, it’s doing exactly what it was engineered to do: interrupting the flow of electricity to prevent overheating, melted insulation, and potential electrical fires. A breaker that trips once might be a fluke; a breaker that trips repeatedly immediately after being reset is a hard fault. In Fort Myers, where heavy A/C loads and high humidity put constant stress on residential panels, treating a tripping breaker as a nuisance rather than a symptom is dangerous. You are likely dealing with an overloaded circuit, a dead short, or a ground fault. Do not repeatedly force the breaker on—this degrades the breaker's internal bimetallic strip and increases the risk of a catastrophic arc.",
    diagnostic_flow: "If the breaker trips immediately upon reset (with a loud 'snap') → You have a dead short. A hot wire is touching a neutral or ground. Do not reset it again.\n\nIf the breaker holds for a few minutes or hours, then trips → You likely have an overloaded circuit or a weak/failing breaker. Check what appliances are running simultaneously on that circuit.\n\nIf the tripped breaker is an AFCI or GFCI (has a 'Test' button) → It may be detecting an arc fault (sparking in the walls/outlets) or a ground fault (current leaking to ground, often due to moisture in outdoor or bathroom receptacles).\n\nIf the breaker feels physically hot to the touch or smells like ozone → Stop immediately. You have severe resistance heating at the bus bar connection. Call a licensed electrician.",
    top_causes: [
      "Circuit Overload: Drawing more amperage than the breaker is rated for (e.g., running a space heater, microwave, and high-draw appliances on a standard 15A or 20A circuit).",
      "Short Circuit: A hot wire is making direct contact with a neutral wire inside an outlet, switch, or appliance cord, causing a massive, instantaneous spike in current.",
      "Ground Fault: A hot wire is touching the ground wire or the side of a metal box. Common in Fort Myers outdoor receptacles exposed to rain and humidity.",
      "Failing Breaker or Bad Bus Connection: Over time, the internal spring mechanism weakens, or the connection to the panel's bus bar becomes loose and pitted, creating high resistance and heat.",
      "Arc Fault: Loose wiring connections in wall receptacles creating microscopic sparks that AFCI breakers detect and trip to prevent fires."
    ],
    quick_checks: [
      "Unplug Everything: Turn off and unplug all devices on the affected circuit. Reset the breaker. If it holds, plug devices back in one by one until it trips to identify the overloaded/faulty appliance.",
      "Feel the Panel (Carefully): Place the back of your hand against the closed metal panel door. If it feels unusually warm or you smell burning plastic/ozone, stop immediately.",
      "Check for GFCI Resets: Check bathrooms, kitchens, and garage/outdoor outlets. A tripped GFCI outlet downstream can sometimes interact with the panel breaker.",
      "Inspect Cords: Look for frayed, chewed, or melted appliance cords that might be causing a localized short."
    ],
    stop_diy: "STOP DIY IF: The breaker trips instantly with a loud bang or spark when you try to reset it. Do not attempt to hold the breaker handle in the 'ON' position. Stop immediately if you notice a burning plastic smell, see scorching around your outlets, or if the breaker feels hot to the touch. Opening the main electrical panel to inspect bus bars or measure voltage (120V/240V) exposes you to lethal amperage and arc flash hazards. Only a licensed electrician should remove the deadfront cover.",
    repair_vs_replace: "Repair: Replacing a standard 15A/20A single-pole breaker is typically a quick and inexpensive repair ($150-$250) if the breaker itself has mechanically failed.\n\nReplace/Upgrade: If the tripping is caused by a Federal Pacific (FPE) or Zinsco panel, these are known fire hazards that fail to trip under overload conditions and require immediate full panel replacement ($2,000-$4,000). If your home has a 100-amp service but you are running modern appliances (EV chargers, large A/C units), you will likely need a heavy-up service upgrade to 200 amps. If the bus bar is pitted or burned where the breaker connects, the entire panel must be replaced.",
    cta: "Don't risk an electrical fire by ignoring a tripping breaker. Our licensed Fort Myers electricians have the diagnostic tools to safely locate shorts, overloads, and panel issues. Call us today for immediate, code-compliant electrical service."
  }
};

async function run() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const slug = '/electrical/breaker-keeps-tripping/fort-myers-fl';
  
  try {
    const res = await pool.query(
      "UPDATE pages SET content_json = $1 WHERE slug = $2 RETURNING *",
      [content, slug]
    );
    console.log("Database updated successfully, rows affected:", res.rowCount);
  } catch (err) {
    console.error("Failed to update database:", err);
  } finally {
    await pool.end();
  }
}

run();
