import React from 'react';

export type Cause = {
  title: string;
  description: string;
};

export type DiagnosticContent = {
  field_triage: string;
  diagnostic_flow: string[];
  top_causes: Cause[];
  quick_checks: string[];
  stop_diy: string;
  repair_vs_replace: string;
  cta: string;
};

export type DiagnosticData = {
  seo: {
    title: string;
    description: string;
  };
  content: DiagnosticContent;
};

function TriageBlock({ content }: { content?: string }) {
  if (!content) return null;
  return (
    <section className="my-8 p-6 bg-red-50 border-l-4 border-red-500 rounded-md">
      <h2 className="text-xl font-bold text-red-700 mb-2">Field Triage</h2>
      <p className="text-gray-800">{content}</p>
    </section>
  );
}

function DecisionFlow({ content }: { content?: string[] }) {
  if (!content || !content.length) return null;
  return (
    <section className="my-8">
      <h2 className="text-2xl font-semibold mb-4">Diagnostic Flow</h2>
      <ul className="list-disc pl-5 space-y-2">
        {content.map((step, i) => (
          <li key={i} className="text-gray-700">{step}</li>
        ))}
      </ul>
    </section>
  );
}

function CauseCards({ causes }: { causes?: Cause[] }) {
  if (!causes || !causes.length) return null;
  return (
    <section className="my-8">
      <h2 className="text-2xl font-semibold mb-4">Top Causes</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {causes.map((c, i) => (
          <div key={i} className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
            <h3 className="font-bold text-lg mb-2">{c.title}</h3>
            <p className="text-gray-600">{c.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function QuickChecks({ checks }: { checks?: string[] }) {
  if (!checks || !checks.length) return null;
  return (
    <section className="my-8 p-6 bg-blue-50 rounded-lg">
      <h2 className="text-xl font-bold text-blue-800 mb-4">Quick Checks</h2>
      <ul className="list-disc pl-5 space-y-2 text-blue-900">
        {checks.map((check, i) => (
          <li key={i}>{check}</li>
        ))}
      </ul>
    </section>
  );
}

function StopDIYAlert({ content }: { content?: string }) {
  if (!content) return null;
  return (
    <section className="my-8 p-6 bg-yellow-100 border border-yellow-400 rounded-lg">
      <h2 className="text-xl font-bold text-yellow-800 mb-2">Stop DIY Alert</h2>
      <p className="text-yellow-900">{content}</p>
    </section>
  );
}

function RepairVsReplace({ content }: { content?: string }) {
  if (!content) return null;
  return (
    <section className="my-8 p-6 bg-gray-100 rounded-lg">
      <h2 className="text-xl font-bold text-gray-800 mb-2">Repair vs Replace</h2>
      <p className="text-gray-700">{content}</p>
    </section>
  );
}

function StickyCTA({ content }: { content?: string }) {
  if (!content) return null;
  return (
    <div className="fixed bottom-0 left-0 w-full bg-blue-600 text-white p-4 text-center shadow-lg z-50">
      <p className="font-bold">{content}</p>
    </div>
  );
}

export default function DiagnosticPageView({ data }: { data: DiagnosticData }) {
  if (!data || !data.content) {
    return <p>No content available.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 pb-24">
      <h1 className="text-4xl font-extrabold mb-6">{data.seo?.title || "Diagnostic Report"}</h1>
      
      <TriageBlock content={data.content.field_triage} />
      <DecisionFlow content={data.content.diagnostic_flow} />
      <CauseCards causes={data.content.top_causes} />
      <QuickChecks checks={data.content.quick_checks} />
      <StopDIYAlert content={data.content.stop_diy} />
      <RepairVsReplace content={data.content.repair_vs_replace} />
      
      <StickyCTA content={data.content.cta} />
    </div>
  );
}
