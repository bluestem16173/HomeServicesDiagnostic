const { Pool } = require('pg');
process.loadEnvFile('.env.local');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const HVAC = [
  "ac-not-cooling", "ac-blowing-warm-air", "ac-not-turning-on", "ac-running-constantly",
  "weak-airflow-from-vents", "ac-freezing-up-ice-on-coil", "thermostat-not-working", 
  "ac-leaking-water", "breaker-keeps-tripping-ac", "outside-unit-not-running",
  "ac-short-cycling", "loud-noise-from-ac-unit", "ac-smells-musty-burning", 
  "high-electric-bill-hvac-issue", "ac-fan-not-spinning"
];

const PLUMBING = [
  "water-heater-leaking", "no-hot-water", "drain-clogged-backed-up", "toilet-overflowing",
  "pipe-leak-visible-leak", "low-water-pressure", "sewer-smell-in-house", 
  "garbage-disposal-not-working", "faucet-wont-turn-off", "burst-pipe-emergency",
  "water-heater-not-heating-properly", "slow-drain-recurring", "shower-not-draining", 
  "water-pressure-too-high", "dishwasher-not-draining"
];

const ELECTRICAL = [
  "breaker-keeps-tripping", "outlet-not-working", "lights-flickering", "burning-smell-from-outlet",
  "power-out-in-part-of-house", "electrical-panel-issues", "switch-not-working", 
  "gfci-outlet-wont-reset", "wiring-issue-exposed-wire", "electrical-shock-from-outlet",
  "circuit-overload-issues", "frequent-power-surges", "light-fixture-not-working", 
  "buzzing-from-electrical-panel", "outlet-hot-to-touch"
];

const CITY_ALLOCATIONS = {
  "fort-myers-fl": 12,
  "cape-coral-fl": 12,
  "estero-fl": 8,
  "bonita-springs-fl": 8,
  "fort-myers-beach-fl": 5
};

async function seedQueue() {
  const allTopics = [
    ...HVAC.map(t => ({ trade: "hvac", slug: t })),
    ...PLUMBING.map(t => ({ trade: "plumbing", slug: t })),
    ...ELECTRICAL.map(t => ({ trade: "electrical", slug: t }))
  ];

  // Shuffle topics to distribute trades evenly across cities
  allTopics.sort(() => Math.random() - 0.5);

  const cityPool = [];
  for (const [city, count] of Object.entries(CITY_ALLOCATIONS)) {
    for (let i = 0; i < count; i++) {
      cityPool.push(city);
    }
  }
  
  // Shuffle cities just to be safe
  cityPool.sort(() => Math.random() - 0.5);

  const slugsToQueue = [];
  
  for (let i = 0; i < allTopics.length; i++) {
    const topic = allTopics[i];
    const city = cityPool[i];
    
    // Final slug format: /trade/symptom/city
    const fullSlug = `/${topic.trade}/${topic.slug}/${city}`;
    slugsToQueue.push(fullSlug);
  }

  console.log(`Prepared ${slugsToQueue.length} pages to queue.`);

  let inserted = 0;
  for (const slug of slugsToQueue) {
    try {
      await pool.query(
        "INSERT INTO generation_queue (proposed_slug, status, priority, page_type) VALUES ($1, 'pending', 10, 'diagnostic')",
        [slug]
      );
      inserted++;
      console.log(`Queued: ${slug}`);
    } catch (err) {
      console.error(`Failed to queue ${slug}:`, err);
    }
  }

  console.log(`Successfully inserted ${inserted} new items into the queue.`);
  process.exit(0);
}

seedQueue();
