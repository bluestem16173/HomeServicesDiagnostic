import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy | Home Service Diagnostics',
  description: 'Privacy Policy for HVAC Revenue Boost and Home Service Diagnostics.',
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-gray-50 text-slate-900 py-12 md:py-20 px-6">
      <div className="max-w-[800px] mx-auto bg-white p-8 md:p-12 shadow-sm rounded-lg border border-gray-200">
        <div className="mb-10 border-b pb-6">
          <Link href="/" className="text-blue-600 hover:underline text-sm font-semibold mb-6 inline-block">
            &larr; Back to Home
          </Link>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">Privacy Policy</h1>
          <p className="text-sm text-gray-500 font-medium">Effective Date: [4/24/2026]</p>
        </div>

        <div className="space-y-8 text-slate-700 leading-relaxed">
          <section>
            <p className="mb-4">
              <strong>Business Name:</strong> HVAC Revenue Boost / Home Service Diagnostic<br/>
              <strong>Website:</strong> <a href="https://homeservicediagnostics.com" className="text-blue-600 hover:underline">https://homeservicediagnostics.com</a><br/>
              <strong>Contact Email:</strong> <a href="mailto:support@hvacrevenueboost.com" className="text-blue-600 hover:underline">support@hvacrevenueboost.com</a>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">1. Information We Collect</h2>
            <p className="mb-3">We collect personal information that you voluntarily provide when submitting a service request, including:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Name</li>
              <li>Phone number</li>
              <li>Email address</li>
              <li>Service address</li>
              <li>Details about your service request</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">2. How We Use Your Information</h2>
            <p className="mb-3">We use your information to:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Connect you with HVAC service providers</li>
              <li>Schedule appointments</li>
              <li>Send service-related updates and notifications</li>
              <li>Respond to inquiries and customer support requests</li>
            </ul>
            <p className="font-semibold text-slate-900 bg-slate-100 p-3 rounded border-l-4 border-blue-600">We do not sell or share your personal information for marketing purposes.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">3. SMS Communications</h2>
            <p className="mb-3">By providing your phone number and opting in through our website, you consent to receive SMS messages from HVAC Revenue Boost related to your service request.</p>
            <p className="mb-3">These messages may include:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Appointment scheduling</li>
              <li>Service updates</li>
              <li>Technician communication</li>
              <li>Follow-ups related to your request</li>
            </ul>
            <p className="mb-3">Message frequency may vary. Message and data rates may apply.</p>
            <p className="mb-3">You can opt out at any time by replying <strong>STOP</strong> to any message.<br/>For assistance, reply <strong>HELP</strong> or contact us at <a href="mailto:support@hvacrevenueboost.com" className="text-blue-600 hover:underline">support@hvacrevenueboost.com</a>.</p>
            <p className="font-semibold">We do not send marketing or promotional messages without explicit consent.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">4. Consent and Opt-In</h2>
            <p className="mb-3">SMS consent is obtained through a clear, affirmative action on our website, such as selecting a checkbox before submitting a service request.</p>
            <p className="mb-3">Consent to receive SMS messages is not a condition of purchase.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">5. Sharing of Information</h2>
            <p className="mb-3">We may share your information with:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Local HVAC contractors or service providers to fulfill your request</li>
              <li>Service providers who assist in operating our website and communications</li>
            </ul>
            <p>All partners are expected to handle your data securely and only for the purpose of fulfilling your request.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">6. Data Security</h2>
            <p>We implement reasonable safeguards to protect your personal information. However, no method of transmission over the internet is 100% secure.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">7. Your Rights</h2>
            <p className="mb-3">You may request to:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Access your data</li>
              <li>Correct your data</li>
              <li>Delete your data</li>
            </ul>
            <p>Contact us at <a href="mailto:support@hvacrevenueboost.com" className="text-blue-600 hover:underline">support@hvacrevenueboost.com</a> for any requests.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">8. Updates to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated effective date.</p>
          </section>
        </div>
      </div>
    </main>
  );
}
