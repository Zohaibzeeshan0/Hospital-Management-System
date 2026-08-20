'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { AlertCircle, Search, Plus, Stethoscope, Clock, ShieldAlert, CheckCircle2, User } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function AdminEmergencyPage() {
  const [user, setUser] = useState<any>(null);
  const [cases, setCases] = useState<any[]>([
    { id: '1', caseNo: 'EMG-2026-01', patientName: 'Robert Vance', emergencyType: 'Acute Myocardial Infarction', priority: 'Critical', status: 'In Treatment', doctorName: 'Dr. Sarah Smith', arrivalTime: '2026-08-19T09:15:00Z', notes: 'Immediate thrombolytic therapy initiated.' },
    { id: '2', caseNo: 'EMG-2026-02', patientName: 'Elena Rostova', emergencyType: 'Subdural Hematoma (Trauma)', priority: 'Critical', status: 'Waiting', doctorName: 'Dr. Michael Chen', arrivalTime: '2026-08-19T09:45:00Z', notes: 'Emergency STAT CT scan ordered.' },
    { id: '3', caseNo: 'EMG-2026-03', patientName: 'David Miller', emergencyType: 'Compound Femur Fracture', priority: 'High', status: 'In Treatment', doctorName: 'Dr. Sarah Smith', arrivalTime: '2026-08-19T08:30:00Z', notes: 'Splint applied. IV analgesia given.' },
  ]);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      setUser(data.user);
    } catch (e) {
      console.error(e);
    }
  };

  const criticalCount = cases.filter(c => c.priority === 'Critical').length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header user={user} />
      <div className="flex flex-1">
        <Sidebar role="ADMIN" />
        <main className="flex-1 p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <ShieldAlert className="h-6 w-6 text-rose-600 animate-pulse" /> Emergency Trauma & Triage Response
              </h1>
              <p className="text-xs text-slate-500">Monitor STAT emergency admissions, priority levels (Critical, High, Medium, Low), and attending physicians.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-rose-500/10 border border-rose-500/30 p-4 rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-xs text-rose-700 font-bold uppercase tracking-wider">Critical STAT Cases</p>
                <p className="text-2xl font-extrabold text-rose-700 mt-1">{criticalCount} Active</p>
              </div>
              <AlertCircle className="h-8 w-8 text-rose-600 animate-bounce" />
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 font-medium">In Treatment</p>
                <p className="text-2xl font-bold text-sky-600 mt-1">2 Patients</p>
              </div>
              <Stethoscope className="h-6 w-6 text-sky-600" />
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 font-medium">Waiting Triage</p>
                <p className="text-2xl font-bold text-amber-600 mt-1">1 Patient</p>
              </div>
              <Clock className="h-6 w-6 text-amber-600" />
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 font-medium">Discharged Today</p>
                <p className="text-2xl font-bold text-emerald-600 mt-1">5 Cases</p>
              </div>
              <CheckCircle2 className="h-6 w-6 text-emerald-600" />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-3.5">Case # & Patient</th>
                    <th className="px-6 py-3.5">Emergency Condition</th>
                    <th className="px-6 py-3.5">Triage Priority</th>
                    <th className="px-6 py-3.5">Assigned Physician</th>
                    <th className="px-6 py-3.5">Arrival Time</th>
                    <th className="px-6 py-3.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {cases.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50 transition">
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-900">{c.patientName}</p>
                        <p className="text-[10px] font-mono text-rose-600 font-bold">{c.caseNo}</p>
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-800">{c.emergencyType}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          c.priority === 'Critical' ? 'bg-rose-100 text-rose-700 animate-pulse' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {c.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-700 font-medium">{c.doctorName}</td>
                      <td className="px-6 py-4 text-slate-500 font-mono">{formatDate(c.arrivalTime, 'hh:mm a')}</td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-700">
                          {c.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
