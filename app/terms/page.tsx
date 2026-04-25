import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service | Home Service Diagnostics',
  description: 'Terms of Service for HVAC Revenue Boost and Home Service Diagnostics.',
};

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen bg-gray-50 text-slate-900 py-12 md:py-20 px-6">
      <div className="max-w-[800px] mx-auto bg-white p-8 md:p-12 shadow-sm rounded-lg border border-gray-200">
        <div className="mb-10 border-b pb-6">
          <Link href="/" className="text-blue-600 hover:underline text-sm font-semibold mb-6 inline-block">
            &larr; Back to Home
          </Link>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">Terms of Service</h1>
          <p className="text-sm text-gray-500 font-medium">Effective Date: [4/24/2026]</p>
        </div>

        <div className="space-y-8 text-slate-700 leading-relaxed">
          <section>
            <p className="mb-4">
              <strong>Business Name:</strong> HVAC Revenue Boost/Home Service Diagnostics<br/>
              <strong>Website:</strong> <a href="https://homeservicediagnostics.com/" className="text-blue-600 hover:underline">https://homeservicediagnostics.com/</a>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">1. Acceptance of Terms</h2>
            <p>By accessing or using this website, you agree to be bound by these Terms of Service.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">2. Services Provided</h2>
            <p className="mb-3">HVAC Revenue Boost | Home Service Diagnostics connects users with HVAC, electrical, plumbing, and window/general construction service providers for repair, maintenance, and installation services.</p>
            <p className="font-semibold text-slate-900 bg-slate-100 p-3 rounded border-l-4 border-blue-600">We do not directly perform trade services.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">3. No Guarantee of Service</h2>
            <p className="mb-3">We do not guarantee:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Availability of service providers</li>
              <li>Quality of work performed</li>
              <li>Response times</li>
            </ul>
            <p>All services are provided by third-party contractors.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">4. User Responsibilities</h2>
            <p className="mb-3">You agree to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide accurate and truthful information</li>
              <li>Use the website only for legitimate service requests</li>
              <li>Not misuse or attempt to disrupt the platform</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">5. SMS Communications</h2>
            <p className="mb-3">By submitting your information and opting in, you agree to receive SMS messages from HVAC Revenue Boost | Home Service Diagnostics related to your service request.</p>
            <p className="mb-3">These messages may include:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Appointment confirmations</li>
              <li>Service updates</li>
              <li>Follow-up communications</li>
            </ul>
            <p className="mb-3">Message frequency varies. Message and data rates may apply.</p>
            <p className="mb-3">You may opt out at any time by replying <strong>STOP</strong>.<br/>For assistance, reply <strong>HELP</strong> or contact <a href="mailto:support@hvacrevenueboost.com" className="text-blue-600 hover:underline">support@hvacrevenueboost.com</a>.</p>
            <p className="font-semibold">Consent to receive SMS messages is not required as a condition of purchase.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">6. Limitation of Liability</h2>
            <p className="mb-3">HVAC Revenue Boost | Home Service Diagnostics not liable for:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Damages caused by third-party contractors</li>
              <li>Service delays or failures</li>
              <li>Any indirect or consequential damages</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">7. Intellectual Property</h2>
            <p>All content on this site is owned by HVAC Revenue Boost and may not be copied or reused without permission.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">8. Termination</h2>
            <p>We reserve the right to restrict or terminate access to the site at our discretion.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">9. Changes to Terms</h2>
            <p>We may update these Terms at any time. Continued use of the site constitutes acceptance of the updated Terms.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">10. Contact Information</h2>
            <p>For questions, contact:<br/><a href="mailto:support@hvacrevenueboost.com" className="text-blue-600 hover:underline font-medium">support@hvacrevenueboost.com</a></p>
          </section>
        </div>
      </div>
    </main>
  );
}
