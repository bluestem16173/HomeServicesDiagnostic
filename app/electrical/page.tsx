import type { Metadata } from "next";
import { TradeHubPage } from "@/components/TradeHubPage";
import { SITE_URL } from "@/lib/seoLinks";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Electrical Diagnostic Hub | Home Service Diagnostics",
  description: "Browse electrical diagnostic pages by symptom and city.",
  alternates: {
    canonical: `${SITE_URL}/electrical`,
  },
};

export default function ElectricalHub() {
  return <TradeHubPage trade="electrical" />;
}
