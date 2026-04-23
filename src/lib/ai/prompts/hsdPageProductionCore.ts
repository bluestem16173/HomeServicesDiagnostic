/**
 * Page-production schematic (simple `slug` + `page_type` + `content` JSON).
 * Canonical implementation for Fly lives in `worker/prompts/pageProductionCore.js`.
 */
export {
  buildPageProductionCore as buildHsdPageProductionUserPrompt,
  PAGE_PRODUCTION_TEMPLATE as HSD_PAGE_PRODUCTION_CORE_TEMPLATE,
} from "../../../../worker/prompts/pageProductionCore.js";
