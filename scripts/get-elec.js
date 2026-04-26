const { Client } = require('pg');

const client = new Client({ connectionString: process.env.DATABASE_URL });

client.connect().then(() => {
  return client.query("SELECT content_json FROM pages WHERE slug = '/electrical/breaker-tripping/fort-myers-fl'");
}).then(res => {
  if (res.rows.length > 0) {
    console.log(JSON.stringify(res.rows[0].content_json.content.top_causes, null, 2));
  } else {
    console.log("No data found");
  }
  client.end();
}).catch(err => {
  console.error(err);
  client.end();
});
