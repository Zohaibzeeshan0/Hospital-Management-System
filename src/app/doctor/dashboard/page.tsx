'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { Stethoscope, Calendar, Clock, Users, CheckCircle2, FileText, Activity, AlertCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function DoctorDashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const userRes = await fetch('/api/auth/me');
      const userData = await userRes.json();
      setUser(userData.user);

      const apptRes = await fetch('/api/doctor/appointments?filter=all');
      const apptData = await apptRes.json();
      setAppointments(apptData.appointments || []);
    } catch (e) {
      console.error(e);
    }
  };

  const todaysAppointments = appointments.filter((a) => {
    const todayStr = new Date().toISOString().split('T')[0];
    return a.date.startsWith(todayStr);
  });

  const pendingConsults = appointments.filter((a) => a.status === 'CONFIRMED' || a.status === 'PENDING');
  const completedConsults = appointments.filter((a) => a.status === 'COMPLETED');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header user={user} />
      <div className="flex flex-1">
        <Sidebar role="DOCTOR" />
        <main className="flex-1 p-6 md:p-8 space-y-6">
          {/* Welcome Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-teal-900 via-slate-900 to-sky-900 text-white p-6 rounded-3xl shadow-xl">
            <div className="flex items-center gap-4">
              <img
                src={user?.avatarUrl || 'https://images.unsplash.com/photo-1594824813566-8185b9b94042?w=200&auto=format&fit=crop&q=80'}
                alt=""
                className="h-16 w-16 rounded-2xl object-cover ring-4 ring-teal-500/30"
              />
              <div>
                <span className="text-xs font-semibold text-teal-400 uppercase tracking-wider">Doctor Clinical Suite</span>
                <h1 className="text-2xl font-bold tracking-tight">Welcome, {user?.name || 'Doctor'}</h1>
                <p className="text-xs text-slate-300 mt-1">{user?.doctorProfile?.specialization} • {user?.doctorProfile?.department?.name}</p>
              </div>
            </div>
            <Link
              href="/doctor/appointments"
              className="px-5 py-2.5 rounded-xl bg-teal-500 text-white text-xs font-semibold hover:bg-teal-400 transition shadow-lg flex items-center gap-2"
            >
              Start Consultations <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 font-medium">Today's Visits</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{todaysAppointments.length}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                <Clock className="h-6 w-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 font-medium">Pending Consultations</p>
                <p className="text-2xl font-bold text-amber-600 mt-1">{pendingConsults.length}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <AlertCircle className="h-6 w-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 font-medium">Completed Consults</p>
                <p className="text-2xl font-bold text-emerald-600 mt-1">{completedConsults.length}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6" />
              </div>
            </div>
          </div>

          {/* Today's Schedule Feed */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Today's Clinical Roster</h3>
                <p className="text-xs text-slate-500">Patients scheduled for consultation today</p>
              </div>
              <Link href="/doctor/appointments" className="text-xs text-sky-600 font-semibold hover:underline">
                View All Appointments →
              </Link>
            </div>

            <div className="space-y-3">
              {todaysAppointments.length === 0 ? (
                <p className="text-center py-6 text-xs text-slate-400">No scheduled appointments for today.</p>
              ) : (
                todaysAppointments.map((apt) => (
                  <div key={apt.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-white hover:border-slate-200 transition">
                    <div className="flex items-center gap-3">
                      <img src={apt.patient.user.avatarUrl} alt="" className="h-10 w-10 rounded-xl object-cover" />
                      <div>
                        <p className="font-bold text-slate-900 text-xs">{apt.patient.user.name}</p>
                        <p className="text-[10px] text-slate-500">{apt.reason}</p>
                        <span className="text-[10px] text-teal-600 font-semibold">{apt.timeSlot}</span>
                      </div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      apt.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' : 'bg-sky-100 text-sky-700'
                    }`}>
                      {apt.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
