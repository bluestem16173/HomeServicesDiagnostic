"use client";

import { useState } from "react";
import LeadModal from "./LeadModal";

export default function ConclusionLeadCTA({
  vertical,
  cityContext,
}: {
  vertical: string;
  cityContext?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="w-full block text-center bg-[#1e3a8a] text-white font-bold text-[13px] py-3.5 rounded hover:bg-blue-800 transition-colors shadow-sm uppercase tracking-wide"
      >
        Get This Checked Before It Gets Worse
      </button>
      <LeadModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        serviceCategory={vertical}
        cityContext={cityContext}
      />
    </>
  );
}
