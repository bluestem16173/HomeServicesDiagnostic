import type { MermaidFlowInput } from "@/lib/buildMermaid";

export const FLOW_TYPES = [
  "DRAIN_FLOW",
  "LEAK_FLOW",
  "PRESSURE_FLOW",
  "HIGH_PRESSURE_FLOW",
  "FIXTURE_FLOW",
  "SEWER_FLOW",
  "COOLING_FLOW",
  "AIRFLOW_FLOW",
  "HVAC_ELECTRICAL_FLOW",
  "THERMOSTAT_FLOW",
  "POWER_FLOW",
  "BREAKER_FLOW",
  "OUTLET_FLOW",
  "WIRING_FLOW",
  "POWER_SURGE_FLOW",
] as const;

export type FlowType = (typeof FLOW_TYPES)[number];

const DRAIN_FLOW: MermaidFlowInput = {
  type: "mermaid",
  direction: "LR",
  nodes: [
    { id: "drain_slow", label: "Water Draining Slowly?" },
    { id: "single_fixture", label: "One Fixture Only?" },
    { id: "local_clog", label: "Hair or Debris Blockage" },
    { id: "multiple", label: "Multiple Drains Affected?" },
    { id: "main_clog", label: "Main Line Clog" },
    { id: "backup", label: "Water Backing Up?" },
    { id: "sewer", label: "Sewer Line Issue" },
  ],
  edges: [
    { from: "drain_slow", to: "single_fixture", label: "Yes" },
    { from: "single_fixture", to: "local_clog", label: "Yes" },
    { from: "single_fixture", to: "multiple", label: "No" },
    { from: "multiple", to: "main_clog", label: "Yes" },
    { from: "multiple", to: "backup", label: "No" },
    { from: "backup", to: "sewer", label: "Yes" },
  ],
};

const SEWER_FLOW: MermaidFlowInput = {
  type: "mermaid",
  direction: "LR",
  nodes: [
    { id: "start", label: "Multiple Fixtures Slow?" },
    { id: "backup", label: "Water Backing Up?" },
    { id: "single", label: "Single Drain Only?" },
    { id: "main_line", label: "Main Line Clog" },
    { id: "branch_line", label: "Branch Drain Clog" },
    { id: "trap_clog", label: "Trap or Fixture Clog" },
    { id: "vent_issue", label: "Vent or Slope Issue" },
  ],
  edges: [
    { from: "start", to: "backup", label: "Yes" },
    { from: "start", to: "single", label: "No" },
    { from: "backup", to: "main_line", label: "Yes" },
    { from: "backup", to: "branch_line", label: "No" },
    { from: "single", to: "trap_clog", label: "Yes" },
    { from: "single", to: "vent_issue", label: "No" },
  ],
};

const LEAK_FLOW: MermaidFlowInput = {
  type: "mermaid",
  direction: "LR",
  nodes: [
    { id: "leak_active", label: "Water Actively Leaking?" },
    { id: "location", label: "Where is Water Coming From?" },
    { id: "pipe", label: "Pipe or Joint Leak" },
    { id: "fixture", label: "Fixture or Valve Leak" },
    { id: "hidden", label: "Hidden Leak Behind Wall" },
  ],
  edges: [
    { from: "leak_active", to: "location", label: "Yes" },
    { from: "location", to: "pipe", label: "Pipe" },
    { from: "location", to: "fixture", label: "Fixture" },
    { from: "leak_active", to: "hidden", label: "No visible source" },
  ],
};

const PRESSURE_FLOW: MermaidFlowInput = {
  type: "mermaid",
  direction: "LR",
  nodes: [
    { id: "pressure_low", label: "Water Pressure Low?" },
    { id: "all_fixtures", label: "All Fixtures Affected?" },
    { id: "supply", label: "Supply Line or Regulator Issue" },
    { id: "single_fixture", label: "Single Fixture Only?" },
    { id: "fixture_issue", label: "Fixture or Valve Problem" },
  ],
  edges: [
    { from: "pressure_low", to: "all_fixtures", label: "Yes" },
    { from: "all_fixtures", to: "supply", label: "All" },
    { from: "all_fixtures", to: "single_fixture", label: "One" },
    { from: "single_fixture", to: "fixture_issue", label: "Yes" },
  ],
};

const HIGH_PRESSURE_FLOW: MermaidFlowInput = {
  type: "mermaid",
  direction: "LR",
  nodes: [
    { id: "pressure_high", label: "Water Pressure Too High?" },
    { id: "all_fixtures", label: "All Fixtures Affected?" },
    { id: "regulator", label: "Pressure Regulator Issue" },
    { id: "single_fixture", label: "Single Fixture Only?" },
    { id: "fixture_issue", label: "Fixture Valve or Cartridge Issue" },
  ],
  edges: [
    { from: "pressure_high", to: "all_fixtures", label: "Yes" },
    { from: "all_fixtures", to: "regulator", label: "All" },
    { from: "all_fixtures", to: "single_fixture", label: "One" },
    { from: "single_fixture", to: "fixture_issue", label: "Yes" },
  ],
};

