const { Pool } = require('pg');

const pages = [
  {
    slug: '/hvac/ac-not-cooling/fort-myers-fl',
    title: 'AC Not Cooling Diagnostics - Let’s Find the Cause.',
    description: 'Expert diagnostic guide for AC not cooling in Fort Myers. We help you find the cause fast.',
    content: {
      field_triage: "When your AC is blowing warm air, the system still is not cooling despite moving air. If the fan is running but no cold air comes out, you have a mechanical or electrical failure, not a thermostat issue. In the Fort Myers heat, do not ignore this—forcing a struggling system to run drastically increases the risk of complete compressor failure.",
      top_causes: [
        {
          title: "Capacitor Failure",
          description: "Mechanism: The dual-run capacitor fails to deliver the high-voltage jolt needed to start the compressor or fan motor. Symptoms: You may hear a humming sound from the outside unit, but the fan won't spin. Risk if ignored: Continuous starting attempts will overheat and destroy the compressor windings."
        },
        {
          title: "Refrigerant Leak",
          description: "Mechanism: Refrigerant is not consumed. If the system is low on charge, low charge equals a leak in the sealed copper lines or coils. Symptoms: Ice buildup on the evaporator coil, hissing sounds, or warm air at the vents. Risk if ignored: Running a system with a leak will burn out the compressor due to lack of cooling return gas."
        },
        {
          title: "Airflow Restriction",
          description: "Mechanism: A severely clogged filter or blocked return grille prevents sufficient air from passing over the indoor coil. Symptoms: Weak airflow at the vents and a coil that rapidly freezes over into a block of ice. Risk if ignored: The frozen coil will eventually cause liquid refrigerant to slug back to the compressor, destroying it."
        },
        {
          title: "Condenser Fan Issue",
          description: "Mechanism: The outdoor fan motor burns out or its bearings seize, preventing the system from rejecting heat. Symptoms: The outdoor unit gets dangerously hot and the AC blows strictly warm air. Risk if ignored: The compressor will trip on its thermal overload and eventually fail permanently."
        },
        {
          title: "Electrical/Voltage Issue",
          description: "Mechanism: Burnt contactors, loose wiring, or voltage drops prevent the 208–230V power from properly engaging the outdoor unit. Symptoms: Clicking noises from the outside unit with no startup. Risk if ignored: Arcing at the contactor can cause fires or destroy connected components."
        }
      ],
      diagnostic_flow: [
        "IF airflow is weak at registers → THEN check filter, blower motor, and coil face for ice or debris.",
        "IF airflow is strong but air is warm → THEN verify outdoor unit is running (both fan and compressor).",
        "IF outdoor unit is completely silent → THEN check the breaker, disconnect switch, and thermostat wiring.",
        "IF outdoor fan runs but compressor does not → THEN suspect a failed capacitor or hard-start issue."
      ],
      quick_checks: [
        "Verify thermostat is set to 'Cool' and the setpoint is below room temperature.",
        "Check the main electrical panel to ensure the AC breaker hasn't tripped.",
        "Inspect the air filter—if it's completely coated in dust, replace it immediately to restore airflow.",
        "Measure the temperature split at the vents: a healthy system should have a 15–20°F difference between return and supply air."
      ],
      stop_diy: "Stop here if you lack training. Stop here if you must open panels exposing 208–230V circuits—the electrical shock risk is lethal. Attempting to charge a pressurized system without EPA certification carries severe legal penalties. Forcing a struggling system to run drastically increases system damage risk.",
      repair_vs_replace: "If the system is over the 10–12+ year threshold, structural degradation is advanced. While a capacitor is a fast $200 repair, replacing a failed compressor or repairing a sealed-system leak often costs as much as a new unit. What starts as a small repair can turn into a multi-thousand-dollar failure if ignored.",
      cta: "Fort Myers HVAC problems get worse fast—get help today",
      mermaid_chart: "graph TD\n  A[Warm Air at Vents] --> B{Is Outdoor Unit Running?}\n  B -- Yes --> C[Check Refrigerant & Compressor]\n  B -- No --> D[Check Breaker & Capacitor]\n  C --> E[Call HVAC Pro]\n  D --> E"
    }
  },
  {
    slug: '/electrical/breaker-keeps-tripping/fort-myers-fl',
    title: 'Breaker Keeps Tripping Diagnostics — Let’s Find the Cause.',
    description: 'Expert diagnostic guide for breakers constantly tripping in Fort Myers.',
    content: {
      field_triage: "When a breaker keeps tripping, your electrical system still is not functioning safely. This is not a nuisance—it is a critical safety mechanism. If the breaker snaps back immediately or after a few minutes of load, you have a dead short or a severe overload. Do not ignore this; resetting a tripping breaker repeatedly is a massive fire hazard in Fort Myers homes.",
      top_causes: [
        {
          title: "Dead Short Circuit",
          description: "Mechanism: A hot wire is making direct contact with a neutral wire or grounded metal box, causing a massive amperage spike. Symptoms: The breaker trips instantly with a loud 'pop' as soon as it is reset. Risk if ignored: Extreme fire hazard and melted wiring inside your walls."
        },
        {
          title: "Overloaded Circuit",
          description: "Mechanism: Too many high-draw appliances (space heaters, ACs, microwaves) are pulling more amperage than the breaker is rated for (e.g., 25 amps on a 20-amp breaker). Symptoms: The breaker trips after a few minutes of heavy use. Risk if ignored: Insulation degradation leading to a permanent short."
        },
        {
          title: "Ground Fault",
          description: "Mechanism: A hot wire touches a grounding path or water infiltrates an outlet (common in Florida kitchens and outdoor receptacles). Symptoms: Tripping specifically during rainstorms or when using water near appliances. Risk if ignored: Lethal electrical shock hazard."
        },
        {
          title: "Failed Breaker",
          description: "Mechanism: The internal bimetallic strip or electromagnet in the breaker has weakened over years of use. Symptoms: The breaker feels loose, spongy, or trips even when no load is connected. Risk if ignored: A weak breaker may fail to trip during a real emergency, destroying appliances."
        }
      ],
      diagnostic_flow: [
        "IF breaker trips immediately upon reset → THEN you have a dead short circuit. Stop immediately.",
        "IF breaker trips after 10 minutes of appliance use → THEN unplug heavy loads and re-test for an overload.",
        "IF breaker trips only when it rains → THEN inspect exterior GFCIs and outdoor lighting for water intrusion.",
        "IF breaker is spongy and won't reset at all → THEN the breaker itself has mechanically failed."
      ],
      quick_checks: [
        "Unplug all devices from the affected circuit to rule out a faulty appliance.",
        "Check for a burnt smell or scorch marks around outlets and switches.",
        "Verify if the tripped breaker is a standard breaker, AFCI, or GFCI, as this changes the diagnostic path.",
        "Measure the voltage at the panel if trained; verify the incoming supply is a stable 120V per leg."
      ],
      stop_diy: "Stop here if you are not experienced. Stop here if you must open the main breaker panel—the exposed bus bars carry lethal 240V amperage. The electrical shock risk is severe. Forcing a breaker to stay on drastically increases the system damage risk and fire probability.",
      repair_vs_replace: "A faulty appliance is an easy fix, but if your home’s electrical panel is at the 10–12+ year threshold or is an outdated brand (like Federal Pacific), panel replacement is critical. What starts as a small repair can turn into a multi-thousand-dollar failure if ignored.",
      cta: "Fort Myers electrical problems get worse fast—get help today",
      mermaid_chart: "graph TD\n  A[Breaker Trips] --> B{When does it trip?}\n  B -- Instantly --> C[Short Circuit - Stop DIY]\n  B -- After 10 mins --> D[Overload - Unplug Devices]\n  C --> E[Call Electrician]\n  D --> E"
    }
  },
  {
    slug: '/plumbing/no-hot-water/fort-myers-fl',
    title: 'No Hot Water Diagnostics — Let’s Find the Cause.',
    description: 'Expert diagnostic guide for lack of hot water in Fort Myers.',
    content: {
      field_triage: "When you have no hot water, your plumbing system still is not generating or delivering heat. Whether you have an electric tank, gas heater, or tankless system, if the water is flowing cold, a critical heating or control component has failed. Do not ignore this—especially if you notice pooling water, as a failing tank can flood your Fort Myers home.",
      top_causes: [
        {
          title: "Burnt Heating Element (Electric)",
          description: "Mechanism: The upper or lower 4500W heating element has burned out or shorted to the tank casing due to sediment buildup. Symptoms: Lukewarm water or absolutely no hot water at all. Risk if ignored: The remaining element will overwork and burn out, leaving you completely without hot water."
        },
        {
          title: "Failed Thermostat",
          description: "Mechanism: The temperature control sensors fail to read the water temperature correctly, failing to send voltage to the elements or gas valve. Symptoms: Water is either freezing cold or dangerously scalding hot. Risk if ignored: Scalding risk for family members or a burst tank from over-pressurization."
        },
        {
          title: "Extinguished Pilot Light / Bad Thermocouple (Gas)",
          description: "Mechanism: The thermocouple fails to sense the pilot flame, shutting the gas valve for safety. Symptoms: No hot water and no visible flame in the burner chamber. Risk if ignored: Gas buildup hazard if safety valves are tampered with."
        },
        {
          title: "Sediment Accumulation",
          description: "Mechanism: Hard water minerals calcify at the bottom of the tank, creating an insulating barrier between the heat source and the water. Symptoms: Popping or rumbling noises from the tank and reduced hot water capacity. Risk if ignored: Overheating of the tank bottom, leading to a catastrophic tank rupture."
        }
      ],
      diagnostic_flow: [
        "IF it is an electric heater → THEN check the main breaker panel for a tripped 240V breaker.",
        "IF it is a gas heater → THEN check if the pilot light is lit and the gas supply valve is open.",
        "IF water is leaking from the base of the tank → THEN turn off the water supply immediately; the tank has breached.",
        "IF water is lukewarm but not hot → THEN suspect a failed lower heating element or a broken dip tube."
      ],
      quick_checks: [
        "Check the electrical panel to ensure the dedicated 30-amp water heater breaker is on.",
        "Press the red reset button on the upper thermostat (for electric heaters) to see if the high-limit switch tripped.",
        "Inspect the TPR (Temperature & Pressure Relief) valve for active leaking or hissing.",
        "Verify the thermostat is set between 120°F and 130°F to prevent scalding while ensuring hot showers."
      ],
      stop_diy: "Stop here if you are unsure. Stop here if you must test live 240V thermostat wires—the electrical shock risk is lethal. If working with gas, an incorrect repair carries an explosion risk. Altering pressure relief valves creates immense system damage risk and explosion potential.",
      repair_vs_replace: "Replacing an element or thermocouple is inexpensive. However, if the tank is past the 10–12+ year threshold and shows rust or bottom leaking, you must replace the entire unit. What starts as a small repair can turn into a multi-thousand-dollar failure if ignored.",
      cta: "Fort Myers plumbing problems get worse fast—get help today",
      mermaid_chart: "graph TD\n  A[No Hot Water] --> B{Gas or Electric?}\n  B -- Electric --> C[Check Breaker & Elements]\n  B -- Gas --> D[Check Pilot & Gas Valve]\n  C --> E[Call Plumber]\n  D --> E"
    }
  }
];

async function run() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  try {
    for (const page of pages) {
      // Check if page exists
      const res = await pool.query("SELECT id FROM pages WHERE slug = $1", [page.slug]);
      
      const payload = {
        seo: {
          title: page.title,
          description: page.description
        },
        content: page.content
      };

      if (res.rows.length > 0) {
        await pool.query(
          "UPDATE pages SET content_json = $1 WHERE slug = $2",
          [payload, page.slug]
        );
        console.log(`Updated ${page.slug}`);
      } else {
        await pool.query(
          "INSERT INTO pages (slug, content_json) VALUES ($1, $2)",
          [page.slug, payload]
        );
        console.log(`Inserted ${page.slug}`);
      }
    }
    console.log("All pages processed successfully!");
  } catch (err) {
    console.error("Database error:", err);
  } finally {
    await pool.end();
  }
}

run();
