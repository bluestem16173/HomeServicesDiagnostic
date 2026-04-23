import Image from "next/image";
import Link from "next/link";

export type PageData = {
  page_type: string;
  service: string;
  mode: string;
  city?: string;
  hero: {
    headline: string;
    subheadline: string;
    image_prompt: string; 
    image_path: string; 
    primary_cta?: string;
    secondary_cta?: string;
  };
  cards?: {
    title: string;
    description: string;
    href: string;
    image_prompt: string;
    image_path: string;
  }[];
  clusters?: {
    title: string;
    links: { label: string; href: string }[];
  }[];
};

export default function PageTemplate({ data }: { data: PageData }) {
  return (
    <main className="min-h-screen bg-[#0f172a] text-white font-sans selection:bg-yellow-400 selection:text-black">
      {/* HEADER / NAVIGATION */}
      <header className="absolute top-0 w-full z-50 px-6 py-6 border-b border-white/10 bg-[#0f172a]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <span className="text-2xl font-bold tracking-tighter hover:text-yellow-400 transition-colors">HSD</span>
            <div className="h-4 w-px bg-white/20"></div>
            <span className="text-sm font-medium text-gray-300 hidden sm:inline-block">Home Service Diagnostics</span>
          </Link>
          <p className="text-xs text-gray-500 uppercase tracking-widest hidden md:block">
            (AH Operations Group)
          </p>
        </div>
      </header>

      {/* 1. HERO */}
      <section className="relative pt-40 pb-32 px-6 flex items-center min-h-[85vh]">
        <div className="absolute inset-0 z-0">
          <Image 
            src={data.hero.image_path || "/images/hero.png"} 
            alt={data.hero.headline} 
            fill 
            className="object-cover object-center opacity-40 mix-blend-luminosity"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a]/80 via-[#0f172a]/60 to-[#0f172a]"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs sm:text-sm font-medium text-yellow-400 mb-8">
            <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></span>
            {data.mode === "upgrade" 
              ? "Performance optimization by HVAC Revenue Boost" 
              : "Performance and optimization partner under the HSD platform"}
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-tight">
            {data.hero.headline}
          </h1>
          
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            {data.hero.subheadline}
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-[#facc15] hover:bg-yellow-500 text-black px-8 py-4 rounded-lg font-semibold transition-all shadow-[0_0_20px_rgba(250,204,21,0.3)] flex items-center justify-center gap-2">
              {data.hero.primary_cta || "Start Diagnosis"}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
            </button>

            {(data.hero.secondary_cta || data.mode === "repair") && (
              <button className="bg-white/5 hover:bg-white/10 border border-white/20 text-white px-8 py-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2">
                {data.hero.secondary_cta || "Explore Upgrades"}
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 2. 4-CARD GRID */}
      {data.cards && data.cards.length > 0 && (
        <section className="relative z-20 -mt-20 px-6 max-w-7xl mx-auto mb-32">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.cards.map((card, idx) => (
              <div key={idx} className="group bg-[#1e293b] rounded-2xl overflow-hidden border border-white/10 hover:border-yellow-400/50 transition-all hover:-translate-y-1 shadow-xl flex flex-col">
                <div className="relative h-48 w-full shrink-0 bg-black">
                  <Image src={card.image_path} alt={card.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-80" />
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
                  <p className="text-gray-400 text-sm mb-6 flex-grow">{card.description}</p>
                  <Link href={card.href} className="text-[#facc15] font-medium flex items-center gap-2 group-hover:gap-3 transition-all text-sm uppercase tracking-wide mt-auto">
                    {data.mode === "upgrade" ? "Explore Options" : "Diagnose Now"} <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. TRUST ROW */}
      <section className="bg-white/5 border-y border-white/10 py-12 mb-32">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0 divide-y md:divide-y-0 md:divide-x divide-white/10 text-center">
          <div className="px-6 flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-yellow-400/20 flex items-center justify-center mb-4 text-[#facc15]">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
            </div>
            <h4 className="text-lg font-semibold mb-2">Trusted Local Experts</h4>
            <p className="text-sm text-gray-400">Vetted professionals ensuring code-compliant diagnostics.</p>
          </div>
          <div className="px-6 pt-8 md:pt-0 flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-yellow-400/20 flex items-center justify-center mb-4 text-[#facc15]">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            </div>
            <h4 className="text-lg font-semibold mb-2">Fast & Accurate</h4>
            <p className="text-sm text-gray-400">Data-driven routing for the fastest resolution time.</p>
          </div>
          <div className="px-6 pt-8 md:pt-0 flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-yellow-400/20 flex items-center justify-center mb-4 text-[#facc15]">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            </div>
            <h4 className="text-lg font-semibold mb-2">Fix or Upgrade</h4>
            <p className="text-sm text-gray-400">Clear pathways to repair urgent issues or invest in the future.</p>
          </div>
        </div>
      </section>

      {/* 3. CLUSTER SECTION */}
      {data.clusters && data.clusters.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 mb-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Diagnostic Clusters</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Select your problem area below to get a highly targeted diagnostic workflow.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {data.clusters.map((cluster, idx) => (
              <div key={idx}>
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-3 border-b border-white/10 pb-4">
                  <span className="text-[#facc15]">0{idx + 1}.</span> {cluster.title}
                </h3>
                <ul className="space-y-4">
                  {cluster.links.map((link, lidx) => (
                    <li key={lidx}>
                      <Link href={link.href} className="text-gray-400 hover:text-[#facc15] transition-colors flex items-center justify-between group">
                        {link.label} <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 5. FINAL CTA SECTION */}
      <section className="bg-gradient-to-t from-black to-[#0f172a] py-32 px-6 border-t border-white/5 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold mb-6">Ready to solve your home issues?</h2>
          <p className="text-xl text-gray-400 mb-10">Stop delaying essential repairs. Get a clear diagnosis and take action today.</p>
          <button className="bg-[#facc15] hover:bg-yellow-500 text-black px-10 py-5 rounded-lg text-lg font-bold transition-all shadow-xl hover:shadow-[0_0_40px_rgba(250,204,21,0.4)]">
            Start Your Free Diagnosis
          </button>
        </div>
      </section>
      
      {/* FOOTER */}
      <footer className="bg-black py-12 px-6 text-center text-gray-600 text-sm border-t border-white/10 flex flex-col items-center justify-center">
        <p className="mb-2">&copy; {new Date().getFullYear()} Home Service Diagnostics (HSD) — AH Operations Group.</p>
        <p className="mb-6">All rights reserved. Professional diagnostics for residential and commercial properties.</p>
        <div className="text-[#facc15]/80 font-semibold tracking-wider uppercase text-xs">
          Powered by HVAC Revenue Boost
        </div>
      </footer>
    </main>
  );
}