const FIXTURE_FLOW: MermaidFlowInput = {
  type: "mermaid",
  direction: "LR",
  nodes: [
    { id: "start", label: "Single Fixture Failing?" },
    { id: "water", label: "Water Present?" },
    { id: "drain", label: "Drain or Flush Problem?" },
    { id: "supply", label: "Supply Valve or Line" },
    { id: "internal", label: "Internal Fixture Part" },
    { id: "clog", label: "Local Fixture Clog" },
    { id: "branch", label: "Branch Drain Issue" },
  ],
  edges: [
    { from: "start", to: "water", label: "Yes" },
    { from: "start", to: "drain", label: "No" },
    { from: "water", to: "internal", label: "Yes" },
    { from: "water", to: "supply", label: "No" },
    { from: "drain", to: "clog", label: "Yes" },
    { from: "drain", to: "internal", label: "No" },
  ],
};

const BREAKER_FLOW: MermaidFlowInput = {
  type: "mermaid",
  direction: "LR",
  nodes: [
    { id: "breaker_trip", label: "Breaker Tripping?" },
    { id: "immediate_trip", label: "Trips Immediately?" },
    { id: "short_circuit", label: "Short Circuit" },
    { id: "under_load", label: "Trips Under Load?" },
    { id: "overload", label: "Circuit Overload" },
    { id: "wiring_issue", label: "Wiring Fault" },
  ],
  edges: [
    { from: "breaker_trip", to: "immediate_trip", label: "Yes" },
    { from: "immediate_trip", to: "short_circuit", label: "Yes" },
    { from: "immediate_trip", to: "under_load", label: "No" },
    { from: "under_load", to: "overload", label: "Yes" },
    { from: "under_load", to: "wiring_issue", label: "No" },
  ],
};

const AIRFLOW_FLOW: MermaidFlowInput = {
  type: "mermaid",
  direction: "LR",
  nodes: [
    { id: "air_weak", label: "Airflow Weak?" },
    { id: "all_rooms", label: "All Rooms Affected?" },
    { id: "filter", label: "Dirty Filter or Blocked Intake" },
    { id: "some_rooms", label: "Only Some Rooms?" },
    { id: "duct", label: "Duct Blockage or Leak" },
    { id: "fan", label: "Blower Fan Issue" },
  ],
  edges: [
    { from: "air_weak", to: "all_rooms", label: "Yes" },
    { from: "all_rooms", to: "filter", label: "All" },
    { from: "all_rooms", to: "some_rooms", label: "Some" },
    { from: "some_rooms", to: "duct", label: "Yes" },
    { from: "some_rooms", to: "fan", label: "No" },
  ],
};

const HVAC_ELECTRICAL_FLOW: MermaidFlowInput = {
  type: "mermaid",
  direction: "LR",
  nodes: [
    { id: "unit_on", label: "AC Turning On?" },
    { id: "thermostat", label: "Thermostat Responding?" },
    { id: "control_issue", label: "Thermostat or Control Board Issue" },
    { id: "breaker", label: "Breaker Tripping?" },
    { id: "breaker_issue", label: "Overload or Electrical Fault" },
    { id: "capacitor", label: "Capacitor or Relay Failure" },
  ],
  edges: [
    { from: "unit_on", to: "thermostat", label: "No" },
    { from: "unit_on", to: "breaker", label: "Yes but fails" },
    { from: "thermostat", to: "control_issue", label: "No" },
    { from: "breaker", to: "breaker_issue", label: "Yes" },
    { from: "breaker", to: "capacitor", label: "No" },
  ],
};

const THERMOSTAT_FLOW: MermaidFlowInput = {
  type: "mermaid",
  direction: "LR",
  nodes: [
    { id: "start", label: "Display Blank?" },
    { id: "power", label: "Breaker or Fuse OK?" },
    { id: "call", label: "System Responds to Call?" },
    { id: "low_voltage", label: "Low-Voltage Power Issue" },
    { id: "settings", label: "Settings or Schedule Issue" },
    { id: "wiring", label: "Thermostat Wiring Fault" },
    { id: "equipment", label: "Equipment Control Fault" },
  ],
  edges: [
    { from: "start", to: "power", label: "Yes" },
    { from: "start", to: "call", label: "No" },
    { from: "power", to: "low_voltage", label: "No" },
    { from: "power", to: "settings", label: "Yes" },
    { from: "call", to: "equipment", label: "No" },
    { from: "call", to: "wiring", label: "Yes" },
  ],
};

