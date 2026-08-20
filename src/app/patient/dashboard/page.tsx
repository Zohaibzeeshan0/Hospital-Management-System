'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { HeartPulse, Calendar, FileText, Pill, Receipt, Plus, Clock, CheckCircle2, Activity, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';

export default function PatientDashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [records, setRecords] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const userRes = await fetch('/api/auth/me');
      const userData = await userRes.json();
      setUser(userData.user);

      const [apptRes, recRes] = await Promise.all([
        fetch('/api/patient/appointments'),
        fetch('/api/patient/records'),
      ]);

      const apptData = await apptRes.json();
      const recData = await recRes.json();

      setAppointments(apptData.appointments || []);
      setRecords(recData);
    } catch (e) {
      console.error(e);
    }
  };

  const upcomingVisits = appointments.filter((a) => a.status === 'CONFIRMED' || a.status === 'PENDING');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header user={user} />
      <div className="flex flex-1">
        <Sidebar role="PATIENT" />
        <main className="flex-1 p-6 md:p-8 space-y-6">
          {/* Patient Hero Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-sky-900 via-slate-900 to-teal-900 text-white p-6 rounded-3xl shadow-xl">
            <div className="flex items-center gap-4">
              <img
                src={user?.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80'}
                alt=""
                className="h-16 w-16 rounded-2xl object-cover ring-4 ring-sky-500/30"
              />
              <div>
                <span className="text-xs font-semibold text-sky-400 uppercase tracking-wider">Personal Patient Portal</span>
                <h1 className="text-2xl font-bold tracking-tight">Hello, {user?.name}</h1>
                <p className="text-xs text-slate-300 mt-1">Patient ID: {user?.patientProfile?.patientCode} • Blood Group: {user?.patientProfile?.bloodGroup || 'O+'}</p>
              </div>
            </div>
            <Link
              href="/patient/appointments"
              className="px-5 py-2.5 rounded-xl bg-sky-500 text-white text-xs font-semibold hover:bg-sky-400 transition shadow-lg flex items-center gap-2"
            >
              Book Specialist Visit <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 font-medium">Upcoming Visits</p>
                <p className="text-xl font-bold text-slate-900 mt-1">{upcomingVisits.length}</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                <Calendar className="h-5 w-5" />
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 font-medium">Prescriptions</p>
                <p className="text-xl font-bold text-teal-600 mt-1">{records?.prescriptions?.length || 0}</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                <Pill className="h-5 w-5" />
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 font-medium">Lab Reports</p>
                <p className="text-xl font-bold text-purple-600 mt-1">{records?.labReports?.length || 0}</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <FileText className="h-5 w-5" />
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 font-medium">Invoices</p>
                <p className="text-xl font-bold text-emerald-600 mt-1">{records?.invoices?.length || 0}</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Receipt className="h-5 w-5" />
              </div>
            </div>
          </div>

          {/* Upcoming Visits & Prescriptions Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upcoming Visits Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">Upcoming Appointments</h3>
                <Link href="/patient/appointments" className="text-xs text-sky-600 font-semibold hover:underline">
                  Manage Visits →
                </Link>
              </div>

              <div className="space-y-3">
                {upcomingVisits.length === 0 ? (
                  <p className="text-center py-6 text-xs text-slate-400">No active appointment bookings.</p>
                ) : (
                  upcomingVisits.map((apt) => (
                    <div key={apt.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/70 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img src={apt.doctor.user.avatarUrl} alt="" className="h-10 w-10 rounded-xl object-cover" />
                        <div>
                          <p className="font-bold text-slate-900 text-xs">{apt.doctor.user.name}</p>
                          <p className="text-[10px] text-sky-600">{apt.department?.name}</p>
                          <p className="text-[10px] text-slate-500">{formatDate(apt.date)} • {apt.timeSlot}</p>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-sky-100 text-sky-700 text-[10px] font-bold">
                        {apt.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Recent Prescriptions */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">Active Prescriptions</h3>
                <Link href="/patient/records" className="text-xs text-teal-600 font-semibold hover:underline">
                  Medical Vault →
                </Link>
              </div>

              <div className="space-y-3">
                {records?.prescriptions?.length === 0 ? (
                  <p className="text-center py-6 text-xs text-slate-400">No active digital prescriptions.</p>
                ) : (
                  (records?.prescriptions || []).slice(0, 2).map((pres: any) => (
                    <div key={pres.id} className="p-4 rounded-xl border border-slate-100 bg-teal-50/30 space-y-2 text-xs">
                      <div className="flex justify-between font-bold text-slate-900">
                        <span>{pres.prescriptionNo}</span>
                        <span className="text-teal-600 text-[10px]">{formatDate(pres.createdAt)}</span>
                      </div>
                      <p className="text-slate-500 text-[10px]">Prescribed by {pres.doctor?.user?.name}</p>
                      <div className="space-y-1 pt-1">
                        {pres.items.map((item: any) => (
                          <div key={item.id} className="flex justify-between font-medium text-slate-800">
                            <span>• {item.medicineName} ({item.dosage})</span>
                            <span className="text-slate-500">{item.frequency}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
