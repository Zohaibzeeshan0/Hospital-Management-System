'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { Search, Users, Activity, FileText, AlertCircle, Phone, Calendar, HeartPulse, X, Shield } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function AdminPatientsPage() {
  const [user, setUser] = useState<any>(null);
  const [patients, setPatients] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<any>(null);

  useEffect(() => {
    fetchPatients();
  }, [search]);

  const fetchPatients = async () => {
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
        <Sidebar role="ADMIN" />
        <main className="flex-1 p-6 md:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Patient Directory & Medical Profiles</h1>
              <p className="text-xs text-slate-500">Comprehensive patient records, medical history, blood groups, and emergency contacts.</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="relative">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search patient by name, code (e.g. PAT-2026-001), phone, or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-3.5">Patient Details</th>
                    <th className="px-6 py-3.5">Code & Blood</th>
                    <th className="px-6 py-3.5">Emergency Contact</th>
                    <th className="px-6 py-3.5">Allergies & Conditions</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {patients.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                        No registered patients found matching criteria.
                      </td>
                    </tr>
                  ) : (
                    patients.map((pat) => (
                      <tr key={pat.id} className="hover:bg-slate-50/80 transition">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={pat.user.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80'}
                              alt={pat.user.name}
                              className="h-10 w-10 rounded-xl object-cover ring-2 ring-slate-100"
                            />
                            <div>
                              <p className="font-bold text-slate-900 text-sm">{pat.user.name}</p>
                              <p className="text-[11px] text-slate-400">{pat.user.email} • {pat.user.phone || 'No phone'}</p>
                              <p className="text-[10px] text-slate-400">{pat.gender}, {formatDate(pat.dateOfBirth)}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-mono text-xs font-semibold text-slate-800">{pat.patientCode}</p>
                          <span className="inline-block mt-1 px-2 py-0.5 rounded bg-rose-100 text-rose-700 text-[10px] font-bold">
                            {pat.bloodGroup}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-medium text-slate-800">{pat.emergencyContact || 'Not specified'}</p>
                          <p className="text-[10px] text-slate-500">{pat.emergencyPhone}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-rose-600 font-medium text-[11px]">Allergies: {pat.allergies || 'None reported'}</p>
                          <p className="text-slate-500 text-[10px]">Conditions: {pat.medicalConditions || 'None'}</p>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => setSelectedPatient(pat)}
                            className="px-3 py-1.5 rounded-lg bg-sky-50 text-sky-600 hover:bg-sky-100 text-xs font-semibold transition"
                          >
                            Full Profile
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Detailed Patient Drawer Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 max-w-2xl w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <img src={selectedPatient.user.avatarUrl} alt="" className="h-12 w-12 rounded-2xl object-cover" />
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{selectedPatient.user.name}</h3>
                  <p className="text-xs text-sky-600 font-mono">{selectedPatient.patientCode} • Blood Group: {selectedPatient.bloodGroup}</p>
                </div>
              </div>
              <button onClick={() => setSelectedPatient(null)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl">
                <p className="text-slate-400 font-semibold mb-1">Contact Info</p>
                <p className="text-slate-800 font-medium">{selectedPatient.user.email}</p>
                <p className="text-slate-600">{selectedPatient.user.phone}</p>
                <p className="text-slate-600">{selectedPatient.address}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl">
                <p className="text-slate-400 font-semibold mb-1">Emergency Contact</p>
                <p className="text-slate-800 font-medium">{selectedPatient.emergencyContact}</p>
                <p className="text-slate-600">{selectedPatient.emergencyPhone}</p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Clinical History ({selectedPatient.medicalRecords?.length || 0} Visits)</h4>
              {(selectedPatient.medicalRecords || []).map((rec: any) => (
                <div key={rec.id} className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1 text-xs">
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>Diagnosis: {rec.diagnosis}</span>
                    <span className="text-slate-400 text-[10px]">{formatDate(rec.createdAt)}</span>
                  </div>
                  <p className="text-slate-600">Symptoms: {rec.symptoms}</p>
                  <p className="text-sky-700 font-medium">Treatment Plan: {rec.treatmentPlan}</p>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button onClick={() => setSelectedPatient(null)} className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold">
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