const COOLING_FLOW: MermaidFlowInput = {
  type: "mermaid",
  direction: "LR",
  nodes: [
    { id: "system_on", label: "System Running?" },
    { id: "no_power", label: "Power or Thermostat Issue" },
    { id: "airflow", label: "Airflow Strong from Vents?" },
    { id: "airflow_issue", label: "Filter or Blower Restriction" },
    { id: "cooling", label: "Air Actually Cold?" },
    { id: "refrigerant", label: "Low Refrigerant or Leak" },
    { id: "outdoor", label: "Outdoor Unit Running?" },
    { id: "compressor", label: "Compressor or Capacitor Failure" },
    { id: "control", label: "Thermostat or Sensor Issue" },
  ],
  edges: [
    { from: "system_on", to: "no_power", label: "No" },
    { from: "system_on", to: "airflow", label: "Yes" },
    { from: "airflow", to: "airflow_issue", label: "Weak" },
    { from: "airflow", to: "cooling", label: "Strong" },
    { from: "cooling", to: "refrigerant", label: "Not Cold" },
    { from: "cooling", to: "outdoor", label: "Cold Air" },
    { from: "outdoor", to: "compressor", label: "No" },
    { from: "outdoor", to: "control", label: "Yes but inconsistent" },
  ],
};

const POWER_FLOW: MermaidFlowInput = {
  type: "mermaid",
  direction: "LR",
  nodes: [
    { id: "start", label: "Whole Home Out?" },
    { id: "neighbors", label: "Neighbors Affected?" },
    { id: "room", label: "One Room Only?" },
    { id: "utility", label: "Utility Outage" },
    { id: "main", label: "Main Panel Issue" },
    { id: "circuit", label: "Circuit Fault" },
    { id: "device", label: "Device or GFCI Trip" },
  ],
  edges: [
    { from: "start", to: "neighbors", label: "Yes" },
    { from: "start", to: "room", label: "No" },
    { from: "neighbors", to: "utility", label: "Yes" },
    { from: "neighbors", to: "main", label: "No" },
    { from: "room", to: "circuit", label: "Yes" },
    { from: "room", to: "device", label: "No" },
  ],
};

const OUTLET_FLOW: MermaidFlowInput = {
  type: "mermaid",
  direction: "LR",
  nodes: [
    { id: "outlet_working", label: "Outlet Working?" },
    { id: "multiple_outlets", label: "Multiple Outlets Affected?" },
    { id: "circuit_issue", label: "Circuit Issue" },
    { id: "gfci", label: "GFCI Tripped?" },
    { id: "gfci_issue", label: "GFCI Reset Required" },
    { id: "device_fault", label: "Outlet or Device Failure" },
  ],
  edges: [
    { from: "outlet_working", to: "multiple_outlets", label: "No" },
    { from: "multiple_outlets", to: "circuit_issue", label: "Yes" },
    { from: "multiple_outlets", to: "gfci", label: "No" },
    { from: "gfci", to: "gfci_issue", label: "Yes" },
    { from: "gfci", to: "device_fault", label: "No" },
  ],
};

const WIRING_FLOW: MermaidFlowInput = {
  type: "mermaid",
  direction: "LR",
  nodes: [
    { id: "start", label: "Burning Smell or Sparks?" },
    { id: "heat", label: "Device Hot to Touch?" },
    { id: "breaker", label: "Breaker Also Trips?" },
    { id: "urgent", label: "Stop Use Immediately" },
    { id: "loose", label: "Loose Connection or Arc" },
    { id: "short", label: "Short Circuit Fault" },
    { id: "device", label: "Failed Switch or Outlet" },
  ],
  edges: [
    { from: "start", to: "urgent", label: "Yes" },
    { from: "start", to: "heat", label: "No" },
    { from: "heat", to: "loose", label: "Yes" },
    { from: "heat", to: "breaker", label: "No" },
    { from: "breaker", to: "short", label: "Yes" },
    { from: "breaker", to: "device", label: "No" },
  ],
};

const POWER_SURGE_FLOW: MermaidFlowInput = {
  type: "mermaid",
  direction: "LR",
  nodes: [
    { id: "surge_event", label: "Power Surge Occurred?" },
    { id: "whole_home", label: "Affects Whole Home?" },
    { id: "panel_issue", label: "Panel or Supply Issue" },
    { id: "breaker_trip", label: "Breaker Tripping?" },
    { id: "circuit_overload", label: "Circuit Overload" },
    { id: "outlet_damage", label: "Outlet or Device Damage" },
    { id: "wiring_damage", label: "Wiring or Surge Damage" },
  ],
  edges: [
    { from: "surge_event", to: "whole_home", label: "Yes" },
    { from: "whole_home", to: "panel_issue", label: "Yes" },
    { from: "whole_home", to: "breaker_trip", label: "No" },
    { from: "breaker_trip", to: "circuit_overload", label: "Yes" },
    { from: "breaker_trip", to: "outlet_damage", label: "No" },
    { from: "outlet_damage", to: "wiring_damage", label: "Damaged" },
  ],
};

