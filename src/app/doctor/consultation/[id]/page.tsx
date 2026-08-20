'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { Stethoscope, Pill, TestTube, Activity, Plus, Save, Calendar, ArrowLeft, Trash2, CheckCircle2 } from 'lucide-react';

export default function DoctorConsultationPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [appointment, setAppointment] = useState<any>(null);
  const [labCatalog, setLabCatalog] = useState<any[]>([]);

  // Form states
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [examinationNotes, setExaminationNotes] = useState('');
  const [treatmentPlan, setTreatmentPlan] = useState('');
  const [doctorNotes, setDoctorNotes] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');

  // Vital Signs
  const [bloodPressure, setBloodPressure] = useState('120/80');
  const [heartRate, setHeartRate] = useState('72');
  const [temperature, setTemperature] = useState('98.6');
  const [respiratoryRate, setRespiratoryRate] = useState('16');
  const [oxygenSaturation, setOxygenSaturation] = useState('99');
  const [weight, setWeight] = useState('70');
  const [height, setHeight] = useState('175');

  // Calculated BMI
  const bmi = (Number(weight) && Number(height))
    ? (Number(weight) / Math.pow(Number(height) / 100, 2)).toFixed(1)
    : '22.9';

  // Digital Prescription Items
  const [prescriptionItems, setPrescriptionItems] = useState<any[]>([
    { medicineName: 'Paracetamol', dosage: '500mg', frequency: '2 times daily', duration: '5 days', route: 'Oral', instructions: 'Take after meals' }
  ]);

  // Selected Lab Tests to Order
  const [selectedLabs, setSelectedLabs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const userRes = await fetch('/api/auth/me');
      const userData = await userRes.json();
      setUser(userData.user);

      const apptRes = await fetch('/api/doctor/appointments?filter=all');
      const apptData = await apptRes.json();
      const appt = (apptData.appointments || []).find((a: any) => a.id === params.id) || apptData.appointments?.[0];
      if (appt) {
        setAppointment(appt);
        setSymptoms(appt.reason || '');
      }

      // Fetch Lab Catalog
      const labRes = await fetch('/api/lab/catalog');
      const labData = await labRes.json();
      setLabCatalog(labData.catalog || []);
    } catch (e) {
      console.error(e);
    }
  };

  const addMedicine = () => {
    setPrescriptionItems([...prescriptionItems, { medicineName: '', dosage: '', frequency: '2 times daily', duration: '5 days', route: 'Oral', instructions: '' }]);
  };

  const removeMedicine = (idx: number) => {
    setPrescriptionItems(prescriptionItems.filter((_, i) => i !== idx));
  };

  const updateMedicine = (idx: number, field: string, value: string) => {
    const updated = [...prescriptionItems];
    updated[idx][field] = value;
    setPrescriptionItems(updated);
  };

  const handleSaveConsultation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appointment) return;
    setLoading(true);

    try {
      // 1. Save Consultation & Record
      const res = await fetch('/api/doctor/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appointmentId: appointment.id,
          action: 'COMPLETE',
          chiefComplaint,
          symptoms,
          diagnosis,
          examinationNotes,
          treatmentPlan,
          doctorNotes,
          followUpDate,
          bloodPressure: `${bloodPressure} mmHg`,
          heartRate: `${heartRate} bpm`,
          temperature: `${temperature} °F`,
          respiratoryRate: `${respiratoryRate} breaths/min`,
          oxygenSaturation: `${oxygenSaturation}%`,
          weight: `${weight} kg`,
          height: `${height} cm`,
          bmi: `${bmi} kg/m²`,
          prescriptionItems,
          selectedLabs,
        }),
      });

      if (res.ok) {
        router.push('/doctor/appointments');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header user={user} />
      <div className="flex flex-1">
        <Sidebar role="DOCTOR" />
        <main className="flex-1 p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => router.back()} className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50">
                <ArrowLeft className="h-4 w-4" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Clinical Consultation Screen</h1>
                <p className="text-xs text-slate-500">Patient: {appointment?.patient?.user?.name || 'Patient'} ({appointment?.patient?.patientCode})</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSaveConsultation} className="space-y-6">
            {/* Vital Signs Panel */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Activity className="h-4 w-4 text-teal-600" /> Patient Vital Signs
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Blood Pressure (mmHg)</label>
                  <input type="text" value={bloodPressure} onChange={(e) => setBloodPressure(e.target.value)} className="w-full px-3 py-2 border rounded-xl text-xs bg-slate-50" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Heart Rate (bpm)</label>
                  <input type="text" value={heartRate} onChange={(e) => setHeartRate(e.target.value)} className="w-full px-3 py-2 border rounded-xl text-xs bg-slate-50" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Temperature (°F)</label>
                  <input type="text" value={temperature} onChange={(e) => setTemperature(e.target.value)} className="w-full px-3 py-2 border rounded-xl text-xs bg-slate-50" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">SpO2 (%)</label>
                  <input type="text" value={oxygenSaturation} onChange={(e) => setOxygenSaturation(e.target.value)} className="w-full px-3 py-2 border rounded-xl text-xs bg-slate-50" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Weight (kg)</label>
                  <input type="text" value={weight} onChange={(e) => setWeight(e.target.value)} className="w-full px-3 py-2 border rounded-xl text-xs bg-slate-50" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Height (cm)</label>
                  <input type="text" value={height} onChange={(e) => setHeight(e.target.value)} className="w-full px-3 py-2 border rounded-xl text-xs bg-slate-50" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Calculated BMI</label>
                  <input type="text" disabled value={`${bmi} kg/m²`} className="w-full px-3 py-2 border rounded-xl text-xs bg-teal-50 text-teal-800 font-bold" />
                </div>
              </div>
            </div>

            {/* Clinical Evaluation */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Stethoscope className="h-4 w-4 text-sky-600" /> Clinical Assessment
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Chief Complaint *</label>
                  <textarea rows={2} required placeholder="e.g. Fever and persistent dry cough for 3 days." value={chiefComplaint} onChange={(e) => setChiefComplaint(e.target.value)} className="w-full px-3 py-2 border rounded-xl text-xs bg-slate-50" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Observed Symptoms *</label>
                  <textarea rows={2} required value={symptoms} onChange={(e) => setSymptoms(e.target.value)} className="w-full px-3 py-2 border rounded-xl text-xs bg-slate-50" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Clinical Diagnosis *</label>
                  <textarea rows={2} required placeholder="e.g. Acute Bronchitis" value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} className="w-full px-3 py-2 border rounded-xl text-xs bg-slate-50" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Treatment Plan *</label>
                  <textarea rows={2} required placeholder="e.g. Rest, oral antibiotics, steam inhalation." value={treatmentPlan} onChange={(e) => setTreatmentPlan(e.target.value)} className="w-full px-3 py-2 border rounded-xl text-xs bg-slate-50" />
                </div>
              </div>
            </div>

            {/* Digital Prescription Builder */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Pill className="h-4 w-4 text-teal-600" /> Prescription System (Multiple Medicines)
                </h3>
                <button type="button" onClick={addMedicine} className="text-xs font-bold text-teal-600 hover:underline flex items-center gap-1">
                  <Plus className="h-4 w-4" /> Add Medicine
                </button>
              </div>

              <div className="space-y-3">
                {prescriptionItems.map((item, idx) => (
                  <div key={idx} className="grid grid-cols-1 sm:grid-cols-6 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs items-center">
                    <input type="text" placeholder="Medicine (e.g. Paracetamol)" value={item.medicineName} onChange={(e) => updateMedicine(idx, 'medicineName', e.target.value)} className="px-2.5 py-1.5 border rounded-lg" />
                    <input type="text" placeholder="Dosage (500mg)" value={item.dosage} onChange={(e) => updateMedicine(idx, 'dosage', e.target.value)} className="px-2.5 py-1.5 border rounded-lg" />
                    <input type="text" placeholder="Frequency (2x daily)" value={item.frequency} onChange={(e) => updateMedicine(idx, 'frequency', e.target.value)} className="px-2.5 py-1.5 border rounded-lg" />
                    <input type="text" placeholder="Duration (5 days)" value={item.duration} onChange={(e) => updateMedicine(idx, 'duration', e.target.value)} className="px-2.5 py-1.5 border rounded-lg" />
                    <select value={item.route} onChange={(e) => updateMedicine(idx, 'route', e.target.value)} className="px-2.5 py-1.5 border rounded-lg">
                      <option value="Oral">Oral</option>
                      <option value="IV">IV Injection</option>
                      <option value="Topical">Topical</option>
                      <option value="Inhalation">Inhalation</option>
                    </select>
                    <button type="button" onClick={() => removeMedicine(idx)} className="text-rose-500 hover:text-rose-700 justify-self-end p-1">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => router.back()} className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-lg flex items-center gap-2">
                <Save className="h-4 w-4" /> {loading ? 'Saving Consultation...' : 'Complete Consultation & Issue Prescription'}
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
