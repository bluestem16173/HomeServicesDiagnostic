const { runWorker } = require("./worker");

console.log("HSD Worker starting (JS)...");

runWorker().catch(err => {
  console.error("Fatal worker error:", err);
});