const DEFAULT_FLOW: MermaidFlowInput = {
  type: "mermaid",
  direction: "LR",
  nodes: [
    { id: "start", label: "Issue Active Now?" },
    { id: "scope", label: "Affects Whole System?" },
    { id: "safety", label: "Safety Signs Present?" },
    { id: "urgent", label: "Urgent Safety Check" },
    { id: "system", label: "System-Level Fault" },
    { id: "local", label: "Local Component Fault" },
    { id: "monitor", label: "Monitor and Retest" },
  ],
  edges: [
    { from: "start", to: "safety", label: "Yes" },
    { from: "start", to: "monitor", label: "No" },
    { from: "safety", to: "urgent", label: "Yes" },
    { from: "safety", to: "scope", label: "No" },
    { from: "scope", to: "system", label: "Yes" },
    { from: "scope", to: "local", label: "No" },
  ],
};

export const FLOWS: Record<FlowType, MermaidFlowInput> = {
  DRAIN_FLOW,
  LEAK_FLOW,
  PRESSURE_FLOW,
  HIGH_PRESSURE_FLOW,
  FIXTURE_FLOW,
  SEWER_FLOW,
  COOLING_FLOW,
  AIRFLOW_FLOW,
  HVAC_ELECTRICAL_FLOW,
  THERMOSTAT_FLOW,
  POWER_FLOW,
  BREAKER_FLOW,
  OUTLET_FLOW,
  WIRING_FLOW,
  POWER_SURGE_FLOW,
};

export function getFlowTypeForSlug(slug: string): FlowType {
  if (
    slug.includes("clogged-drain") ||
    slug.includes("drain-clogged") ||
    slug.includes("slow-drain") ||
    slug.includes("shower-not-draining")
  ) {
    return "DRAIN_FLOW";
  }

  if (slug.includes("sewer-backup")) {
    return "SEWER_FLOW";
  }

  if (slug.includes("pipe-leak") || slug.includes("water-heater-leaking")) {
    return "LEAK_FLOW";
  }

  if (slug.includes("high-water-pressure")) {
    return "HIGH_PRESSURE_FLOW";
  }

  if (slug.includes("low-water-pressure")) {
    return "PRESSURE_FLOW";
  }

  if (
    slug.includes("faucet") ||
    slug.includes("toilet") ||
    slug.includes("disposal")
  ) {
    return "FIXTURE_FLOW";
  }

  if (slug.includes("ac-not-cooling")) {
    return "COOLING_FLOW";
  }

  if (slug.includes("weak-airflow") || slug.includes("weak-airflow-from-vents")) {
    return "AIRFLOW_FLOW";
  }

  if (slug.includes("ac-wont-turn-on") || slug.includes("ac-not-turning-on")) {
    return "HVAC_ELECTRICAL_FLOW";
  }

  if (slug.includes("thermostat")) {
    return "THERMOSTAT_FLOW";
  }

  const FLOW_TYPE_MAP: Record<string, FlowType> = {
    "power-surges": "POWER_SURGE_FLOW",
    "breaker-keeps-tripping": "BREAKER_FLOW",
    "outlets-not-working": "OUTLET_FLOW",
    "gfci-wont-reset": "OUTLET_FLOW",
    "sparks-from-outlet": "OUTLET_FLOW",
    "main-panel-buzzing": "WIRING_FLOW",
  };

  for (const [symptom, flowType] of Object.entries(FLOW_TYPE_MAP)) {
    if (slug.includes(symptom)) return flowType;
  }

  if (slug.includes("breaker-tripping")) {
    return "BREAKER_FLOW";
  }

  if (slug.includes("outlets-not-working") || slug.includes("outlet-not-working")) {
    return "OUTLET_FLOW";
  }

  if (slug.includes("power-outage")) {
    return "POWER_FLOW";
  }

  if (slug.includes("sparks") || slug.includes("burning")) {
    return "WIRING_FLOW";
  }

  if (slug.includes("surge") || slug.includes("storm")) {
    return "POWER_SURGE_FLOW";
  }

  if (slug.includes("/hvac/")) {
    return "HVAC_ELECTRICAL_FLOW";
  }

  if (slug.includes("/electrical/")) {
    return "POWER_FLOW";
  }

  return "FIXTURE_FLOW";
}

export function getFlowForSlug(slug: string) {
  return FLOWS[getFlowTypeForSlug(slug)] ?? DEFAULT_FLOW;
}
