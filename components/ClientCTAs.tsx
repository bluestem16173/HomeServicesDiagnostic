"use client";

import React, { useState } from "react";
import LeadModal from "./LeadModal";
import Image from "next/image";
import Link from "next/link";

interface CTAPraps {
  content: string;
  vertical?: string;
  cityContext?: string;
}

export function HsdLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <div className="flex flex-col items-center">
        {/* Yellow Roof */}
        <svg width="56" height="20" viewBox="0 0 48 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-0.5">
          <path d="M24 2L4 14M24 2L44 14" stroke="#facc15" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        {/* HSD Text */}
        <span className="text-4xl font-black text-white leading-none tracking-tight drop-shadow-md">HSD</span>
        {/* Yellow Underline */}
        <div className="w-[110%] h-1.5 bg-[#facc15] mt-1.5"></div>
      </div>
      <div className="flex flex-col justify-center">
        <span className="text-white font-bold text-xl leading-tight tracking-wide drop-shadow-md">Home Service Diagnostics</span>
        <span className="text-[#facc15] text-sm font-bold leading-tight mt-0.5 drop-shadow-md">(AH Operations Group)</span>
      </div>
    </div>
  );
}

export function getCtaText(vertical?: string) {
  const v = (vertical || '').toLowerCase();
  if (v === 'plumbing') return 'Get Plumbing Fixed Today';
  if (v === 'electrical') return 'Get Electrical Fixed Today';
  return 'Get AC Fixed Today';
}

