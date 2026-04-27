import type { Metadata } from "next";
import { TradeHubPage } from "@/components/TradeHubPage";
import { SITE_URL } from "@/lib/seoLinks";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "HVAC Diagnostic Hub | Home Service Diagnostics",
  description: "Browse HVAC diagnostic pages by symptom and city.",
  alternates: {
    canonical: `${SITE_URL}/hvac`,
  },
};

export default function HvacHub() {
  return <TradeHubPage trade="hvac" />;
}
