import Link from 'next/link';
import { HeartPulse, MapPin, Phone, Mail, Clock, Send } from 'lucide-react';

export default function ContactPage() {
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

      <section className="py-12 max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600">Get In Touch</span>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">Contact MediPulse Center</h1>
            <p className="text-xs text-slate-600 mt-2">Have a clinical inquiry or need emergency assistance? Our medical staff is available 24/7.</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <div className="h-10 w-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Hospital Location</p>
                <p className="text-xs text-slate-500">742 Evergreen Medical Parkway, New York, NY 10021</p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <div className="h-10 w-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Emergency 24/7 Hotline</p>
                <p className="text-xs text-rose-600 font-bold">+1 (800) 999-EMERGENCY</p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <div className="h-10 w-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">General Inquiries</p>
                <p className="text-xs text-slate-500">info@medipulse.com</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-lg space-y-4">
          <h3 className="text-lg font-bold text-slate-900">Send Us a Direct Message</h3>
          <form className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Your Full Name</label>
              <input type="text" required placeholder="John Doe" className="w-full px-3.5 py-2.5 border rounded-xl text-xs bg-slate-50" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
              <input type="email" required placeholder="john@gmail.com" className="w-full px-3.5 py-2.5 border rounded-xl text-xs bg-slate-50" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Message / Inquiry</label>
              <textarea rows={4} required placeholder="How can we assist you?" className="w-full px-3.5 py-2.5 border rounded-xl text-xs bg-slate-50" />
            </div>
            <button type="submit" className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2">
              <Send className="h-4 w-4" /> Send Message
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
