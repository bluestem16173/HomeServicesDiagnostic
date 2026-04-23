import { runWorker } from "./worker";

console.log("HSD Worker starting...");

runWorker().catch(err => {
    console.error("Fatal worker error:", err);
});