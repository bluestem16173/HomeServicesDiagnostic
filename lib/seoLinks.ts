export const SITE_URL = "https://homeservicediagnostics.com";

export const TRADE_LABELS: Record<string, string> = {
  hvac: "HVAC",
  plumbing: "Plumbing",
  electrical: "Electrical",
};

export const RELATED_SYMPTOMS: Record<string, Record<string, string[]>> = {
  hvac: {
    "ac-not-cooling": ["ac-blowing-warm-air", "ac-not-turning-on", "ac-running-constantly"],
    "ac-blowing-warm-air": ["ac-not-cooling", "ac-freezing-up", "high-electric-bill"],
    "ac-not-turning-on": ["ac-not-cooling", "thermostat-not-working", "outside-unit-not-running"],
    "ac-running-constantly": ["high-electric-bill-ac", "thermostat-not-working", "ac-not-cooling"],
    "ac-freezing-up": ["weak-airflow-from-vents", "ac-not-cooling", "ac-leaking-water"],
    "ac-leaking-water": ["ac-freezing-up", "weak-airflow-from-vents", "ac-not-cooling"],
    "thermostat-not-working": ["ac-not-turning-on", "ac-running-constantly", "ac-not-cooling"],
    "high-electric-bill": ["ac-running-constantly", "ac-not-cooling", "ac-blowing-warm-air"],
    "high-electric-bill-ac": ["ac-running-constantly", "ac-not-cooling", "ac-blowing-warm-air"],
  },
  plumbing: {
    "water-heater-leaking": ["water-heater-not-heating", "no-hot-water", "pipe-leak"],
    "water-heater-not-heating": ["no-hot-water", "water-heater-leaking", "low-water-pressure"],
    "no-hot-water": ["water-heater-not-heating", "water-heater-leaking", "low-water-pressure"],
    "low-water-pressure": ["high-water-pressure", "pipe-leak", "water-heater-not-heating"],
    "clogged-drain": ["slow-drain", "drain-clogged", "shower-not-draining"],
    "drain-clogged": ["slow-drain", "clogged-drain", "shower-drain-clogged"],
    "slow-drain": ["clogged-drain", "drain-clogged", "sewer-smell"],
    "toilet-wont-flush": ["toilet-overflowing", "running-toilet", "toilet-keeps-running"],
    "running-toilet": ["toilet-keeps-running", "toilet-wont-flush", "toilet-overflowing"],
  },
  electrical: {
    "breaker-tripping": ["breaker-keeps-tripping", "circuit-overload", "outlets-not-working"],
    "breaker-keeps-tripping": ["breaker-tripping", "circuit-overload", "power-outage-one-room"],
    "outlet-not-working": ["outlets-not-working", "gfci-wont-reset", "breaker-tripping"],
    "outlets-not-working": ["outlet-not-working", "gfci-wont-reset", "power-outage-one-room"],
    "gfci-wont-reset": ["outlets-not-working", "breaker-tripping", "sparks-from-outlet"],
    "lights-flickering": ["power-surges", "main-panel-buzzing", "breaker-tripping"],
    "main-panel-buzzing": ["panel-buzzing", "breaker-tripping", "power-surges"],
    "panel-buzzing": ["main-panel-buzzing", "breaker-tripping", "power-surges"],
  },
};

export function normalizeSlug(slug: string) {
  return slug.startsWith("/") ? slug : `/${slug}`;
}

export function titleCase(value: string) {
  return value
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .replace(/\bAc\b/g, "AC")
    .replace(/\bHvac\b/g, "HVAC")
    .replace(/\bGfci\b/g, "GFCI");
}

export function formatTrade(trade: string) {
  return TRADE_LABELS[trade] ?? titleCase(trade);
}

export function formatSymptom(symptom: string) {
  return titleCase(symptom);
}

export function formatCity(citySlug: string) {
  return titleCase(citySlug).replace(/\bFl\b/g, "FL").replace(/ FL$/, ", FL");
}

export function formatCityFromSlug(slug: string) {
  const parts = normalizeSlug(slug).split("/").filter(Boolean);
  return formatCity(parts[2] ?? "");
}

export function getSlugParts(slug: string) {
  const [trade = "", symptom = "", city = ""] = normalizeSlug(slug).split("/").filter(Boolean);
  return { trade, symptom, city };
}

export function getRelatedSymptoms(trade: string, symptom: string) {
  return RELATED_SYMPTOMS[trade]?.[symptom] ?? [];
}
