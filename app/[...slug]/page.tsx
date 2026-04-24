import { notFound } from "next/navigation";
import { query } from "@/lib/db";
import { Metadata } from "next";
import Link from "next/link";
import DiagnosticPageView from "@/components/DiagnosticPageView";
import DynamicMermaid from "@/components/DynamicMermaid";

export const revalidate = 3600;

interface PageProps {
  params: Promise<{
    slug?: string[];
  }>;
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  if (!params.slug) {
    console.log("NO SLUG FOUND IN METADATA:", params);
    return { title: 'Not Found' };
  }

  const slugPath = '/' + params.slug.join('/');
  console.log("LOOKING FOR SLUG:", slugPath);

  try {
    const res = await query('SELECT content_json FROM pages WHERE slug = $1 AND status = $2', [slugPath, 'published']);

    if (res.rows.length === 0) {
      return { title: 'Not Found' };
    }

    const contentJson = res.rows[0].content_json || {};

    return {
      title: contentJson.seo?.title || "Home Service Diagnostic",
      description: contentJson.seo?.description || "Diagnostic results for your home service issue.",
    };
  } catch (error) {
    console.error("Error fetching metadata:", error);
    return { title: 'Diagnostic Page' };
  }
}

export default async function DiagnosticPage(props: PageProps) {
  const params = await props.params;
  if (!params.slug) {
    console.log("NO SLUG FOUND:", params);
    return notFound();
  }

  const slugPath = '/' + (params.slug || []).join('/');

  let data = null;

  try {
    const res = await query('SELECT content_json FROM pages WHERE slug = $1 AND status = $2', [slugPath, 'published']);

    if (res.rows.length === 0) {
      notFound();
    }

    data = res.rows[0].content_json;
  } catch (error) {
    console.error("Error fetching diagnostic page:", error);
    notFound();
  }

  if (!data?.content) {
    return null;
  }

  return (
    <main className="min-h-screen bg-slate-900 text-white pb-24">
      <div className="max-w-4xl mx-auto px-6 py-10 space-y-10">

        <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2">
          {data.seo?.title || "Diagnostic Report"}
        </h1>

        <TriageBlock content={data.content.field_triage} />

        <section className="space-y-6">
          <DecisionFlow content={data.content.diagnostic_flow} />
          {data.content.mermaid_chart && (
            <DynamicMermaid chart={data.content.mermaid_chart} />
          )}
        </section>

        <CauseCards causes={data.content.top_causes} />

        <QuickChecks checks={data.content.quick_checks} />

        <StopDIYAlert content={data.content.stop_diy} />

        <RepairVsReplace content={data.content.repair_vs_replace} />

      </div>
      <StickyCTA content={data.content.cta} />
    </main>
  );
}

// ---------------------------------------------------------
// UI COMPONENTS
// ---------------------------------------------------------

export function TriageBlock({ content }: { content: string }) {
  if (!content) return null;
  return (
    <section className="bg-yellow-500/10 border border-yellow-500 p-6 rounded-xl">
      <h2 className="text-xl font-bold mb-2 text-yellow-400">
        What You’re Experiencing
      </h2>
      <p className="text-gray-200">{content}</p>
    </section>
  );
}

export function DecisionFlow({ content }: { content: string[] }) {
  if (!content || content.length === 0) return null;
  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-blue-400">Diagnostic Flow</h2>
      <ul className="space-y-3">
        {content.map((step, i) => (
          <li key={i} className="flex items-start">
            <span className="text-blue-500 mr-3 mt-1">➜</span>
            <span className="text-gray-300 leading-relaxed">{step}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function CauseCards({ causes }: { causes: { title: string; description: string }[] }) {
  if (!causes || causes.length === 0) return null;
  return (
    <section>
      <h2 className="text-xl font-bold mb-4 text-white">Top Causes</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {causes.map((c, i) => (
          <div key={i} className="bg-slate-800 border border-slate-700 p-5 rounded-lg shadow-sm">
            <h3 className="font-semibold text-lg text-gray-100 mb-1">{c.title}</h3>
            <p className="text-sm text-gray-400">{c.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function QuickChecks({ checks }: { checks: string[] }) {
  if (!checks || checks.length === 0) return null;
  return (
    <section className="bg-blue-900/20 border border-blue-800 p-6 rounded-xl">
      <h2 className="text-xl font-bold mb-4 text-blue-300">Quick Safe Checks</h2>
      <ul className="list-disc pl-5 space-y-2 text-gray-300">
        {checks.map((c, i) => <li key={i}>{c}</li>)}
      </ul>
    </section>
  );
}

export function StopDIYAlert({ content }: { content: string }) {
  if (!content) return null;
  return (
    <section className="bg-red-500/10 border border-red-500 p-6 rounded-xl">
      <h2 className="text-lg font-bold text-red-400 mb-2">
        ⚠️ When to Stop DIY
      </h2>
      <p className="text-gray-200">{content}</p>
    </section>
  );
}

export function RepairVsReplace({ content }: { content: string }) {
  if (!content) return null;
  return (
    <section className="bg-slate-800 p-6 rounded-xl border border-slate-700">
      <h2 className="text-xl font-bold mb-2 text-gray-200">Repair vs. Replace</h2>
      <p className="text-gray-400">{content}</p>
    </section>
  );
}

export function StickyCTA({ content }: { content: string }) {
  if (!content) return null;
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-blue-600 text-white p-4 text-center shadow-[0_-4px_10px_rgba(0,0,0,0.3)] z-50">
      <p className="font-bold text-lg max-w-4xl mx-auto">{content}</p>
    </div>
  );
}