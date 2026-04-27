import type { Metadata } from "next";
import { TradeHubPage } from "@/components/TradeHubPage";
import { SITE_URL } from "@/lib/seoLinks";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Plumbing Diagnostic Hub | Home Service Diagnostics",
  description: "Browse plumbing diagnostic pages by symptom and city.",
  alternates: {
    canonical: `${SITE_URL}/plumbing`,
  },
};

export default function PlumbingHub() {
  return <TradeHubPage trade="plumbing" />;
}
