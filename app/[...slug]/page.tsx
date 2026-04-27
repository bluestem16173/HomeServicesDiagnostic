import { notFound, redirect } from "next/navigation";
import { query } from "@/lib/db";
import { Metadata } from "next";
import Link from "next/link";
import DiagnosticPageView from "@/components/DiagnosticPageView";
import DynamicMermaid from "@/components/DynamicMermaid";
import { StickyCTAClient, LocalCTAStrip, HeroSection } from "@/components/ClientCTAs";
import ConclusionLeadCTA from "@/components/ConclusionLeadCTA";
import { AlertTriangle, Info, Check, Wrench, ShieldAlert, FileText, Zap, Droplet, Snowflake, Thermometer } from "lucide-react";
import { HsdSchema as DiagnosticSchema } from "@/src/lib/ai/prompts/generateHsdPage";
import { normalizeHsdStorageJson } from "@/lib/normalizeHsdStorage";
import { buildMermaid } from "@/lib/buildMermaid";
import { FLOWS } from "@/lib/diagnosticFlows";
import { lockPhase3Content } from "@/lib/phase3ContentLock";
import {
  SITE_URL,
  formatCity,
  formatCityFromSlug,
  formatSymptom,
  formatTrade,
  getRelatedSymptoms,
  normalizeSlug,
} from "@/lib/seoLinks";
import { normalizeCanonicalSlug } from "@/lib/canonicalSlugs";

/** Canonical URLs use a leading slash; some DB rows were stored without it. */
async function queryDiagnosticContentJson(slugPath: string) {
  const alt = slugPath.startsWith("/") ? slugPath.slice(1) : `/${slugPath}`;
  let res = await query("SELECT content_json FROM pages WHERE slug = $1", [slugPath]);
  if (res.rows.length === 0 && alt !== slugPath) {
    res = await query("SELECT content_json FROM pages WHERE slug = $1", [alt]);
  }
  return res;
}

export const revalidate = 0;
export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{
    slug?: string[];
  }>;
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  if (!params.slug) {
    return { title: 'Not Found' };
  }

  const slugPath = '/' + params.slug.join('/');
  const canonicalSlug = normalizeCanonicalSlug(slugPath);
  const [trade = "", symptom = "", city = ""] = params.slug;
  const [, canonicalSymptom = symptom] = canonicalSlug.split("/").filter(Boolean);
  const tradeLabel = formatTrade(trade);
  const symptomLabel = formatSymptom(canonicalSymptom || "home service issue");
  const cityLabel = formatCity(city || "your-area");

  return {
    title: `${symptomLabel} in ${cityLabel} | ${tradeLabel} Help`,
    description: `Diagnose ${symptomLabel.toLowerCase()} in ${cityLabel}. Fast troubleshooting and local service guidance.`,
    alternates: {
      canonical: `${SITE_URL}${canonicalSlug}`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

async function getWeather(cityQuery: string): Promise<{ temp: number, code: number, humidity: number, feelsLike: number } | null> {
  try {
    const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityQuery)}&count=1&language=en&format=json`, { next: { revalidate: 3600 } });
    if (!geoRes.ok) return null;
    const geoData = await geoRes.json();
    if (geoData.results && geoData.results.length > 0) {
      const { latitude, longitude } = geoData.results[0];
      const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code&temperature_unit=fahrenheit`, { next: { revalidate: 3600 } });
      if (!weatherRes.ok) return null;
      const weatherData = await weatherRes.json();
      const current = weatherData.current;
      return { 
        temp: Math.round(current.temperature_2m),
        code: current.weather_code,
        humidity: Math.round(current.relative_humidity_2m),
        feelsLike: Math.round(current.apparent_temperature)
      };
    }
  } catch (e) {
    console.error("Weather fetch failed:", e);
  }
  return null;
}

type InternalLink = {
  slug: string;
  label: string;
};

