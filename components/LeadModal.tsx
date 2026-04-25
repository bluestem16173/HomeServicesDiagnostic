"use client";

import React, { useState } from "react";
import { X, ShieldCheck } from "lucide-react";
import Link from "next/link";

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceCategory?: string;
  cityContext?: string;
}

export default function LeadModal({ isOpen, onClose, serviceCategory = "Home Services", cityContext }: LeadModalProps) {
  const getCtaText = (vertical?: string) => {
    const v = (vertical || '').toLowerCase();
    if (v === 'plumbing') return 'Get Plumbing Fixed Today';
    if (v === 'electrical') return 'Get Electrical Fixed Today';
    return 'Get AC Fixed Today';
  };
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [consentChecked, setConsentChecked] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', zip: '', description: '' });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          serviceCategory,
          cityContext
        })
      });
    } catch (error) {
      console.error("Error submitting lead:", error);
    }
    
    setIsSubmitting(false);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setFormData({ name: '', phone: '', zip: '', description: '' });
      setConsentChecked(false);
      onClose();
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#0b1121] border border-white/10 w-full max-w-md rounded-2xl shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900/50 to-[#0b1121] p-6 border-b border-white/10 relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-2xl font-bold text-white mb-1">Get Expert Help</h2>
          <p className="text-sm text-gray-300">
            Local {serviceCategory} pros{cityContext ? ` in ${cityContext}` : ""}. Fast response. Honest answers.
          </p>
        </div>

        {/* Body */}
        <div className="p-6">
          {isSuccess ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/50">
                <ShieldCheck className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Request Received</h3>
              <p className="text-gray-400 text-sm">
                A top-rated local pro will contact you shortly to schedule your service.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Full Name</label>
                <input 
                  required
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Phone Number</label>
                <input 
                  required
                  type="tel" 
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="(555) 123-4567"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">ZIP Code</label>
                <input 
                  required
                  type="text" 
                  value={formData.zip}
                  onChange={e => setFormData({...formData, zip: e.target.value})}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="12345"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">What's going on with your {serviceCategory.toLowerCase()}?</label>
                <textarea 
                  required
                  rows={2}
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                  placeholder="Briefly describe the issue..."
                ></textarea>
              </div>
              
              <div className="flex items-start gap-3 mt-6 mb-6 bg-slate-900/50 p-4 border border-slate-700 rounded-lg">
                <input 
                  type="checkbox" 
                  id="tcpa-consent" 
                  checked={consentChecked}
                  onChange={(e) => setConsentChecked(e.target.checked)}
                  required
                  className="mt-1 w-5 h-5 rounded border-gray-500 text-blue-600 focus:ring-blue-500 bg-slate-800 shrink-0"
                />
                <label htmlFor="tcpa-consent" className="text-xs text-gray-300 leading-snug cursor-pointer font-medium">
                  <strong className="text-white block mb-1">Required:</strong>
                  I agree to receive calls and text messages from HVAC Revenue Boost regarding my service request and appointment scheduling. Message frequency varies. Message and data rates may apply. Reply STOP to opt out, HELP for help. <span className="font-bold text-white underline decoration-yellow-500 underline-offset-2">Consent is not a condition of purchase.</span>
                  <span className="block mt-2 text-[10px] text-gray-400 font-normal">By submitting, you agree to our <Link href="/privacy" className="underline hover:text-white transition-colors" onClick={(e) => e.stopPropagation()}>Privacy Policy</Link> and <Link href="/terms" className="underline hover:text-white transition-colors" onClick={(e) => e.stopPropagation()}>Terms of Service</Link>.</span>
                </label>
              </div>

              <div className="flex flex-col items-center">
                <button 
                  type="submit"
                  disabled={isSubmitting || !consentChecked}
                  className="w-full bg-[#facc15] hover:bg-yellow-500 text-black font-bold py-3 rounded-lg shadow-[0_0_15px_rgba(250,204,21,0.2)] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mb-2"
                >
                  {isSubmitting ? "Submitting..." : getCtaText(serviceCategory)}
                </button>
                <span className="text-[10px] text-gray-500 font-medium">By submitting, you agree to receive calls and text messages about your request.</span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
