import type { z } from "zod";
import { HsdSchema } from "@/src/lib/ai/prompts/generateHsdPage";

type HsdContent = z.infer<typeof HsdSchema>["content"];

/** Phase 3: stable layout caps — truncate only, no invented copy. */
export const PHASE3 = {
  quickTriageMax: 5,
  topCausesMax: 4,
  stopDiyMax: 6,
  repairVsReplaceMax: 5,
} as const;

export function lockPhase3Content(content: HsdContent): HsdContent {
  return {
    ...content,
    hero: {
      ...content.hero,
      headline: content.hero.headline.trim(),
      subhead: content.hero.subhead.trim(),
    },
    quick_triage: content.quick_triage.slice(0, PHASE3.quickTriageMax),
    top_causes: content.top_causes.slice(0, PHASE3.topCausesMax),
    stop_diy: content.stop_diy.slice(0, PHASE3.stopDiyMax),
    repair_vs_replace: content.repair_vs_replace.slice(0, PHASE3.repairVsReplaceMax),
  };
}