export function HeroSection({ title, vertical, description }: { title: string, vertical: string, description?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const imageMap: Record<string, string> = {
    hvac: "/images/hero_fort_myers.png",
    plumbing: "/images/leaky_faucet.png",
    electrical: "/images/electrical_panel.png",
  };
  const imageSrc = imageMap[vertical.toLowerCase()] || "/images/hero_fort_myers.png";

  return (
    <>
      <div className="flex flex-col md:flex-row w-full relative overflow-hidden bg-black">
        
        {/* Full-Width Background Image */}
        <div className="absolute inset-0 z-0">
          <Image src={imageSrc} alt="Diagnostic Service" fill className="object-cover opacity-100" />
          {/* Blue Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0b1121] via-[#0b1121]/80 to-transparent"></div>
        </div>

        {/* Fully Transparent Full-Width Header */}
        <div className="absolute top-0 left-0 right-0 z-30 flex justify-between items-start px-6 md:px-12 py-6 pointer-events-none">
          <HsdLogo className="scale-75 md:scale-90 origin-left drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" />
          <div className="text-right hidden sm:block drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            <span className="text-yellow-400 font-black text-xs md:text-sm uppercase tracking-widest block mb-0.5">Emergency Service Available</span>
            <span className="text-[9px] md:text-[10px] text-white font-bold uppercase tracking-wider">We prioritize urgent diagnostic calls</span>
          </div>
        </div>

        {/* Left Side Content */}
        <div className="w-full md:w-2/3 px-8 md:px-12 lg:px-16 pt-32 pb-12 md:py-28 flex flex-col justify-center relative z-10 text-white">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4 leading-tight drop-shadow-md">
            {title.split(' | ')[0].replace(/\s*[-—]\s*Let[’']s Find the Cause\.?/i, '').replace(/\s*Diagnostics/i, '').replace(/\??$/, '?')}
            <br/>Let's Find the Cause.
          </h1>
          <p className="text-xl font-bold text-yellow-400 mb-4 tracking-wide drop-shadow-md">Fast. Accurate. Local.</p>
          <p className="text-gray-200 mb-8 max-w-md leading-relaxed text-sm md:text-base drop-shadow-md font-medium">
            {description || "Diagnose the problem and get a licensed technician to your home today."}
          </p>
          
          <button 
            onClick={() => setIsOpen(true)}
            className="w-full sm:w-auto self-start bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded font-bold shadow-lg transition-all flex items-center justify-center gap-2 text-lg tracking-wide mb-2 animate-pulse"
          >
            {getCtaText(vertical)}
          </button>
          <p className="text-[10px] text-gray-400 mb-6 font-medium">By submitting, you agree to receive calls and text messages about your request.</p>
          
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-xs font-semibold text-gray-200 drop-shadow-md">
            <span className="flex items-center gap-1"><span className="text-white">✓</span> Same-Day Service</span>
            <span className="flex items-center gap-1"><span className="text-white">✓</span> Licensed & Insured</span>
            <span className="flex items-center gap-1"><span className="text-white">✓</span> Upfront Pricing</span>
            <span className="flex items-center gap-1"><span className="text-yellow-400">★</span> 5-Star Rated</span>
          </div>
        </div>

        {/* Right Side Empty Spacer (since image is now absolute background) */}
        <div className="w-full md:w-1/3 shrink-0 relative z-10 min-h-[250px] md:min-h-auto"></div>
      </div>
      <LeadModal isOpen={isOpen} onClose={() => setIsOpen(false)} serviceCategory={vertical} />
    </>
  );
}

export function StickyCTAClient({ content, vertical, cityContext }: CTAPraps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [consentChecked, setConsentChecked] = useState(false);

  if (!content || !isVisible) return null;
  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-[#0b1121] border-t border-white/10 text-white p-4 md:p-6 shadow-[0_-10px_30px_rgba(0,0,0,0.8)] z-40 flex flex-col justify-center gap-4 animate-in slide-in-from-bottom duration-500">
        <button 
          onClick={() => setIsVisible(false)}
          className="absolute top-2 right-2 md:top-4 md:right-4 text-gray-500 hover:text-white transition-colors"
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 max-w-[1200px] mx-auto w-full px-4 md:px-12">
          <p className="font-semibold text-sm md:text-base text-left max-w-2xl text-gray-300 pr-4">{content}</p>
          <div className="flex flex-col items-center sm:items-end w-full sm:w-auto shrink-0">
            <button 
              onClick={() => setIsOpen(true)}
              disabled={!consentChecked}
              className={`px-8 py-3.5 rounded-lg font-black shadow-[0_0_15px_rgba(250,204,21,0.15)] transition-all flex items-center gap-2 uppercase tracking-wide text-sm w-full sm:w-auto justify-center mb-1 ${consentChecked ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-slate-700 text-slate-400 cursor-not-allowed opacity-70 border border-slate-600'}`}
            >
              {getCtaText(vertical)}
            </button>
            {!consentChecked && (
              <span className="text-[10px] text-yellow-500 font-bold mb-1">Check the required consent box to request service.</span>
            )}
            <span className="text-[9px] text-gray-500 font-medium">By submitting, you agree to receive calls and text messages about your request.</span>
          </div>
        </div>
        
        <div className="max-w-[1200px] mx-auto w-full px-4 md:px-12 mt-4">
          <div className="bg-slate-900/80 border border-slate-700 rounded-lg p-4 flex items-start gap-3 cursor-pointer" onClick={() => setConsentChecked(!consentChecked)}>
            <input 
              type="checkbox" 
              checked={consentChecked}
              onChange={(e) => setConsentChecked(e.target.checked)}
              className="mt-1 w-5 h-5 rounded border-gray-500 text-blue-600 focus:ring-blue-500 bg-slate-800 shrink-0 pointer-events-none"
            />
            <p className="text-xs text-gray-300 leading-snug text-left font-medium select-none">
              <strong className="text-white block mb-1">Required:</strong>
              I agree to receive calls and text messages from HVAC Revenue Boost regarding my service request and appointment scheduling. Message frequency varies. Message and data rates may apply. Reply STOP to opt out, HELP for help. <span className="font-bold text-white underline decoration-yellow-500 underline-offset-2">Consent is not a condition of purchase.</span>
              <span className="block mt-2 text-[10px] text-gray-400 font-normal">By submitting, you agree to our <Link href="/privacy" className="underline hover:text-white transition-colors" onClick={(e) => e.stopPropagation()}>Privacy Policy</Link> and <Link href="/terms" className="underline hover:text-white transition-colors" onClick={(e) => e.stopPropagation()}>Terms of Service</Link>.</span>
            </p>
          </div>
        </div>
      </div>
      <LeadModal isOpen={isOpen} onClose={() => setIsOpen(false)} serviceCategory={vertical} cityContext={cityContext} />
    </>
  );
}

export function LocalCTAStrip({ vertical = "hvac", cityContext = "your area" }: { vertical?: string; cityContext?: string }) {
  const [isOpen, setIsOpen] = useState(false);

  const imageMap: Record<string, string> = {
    hvac: "/images/strange_noises.png",
    plumbing: "/images/leaky_faucet.png",
    electrical: "/images/electrical_panel.png",
  };

  const imageSrc = imageMap[vertical.toLowerCase()] || "/images/hero_fort_myers.png";
  const displayVertical = vertical.toUpperCase();

  return (
    <>
      <section className="bg-[#f8fafc] border border-gray-200 rounded overflow-hidden mt-6 mb-8 flex flex-col md:flex-row">
        <div className="relative w-full md:w-1/3 h-64 md:h-auto shrink-0">
           <Image src={imageSrc} alt={`${displayVertical} Technician`} fill className="object-cover" />
           <div className="absolute inset-0 bg-black/40"></div>
           <div className="absolute inset-0 flex items-center justify-center p-4">
             <HsdLogo className="scale-75 md:scale-90" />
           </div>
        </div>
        <div className="p-6 md:p-8 flex flex-col justify-center w-full">
          <h2 className="text-xl md:text-2xl font-black text-red-600 mb-2 leading-tight">
            Don’t let a small issue turn into a costly mistake.
          </h2>
          <p className="text-slate-600 mb-6 text-sm leading-relaxed font-medium">
            Local vetted pros. Fast response. Honest answers. Get a custom quote or schedule a repair before small issues turn into expensive disasters.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex flex-col items-center sm:items-start w-full sm:w-auto">
              <button 
                onClick={() => setIsOpen(true)}
                className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white px-8 py-3.5 rounded font-black shadow-md transition-all flex justify-center text-sm tracking-wide uppercase mb-1"
              >
                {getCtaText(vertical)}
              </button>
              <span className="text-[10px] text-gray-500 font-medium">By submitting, you agree to receive calls and text messages about your request.</span>
            </div>
            <div className="flex flex-wrap gap-4 text-xs text-slate-700 font-bold">
              <span className="flex items-center gap-1"><span className="text-green-600">✓</span> Same-Day Service</span>
              <span className="flex items-center gap-1"><span className="text-green-600">✓</span> Upfront Pricing</span>
              <span className="flex items-center gap-1"><span className="text-green-600">✓</span> Satisfaction Guaranteed</span>
            </div>
          </div>
        </div>
      </section>
      <LeadModal isOpen={isOpen} onClose={() => setIsOpen(false)} serviceCategory={displayVertical} cityContext={cityContext} />
    </>
  );
}
