import Link from 'next/link';
import {
  HeartPulse,
  Shield,
  Stethoscope,
  Users,
  Calendar,
  Activity,
  Award,
  ArrowRight,
  CheckCircle2,
  Clock,
  Building2,
  Lock,
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-sky-500 selection:text-white">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-sky-500 to-teal-400 text-white shadow-lg shadow-sky-500/20">
              <HeartPulse className="h-6 w-6 animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold tracking-tight text-white">
                MediCare <span className="text-sky-400">Nexus</span>
              </span>
              <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest leading-tight">Hospital System</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-300">
            <Link href="/about" className="hover:text-sky-400 transition">About Us</Link>
            <Link href="/services" className="hover:text-sky-400 transition">Services</Link>
            <Link href="/patient/doctors" className="hover:text-sky-400 transition">Find Doctor</Link>
            <Link href="/contact" className="hover:text-sky-400 transition">Contact</Link>
            <Link href="/faq" className="hover:text-sky-400 transition">FAQ</Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/auth/login" className="text-xs font-semibold text-slate-300 hover:text-white transition">
              Sign In
            </Link>
            <Link
              href="/auth/register"
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-sky-500 to-teal-400 hover:from-sky-400 hover:to-teal-300 shadow-lg shadow-sky-500/25 transition duration-200"
            >
              Book Appointment
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-28 overflow-hidden">
        <div className="absolute top-1/4 -left-40 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-sky-400 text-xs font-semibold">
              <Shield className="h-3.5 w-3.5" /> JCI Accredited Tertiary Facility
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
              Advanced Care. <br />
              <span className="bg-gradient-to-r from-sky-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
                Trusted Professionals. Better Health.
              </span>
            </h1>

            <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-xl">
              MediCare Nexus Hospital unifies administrative operations, clinical workflows, doctor scheduling, diagnostic laboratories, and patient health records into one seamlessly integrated, production-grade cloud platform.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/auth/login?role=admin"
                className="px-6 py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition flex items-center gap-2"
              >
                <Shield className="h-4 w-4" /> Admin Portal
              </Link>
              <Link
                href="/auth/login?role=doctor"
                className="px-6 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-lg shadow-teal-600/30 transition flex items-center gap-2"
              >
                <Stethoscope className="h-4 w-4" /> Doctor Portal
              </Link>
              <Link
                href="/auth/login?role=patient"
                className="px-6 py-3.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-lg shadow-sky-600/30 transition flex items-center gap-2"
              >
                <Users className="h-4 w-4" /> Patient Portal
              </Link>
            </div>

            <div className="pt-8 border-t border-slate-800/80 grid grid-cols-3 gap-4 text-center sm:text-left">
              <div>
                <p className="text-2xl font-bold text-white">99.8%</p>
                <p className="text-xs text-slate-400">Clinical Accuracy</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">50,000+</p>
                <p className="text-xs text-slate-400">Patients Treated</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">24/7</p>
                <p className="text-xs text-slate-400">Trauma Response</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1000&auto=format&fit=crop&q=80"
                alt="MediCare Nexus Hospital"
                className="w-full h-[450px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-md flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-white">MediCare Nexus Center</p>
                  <p className="text-[11px] text-slate-400">742 Evergreen Medical Parkway, NY 10021</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> 24/7 Open
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <HeartPulse className="h-5 w-5 text-sky-400" />
            <span className="font-bold text-white">MediCare Nexus Hospital System</span>
          </div>
          <p>© 2026 MediCare Nexus Hospital. All rights reserved. Advanced Care. Trusted Professionals. Better Health.</p>
        </div>
      </footer>
    </div>
  );
}
