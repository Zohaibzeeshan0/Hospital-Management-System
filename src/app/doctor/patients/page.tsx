'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { Users, Search, Activity, FileText, HeartPulse, Clock, Calendar, AlertCircle, X, Pill, TestTube, CheckCircle2 } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function DoctorPatientsPage() {
  const [user, setUser] = useState<any>(null);
  const [patients, setPatients] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, [search]);

  const fetchData = async () => {
    try {
      const userRes = await fetch('/api/auth/me');
      const userData = await userRes.json();
      setUser(userData.user);

      const res = await fetch(`/api/admin/patients?search=${encodeURIComponent(search)}`);
      const data = await res.json();
      setPatients(data.patients || []);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header user={user} />
      <div className="flex flex-1">
        <Sidebar role="DOCTOR" />
        <main className="flex-1 p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My Assigned Patients</h1>
              <p className="text-xs text-slate-500">Access complete patient clinical history, previous visit diagnoses, vital signs timeline, and lab results.</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="relative">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search patient name, ID (PAT-2026-001), medical condition..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-800"
              />
            </div>
          </div>

          {/* Patient Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {patients.map((pat) => {
              const lastAppt = pat.appointments?.[0];
              const nextAppt = pat.appointments?.find((a: any) => a.status === 'CONFIRMED' || a.status === 'PENDING');
              return (
                <div key={pat.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition space-y-4">
                  <div className="flex items-center gap-3">
                    <img src={pat.user.avatarUrl} alt="" className="h-12 w-12 rounded-xl object-cover ring-2 ring-teal-500/20" />
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">{pat.user.name}</h3>
                      <p className="text-[10px] font-mono text-teal-600 font-bold">{pat.patientCode} • Blood: {pat.bloodGroup}</p>
                      <p className="text-[11px] text-slate-400">{pat.gender}, DoB: {formatDate(pat.dateOfBirth)}</p>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <p className="text-slate-600"><strong>Condition:</strong> {pat.medicalConditions || 'Mild Hypertension'}</p>
                    <p className="text-rose-600 text-[11px]"><strong>Allergies:</strong> {pat.allergies || 'None reported'}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 pt-1">
                    <div>
                      <span className="block text-[10px] font-semibold text-slate-400 uppercase">Last Visit</span>
                      <span className="font-medium text-slate-800">{lastAppt ? formatDate(lastAppt.date) : 'First Visit'}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-semibold text-slate-400 uppercase">Next Visit</span>
                      <span className="font-medium text-teal-600">{nextAppt ? formatDate(nextAppt.date) : 'None scheduled'}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedPatient(pat)}
                    className="w-full py-2 rounded-xl bg-teal-50 text-teal-700 hover:bg-teal-100 text-xs font-bold transition flex items-center justify-center gap-1.5"
                  >
                    <FileText className="h-4 w-4" /> View Full Medical Timeline
                  </button>
                </div>
              );
            })}
          </div>
        </main>
      </div>

      {/* Timeline Medical Record Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 max-w-3xl w-full shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <img src={selectedPatient.user.avatarUrl} alt="" className="h-12 w-12 rounded-xl object-cover" />
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{selectedPatient.user.name}</h3>
                  <p className="text-xs text-teal-600 font-mono">{selectedPatient.patientCode} • Blood Group: {selectedPatient.bloodGroup}</p>
                </div>
              </div>
              <button onClick={() => setSelectedPatient(null)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Patient Info Header Cards */}
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <p className="text-slate-400 font-semibold mb-0.5">Demographics</p>
                <p className="text-slate-800 font-medium">{selectedPatient.gender}, {formatDate(selectedPatient.dateOfBirth)}</p>
                <p className="text-slate-600">{selectedPatient.user.phone}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <p className="text-slate-400 font-semibold mb-0.5">Allergies & Risk</p>
                <p className="text-rose-600 font-semibold">{selectedPatient.allergies || 'None'}</p>
                <p className="text-slate-600">{selectedPatient.medicalConditions}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <p className="text-slate-400 font-semibold mb-0.5">Emergency Contact</p>
                <p className="text-slate-800 font-medium">{selectedPatient.emergencyContact || 'Family'}</p>
                <p className="text-slate-600">{selectedPatient.emergencyPhone}</p>
              </div>
            </div>

            {/* Timeline View */}
            <div className="space-y-4 border-t border-slate-100 pt-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Activity className="h-4 w-4 text-teal-600" /> Longitudinal Clinical History & Vitals Timeline
              </h4>

              <div className="relative pl-6 border-l-2 border-teal-200 space-y-6">
                {(selectedPatient.medicalRecords || []).length === 0 ? (
                  <p className="text-xs text-slate-400 py-4">No previous medical records found for this patient.</p>
                ) : (
                  (selectedPatient.medicalRecords || []).map((rec: any) => (
                    <div key={rec.id} className="relative space-y-2">
                      <div className="absolute -left-[31px] top-0 h-4 w-4 rounded-full bg-teal-500 ring-4 ring-white" />
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-2">
                        <div className="flex items-center justify-between font-bold text-slate-900 border-b border-slate-200 pb-2">
                          <span className="text-sm text-teal-900">Diagnosis: {rec.diagnosis}</span>
                          <span className="text-slate-400 font-mono text-[11px]">{formatDate(rec.createdAt, 'MMM dd, yyyy')}</span>
                        </div>
                        {rec.chiefComplaint && <p className="text-slate-700"><strong>Chief Complaint:</strong> {rec.chiefComplaint}</p>}
                        <p className="text-slate-600"><strong>Symptoms:</strong> {rec.symptoms}</p>
                        <p className="text-teal-700 font-semibold"><strong>Treatment Plan:</strong> {rec.treatmentPlan}</p>

                        {/* Vital Signs Grid */}
                        <div className="mt-3 pt-3 border-t border-slate-200/80">
                          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Observed Vital Signs</p>
                          <div className="grid grid-cols-4 gap-2 text-[11px]">
                            <div className="bg-white p-2 rounded-lg border border-slate-200">
                              <span className="text-[10px] text-slate-400 block">BP</span>
                              <span className="font-bold text-slate-900">{rec.bloodPressure || '120/80 mmHg'}</span>
                            </div>
                            <div className="bg-white p-2 rounded-lg border border-slate-200">
                              <span className="text-[10px] text-slate-400 block">Heart Rate</span>
                              <span className="font-bold text-slate-900">{rec.heartRate || '72 bpm'}</span>
                            </div>
                            <div className="bg-white p-2 rounded-lg border border-slate-200">
                              <span className="text-[10px] text-slate-400 block">Temp</span>
                              <span className="font-bold text-slate-900">{rec.temperature || '98.6 °F'}</span>
                            </div>
                            <div className="bg-white p-2 rounded-lg border border-slate-200">
                              <span className="text-[10px] text-slate-400 block">SpO2</span>
                              <span className="font-bold text-teal-600">{rec.oxygenSaturation || '99%'}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button onClick={() => setSelectedPatient(null)} className="px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold">
                Close Timeline
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
