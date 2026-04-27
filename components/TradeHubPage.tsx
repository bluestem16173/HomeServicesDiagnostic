import Link from "next/link";
import { query } from "@/lib/db";
import {
  SITE_URL,
  formatCity,
  formatSymptom,
  formatTrade,
  getSlugParts,
  normalizeSlug,
} from "@/lib/seoLinks";
import {
  getCanonicalList,
  normalizeCanonicalSlug,
  normalizeSymptom,
} from "@/lib/canonicalSlugs";

type TradeHubPageProps = {
  trade: "hvac" | "plumbing" | "electrical";
};

type CityGroup = {
  citySlug: string;
  city: string;
  pages: Map<
    string,
    {
      slug: string;
    }
  >;
};

type CityClusterLink = {
  symptom: string;
  page?: {
    slug: string;
  };
};

export async function TradeHubPage({ trade }: TradeHubPageProps) {
  const { rows } = await query(
    `
      SELECT slug
      FROM pages
      WHERE status = 'published'
        AND (slug LIKE $1 OR slug LIKE $2)
      ORDER BY slug
    `,
    [`/${trade}/%/%`, `${trade}/%/%`]
  );

  const groups = new Map<string, CityGroup>();
  const canonicalSet = getCanonicalList(trade);

  rows.forEach((row: { slug: string }) => {
    const slug = normalizeSlug(row.slug);
    const { symptom = "", city: citySlug = "" } = getSlugParts(slug);
    if (!symptom || !citySlug) return;

    const canonicalSymptom = normalizeSymptom(trade, symptom);
    const canonicalSlug = normalizeCanonicalSlug(slug);

    const group = groups.get(citySlug) ?? {
      citySlug,
      city: formatCity(citySlug),
      pages: new Map(),
    };
    group.pages.set(canonicalSymptom, {
      slug: canonicalSlug,
    });
    groups.set(citySlug, group);
  });

  const cityGroups = Array.from(groups.values()).sort((a, b) =>
    a.city.localeCompare(b.city)
  );
  const tradeLabel = formatTrade(trade);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${tradeLabel} Diagnostic Hub`,
    url: `${SITE_URL}/${trade}`,
    about: `${tradeLabel} troubleshooting and diagnostic pages`,
  };

  return (
    <main className="min-h-screen bg-[#060913] text-white font-sans pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="px-6 pt-24 pb-14 bg-gradient-to-b from-slate-950 to-[#060913]">
        <div className="max-w-6xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center rounded-full border border-yellow-400/30 bg-yellow-400/10 px-4 py-2 text-sm font-semibold text-yellow-300 hover:bg-yellow-400/20 hover:text-yellow-200"
          >
            &larr; Back to Home
          </Link>
          <h1 className="mt-6 text-4xl md:text-5xl font-bold tracking-tight">
            {tradeLabel} Diagnostic Hub
          </h1>
          <p className="mt-4 max-w-2xl text-slate-300 leading-relaxed">
            Choose a city cluster, then pick the {tradeLabel.toLowerCase()} condition you want to
            diagnose. Each city section links to live local pages for that trade.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-10">
        {cityGroups.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {cityGroups.map((group) => (
              <article
                key={group.city}
                className="rounded-xl border border-white/10 bg-[#0b1121] p-5 shadow-xl"
              >
                <div className="flex items-start justify-between gap-4">
                  <h2 className="text-lg font-bold text-white">{group.city}</h2>
                  <span className="rounded-full border border-white/10 px-2 py-1 text-[11px] font-semibold text-slate-400">
                    {group.pages.size} live
                  </span>
                </div>
                <div className="mt-4 flex flex-col gap-2">
                  {canonicalSet.map((symptom) => {
                    const link: CityClusterLink = {
                      symptom,
                      page: group.pages.get(symptom),
                    };
                    const href = link.page?.slug ?? `/${trade}/${symptom}/${group.citySlug}`;
                    const disabled = !link.page;

                    return (
                      <Link
                        key={symptom}
                        href={href}
                        className={`text-sm font-medium hover:underline ${
                          disabled
                            ? "text-slate-500 opacity-40"
                            : "text-blue-300 hover:text-blue-200"
                        }`}
                        aria-disabled={disabled}
                      >
                        {formatSymptom(symptom)}
                      </Link>
                    );
                  })}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-white/10 bg-[#0b1121] p-8 text-slate-300">
            No published {tradeLabel.toLowerCase()} diagnostic pages are available yet.
          </div>
        )}
      </section>
    </main>
  );
}
