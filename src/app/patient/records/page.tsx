'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { FileText, Pill, Stethoscope, TestTube, Download, Printer } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function PatientRecordsPage() {
  const [user, setUser] = useState<any>(null);
  const [records, setRecords] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'records' | 'prescriptions' | 'labs'>('prescriptions');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const userRes = await fetch('/api/auth/me');
      const userData = await userRes.json();
      setUser(userData.user);

      const res = await fetch('/api/patient/records');
      const data = await res.json();
      setRecords(data);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header user={user} />
      <div className="flex flex-1">
        <Sidebar role="PATIENT" />
        <main className="flex-1 p-6 md:p-8 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Personal Medical Health Vault</h1>
            <p className="text-xs text-slate-500">Access your digital prescriptions, clinical diagnosis history, and official laboratory test reports.</p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-200 gap-6 text-xs font-bold">
            <button
              onClick={() => setActiveTab('prescriptions')}
              className={`pb-3 transition border-b-2 ${
                activeTab === 'prescriptions'
                  ? 'border-sky-600 text-sky-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Digital Prescriptions ({records?.prescriptions?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab('records')}
              className={`pb-3 transition border-b-2 ${
                activeTab === 'records'
                  ? 'border-sky-600 text-sky-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Clinical Visit Diagnoses ({records?.medicalRecords?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab('labs')}
              className={`pb-3 transition border-b-2 ${
                activeTab === 'labs'
                  ? 'border-sky-600 text-sky-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Laboratory Test Reports ({records?.labReports?.length || 0})
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'prescriptions' && (
            <div className="space-y-4">
              {(records?.prescriptions || []).length === 0 ? (
                <p className="text-xs text-slate-400 py-8 text-center bg-white rounded-2xl border border-slate-200">No prescriptions found.</p>
              ) : (
                records.prescriptions.map((pres: any) => (
                  <div key={pres.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <Pill className="h-5 w-5 text-teal-600" />
                          <h3 className="font-bold text-slate-900 text-sm">{pres.prescriptionNo}</h3>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">Prescribed by {pres.doctor?.user?.name} on {formatDate(pres.createdAt)}</p>
                      </div>
                      <button onClick={() => window.print()} className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5">
                        <Printer className="h-3.5 w-3.5" /> Print Rx
                      </button>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs font-bold text-slate-900">Medications List:</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {pres.items.map((item: any) => (
                          <div key={item.id} className="p-3 rounded-xl bg-teal-50/50 border border-teal-100 text-xs space-y-1">
                            <p className="font-bold text-teal-900">{item.medicineName} — {item.dosage}</p>
                            <p className="text-teal-700">Take {item.frequency} for {item.duration}</p>
                            {item.instructions && <p className="text-[11px] text-teal-600 italic">{item.instructions}</p>}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'records' && (
            <div className="space-y-4">
              {(records?.medicalRecords || []).map((rec: any) => (
                <div key={rec.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-2 text-xs">
                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="font-bold text-slate-900 text-sm">Diagnosis: {rec.diagnosis}</span>
                    <span className="text-slate-400 font-mono">{formatDate(rec.createdAt)}</span>
                  </div>
                  <p className="text-slate-700"><strong>Attending Doctor:</strong> {rec.doctor?.user?.name}</p>
                  <p className="text-slate-600"><strong>Observed Symptoms:</strong> {rec.symptoms}</p>
                  <p className="text-sky-700 font-semibold"><strong>Treatment Plan:</strong> {rec.treatmentPlan}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'labs' && (
            <div className="space-y-4">
              {(records?.labReports || []).map((lab: any) => (
                <div key={lab.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3 text-xs">
                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <div className="flex items-center gap-2">
                      <TestTube className="h-5 w-5 text-purple-600" />
                      <span className="font-bold text-slate-900 text-sm">{lab.testName} ({lab.reportNo})</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-bold text-[10px]">{lab.status}</span>
                  </div>
                  <p className="text-slate-600"><strong>Category:</strong> {lab.category}</p>
                  <div className="p-3 bg-purple-50 rounded-xl border border-purple-100 text-purple-900 font-mono leading-relaxed">
                    {lab.result}
                  </div>
                  {lab.notes && <p className="text-slate-500 italic">Notes: {lab.notes}</p>}
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
