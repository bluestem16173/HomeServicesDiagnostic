const pool = require("./db");
const { validatePage, normalizeSlug } = require("./schema");
const { generatePage } = require("./generate");

async function getNextJob() {
  const res = await pool.query(`
    SELECT * FROM generation_queue
    WHERE status = 'pending'
    ORDER BY priority DESC, created_at ASC
    LIMIT 1
  `);

  return res.rows[0];
}

async function processJob(job) {
  const rawSlug = job.slug ?? job.proposed_slug ?? job.proposedSlug;
  const slug = normalizeSlug(rawSlug);

  if (!slug) {
    console.log("⚠️ Invalid job (no slug):", { id: job.id, slug: job.slug, proposed_slug: job.proposed_slug });
    await pool.query(
      `UPDATE generation_queue SET status = 'failed' WHERE id = $1`,
      [job.id]
    );
    return;
  }

  console.log("🔥 Processing:", slug);

  let raw;
  try {
    raw = await generatePage(slug);
  } catch (e) {
    console.error("⚠️ generatePage failed:", e?.message || e);
    await pool.query(
      `UPDATE generation_queue SET status = 'failed' WHERE id = $1`,
      [job.id]
    );
    return;
  }

  const validated = validatePage({ ...raw, slug });

  if (!validated) {
    console.log("⚠️ validatePage returned null:", { id: job.id, slug });
    await pool.query(
      `UPDATE generation_queue SET status = 'failed' WHERE id = $1`,
      [job.id]
    );
    return;
  }

  await pool.query(`
    INSERT INTO pages (slug, page_type, content_json, status)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (slug) DO UPDATE
    SET content_json = $3, status = $4
  `, [
    validated.slug,
    validated.page_type,
    validated.content_json,
    validated.status
  ]);

  await pool.query(
    `UPDATE generation_queue SET status = 'done' WHERE id = $1`,
    [job.id]
  );
}

async function runWorker() {
  console.log("♻️ Worker loop running...");

  while (true) {
    try {
      const job = await getNextJob();

      if (!job) {
        console.log("😴 No jobs, sleeping...");
        await new Promise(r => setTimeout(r, 3000));
        continue;
      }

      await processJob(job);

    } catch (err) {
      console.error("Worker error:", err);
      await new Promise(r => setTimeout(r, 5000));
    }
  }
}

module.exports = { runWorker };