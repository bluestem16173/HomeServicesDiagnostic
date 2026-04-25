import { query } from '../lib/db';

async function run() {
  const payloads = [
    {
      slug: '/hvac/ac-not-cooling/fort-myers-fl',
      content_json: {
        "seo": {
          "title": "AC Not Cooling Diagnostics | Fort Myers, FL",
          "description": "Central AC blowing warm air in Fort Myers? Follow this technician diagnostic guide to find the root cause, from failed capacitors to refrigerant leaks. Know when to call a pro."
        },
        "content": {
          "field_triage": "If your AC is blowing warm air in Fort Myers heat, this is not something to ignore. Symptoms like the indoor fan running but no cold air, short cycling, or climbing indoor temperatures indicate a failure. Stop forcing the unit to run if you hear a grinding compressor, smell burning wire, or find a block of ice.",
          "diagnostic_flow": [
            "If indoor fan runs but no cold air -> Check outdoor capacitor, contactor, or compressor",
            "If unit cycles on/off rapidly -> Check thermostat, airflow restriction, or high-pressure switch",
            "If no power to outdoor unit -> Check main breaker, outdoor disconnect box, and control wiring"
          ],
          "top_causes": [
            {
              "title": "Failed Dual Run Capacitor",
              "description": "The capacitor provides the torque needed to start the compressor and condenser fan. Without it, the compressor pulls locked rotor amps, overheats, and trips its internal thermal overload. You will hear a humming sound from the outdoor condenser followed by a click. This is the most common field failure in Florida heat."
            },
            {
              "title": "Refrigerant Leak",
              "description": "Central air conditioners are closed, pressurized systems. Refrigerant is not consumed—low charge equals a leak in the evaporator coil, condenser coil, or copper line set. Results in an iced-over indoor coil or an oily residue on copper joints. A sealed residential unit cannot simply be 'topped off' without a permanent leak repair."
            },
            {
              "title": "Dirty Evaporator Coil or Clogged Filter",
              "description": "Restricted airflow prevents proper heat exchange across the indoor coil. The coil temperature drops below freezing, turning condensation into a solid block of ice. A filthy 1-inch filter or crushed return duct causes this. The unit blows weak, slightly cool air before completely freezing up."
            },
            {
              "title": "Failing Condenser Fan Motor",
              "description": "If the outdoor fan stops spinning, heat cannot be rejected from the condenser coil. Head pressure skyrockets rapidly, and a safety switch trips to save the compressor. The top of the outdoor unit will be extremely hot to the touch."
            },
            {
              "title": "Compressor Failure",
              "description": "Mechanical failure of internal valves or electrically shorted windings, often secondary to prolonged airflow restriction, failed capacitors, or severe refrigerant leaks. Draws extreme amperage and instantly trips the breaker, or runs but pumps no differential pressure. Requires a complete outdoor unit or system replacement."
            }
          ],
          "quick_checks": [
            "Verify thermostat settings are on COOL and the setpoint is well below the indoor ambient temperature.",
            "Reset the main AC breaker inside your electrical panel and verify the outdoor disconnect switch is firmly inserted.",
            "Inspect the indoor return air filter and the outdoor condenser unit for visible airflow blockage like debris or overgrown landscaping."
          ],
          "stop_diy": "Stop here if you are untrained in high-voltage and pressurized refrigerant systems. Central AC units operate on 240V AC with dual run capacitors that hold lethal charges. Attempting to charge a pressurized residential air conditioner without EPA certification is illegal and dangerous. Forcing a struggling system to run will cause catastrophic compressor failure.",
          "repair_vs_replace": "If the central AC system is over 12 years old, structural and mechanical degradation is advanced, especially in coastal zones. A capacitor replacement is a fast, low-cost fix. However, replacing a failed compressor or repairing a sealed-system leak often costs as much as a brand new high-efficiency system. What starts as a minor repair can turn into a multi-thousand-dollar failure if ignored.",
          "cta": "The Fort Myers heat load will rapidly destroy a struggling AC system. Call now for same-day HVAC service or request service online to get a licensed tech to your home.",
          "mermaid_chart": "graph TD\n  Start[AC Not Cooling] --> FanCheck{Indoor Fan Running?}\n  FanCheck -- Yes --> Airflow{Weak Airflow?}\n  FanCheck -- No --> PowerCheck{Power to Unit?}\n  Airflow -- Yes --> Filter[Check Filter & Coils]\n  Airflow -- No --> TempDrop{Air is Warm?}\n  TempDrop -- Yes --> CompressorCheck[Check Compressor / Capacitor]\n  TempDrop -- No --> CallPro[Call a Professional]"
        }
      }
    },
    {
      slug: '/plumbing/water-heater-leaking/fort-myers-fl',
      content_json: {
        "seo": {
          "title": "Water Heater Leaking Diagnostics | Fort Myers, FL",
          "description": "Water heater leaking in Fort Myers? Discover the root cause—from failed T&P valves to rusted tanks—and learn when to shut off the water immediately."
        },
        "content": {
          "field_triage": "If your water heater is leaking in your garage or utility closet, water damage escalates by the minute. Determine if it's a fitting leak or a tank rupture before trying to fix it. Turn off the cold water supply valve above the tank immediately if you cannot identify the source.",
          "diagnostic_flow": [
            "If leaking from the top -> Check cold water inlet, hot water outlet, or anode rod port",
            "If leaking from the side pipe -> Check Temperature & Pressure (T&P) relief valve",
            "If leaking from the bottom -> Check drain valve or inner tank structural failure"
          ],
          "top_causes": [
            {
              "title": "Failed T&P Relief Valve",
              "description": "The T&P valve releases water if temperature or pressure exceeds safe limits. If the valve fails or pressure is genuinely too high, it will dump water down the side discharge pipe."
            },
            {
              "title": "Rusted Inner Tank",
              "description": "Hard water eats away the sacrificial anode rod. Once depleted, the water corrodes the steel tank itself, leading to microscopic pinhole leaks that cannot be repaired. This requires full tank replacement."
            },
            {
              "title": "Loose Top Connections",
              "description": "Vibration or thermal expansion can loosen the dielectric nipples on the top of the tank. Water runs down the side of the tank under the insulation, making it look like a tank failure when it's just a fitting."
            },
            {
              "title": "Leaking Drain Valve",
              "description": "The plastic or brass drain valve at the bottom of the tank can fail to close completely after a flush, causing a slow but steady drip."
            }
          ],
          "quick_checks": [
            "Look at the top of the tank to rule out loose inlet/outlet pipes leaking downward.",
            "Check if the water is coming specifically from the T&P discharge pipe—if so, the valve is doing its job or has failed.",
            "Turn off the cold water supply valve above the tank immediately to stop the flow of water."
          ],
          "stop_diy": "Stop here if the tank itself is ruptured or if you smell gas. Water heaters involve 240V electricity or explosive gas, and scalding water. An improper DIY installation can turn a water heater into a literal explosive hazard.",
          "repair_vs_replace": "If the unit is over 8-10 years old and the leak is from the bottom of the tank, the steel is compromised and replacement is the only option. A minor valve repair is cheap, but ignoring a failing tank leads to catastrophic thousands of dollars in water damage.",
          "cta": "A leaking water heater requires immediate action to prevent severe property damage. Call now for priority plumbing service.",
          "mermaid_chart": "graph TD\n  Start[Water Heater Leaking] --> Top{Leaking from Top?}\n  Top -- Yes --> Fittings[Check Inlet/Outlet Fittings]\n  Top -- No --> Side{Leaking from Side Pipe?}\n  Side -- Yes --> TPValve[Check T&P Valve]\n  Side -- No --> Tank[Tank Rupture or Drain Valve]"
        }
      }
    },
    {
      slug: '/electrical/breaker-keeps-tripping/fort-myers-fl',
      content_json: {
        "seo": {
          "title": "Breaker Keeps Tripping Diagnostics | Fort Myers, FL",
          "description": "Circuit breaker keeps tripping in Fort Myers? Learn the difference between overloads, short circuits, and ground faults, and when you need a licensed electrician."
        },
        "content": {
          "field_triage": "A tripping breaker is a critical safety mechanism doing its job to prevent an electrical fire. Never tape a breaker open or force it to stay on. Repeatedly resetting a tripping breaker degrades the contacts and increases fire risk. You must isolate the cause.",
          "diagnostic_flow": [
            "If breaker trips after a few minutes -> Likely an overloaded circuit (too many appliances)",
            "If breaker trips instantly with a loud pop -> Hard short circuit in wiring or device",
            "If breaker trips randomly, especially outside or near water -> Ground fault or moisture issue"
          ],
          "top_causes": [
            {
              "title": "Overloaded Circuit",
              "description": "Running a space heater, microwave, and air fryer on the same 15-amp kitchen or bedroom circuit draws more current than the wire can safely handle, causing the breaker to heat up and trip."
            },
            {
              "title": "Hard Short Circuit",
              "description": "A hot wire is making direct contact with a neutral wire inside an outlet, switch, or appliance. This causes a massive, instantaneous surge of current that violently trips the breaker."
            },
            {
              "title": "Ground Fault",
              "description": "A hot wire touches the ground wire or the metal side of an electrical box. Often caused by moisture infiltration in outdoor outlets or damaged appliance cords."
            },
            {
              "title": "Worn Out Breaker",
              "description": "Breakers wear out over time, especially if they have tripped frequently. The internal bimetallic strip weakens and trips below its rated amperage, causing nuisance tripping."
            }
          ],
          "quick_checks": [
            "Unplug every single device on the dead circuit, then try to reset the breaker. If it holds, plug devices in one by one to find the culprit.",
            "Check the panel for any buzzing sounds or burning smells, which indicate severe arcing.",
            "Ensure you are pushing the breaker handle firmly to the 'OFF' position before switching it back to 'ON'."
          ],
          "stop_diy": "Stop here if the breaker trips instantly and violently when reset, or if you smell burning plastic. Opening an electrical panel exposes you to deadly live bus bars. Never replace a breaker with a higher amperage rating—this will cause the wires in your walls to melt and start a fire.",
          "repair_vs_replace": "Replacing a worn-out breaker or a faulty receptacle is a fast, low-cost repair. However, if your panel is an outdated brand (like Federal Pacific or Zinsco), or if the wiring itself is compromised, a panel upgrade or house rewire may be necessary to protect your home.",
          "cta": "Don't gamble with electrical fires. Get a licensed electrician to properly diagnose your tripping breaker today.",
          "mermaid_chart": "graph TD\n  Start[Breaker Trips] --> Unplug{Unplug All Devices}\n  Unplug --> Reset[Reset Breaker]\n  Reset --> Hold{Does it hold?}\n  Hold -- Yes --> PlugIn[Plug in one by one -> Find Overload]\n  Hold -- No --> Instant{Trips Instantly?}\n  Instant -- Yes --> Short[Short Circuit - Call Pro]\n  Instant -- No --> Worn[Worn Breaker - Call Pro]"
        }
      }
    }
  ];

  for (const page of payloads) {
    try {
      await query(`
        INSERT INTO pages (slug, page_type, status, content_json)
        VALUES ($1, 'city', 'published', $2)
        ON CONFLICT (slug) DO UPDATE SET content_json = $2, status = 'published'
      `, [page.slug, page.content_json]);
      console.log("Successfully seeded high-quality payload for:", page.slug);
    } catch (error) {
      console.error("Error seeding", page.slug, error);
    }
  }
}

run();
