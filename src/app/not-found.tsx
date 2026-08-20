import Link from 'next/link';
import { HeartPulse, ArrowLeft, ShieldAlert } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-center items-center p-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-sky-600 to-teal-500 text-white shadow-xl shadow-sky-600/30 mb-6">
        <HeartPulse className="h-8 w-8 animate-pulse" />
      </div>

      <span className="px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-bold uppercase tracking-wider mb-2">
        Error 404 — Page Not Found
      </span>

      <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">Clinical Route Unavailable</h1>
      <p className="text-slate-400 text-xs max-w-md mb-8">
        The requested medical resource or portal route does not exist or has been relocated.
      </p>

      <Link
        href="/"
        className="px-6 py-3 rounded-xl bg-gradient-to-r from-sky-600 to-teal-500 hover:from-sky-500 hover:to-teal-400 text-white text-xs font-bold shadow-lg shadow-sky-600/30 transition flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" /> Return to Hospital Home
      </Link>
    </div>
  );
}
