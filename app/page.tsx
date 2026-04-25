import Image from "next/image";
import Link from "next/link";
import { Snowflake, Droplet, Zap, LayoutGrid, Stethoscope, Home, ArrowRight, ShieldCheck, Clock, CheckCircle, Sparkles, Upload } from "lucide-react";

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

export default async function HomePage() {
  const weather = await getWeather('fort myers');
  const temp = weather?.feelsLike ?? weather?.temp;
  const isStormy = weather ? (weather.code >= 50 && weather.code <= 99) : false;

  let weatherAlert = null;
  if (temp && temp > 90) {
    weatherAlert = { text: "Peak Heat Stress", color: "text-red-500", desc: "HVAC systems at high risk", link: "/hvac/ac-not-cooling/fort-myers-fl" };
  } else if (temp && temp > 85) {
    weatherAlert = { text: "High Heat Load", color: "text-red-400", desc: "AC struggling to cool?", link: "/hvac/ac-not-cooling/fort-myers-fl" };
  } else if (isStormy) {
    weatherAlert = { text: "Storm Activity", color: "text-yellow-400", desc: "Electrical surges likely", link: "/electrical/breaker-tripping/cape-coral-fl" };
  } else if (temp) {
    weatherAlert = { text: "Stable Conditions", color: "text-blue-400", desc: "View Top HVAC Issues", link: "/hvac/ac-not-cooling/fort-myers-fl" };
  }

  return (
    <main className="min-h-screen bg-[#060913] text-white font-sans selection:bg-yellow-400 selection:text-black pb-24">

      {/* HEADER / NAVIGATION */}
      <header className="absolute top-0 w-full z-50 px-8 py-4 bg-gradient-to-b from-black/80 to-transparent">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">

          {/* LOGO */}
          <Link href="/" className="flex items-center gap-3 group">
            {/* HSD House Icon */}
            <div className="relative flex flex-col items-center justify-center pt-2">
              <svg width="60" height="20" viewBox="0 0 60 20" fill="none" className="text-yellow-400 absolute top-0">
                <path d="M2 18 L30 2 L58 18" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-3xl font-extrabold tracking-tight text-white leading-none z-10 mt-1">HSD</span>
              <div className="w-full h-[3px] bg-yellow-400 mt-1 rounded-full"></div>
            </div>

            {/* Text Lockup */}
            <div className="leading-tight flex flex-col">
              <div className="text-[13px] font-semibold text-white tracking-wide">
                Home Service Diagnostics
              </div>
              <div className="text-[10px] font-medium text-yellow-400 mt-0.5">
                (AH Operations Group)
              </div>
            </div>
          </Link>

          {/* NAV LINKS */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-gray-300">
            <Link href="#" className="hover:text-white transition-colors">HVAC</Link>
            <Link href="#" className="hover:text-white transition-colors">Plumbing</Link>
            <Link href="#" className="hover:text-white transition-colors">Electrical</Link>
            <Link href="#" className="hover:text-white transition-colors">Windows</Link>
            <Link href="#" className="hover:text-white transition-colors">Roofing</Link>
            <Link href="/about" className="hover:text-white transition-colors flex items-center gap-1">
              About Us <span className="text-[10px]">▼</span>
            </Link>
          </nav>

          {/* HEADER BUTTONS */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="#" className="bg-[#facc15] hover:bg-yellow-500 text-black px-4 py-2 rounded-md text-sm font-semibold flex items-center gap-2 transition-all">
              <Stethoscope className="w-4 h-4" />
              Diagnose a Problem
            </Link>
            <Link href="#" className="border border-yellow-400/50 hover:border-yellow-400 text-gray-200 hover:text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-all bg-black/20 backdrop-blur-sm">
              <Home className="w-4 h-4 text-gray-300" />
              Home Upgrades
            </Link>
          </div>
        </div>
      </header>

      {/* 1. HERO */}
      <section className="relative pt-48 pb-56 px-6 flex items-center min-h-[75vh]">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero_fort_myers.png"
            alt="City Skyline"
            fill
            className="object-cover object-center opacity-70"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#060913]/60 via-[#060913]/40 to-[#060913]"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center">
          
          {/* WEATHER WIDGET */}
          {weatherAlert && (
            <Link href={weatherAlert.link} className="mb-6 bg-black/40 border border-white/10 hover:border-white/30 hover:bg-black/60 transition-all backdrop-blur-md rounded-full px-5 py-2 flex items-center gap-3 group/weather">
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${weatherAlert.color.replace('text-', 'bg-')}`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${weatherAlert.color.replace('text-', 'bg-')}`}></span>
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-300">Live in Fort Myers:</span>
              <span className="text-sm font-bold text-white">{temp}°F</span>
              <span className="text-[10px] text-blue-300 ml-1 font-bold tracking-widest uppercase">Humidity: {weather.humidity}%</span>
              <span className="text-gray-400 text-xs px-2 border-l border-white/20 ml-1">
                <span className={`${weatherAlert.color} font-medium`}>{weatherAlert.text}</span> <span className="hidden sm:inline">— {weatherAlert.desc}</span>
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-gray-400 ml-1 group-hover/weather:translate-x-1 transition-transform" />
            </Link>
          )}

          <h1 className="text-5xl md:text-6xl font-bold mb-4 tracking-tight leading-tight">
            Diagnose problems<br />
            <span className="text-[#facc15]">before they cost you thousands.</span>
          </h1>

          <p className="text-lg text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Fast, accurate diagnostics for HVAC, plumbing, electrical, and more.<br />
            Then decide whether to fix it or upgrade with confidence.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-[#facc15] hover:bg-yellow-500 text-black px-8 py-3.5 rounded-md font-semibold transition-all shadow-[0_0_15px_rgba(250,204,21,0.2)] flex items-center justify-center gap-2 text-sm">
              Start a Diagnosis
              <ArrowRight className="w-4 h-4" />
            </button>

            <button className="border border-white/20 hover:border-white/40 text-white px-8 py-3.5 rounded-md font-medium transition-all bg-white/5 backdrop-blur-sm flex items-center justify-center gap-2 text-sm">
              Explore Upgrades
              <ArrowRight className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>
      </section>

      {/* 2. 4-CARD GRID (OVERLAPPING HERO) */}
      <section className="relative z-20 -mt-36 px-6 max-w-[1400px] mx-auto mb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">

          {/* Card 1: HVAC */}
          <div className="group bg-[#0b1121] rounded-xl overflow-hidden border border-white/5 hover:border-blue-500/30 transition-all hover:-translate-y-1 shadow-2xl flex flex-col relative">
            <div className="relative h-44 w-full shrink-0">
              <Image src="/images/strange_noises.png" alt="HVAC diagnostics" fill className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-90" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b1121] to-transparent opacity-80"></div>
            </div>

            {/* Overlay Icon */}
            <div className="absolute top-[152px] left-6 w-10 h-10 rounded-full bg-[#0b1121] border border-blue-500 flex items-center justify-center z-10 shadow-lg">
              <Snowflake className="w-5 h-5 text-blue-400" />
            </div>

            <div className="p-6 pt-10 flex flex-col flex-grow">
              <h3 className="text-xl font-bold mb-2">HVAC Problems</h3>
              <p className="text-gray-400 text-sm mb-6 leading-relaxed">AC not cooling, strange noises, high bills, and more.</p>
              <Link href="#" className="text-blue-400 font-medium flex items-center gap-2 text-sm tracking-wide mt-auto">
                Diagnose Now <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Card 2: Plumbing */}
          <div className="group bg-[#0b1121] rounded-xl overflow-hidden border border-white/5 hover:border-blue-400/30 transition-all hover:-translate-y-1 shadow-2xl flex flex-col relative">
            <div className="relative h-44 w-full shrink-0">
              <Image src="/images/leaky_faucet.png" alt="Plumbing inspections" fill className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-90" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b1121] to-transparent opacity-80"></div>
            </div>

            <div className="absolute top-[152px] left-6 w-10 h-10 rounded-full bg-[#0b1121] border border-blue-400 flex items-center justify-center z-10 shadow-lg">
              <Droplet className="w-5 h-5 text-blue-400" />
            </div>

            <div className="p-6 pt-10 flex flex-col flex-grow">
              <h3 className="text-xl font-bold mb-2">Plumbing Issues</h3>
              <p className="text-gray-400 text-sm mb-6 leading-relaxed">Leaks, low pressure, no hot water, and more.</p>
              <Link href="#" className="text-blue-400 font-medium flex items-center gap-2 text-sm tracking-wide mt-auto">
                Diagnose Now <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Card 3: Electrical */}
          <div className="group bg-[#0b1121] rounded-xl overflow-hidden border border-white/5 hover:border-yellow-400/30 transition-all hover:-translate-y-1 shadow-2xl flex flex-col relative">
            <div className="relative h-44 w-full shrink-0">
              <Image src="/images/electrical_panel.png" alt="Electrical safety" fill className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-90" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b1121] to-transparent opacity-80"></div>
            </div>

            <div className="absolute top-[152px] left-6 w-10 h-10 rounded-full bg-[#0b1121] border border-yellow-400 flex items-center justify-center z-10 shadow-lg">
              <Zap className="w-5 h-5 text-yellow-400" />
            </div>

            <div className="p-6 pt-10 flex flex-col flex-grow">
              <h3 className="text-xl font-bold mb-2">Electrical Problems</h3>
              <p className="text-gray-400 text-sm mb-6 leading-relaxed">Power loss, tripped breakers, flickering lights, and more.</p>
              <Link href="#" className="text-yellow-400 font-medium flex items-center gap-2 text-sm tracking-wide mt-auto">
                Diagnose Now <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Card 4: Windows */}
          <div className="group bg-[#0b1121] rounded-xl overflow-hidden border border-white/5 hover:border-green-500/30 transition-all hover:-translate-y-1 shadow-2xl flex flex-col relative">
            <div className="relative h-44 w-full shrink-0">
              <Image src="/images/hero_windows_fort_myers.png" alt="Windows" fill className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-90" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b1121] to-transparent opacity-80"></div>
            </div>

            <div className="absolute top-[152px] left-6 w-10 h-10 rounded-full bg-[#0b1121] border border-green-500 flex items-center justify-center z-10 shadow-lg">
              <LayoutGrid className="w-4 h-4 text-green-500" />
            </div>

            <div className="p-6 pt-10 flex flex-col flex-grow">
              <h3 className="text-xl font-bold mb-2">Windows & Doors</h3>
              <p className="text-gray-400 text-sm mb-6 leading-relaxed">Drafts, leaks, hard to open, damaged glass, and more.</p>
              <Link href="#" className="text-green-500 font-medium flex items-center gap-2 text-sm tracking-wide mt-auto">
                Diagnose Now <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* 3. TRUST ROW (Contained in a border box) */}
      <section className="max-w-[1400px] mx-auto px-6 mb-6">
        <div className="border border-white/10 rounded-xl bg-[#0b1121]/50 backdrop-blur-sm p-6 lg:p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-white/10">

            <div className="flex items-center gap-4 px-4">
              <div className="w-12 h-12 rounded-full border border-blue-500/30 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h4 className="text-sm font-semibold mb-0.5 text-gray-200">Trusted Local Experts</h4>
                <p className="text-[13px] text-gray-500">Real pros. Real solutions.</p>
              </div>
            </div>

            <div className="flex items-center gap-4 px-4 pt-6 md:pt-0">
              <div className="w-12 h-12 rounded-full border border-blue-500/30 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h4 className="text-sm font-semibold mb-0.5 text-gray-200">Fast & Accurate</h4>
                <p className="text-[13px] text-gray-500">Get answers in minutes.</p>
              </div>
            </div>

            <div className="flex items-center gap-4 px-4 pt-6 md:pt-0">
              <div className="w-12 h-12 rounded-full border border-blue-500/30 flex items-center justify-center shrink-0">
                <CheckCircle className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h4 className="text-sm font-semibold mb-0.5 text-gray-200">Fix or Upgrade</h4>
                <p className="text-[13px] text-gray-500">You decide what's best.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. BOTTOM CTA BAR */}
      <section className="max-w-[1400px] mx-auto px-6 mb-12">
        <div className="border border-white/10 rounded-xl bg-[#080d1a] p-6 lg:px-8 lg:py-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="hidden sm:flex w-12 h-12 rounded-lg bg-black/50 border border-white/5 items-center justify-center">
              <Sparkles className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-200 mb-1">Looking to improve your home?</h3>
              <p className="text-sm text-gray-500">Explore high-quality upgrades and maximize your home's value.</p>
            </div>
          </div>
          <button className="w-full md:w-auto border border-yellow-500/50 hover:border-yellow-400 text-yellow-400 px-6 py-3 rounded-md text-sm font-medium transition-all bg-black/30 flex items-center justify-center gap-2 shrink-0">
            Explore Home Upgrades
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

    </main>
  );
}