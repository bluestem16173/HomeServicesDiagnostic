import { query } from '../lib/db';

async function run() {
  const slug = '/hvac/ac-not-cooling/fort-myers-fl';
  
  const content_json = {
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
  };

  try {
    await query(`
      INSERT INTO pages (slug, page_type, status, content_json)
      VALUES ($1, 'city', 'published', $2)
      ON CONFLICT (slug) DO UPDATE SET content_json = $2, status = 'published'
    `, [slug, content_json]);
    console.log("Successfully seeded", slug);
  } catch (error) {
    console.error("Error seeding:", error);
  }
}

run();
