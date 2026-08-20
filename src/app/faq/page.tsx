import Link from 'next/link';
import { HeartPulse, HelpCircle } from 'lucide-react';

export default function FAQPage() {
  const faqs = [
    { q: 'How do I book an appointment with a specialist?', a: 'You can search for doctors by department, specialization, or fee in the Patient Portal, or use the 1-Click Appointment Wizard on our website.' },
    { q: 'Can I access my lab reports and prescriptions online?', a: 'Yes! The Patient Portal includes a digital Medical Vault where you can view laboratory test results and print digital prescriptions anytime.' },
    { q: 'What insurance providers does MediPulse accept?', a: 'MediPulse partners with over 45 major health insurance providers including BlueCross, Aetna, Cigna, and Medicare.' },
    { q: 'How do emergency admissions work?', a: 'Our 24/7 Emergency Room operates a real-time STAT Triage system. Emergency patients are prioritized by severity (Critical, High, Medium, Low) and immediately assigned to trauma specialists.' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-sky-600 to-teal-500 text-white shadow-md">
              <HeartPulse className="h-6 w-6 animate-pulse" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-900">
              Medi<span className="text-sky-600">Pulse</span>
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <Link href="/about" className="text-xs font-semibold text-slate-700 hover:text-sky-600">About</Link>
            <Link href="/services" className="text-xs font-semibold text-slate-700 hover:text-sky-600">Services</Link>
            <Link href="/auth/login" className="px-4 py-2 rounded-xl text-xs font-semibold bg-sky-600 text-white shadow-md">Sign In</Link>
          </div>
        </div>
      </header>

      <section className="py-12 max-w-4xl mx-auto px-6 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-600">Frequently Asked Questions</span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Everything You Need to Know</h1>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-sky-600 shrink-0" /> {faq.q}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed pl-7">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