async function getDeterministicInternalLinks(
  slugPath: string,
  trade: string,
  symptom: string,
  citySlug: string
) {
  const canonicalSlug = normalizeSlug(slugPath);
  const sameSymptomResult = await query(
    `
      SELECT slug
      FROM pages
      WHERE status = 'published'
        AND (slug LIKE $1 OR slug LIKE $2)
        AND slug != $3
        AND slug != $4
      ORDER BY slug
      LIMIT 6
    `,
    [`/${trade}/${symptom}/%`, `${trade}/${symptom}/%`, canonicalSlug, canonicalSlug.slice(1)]
  );

  const sameSymptomCities = sameSymptomResult.rows.map((row: { slug: string }) => {
    const slug = normalizeSlug(row.slug);
    return {
      slug,
      label: formatCityFromSlug(slug),
    };
  });

  const relatedSymptomSlugs = getRelatedSymptoms(trade, symptom).map(
    (relatedSymptom) => `/${trade}/${relatedSymptom}/${citySlug}`
  );
  const relatedResult = relatedSymptomSlugs.length
    ? await query(
        `
          SELECT slug
          FROM pages
          WHERE status = 'published'
            AND (slug = ANY($1::text[]) OR slug = ANY($2::text[]))
          ORDER BY slug
          LIMIT 6
        `,
        [relatedSymptomSlugs, relatedSymptomSlugs.map((slug) => slug.slice(1))]
      )
    : { rows: [] };

  const relatedSymptoms = relatedResult.rows.map((row: { slug: string }) => {
    const slug = normalizeSlug(row.slug);
    const [, relatedSymptom = ""] = slug.split("/").filter(Boolean);
    return {
      slug,
      label: formatSymptom(relatedSymptom),
    };
  });

  return {
    tradeHub: {
      slug: `/${trade}`,
      label: `${formatTrade(trade)} Diagnostic Hub`,
    },
    sameSymptomCities,
    relatedSymptoms,
  };
}

