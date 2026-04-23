const idempotentBrief = require("./idempotentBrief");
const masterLayer = require("./masterLayer");
const hardEmissionContract = require("./hardEmissionContract");
const { getTradeAnnex } = require("./tradeAnnexes");
const { buildPageProductionCore } = require("./pageProductionCore");
const hvacRulesUnderRules = require("./hvacRulesUnderRules");

/**
 * Ordered stack: idempotent brief → master authority → emission contract → trade annex → page production core.
 */
function buildStackedUserPrompt(ctx) {
  const {
    slug,
    trade,
    page_type,
    target_keyword,
    location,
  } = ctx;

  const trade_specific_rules = trade === "hvac" ? hvacRulesUnderRules : "";

  const core = buildPageProductionCore({
    slug,
    trade,
    page_type,
    target_keyword,
    location,
    trade_specific_rules,
  });

  const parts = [
    idempotentBrief,
    masterLayer,
    hardEmissionContract,
    getTradeAnnex(trade),
    core,
  ];

  return parts.join("\n\n---\n\n");
}

module.exports = { buildStackedUserPrompt };
