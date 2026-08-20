'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { LogOut, FileText, CheckCircle2, Calendar, User, Printer } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function AdminAdmissionsPage() {
  const [user, setUser] = useState<any>(null);
  const [admissions, setAdmissions] = useState<any[]>([
    {
      id: '1',
      admissionNo: 'ADM-2026-801',
      patientName: 'Robert Vance',
      doctorName: 'Dr. Sarah Smith',
      deptName: 'Cardiology',
      bedNumber: 'BED-ICU-101',
      admissionDate: '2026-08-15T10:00:00Z',
      reason: 'Acute Coronary Syndrome',
      diagnosis: 'STEMI Antero-septal',
      status: 'Admitted',
    },
    {
      id: '2',
      admissionNo: 'ADM-2026-802',
      patientName: 'John Doe',
      doctorName: 'Dr. Michael Chen',
      deptName: 'Neurology',
      bedNumber: 'BED-GEN-201',
      admissionDate: '2026-08-10T14:30:00Z',
      reason: 'Seizure workup and EEG monitoring',
      diagnosis: 'Temporal Lobe Epilepsy',
      status: 'Discharged',
      dischargeDate: '2026-08-18T11:00:00Z',
      treatmentSummary: 'Optimized Levetiracetam 500mg BID. 24h video EEG clear.',
    },
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

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header user={user} />
      <div className="flex flex-1">
        <Sidebar role="ADMIN" />
        <main className="flex-1 p-6 md:p-8 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Patient Inpatient Admissions & Discharges</h1>
            <p className="text-xs text-slate-500">Manage inpatient ward stays, medical diagnoses, attending physicians, and generate discharge summaries.</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-3.5">Admission #</th>
                    <th className="px-6 py-3.5">Patient</th>
                    <th className="px-6 py-3.5">Attending Physician</th>
                    <th className="px-6 py-3.5">Bed / Room</th>
                    <th className="px-6 py-3.5">Admission Date</th>
                    <th className="px-6 py-3.5">Diagnosis</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {admissions.map((adm) => (
                    <tr key={adm.id} className="hover:bg-slate-50 transition">
                      <td className="px-6 py-4 font-mono font-bold text-sky-600">{adm.admissionNo}</td>
                      <td className="px-6 py-4 font-semibold text-slate-900">{adm.patientName}</td>
                      <td className="px-6 py-4 text-slate-700">{adm.doctorName}</td>
                      <td className="px-6 py-4 font-mono text-slate-600">{adm.bedNumber}</td>
                      <td className="px-6 py-4 text-slate-500">{formatDate(adm.admissionDate)}</td>
                      <td className="px-6 py-4 font-medium text-slate-800">{adm.diagnosis}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          adm.status === 'Admitted' ? 'bg-sky-100 text-sky-700' : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {adm.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button onClick={() => alert(`Discharge Summary for ${adm.admissionNo}:\nDiagnosis: ${adm.diagnosis}\nTreatment: ${adm.treatmentSummary || 'Ongoing Inpatient Care'}`)} className="text-xs font-bold text-sky-600 hover:underline flex items-center gap-1">
                          <Printer className="h-3.5 w-3.5" /> Summary
                        </button>
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
