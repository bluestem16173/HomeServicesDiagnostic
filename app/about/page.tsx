import Image from "next/image";
import Link from "next/link";
import { Stethoscope, Home, ShieldCheck, Clock, MapPin, ClipboardList, Search, List, CheckCircle, Shield } from "lucide-react";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#060913] text-white font-sans selection:bg-yellow-400 selection:text-black pb-24">
      
      {/* HEADER / NAVIGATION */}
      <header className="absolute top-0 w-full z-50 px-8 py-4 bg-gradient-to-b from-black/80 to-transparent">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative flex flex-col items-center justify-center pt-2">
              <svg width="60" height="20" viewBox="0 0 60 20" fill="none" className="text-yellow-400 absolute top-0">
                <path d="M2 18 L30 2 L58 18" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-3xl font-extrabold tracking-tight text-white leading-none z-10 mt-1">HSD</span>
              <div className="w-full h-[3px] bg-yellow-400 mt-1 rounded-full"></div>
            </div>

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
            <Link href="/about" className="text-white border-b-2 border-yellow-400 pb-1">About Us</Link>
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
      <section className="relative pt-40 lg:pt-48 pb-24 px-6 flex items-center min-h-[60vh]">
        {/* Background Image (Right Aligned) */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/images/about_hero.png" 
            alt="Luxury home interior" 
            fill 
            className="object-cover object-right opacity-60"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#060913] via-[#060913]/90 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-[#060913]/40 via-transparent to-[#060913]"></div>
        </div>

        <div className="relative z-10 max-w-[1400px] mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="max-w-xl">
            <h4 className="text-yellow-400 text-sm font-bold tracking-wider mb-6">ABOUT US</h4>
            <h1 className="text-5xl md:text-6xl font-bold mb-8 tracking-tight leading-tight">
              Real answers.<br/>
              Honest guidance.<br/>
              <span className="text-[#facc15]">Better homes.</span>
            </h1>
            
            <p className="text-base md:text-lg text-gray-300 mb-6 leading-relaxed">
              Home Service Diagnostics (HSD) was built to help homeowners make confident decisions about repairs or upgrades—without the guesswork, pressure, or sales tactics.
            </p>
            <p className="text-base md:text-lg text-gray-300 leading-relaxed font-medium">
              Just clear, accurate diagnostics you can trust.
            </p>
          </div>
        </div>
      </section>

      {/* 2. TRUST ROW (4 Columns) */}
      <section className="relative z-20 max-w-[1400px] mx-auto px-6 mb-16">
        <div className="border border-white/10 rounded-xl bg-[#0b1121]/80 backdrop-blur-md p-8 lg:p-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 divide-y md:divide-y-0 lg:divide-x divide-white/10">
            
            <div className="flex items-start gap-4 lg:px-6">
              <ShieldCheck className="w-8 h-8 text-yellow-400 shrink-0" />
              <div>
                <h4 className="text-base font-semibold mb-1 text-white">Honest & Transparent</h4>
                <p className="text-sm text-gray-400">No upsells. No gimmicks.<br/>Just the facts.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 lg:px-6 pt-6 md:pt-0">
              <Clock className="w-8 h-8 text-yellow-400 shrink-0" />
              <div>
                <h4 className="text-base font-semibold mb-1 text-white">Fast & Accurate</h4>
                <p className="text-sm text-gray-400">Get clear answers in<br/>minutes, not days.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 lg:px-6 pt-6 lg:pt-0">
              <Home className="w-8 h-8 text-yellow-400 shrink-0" />
              <div>
                <h4 className="text-base font-semibold mb-1 text-white">Homeowner Focused</h4>
                <p className="text-sm text-gray-400">Solutions that make sense<br/>for your home and budget.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 lg:px-6 pt-6 lg:pt-0">
              <MapPin className="w-8 h-8 text-yellow-400 shrink-0" />
              <div>
                <h4 className="text-base font-semibold mb-1 text-white">Local & Independent</h4>
                <p className="text-sm text-gray-400">Proudly serving homeowners<br/>in Southwest Florida.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. FOUNDER SECTION */}
      <section className="max-w-[1400px] mx-auto px-6 mb-24">
        <div className="border border-white/10 rounded-xl bg-[#0b1121] overflow-hidden flex flex-col lg:flex-row">
          {/* Image */}
          <div className="lg:w-5/12 relative min-h-[400px]">
            <Image 
              src="/images/adam_hsd_polo.png" 
              alt="Adam, Founder of HSD" 
              fill 
              className="object-cover object-top"
            />
          </div>
          
          {/* Content */}
          <div className="lg:w-7/12 p-10 lg:p-16 flex flex-col justify-center">
            <h4 className="text-yellow-400 text-xs font-bold tracking-widest uppercase mb-4">About the Founder</h4>
            <h2 className="text-4xl md:text-5xl font-bold mb-8">
              Hi, I'm <span className="text-[#facc15]">Adam.</span>
            </h2>
            
            <div className="space-y-6 text-gray-300 text-[15px] leading-relaxed">
              <p>
                I started HSD because I saw too many homeowners get conflicting opinions, pay for things they didn't need, or feel pressured into decisions that weren't right for them.
              </p>
              <p>
                I believe homeowners deserve better. That's why I built a diagnostic system that puts clarity first—so you can make the right call with confidence.
              </p>
              <p className="font-medium text-white pt-2">
                I'm not here to sell you something.<br/>
                I'm here to help you understand your options.
              </p>
            </div>

            {/* Signature Placeholder */}
            <div className="mt-8">
              <span className="font-serif italic text-3xl text-white opacity-90">— Adam</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS */}
      <section className="max-w-[1400px] mx-auto px-6 mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
          How <span className="text-[#facc15]">HSD</span> Works
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-6 left-12 right-12 h-[1px] bg-white/20 -z-10"></div>

          {/* Step 1 */}
          <div className="flex flex-col md:items-center md:text-center group">
            <div className="flex items-center gap-4 md:flex-col md:gap-6 mb-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-[#0b1121] border border-blue-500 flex items-center justify-center shrink-0 z-10 shadow-lg">
                  <ClipboardList className="w-6 h-6 text-blue-400" />
                </div>
                <div className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-yellow-400 text-black text-xs font-bold flex items-center justify-center border-2 border-[#060913]">1</div>
              </div>
              <h3 className="text-lg font-bold">Tell Us the Problem</h3>
            </div>
            <p className="text-sm text-gray-400 pl-20 md:pl-0">Answer a few quick questions about what you're experiencing.</p>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col md:items-center md:text-center group">
            <div className="flex items-center gap-4 md:flex-col md:gap-6 mb-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-[#0b1121] border border-blue-500 flex items-center justify-center shrink-0 z-10 shadow-lg">
                  <Search className="w-6 h-6 text-blue-400" />
                </div>
                <div className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-yellow-400 text-black text-xs font-bold flex items-center justify-center border-2 border-[#060913]">2</div>
              </div>
              <h3 className="text-lg font-bold">Get a Diagnosis</h3>
            </div>
            <p className="text-sm text-gray-400 pl-20 md:pl-0">We analyze the details and identify the likely cause.</p>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col md:items-center md:text-center group">
            <div className="flex items-center gap-4 md:flex-col md:gap-6 mb-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-[#0b1121] border border-blue-500 flex items-center justify-center shrink-0 z-10 shadow-lg">
                  <List className="w-6 h-6 text-blue-400" />
                </div>
                <div className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-yellow-400 text-black text-xs font-bold flex items-center justify-center border-2 border-[#060913]">3</div>
              </div>
              <h3 className="text-lg font-bold">See Your Options</h3>
            </div>
            <p className="text-sm text-gray-400 pl-20 md:pl-0">Review repair or upgrade solutions that make sense for your situation.</p>
          </div>

          {/* Step 4 */}
          <div className="flex flex-col md:items-center md:text-center group">
            <div className="flex items-center gap-4 md:flex-col md:gap-6 mb-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-[#0b1121] border border-blue-500 flex items-center justify-center shrink-0 z-10 shadow-lg">
                  <CheckCircle className="w-6 h-6 text-blue-400" />
                </div>
                <div className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-yellow-400 text-black text-xs font-bold flex items-center justify-center border-2 border-[#060913]">4</div>
              </div>
              <h3 className="text-lg font-bold">Make a Confident Decision</h3>
            </div>
            <p className="text-sm text-gray-400 pl-20 md:pl-0">You get the clarity you need to move forward with confidence.</p>
          </div>

        </div>
      </section>

    </main>
  );
}
