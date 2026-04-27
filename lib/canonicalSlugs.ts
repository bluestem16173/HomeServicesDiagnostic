export const HVAC_CANONICAL: Record<string, string[]> = {
  "weak-airflow": ["weak-airflow-from-vents"],
  "outdoor-unit-not-running": ["outside-unit-not-running"],
  "hvac-tripping-breaker": ["ac-breaker-tripping"],
};

export const PLUMBING_CANONICAL: Record<string, string[]> = {
  "pipe-leak": ["pipe-leaking", "leaking-pipe"],
  "clogged-drain": ["drain-clogged", "slow-drain"],
  "drain-smell": ["sewer-smell", "bad-drain-odor"],
};

export const ELECTRICAL_CANONICAL: Record<string, string[]> = {
  "breaker-keeps-tripping": ["breaker-tripping"],
  "outlets-not-working": ["outlet-not-working"],
  "power-surges": ["voltage-fluctuation"],
};

export const TRADE_CANONICAL_SYMPTOMS: Record<string, string[]> = {
  electrical: [
    "breaker-keeps-tripping",
    "outlets-not-working",
    "lights-flickering",
    "main-panel-buzzing",
    "power-outage-one-room",
    "gfci-wont-reset",
    "smell-burning-plastic",
    "sparks-from-outlet",
    "generator-wont-start",
    "ceiling-fan-wobbly",
    "outlet-hot-to-touch",
    "partial-power-outage",
    "electrical-shock-outlet",
    "light-switch-not-working",
    "power-surges",
  ],
  plumbing: [
    "water-heater-leaking",
    "no-hot-water",
    "toilet-wont-flush",
    "clogged-drain",
    "low-water-pressure",
    "garbage-disposal-jammed",
    "pipe-burst",
    "running-toilet",
    "sewer-backup",
    "water-softener-issues",
    "pipe-leak",
    "leaky-faucet",
    "drain-smell",
    "shower-not-draining",
    "high-water-pressure",
  ],
  hvac: [
    "ac-not-cooling",
    "ac-blowing-warm-air",
    "ac-freezing-up",
    "ac-making-loud-noise",
    "ac-wont-turn-on",
    "ac-short-cycling",
    "ac-leaking-water",
    "ac-smells-bad",
    "thermostat-blank",
    "high-electric-bill",
    "weak-airflow",
    "ac-running-constantly",
    "outdoor-unit-not-running",
    "hvac-tripping-breaker",
    "ac-not-turning-off",
  ],
};

const CANONICAL_MAPS: Record<string, Record<string, string[]>> = {
  hvac: HVAC_CANONICAL,
  plumbing: PLUMBING_CANONICAL,
  electrical: ELECTRICAL_CANONICAL,
};

export function normalizeSymptom(trade: string, symptom: string) {
  const maps = CANONICAL_MAPS[trade] ?? {};

  for (const [canonical, aliases] of Object.entries(maps)) {
    if (canonical === symptom || aliases.includes(symptom)) {
      return canonical;
    }
  }

  return symptom;
}

export function getCanonicalList(trade: string) {
  return TRADE_CANONICAL_SYMPTOMS[trade] ?? [];
}

export function normalizeCanonicalSlug(slug: string) {
  const normalizedSlug = slug.startsWith("/") ? slug : `/${slug}`;
  const [trade = "", symptom = "", city = ""] = normalizedSlug.split("/").filter(Boolean);
  const normalizedSymptom = normalizeSymptom(trade, symptom);

  if (!trade || !symptom || !city || normalizedSymptom === symptom) {
    return normalizedSlug;
  }

  return `/${trade}/${normalizedSymptom}/${city}`;
}