export default async function DiagnosticPage(props: PageProps) {
  const params = await props.params;
  if (!params.slug) return notFound();

  const slugPath = '/' + (params.slug || []).join('/');
  const canonicalSlug = normalizeCanonicalSlug(slugPath);
  if (canonicalSlug !== slugPath) {
    redirect(canonicalSlug);
  }
  let data = null;

  try {
    const res = await queryDiagnosticContentJson(slugPath);
    if (res.rows.length === 0) notFound();
    data = res.rows[0].content_json;
  } catch (error) {
    console.error("[diagnostic] DB error for", slugPath, error);
    notFound();
  }

  const normalized = normalizeHsdStorageJson(data);
  const parsed = DiagnosticSchema.safeParse(normalized);

  if (!parsed.success) {
    console.error("Zod Schema Validation Failed for:", slugPath);
    console.error(parsed.error.flatten());
    return notFound();
  }

  const pageData = parsed.data;
  const content = lockPhase3Content(parsed.data.content);

  const vertical = params.slug[0] || "hvac";
  const symptomSlug = params.slug[1] || "issue";
  const citySlug = params.slug[2] || "your-area";
  const cityContext = formatCity(citySlug);
  const citySearchQuery = citySlug.split('-').slice(0, -1).join(' '); 
  const weather = vertical !== 'plumbing' ? await getWeather(citySearchQuery) : null;
  const seoLinks = await getDeterministicInternalLinks(slugPath, vertical, symptomSlug, citySlug);

  const flow = FLOWS[content.flow_type];
  const mermaidString = buildMermaid(flow);

  const slugIssueTitle = `${(params.slug[1] || "issue")
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")
    .replace(/\bAc\b/g, "AC")
    .replace(/\bHvac\b/g, "HVAC")}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: formatSymptom(symptomSlug),
    areaServed: cityContext,
    provider: {
      "@type": "LocalBusiness",
      name: "Home Service Diagnostics",
      url: SITE_URL,
    },
    url: `${SITE_URL}${slugPath}`,
  };

  return (
    <main className="min-h-screen bg-gray-100 text-slate-900 pb-24 font-sans selection:bg-blue-200 selection:text-blue-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-[1200px] mx-auto bg-white shadow-2xl my-8 md:my-12 overflow-hidden border border-gray-300">
        <nav className="flex flex-col gap-3 border-b border-slate-200 bg-slate-50 px-5 py-4 text-sm font-semibold text-slate-700 sm:flex-row sm:items-center sm:justify-between md:px-8">
          <Link href={seoLinks.tradeHub.slug} className="text-blue-700 hover:underline">
            &larr; Back to {seoLinks.tradeHub.label}
          </Link>
          <Link href="/" className="text-slate-600 hover:text-slate-900 hover:underline">
            Home Service Diagnostics
          </Link>
        </nav>
        
        {/* 1. HERO SECTION — prefer JSON hero; slug title is fallback only */}
        <HeroSection 
          title={content.hero.headline?.trim() ? content.hero.headline : slugIssueTitle} 
          description={content.hero.subhead || (pageData as { seo?: { description?: string } }).seo?.description} 
          vertical={vertical} 
        />

        <div className="p-6 md:p-8 space-y-8">
          
          {/* 2. QUICK TRIAGE */}
          <QuickTriageBlock content={content.quick_triage} vertical={vertical} weather={weather} />

          {/* 3 & 4. DIAGNOSTIC FLOW + CONCLUSION */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            <div className="lg:col-span-8 flex flex-col">
              <div className="flex justify-between items-end mb-4 border-b pb-2">
                <h2 className="text-[11px] font-bold tracking-widest text-blue-900 uppercase m-0">3. Diagnostic Flow (Visual Flowchart)</h2>
                <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">*Interactive Chart</span>
              </div>
              <div className="bg-slate-50 border border-blue-100 rounded-lg p-4 flex-grow flex flex-col items-stretch justify-start w-full min-w-0 shadow-inner">
                {mermaidString && (
                  <div className="w-full max-w-full min-w-0">
                    <DynamicMermaid chart={mermaidString} />
                  </div>
                )}
                {content.local_factors && content.local_factors.length > 0 && (
                  <div className="mt-6 text-[11px] md:text-xs font-semibold text-slate-600 bg-white border border-blue-100 px-4 py-3 rounded-md max-w-4xl mx-auto shadow-sm w-full">
                    <Info className="inline w-3.5 h-3.5 mr-1.5 mb-0.5 text-blue-500" />
                    <span className="font-bold">Local Factors ({cityContext}):</span>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                      {content.local_factors.map((f: string, i: number) => <li key={i}>{f}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            </div>
            <div className="lg:col-span-4 flex flex-col">
              <h2 className="text-[11px] font-bold tracking-widest text-blue-900 uppercase mb-4 border-b pb-2">4. Diagnostic Conclusion</h2>
              <div className="flex-grow">
                <DiagnosticConclusionCard content={content} symptom={params.slug?.[1]?.replace(/-/g, ' ') || "your issue"} vertical={vertical} cityContext={cityContext} weather={weather} />
              </div>
            </div>
          </div>

          {/* 5. TOP CAUSES */}
          <CauseCards causes={content.top_causes} />

          {/* 6, 7. 2-COLUMN BOTTOM GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StopDIYAlert content={content.stop_diy} />
            <RepairVsReplace content={content.repair_vs_replace} />
          </div>

          {/* 9. LOCAL CTA STRIP */}
          <div>
            <h2 className="text-[11px] font-bold tracking-widest text-blue-900 uppercase mb-4 border-b pb-2">9. Local CTA Strip</h2>
            <LocalCTAStrip vertical={vertical} cityContext={cityContext} />
          </div>
          
          <InternalLinkingBlock links={seoLinks} />

        </div>
      </div>
      
      <StickyCTAClient content={content.hero?.headline} vertical={vertical} cityContext={cityContext} />
    </main>
  );
}

// ---------------------------------------------------------
// UI COMPONENTS
// ---------------------------------------------------------

function InternalLinkingBlock({
  links,
}: {
  links: {
    tradeHub: InternalLink;
    sameSymptomCities: InternalLink[];
    relatedSymptoms: InternalLink[];
  };
}) {
  const sections = [
    {
      title: "Same Issue In Nearby Cities",
      links: links.sameSymptomCities,
    },
    {
      title: "Related Symptoms",
      links: links.relatedSymptoms,
    },
    {
      title: "Trade Hub",
      links: [links.tradeHub],
    },
  ];

  return (
    <section className="border-t border-gray-200 pt-6 mt-8">
      <div className="mb-4">
        <h2 className="text-[11px] font-bold tracking-widest text-blue-900 uppercase">
          10. Related Topics / Internal Links
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Explore the same problem in nearby cities, related diagnostics, and the full trade hub.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {sections.map((section) => (
          <div key={section.title} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
              {section.title}
            </h3>
            <div className="flex flex-col gap-2 text-sm">
              {section.links.length > 0 ? (
                section.links.map((link) => (
                  <Link key={link.slug} href={link.slug} className="font-medium text-blue-700 hover:underline">
                    {link.label}
                  </Link>
                ))
              ) : (
                <span className="text-xs text-slate-500">More pages coming soon.</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function QuickTriageBlock({ content, vertical, weather }: { content: string[], vertical: string, weather?: { temp: number, code: number, humidity: number, feelsLike: number } | null }) {
  if (!content || !content.length) return null;
  // Use 'feelsLike' (heat index) for logic, huge for Florida
  const temp = weather?.feelsLike;
  const isStormy = weather ? (weather.code >= 50 && weather.code <= 99) : false;

  return (
    <div>
      <h2 className="text-[11px] font-bold tracking-widest text-blue-900 uppercase mb-4 border-b pb-2">2. Alert / Quick Triage</h2>
      <section className="bg-[#f0f4f8] border border-blue-200 p-5 rounded flex flex-col md:flex-row items-center gap-6 justify-between shadow-sm">
        <div className="flex items-start gap-4">
          <div className="bg-[#1e3a8a] text-white p-3 rounded shrink-0 shadow-md">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-[#1e3a8a] tracking-wider mb-2 uppercase">
              Quick Triage Checks
            </h3>
            <ul className="list-disc pl-4 space-y-1 text-slate-800 text-sm font-medium">
              {content.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
        {weather && temp !== undefined && (
          <div className="bg-white border border-blue-100 p-4 rounded shrink-0 flex items-center gap-4 hidden md:flex shadow-sm">
             <div>
               <div className="flex items-center gap-2 mb-1">
                  <Thermometer className="w-5 h-5 text-yellow-400" />
                  <span className="font-semibold tracking-wide text-sm">Feels Like: <strong className="text-lg">{temp}°F</strong></span>
               </div>
               <div className="flex items-center gap-1.5 mb-2 text-blue-600 text-[10px] font-bold uppercase tracking-wider">
                  <Droplet className="w-3 h-3" /> Humidity: {weather.humidity}%
               </div>
               
               {vertical === 'hvac' && temp > 90 ? (
                 <div className="text-xs text-slate-700 max-w-[250px] leading-relaxed mt-2 space-y-1">
                   <p className="font-bold text-red-700">Extreme temperatures are causing peak system stress.</p>
                   <p>If your AC is failing now:</p>
                   <ul className="list-disc pl-4 text-[11px] text-slate-600 font-medium">
                     <li>Compressors and capacitors are at highest risk of catastrophic failure</li>
                     <li>Running a struggling system will cause permanent damage</li>
                   </ul>
                 </div>
               ) : vertical === 'hvac' && temp > 85 ? (
                 <div className="text-xs text-slate-700 max-w-[250px] leading-relaxed mt-2 space-y-1">
                   <p className="font-bold text-red-600">High outdoor temperatures increase system load.</p>
                   <p>If your AC is not cooling under these conditions:</p>
                   <ul className="list-disc pl-4 text-[11px] text-slate-600 font-medium">
                     <li>Airflow or refrigerant issues are more likely</li>
                     <li>System strain increases risk of failure</li>
                   </ul>
                 </div>
               ) : vertical === 'electrical' && isStormy ? (
                 <div className="text-xs text-slate-700 max-w-[250px] leading-relaxed mt-2 space-y-1">
                   <p className="font-bold text-yellow-600">Current storm activity increases electrical risks.</p>
                   <p>If your breakers are tripping during a storm:</p>
                   <ul className="list-disc pl-4 text-[11px] text-slate-600 font-medium">
                     <li>Moisture may be intruding into exterior GFI outlets</li>
                     <li>Surge conditions can cause sensitive AFCI breakers to trip</li>
                   </ul>
                 </div>
               ) : (
                 <p className="text-xs text-gray-500 max-w-[200px] leading-relaxed mt-2">
                   At this temperature, your {vertical.toUpperCase()} should be running efficiently — if it’s not, something is failing.
                 </p>
               )}
             </div>

             {vertical === 'hvac' && temp > 90 ? (
               <span className="px-3 py-1 bg-red-100 text-red-800 text-[10px] font-bold rounded-full border border-red-300">
                 Peak Stress
               </span>
             ) : vertical === 'hvac' && temp > 85 ? (
               <span className="px-3 py-1 bg-red-50 text-red-600 text-[10px] font-bold rounded-full border border-red-200">
                 High Heat Load
               </span>
             ) : vertical === 'electrical' && isStormy ? (
               <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-[10px] font-bold rounded-full border border-yellow-300">
                 Storm Risk
               </span>
             ) : null}
          </div>
        )}
      </section>
    </div>
  );
}



export function CauseCards({ causes }: { causes: { cause: string; mechanism: string | string[]; signal: string | string[]; escalation?: string | string[]; severity: string }[] }) {
  if (!causes || causes.length === 0) return null;

  const icons = [<FileText key="1" className="w-6 h-6"/>, <Zap key="2" className="w-6 h-6"/>, <Wrench key="3" className="w-6 h-6"/>, <Droplet key="4" className="w-6 h-6"/>, <Snowflake key="5" className="w-6 h-6"/>];

  return (
    <section>
      <h2 className="text-[11px] font-bold tracking-widest text-blue-900 uppercase mb-4 border-b pb-2">5. Top Causes (Technical Details)</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 lg:divide-x divide-gray-200">
        {causes.slice(0, 4).map((c, i) => (
          <div key={i} className="lg:px-4 first:pl-0 pt-4 lg:pt-0">
            <div className="flex items-center gap-2 mb-3 text-blue-800">
              {icons[i % icons.length]}
              <h3 className="font-extrabold text-sm uppercase tracking-wide">{c.cause}</h3>
            </div>
            <div className="mb-3">
              <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wide">Mechanism:</span>
              <ul className="list-disc pl-4 text-[12px] text-slate-600 space-y-1 mt-1 font-medium">
                {(Array.isArray(c.mechanism) ? c.mechanism : [c.mechanism]).map((m, idx) => m ? <li key={idx}>{m}</li> : null)}
              </ul>
            </div>
            <div className="mb-3">
              <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wide">Signal:</span>
              <ul className="list-disc pl-4 text-[12px] text-slate-600 space-y-1 mt-1 font-medium">
                {(Array.isArray(c.signal) ? c.signal : [c.signal]).map((s, idx) => s ? <li key={idx}>{s}</li> : null)}
              </ul>
            </div>
            <div className="mb-3">
              <span className="text-[11px] font-bold text-red-800 uppercase tracking-wide">Escalation:</span>
              <ul className="list-disc pl-4 text-[12px] text-red-600 space-y-1 mt-1 font-medium">
                {(Array.isArray(c.escalation) ? c.escalation : (c.escalation ? [c.escalation] : [])).map((e: any, idx: number) => <li key={idx}>{e}</li>)}
              </ul>
            </div>
            <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded ${c.severity === 'high' ? 'bg-red-100 text-red-700' : c.severity === 'moderate' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
              Severity: {c.severity}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

export function StopDIYAlert({ content }: { content: string[] | Record<string, string> }) {
  if (!content) return null;
  const items = Array.isArray(content) ? content : (typeof content === 'object' ? Object.values(content) : []);
  if (items.length === 0) return null;
  return (
    <section className="bg-[#fef2f2] border border-red-200 p-5 rounded h-full">
      <h2 className="text-[11px] font-bold text-red-700 tracking-wider mb-4 uppercase flex items-center gap-2">
        <ShieldAlert className="w-4 h-4" /> 6. When to Stop DIY
      </h2>
      <ul className="list-disc pl-5 text-red-900 text-sm font-medium leading-relaxed space-y-1 mb-4">
        {items.map((item, i) => <li key={i}>{item as React.ReactNode}</li>)}
      </ul>
      <p className="text-[11px] font-extrabold text-red-800 uppercase tracking-widest border-t border-red-200 pt-4 flex items-center gap-2 mt-auto">
        <AlertTriangle className="w-4 h-4 shrink-0" /> This is where DIY stops. The risk is not just damage—it’s safety and system failure.
      </p>
    </section>
  );
}

export function RepairVsReplace({ content }: { content: string[] | Record<string, string> }) {
  if (!content) return null;
  const items = Array.isArray(content) ? content : (typeof content === 'object' ? Object.values(content) : []);
  if (items.length === 0) return null;
  return (
    <section className="bg-[#f1f5f9] border border-gray-200 p-5 rounded h-full">
      <h2 className="text-[11px] font-bold text-[#1e3a8a] tracking-wider mb-4 uppercase">7. Repair vs. Replace</h2>
      <ul className="list-disc pl-5 text-slate-800 text-[13px] font-medium leading-relaxed space-y-1.5">
        {items.map((item, i) => (
          <li key={i}>{item as React.ReactNode}</li>
        ))}
      </ul>
    </section>
  );
}

export function DiagnosticConclusionCard({ content, symptom, vertical, cityContext, weather }: { content: any; symptom: string; vertical: string; cityContext: string; weather: any }) {
  let primaryCause = content.top_causes?.[0];
  const escalation = Array.isArray(content.repair_vs_replace) 
    ? content.repair_vs_replace.find((c: string) => c.toLowerCase().includes("minor issue")) || content.repair_vs_replace[content.repair_vs_replace.length - 1]
    : "What starts as a minor issue can become a multi-thousand-dollar failure if the system continues running under stress.";

  // Dynamic weather override logic
  const temp = weather?.feelsLike;
  const isStormy = weather ? (weather.code >= 50 && weather.code <= 99) : false;

  if (primaryCause && vertical === 'hvac' && temp !== undefined && temp > 85) {
    primaryCause = {
      ...primaryCause,
      cause: "Airflow or Refrigerant Stress Failure",
      signal: [`At ${temp}°F, the system is under peak heat load and cannot keep up with the thermostat setpoint.`],
      mechanism: ["High ambient temperatures severely reduce the condenser's ability to reject heat, causing internal pressure to spike and amplifying minor airflow or charge deficits into total system failure."],
      escalation: primaryCause.escalation || []
    };
  } else if (primaryCause && vertical === 'electrical' && isStormy) {
    primaryCause = {
      ...primaryCause,
      cause: "Storm-Related Electrical Fault",
      signal: ["Active storm activity is likely causing surges or moisture intrusion."],
      mechanism: ["Moisture infiltrating exterior boxes or power grid fluctuations are tripping sensitive AFCI/GFCI breakers or stressing main panel components."],
      escalation: primaryCause.escalation || []
    };
  } else if (primaryCause && vertical === 'plumbing' && temp !== undefined && temp < 32) {
    primaryCause = {
      ...primaryCause,
      cause: "Freeze-Related Pressure Failure",
      signal: ["Temperatures have dropped to freezing, exposing uninsulated or poorly insulated lines."],
      mechanism: ["Water expanding as it freezes within the lines is blocking flow and creating immense hydrostatic pressure capable of bursting pipes."],
      escalation: primaryCause.escalation || []
    };
  }

  return (
    <div className="bg-white border-2 border-red-100 rounded-lg shadow-md overflow-hidden flex flex-col h-full">
      <div className="bg-red-600 text-white p-3 text-center">
        <h2 className="text-[12px] font-extrabold tracking-widest uppercase">Most Likely Issue</h2>
        <p className="text-[10px] opacity-90 uppercase tracking-wider">Based on {symptom} Symptoms</p>
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        {primaryCause && (
          <div className="mb-5">
            <h3 className="text-[13px] font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="text-red-600">🔥</span> Likely Cause: {primaryCause.cause}
            </h3>
            
            <div className="space-y-4 text-xs text-slate-700 font-medium">
              <div>
                <p className="font-bold text-slate-900 mb-1">What you might be noticing:</p>
                <ul className="list-disc pl-5 space-y-1 text-slate-600">
                  {(Array.isArray(primaryCause.signal) ? primaryCause.signal : [primaryCause.signal]).map((s: string, idx: number) => s ? <li key={idx}>{s}</li> : null)}
                </ul>
              </div>
              
              <div>
                <p className="font-bold text-slate-900 mb-1">Why this is happening:</p>
                <ul className="list-disc pl-5 space-y-1 text-slate-600">
                  {(Array.isArray(primaryCause.mechanism) ? primaryCause.mechanism : [primaryCause.mechanism]).map((m: string, idx: number) => m ? <li key={idx}>{m}</li> : null)}
                </ul>
              </div>
            </div>
          </div>
        )}

        <div className="bg-[#fff1f2] p-3 rounded border border-red-100 mb-5">
          <p className="text-[11px] font-bold text-red-800 uppercase tracking-wide mb-2">What happens next if ignored:</p>
          <ul className="list-disc pl-5 space-y-1 text-xs text-red-700 font-semibold italic mb-3">
            {primaryCause?.escalation ? (Array.isArray(primaryCause.escalation) ? primaryCause.escalation : [primaryCause.escalation]).map((e: string, idx: number) => <li key={idx}>{e}</li>) : <li>Failure risk increases significantly within weeks</li>}
          </ul>
          <p className="text-[10px] font-bold text-red-600 uppercase tracking-wider flex items-center gap-1.5 border-t border-red-200 pt-2">
            <AlertTriangle className="w-3.5 h-3.5" /> This issue is actively developing and will worsen under continued operation.
          </p>
        </div>

        <div className="mb-5">
          <p className="text-[11px] font-bold text-slate-900 uppercase tracking-wider mb-2 border-b pb-1">If you're noticing:</p>
          <ul className="space-y-1.5 text-xs text-slate-600 font-medium">
            {(Array.isArray(content.quick_triage) ? content.quick_triage : (typeof content.quick_triage === 'object' ? Object.values(content.quick_triage) : [])).map((t: any, i: number) => (
              <li key={i} className="flex items-start gap-1.5">
                <Check className="w-3.5 h-3.5 text-green-500 shrink-0 mt-0.5" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
          <p className="text-[10px] font-bold text-red-600 mt-3 uppercase tracking-wider flex items-center gap-1.5 bg-red-50 py-1.5 px-2 rounded-md">
            <AlertTriangle className="w-3.5 h-3.5" /> This issue is actively developing
          </p>
        </div>

        {/* CONFIDENCE BAR */}
        <div className="mt-auto mb-5">
          <div className="flex justify-between items-end mb-1.5">
            <span className="text-[10px] font-extrabold uppercase text-slate-500 tracking-wider">Confidence Level</span>
            <span className="text-[11px] font-bold text-slate-800">HIGH</span>
          </div>
          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-slate-800 w-[85%] rounded-full"></div>
          </div>
        </div>

        {/* ACTION BUTTON */}
        <ConclusionLeadCTA vertical={vertical} cityContext={cityContext} />
      </div>
    </div>
  );
}
