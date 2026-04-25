const { Pool } = require('pg');

async function run() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const slug = '/hvac/ac-not-cooling/fort-myers-fl';
  
  try {
    const res = await pool.query(
      "SELECT content_json FROM pages WHERE slug = $1",
      [slug]
    );
    if (res.rows.length > 0) {
      let data = res.rows[0].content_json;
      if (data && data.content) {
        data.content.cta = "Fort Myers AC problems get worse fast—get help today";
        
        await pool.query(
          "UPDATE pages SET content_json = $1 WHERE slug = $2",
          [data, slug]
        );
        console.log("Database updated successfully");
      }
    }
  } catch (err) {
    console.error("Failed to update database:", err);
  } finally {
    await pool.end();
  }
}

run();
