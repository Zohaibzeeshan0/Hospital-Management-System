import Link from 'next/link';
import { HeartPulse, Award, Users, ShieldCheck, Activity, ArrowRight } from 'lucide-react';

export default function AboutPage() {
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
            <Link href="/services" className="text-xs font-semibold text-slate-700 hover:text-sky-600">Services</Link>
            <Link href="/faq" className="text-xs font-semibold text-slate-700 hover:text-sky-600">FAQ</Link>
            <Link href="/contact" className="text-xs font-semibold text-slate-700 hover:text-sky-600">Contact</Link>
            <Link href="/auth/login" className="px-4 py-2 rounded-xl text-xs font-semibold bg-sky-600 text-white shadow-md">Sign In</Link>
          </div>
        </div>
      </header>

      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 text-center max-w-3xl space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-600">About MediPulse Medical Center</span>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Pioneering Healthcare Excellence Since 2012</h1>
          <p className="text-slate-600 text-sm leading-relaxed">
            MediPulse Medical Center is a JCI-accredited tertiary care facility committed to compassionate patient care, groundbreaking clinical research, and state-of-the-art diagnostic technology.
          </p>
        </div>
      </section>

      <section className="py-16 max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="h-12 w-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
            <Award className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">JCI Accredited</h3>
          <p className="text-xs text-slate-600 leading-relaxed">Recognized globally for maintaining gold-standard clinical safety protocols and patient outcomes.</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="h-12 w-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center">
            <Users className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">120+ Board Specialists</h3>
          <p className="text-xs text-slate-600 leading-relaxed">Our multidisciplinary medical board includes internationally trained surgeons, cardiologists, and neurologists.</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="h-12 w-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">24/7 Trauma Emergency</h3>
          <p className="text-xs text-slate-600 leading-relaxed">Round-the-clock emergency room, ICU critical resuscitation, and helipad evacuation infrastructure.</p>
        </div>
      </section>
    </div>
  );
}
