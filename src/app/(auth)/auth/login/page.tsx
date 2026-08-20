'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { HeartPulse, Shield, Stethoscope, User, ArrowRight, Lock, Mail, AlertCircle } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = searchParams.get('role') || 'admin';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fillDemoCredentials = (role: string) => {
    if (role === 'admin') {
      setEmail('admin@medipulse.com');
      setPassword('password123');
    } else if (role === 'doctor') {
      setEmail('doctor.smith@medipulse.com');
      setPassword('password123');
    } else if (role === 'patient') {
      setEmail('patient.john@gmail.com');
      setPassword('password123');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      if (data.role === 'ADMIN') {
        router.push('/admin/dashboard');
      } else if (data.role === 'DOCTOR') {
        router.push('/doctor/dashboard');
      } else {
        router.push('/patient/dashboard');
      }
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'An error occurred during sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Quick Demo Preset Selection Buttons */}
      <div className="mb-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-3 shadow-xl backdrop-blur-md">
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 text-center">⚡ One-Click Demo Logins</p>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => fillDemoCredentials('admin')}
            className="px-2.5 py-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 hover:bg-purple-500/20 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
          >
            <Shield className="h-3.5 w-3.5" /> Admin
          </button>
          <button
            type="button"
            onClick={() => fillDemoCredentials('doctor')}
            className="px-2.5 py-2 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-300 hover:bg-teal-500/20 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
          >
            <Stethoscope className="h-3.5 w-3.5" /> Doctor
          </button>
          <button
            type="button"
            onClick={() => fillDemoCredentials('patient')}
            className="px-2.5 py-2 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-300 hover:bg-sky-500/20 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
          >
            <User className="h-3.5 w-3.5" /> Patient
          </button>
        </div>
      </div>

      <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 py-8 px-6 shadow-2xl rounded-3xl sm:px-10">
        {error && (
          <div className="mb-4 rounded-xl bg-rose-500/10 border border-rose-500/20 p-3 text-xs text-rose-400 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <Mail className="h-4 w-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@medipulse.com"
                className="block w-full pl-10 pr-3 py-2.5 border border-slate-800 rounded-xl bg-slate-950 text-slate-100 text-xs placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-300">Password</label>
              <Link href="/auth/forgot-password" className="text-[11px] font-medium text-sky-400 hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <Lock className="h-4 w-4" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="block w-full pl-10 pr-3 py-2.5 border border-slate-800 rounded-xl bg-slate-950 text-slate-100 text-xs placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-sky-600 to-teal-500 hover:from-sky-500 hover:to-teal-400 shadow-lg shadow-sky-600/30 transition duration-200 disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In To Portal'} <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="mt-6 border-t border-slate-800 pt-4 text-center">
          <p className="text-xs text-slate-400">
            New patient?{' '}
            <Link href="/auth/register" className="font-semibold text-sky-400 hover:underline">
              Create Patient Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-sky-600/20 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-teal-600/20 rounded-full blur-3xl"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold text-white mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-sky-500 to-teal-400 text-white shadow-lg shadow-sky-500/30">
            <HeartPulse className="h-6 w-6 animate-pulse" />
          </div>
          Medi<span className="text-sky-400">Pulse</span>
        </Link>
        <h2 className="text-xl font-bold tracking-tight text-slate-200">Sign in to Hospital Workspace</h2>
        <p className="text-xs text-slate-400 mt-1">Select demo credentials or enter your login details below</p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <Suspense fallback={<div className="text-center text-slate-400 text-xs py-8">Loading sign-in workspace...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
