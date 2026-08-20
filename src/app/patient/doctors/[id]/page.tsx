'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { Stethoscope, Star, Calendar, Clock, Globe, Award, ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function DoctorProfileDetailPage({ params }: { params: { id: string } }) {
  const [user, setUser] = useState<any>(null);
  const [doctor, setDoctor] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const userRes = await fetch('/api/auth/me');
      const userData = await userRes.json();
      setUser(userData.user);

      const docRes = await fetch('/api/admin/doctors');
      const docData = await docRes.json();
      const found = (docData.doctors || []).find((d: any) => d.id === params.id) || docData.doctors?.[0];
      setDoctor(found);
    } catch (e) {
      console.error(e);
    }
  };

  if (!doctor) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header user={user} />
      <div className="flex flex-1">
        <Sidebar role="PATIENT" />
        <main className="flex-1 p-6 md:p-8 space-y-6">
          <Link href="/patient/doctors" className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-sky-600 transition">
            <ArrowLeft className="h-4 w-4" /> Back to Specialist Directory
          </Link>

          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <img
                src={doctor.user.avatarUrl}
                alt=""
                className="h-32 w-32 rounded-3xl object-cover ring-4 ring-sky-500/20 shadow-lg"
              />
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-extrabold text-slate-900">{doctor.user.name}</h1>
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5" /> Board Certified
                  </span>
                </div>
                <p className="text-sm font-semibold text-teal-600">{doctor.specialization} • {doctor.department?.name}</p>
                <p className="text-xs text-slate-500 font-mono">License: {doctor.licenseNo} • {doctor.qualification}</p>

                <div className="flex items-center gap-4 text-xs pt-2">
                  <span className="flex items-center gap-1 font-bold text-amber-500">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" /> {doctor.rating || 4.9} (128 Reviews)
                  </span>
                  <span className="text-slate-500 font-medium">• {doctor.experienceYears} Years Clinical Experience</span>
                  <span className="text-slate-500 font-medium">• Languages: {doctor.languages || 'English, Spanish'}</span>
                </div>
              </div>

              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-center space-y-3 shrink-0">
                <p className="text-xs text-slate-500">Consultation Fee</p>
                <p className="text-3xl font-extrabold text-slate-900">{formatCurrency(doctor.consultationFee)}</p>
                <Link
                  href={`/patient/appointments?doc=${doctor.id}`}
                  className="block w-full px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-lg shadow-sky-600/30 transition"
                >
                  BOOK APPOINTMENT
                </Link>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-6 space-y-3">
              <h3 className="text-sm font-bold text-slate-900">Physician Biography</h3>
              <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
                {doctor.bio || 'Dr. Sarah Smith is a chief cardiologist specializing in ischemic heart disease, cardiac catheterization, and preventive vascular healthcare.'}
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
