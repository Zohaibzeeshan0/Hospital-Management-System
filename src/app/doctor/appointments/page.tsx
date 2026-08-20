'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { Calendar, Clock, CheckCircle2, XCircle, Stethoscope, Plus, FileText, Pill, X } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function DoctorAppointmentsPage() {
  const [user, setUser] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [activeConsult, setActiveConsult] = useState<any>(null);

  // Consultation form fields
  const [diagnosis, setDiagnosis] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [treatmentPlan, setTreatmentPlan] = useState('');
  const [notes, setNotes] = useState('');
  const [prescriptionItems, setPrescriptionItems] = useState<any[]>([
    { medicineName: 'Amoxicillin 500mg', dosage: '1 tablet', frequency: 'Twice Daily', duration: '7 Days', instructions: 'Take after meals' }
  ]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const userRes = await fetch('/api/auth/me');
      const userData = await userRes.json();
      setUser(userData.user);

      const res = await fetch('/api/doctor/appointments?filter=all');
      const data = await res.json();
      setAppointments(data.appointments || []);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAction = async (appointmentId: string, action: string) => {
    try {
      await fetch('/api/doctor/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appointmentId, action }),
      });
      fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  const addPrescriptionItem = () => {
    setPrescriptionItems([...prescriptionItems, { medicineName: '', dosage: '', frequency: 'Once Daily', duration: '5 Days', instructions: '' }]);
  };

  const updatePrescriptionItem = (index: number, field: string, val: string) => {
    const updated = [...prescriptionItems];
    updated[index][field] = val;
    setPrescriptionItems(updated);
  };

  const handleCompleteConsultation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeConsult) return;

    try {
      await fetch('/api/doctor/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appointmentId: activeConsult.id,
          action: 'COMPLETE',
          diagnosis,
          symptoms,
          treatmentPlan,
          notes,
          prescriptionItems,
        }),
      });

      setActiveConsult(null);
      setDiagnosis('');
      setSymptoms('');
      setTreatmentPlan('');
      setNotes('');
      fetchData();
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
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Doctor Clinical Workspace</h1>
              <p className="text-xs text-slate-500">Conduct consultations, record diagnoses, and issue digital prescriptions.</p>
            </div>
          </div>

          {/* Appointments Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-3.5">Patient Details</th>
                    <th className="px-6 py-3.5">Date & Slot</th>
                    <th className="px-6 py-3.5">Reason for Visit</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5 text-right">Consultation Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {appointments.map((apt) => (
                    <tr key={apt.id} className="hover:bg-slate-50 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={apt.patient.user.avatarUrl} alt="" className="h-10 w-10 rounded-xl object-cover" />
                          <div>
                            <p className="font-bold text-slate-900 text-sm">{apt.patient.user.name}</p>
                            <p className="text-[10px] text-slate-400">{apt.patient.gender}, Blood: {apt.patient.bloodGroup}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-slate-800">{formatDate(apt.date)}</p>
                        <p className="text-[10px] text-teal-600 font-medium">{apt.timeSlot}</p>
                      </td>
                      <td className="px-6 py-4 text-slate-700 max-w-xs">{apt.reason}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          apt.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' :
                          apt.status === 'CONFIRMED' ? 'bg-sky-100 text-sky-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {apt.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-1.5">
                        {apt.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => handleAction(apt.id, 'CONFIRM')}
                              className="px-3 py-1 rounded-lg bg-teal-50 text-teal-600 hover:bg-teal-100 font-semibold"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleAction(apt.id, 'REJECT')}
                              className="px-3 py-1 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 font-semibold"
                            >
                              Decline
                            </button>
                          </>
                        )}
                        {apt.status === 'CONFIRMED' && (
                          <button
                            onClick={() => { setActiveConsult(apt); setSymptoms(apt.reason); }}
                            className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold shadow-md transition"
                          >
                            Start Consultation
                          </button>
                        )}
                        {apt.status === 'COMPLETED' && (
                          <span className="text-[11px] text-emerald-600 font-semibold flex items-center justify-end gap-1">
                            <CheckCircle2 className="h-4 w-4" /> Consultation Complete
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Consultation & Digital Prescription Modal */}
      {activeConsult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 max-w-3xl w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Clinical Consultation — {activeConsult.patient.user.name}</h3>
                <p className="text-xs text-slate-400">Record clinical diagnosis & prescribe digital medication</p>
              </div>
              <button onClick={() => setActiveConsult(null)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCompleteConsultation} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Observed Symptoms</label>
                  <textarea
                    rows={2}
                    required
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Clinical Diagnosis</label>
                  <textarea
                    rows={2}
                    required
                    placeholder="e.g. Acute Upper Respiratory Infection"
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Treatment Plan & Recommendations</label>
                <textarea
                  rows={2}
                  value={treatmentPlan}
                  onChange={(e) => setTreatmentPlan(e.target.value)}
                  placeholder="Bed rest, hydration 3L/day, follow up in 7 days."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              {/* Digital Prescription Builder */}
              <div className="border-t border-slate-200 pt-3 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Pill className="h-4 w-4 text-teal-600" /> Issue Digital Prescription
                  </h4>
                  <button
                    type="button"
                    onClick={addPrescriptionItem}
                    className="text-xs text-teal-600 font-semibold hover:underline flex items-center gap-1"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add Medicine
                  </button>
                </div>

                <div className="space-y-2">
                  {prescriptionItems.map((item, idx) => (
                    <div key={idx} className="grid grid-cols-4 gap-2 bg-slate-50 p-2.5 rounded-xl text-xs border border-slate-200">
                      <input
                        type="text"
                        placeholder="Medicine Name"
                        value={item.medicineName}
                        onChange={(e) => updatePrescriptionItem(idx, 'medicineName', e.target.value)}
                        className="px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs"
                      />
                      <input
                        type="text"
                        placeholder="Dosage (e.g. 500mg)"
                        value={item.dosage}
                        onChange={(e) => updatePrescriptionItem(idx, 'dosage', e.target.value)}
                        className="px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs"
                      />
                      <input
                        type="text"
                        placeholder="Frequency"
                        value={item.frequency}
                        onChange={(e) => updatePrescriptionItem(idx, 'frequency', e.target.value)}
                        className="px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs"
                      />
                      <input
                        type="text"
                        placeholder="Duration (e.g. 7 Days)"
                        value={item.duration}
                        onChange={(e) => updatePrescriptionItem(idx, 'duration', e.target.value)}
                        className="px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setActiveConsult(null)} className="px-4 py-2 rounded-xl text-xs text-slate-600 bg-slate-100">
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2 rounded-xl text-xs font-bold text-white bg-teal-600 hover:bg-teal-500 shadow-md">
                  Complete Consultation & Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
