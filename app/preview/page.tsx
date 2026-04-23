import Link from "next/link";
import type { Metadata } from "next";
import clusterStub from "../../worker/stubs/hvac-ac-not-cooling.cluster.json";
import cityStub from "../../worker/stubs/hvac-ac-not-cooling-fort-myers-fl.city.json";

type DiagnosticPayload = {
  slug: string;
  page_type: string;
  content: {
    title: string;
    body: string;
    summary: string;
    urgency: string;
    top_causes: { cause: string; why_it_happens: string; severity: string }[];
    diagnostic_steps: string[];
    when_to_call: string[];
    seo: { meta_title: string; meta_description: string };
  };
};

function normalizeSlugParam(raw: string | undefined): string {
  if (!raw || !raw.trim()) return "/hvac/ac-not-cooling";
  const t = raw.trim();
  return t.startsWith("/") ? t : `/${t}`;
}

function loadPayload(slug: string): DiagnosticPayload {
  if (slug === "/hvac/ac-not-cooling/fort-myers-fl") {
    return cityStub as DiagnosticPayload;
  }
  if (slug === "/hvac/ac-not-cooling") {
    return clusterStub as DiagnosticPayload;
  }
  return clusterStub as DiagnosticPayload;
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ slug?: string }>;
}): Promise<Metadata> {
  const slug = normalizeSlugParam((await searchParams).slug);
  const data = loadPayload(slug);
  return {
    title: data.content.seo.meta_title,
    description: data.content.seo.meta_description,
  };
}

export default async function PreviewPage({
  searchParams,
}: {
  searchParams: Promise<{ slug?: string }>;
}) {
  const slug = normalizeSlugParam((await searchParams).slug);
  const data = loadPayload(slug);
  const { content } = data;

  const urgencyStyles: Record<string, string> = {
    high: "bg-red-500/20 text-red-200 border-red-500/40",
    moderate: "bg-amber-500/20 text-amber-200 border-amber-500/40",
    low: "bg-emerald-500/15 text-emerald-200 border-emerald-500/30",
  };

  return (
    <main className="min-h-screen bg-[#060913] text-white font-sans pb-24">
      <header className="border-b border-white/10 bg-[#0b1121]/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/"
            className="text-sm text-yellow-400 hover:text-yellow-300 font-medium"
          >
            ← Home
          </Link>
          <div className="flex flex-wrap gap-2 text-xs">
            <Link
              href="/preview?slug=/hvac/ac-not-cooling"
              className={`px-3 py-1.5 rounded-md border ${slug === "/hvac/ac-not-cooling" ? "border-yellow-400 text-yellow-300" : "border-white/15 text-gray-400 hover:text-white"}`}
            >
              Cluster
            </Link>
            <Link
              href="/preview?slug=/hvac/ac-not-cooling/fort-myers-fl"
              className={`px-3 py-1.5 rounded-md border ${slug === "/hvac/ac-not-cooling/fort-myers-fl" ? "border-yellow-400 text-yellow-300" : "border-white/15 text-gray-400 hover:text-white"}`}
            >
              Fort Myers (city)
            </Link>
          </div>
        </div>
      </header>

      <article className="max-w-3xl mx-auto px-6 pt-10">
        <p className="text-[11px] uppercase tracking-widest text-gray-500 mb-2">
          Preview · {data.page_type} · <code className="text-gray-400">{data.slug}</code>
        </p>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
          {content.title}
        </h1>
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <span
            className={`text-xs font-semibold uppercase tracking-wide px-3 py-1 rounded-full border ${urgencyStyles[content.urgency] ?? urgencyStyles.moderate}`}
          >
            Urgency: {content.urgency}
          </span>
        </div>

        <p className="text-lg text-gray-300 leading-relaxed border-l-2 border-yellow-400/60 pl-4 mb-10">
          {content.summary}
        </p>

        <section className="mb-10">
          <h2 className="text-sm font-semibold text-yellow-400 uppercase tracking-wide mb-4">
            Overview
          </h2>
          <div className="text-gray-300 leading-relaxed space-y-4 whitespace-pre-line">
            {content.body}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-sm font-semibold text-yellow-400 uppercase tracking-wide mb-4">
            Top causes
          </h2>
          <ul className="space-y-4">
            {content.top_causes.map((c, i) => (
              <li
                key={i}
                className="rounded-lg border border-white/10 bg-[#0b1121]/80 p-4"
              >
                <p className="font-semibold text-white">{c.cause}</p>
                <p className="text-sm text-gray-400 mt-1">{c.why_it_happens}</p>
                <p className="text-xs text-gray-500 mt-2">
                  Severity: <span className="text-gray-300">{c.severity}</span>
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-sm font-semibold text-yellow-400 uppercase tracking-wide mb-4">
            Diagnostic steps
          </h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-300 text-sm leading-relaxed">
            {content.diagnostic_steps.map((step, i) => (
              <li key={i} className="pl-1 marker:text-yellow-500/80">
                {step}
              </li>
            ))}
          </ol>
        </section>

        <section className="mb-12">
          <h2 className="text-sm font-semibold text-yellow-400 uppercase tracking-wide mb-4">
            When to call a professional
          </h2>
          <ul className="space-y-2 text-gray-300 text-sm">
            {content.when_to_call.map((line, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-yellow-400 shrink-0">▸</span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </section>

        <footer className="border-t border-white/10 pt-8 text-xs text-gray-500 space-y-2">
          <p>
            <span className="text-gray-400">Meta title:</span> {content.seo.meta_title}
          </p>
          <p>
            <span className="text-gray-400">Meta description:</span>{" "}
            {content.seo.meta_description}
          </p>
        </footer>
      </article>
    </main>
  );
}
