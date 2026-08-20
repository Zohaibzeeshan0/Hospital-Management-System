'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { Calendar, Clock, Stethoscope, Plus, CheckCircle2, User, ArrowRight, X, AlertCircle } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function PatientAppointmentsPage() {
  const [user, setUser] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);

  const [showBookModal, setShowBookModal] = useState(false);
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [availableSlots, setAvailableSlots] = useState<any[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slotMessage, setSlotMessage] = useState('');
  const [reason, setReason] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState('In-Person');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const userRes = await fetch('/api/auth/me');
      const userData = await userRes.json();
      setUser(userData.user);

      const [apptRes, deptRes, docRes] = await Promise.all([
        fetch('/api/patient/appointments'),
        fetch('/api/admin/departments'),
        fetch('/api/doctors/available'),
      ]);

      setAppointments((await apptRes.json()).appointments || []);
      setDepartments((await deptRes.json()).departments || []);
      setDoctors((await docRes.json()).doctors || []);
    } catch (e) {
      console.error(e);
    }
  };

  // Fetch slots whenever doctor and date are selected
  useEffect(() => {
    if (selectedDoctor && date) {
      fetchSlots(selectedDoctor, date);
    } else {
      setAvailableSlots([]);
    }
  }, [selectedDoctor, date]);

  const fetchSlots = async (docId: string, selectedDate: string) => {
    setLoadingSlots(true);
    setSlotMessage('');
    setError('');

    try {
      const res = await fetch(`/api/doctors/${docId}/slots?date=${selectedDate}`);
      const data = await res.json();

      if (!res.ok || !data.isAvailable) {
        setSlotMessage(data.reason || 'Doctor is unavailable on this date.');
        setAvailableSlots([]);
      } else {
        setAvailableSlots(data.availableSlots || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoctor || !date || !timeSlot || !reason) {
      setError('Please select a doctor, date, available time slot, and reason.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/patient/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doctorId: selectedDoctor,
          departmentId: selectedDept,
          date,
          timeSlot,
          reason,
          message,
          type,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to book appointment');
      }

      setShowBookModal(false);
      setSelectedDept('');
      setSelectedDoctor('');
      setDate('');
      setTimeSlot('');
      setReason('');
      setMessage('');
      fetchData();
    } catch (err: any) {
      setError(err.message || 'An error occurred during booking');
    } finally {
      setLoading(false);
    }
  };

  const filteredDoctors = doctors.filter((d) => !selectedDept || d.departmentId === selectedDept);
  const currentDoc = doctors.find((d) => d.id === selectedDoctor);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header user={user} />
      <div className="flex flex-1">
        <Sidebar role="PATIENT" />
        <main className="flex-1 p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My Medical Appointments</h1>
              <p className="text-xs text-slate-500">Schedule consultations with top medical specialists and view appointment status.</p>
            </div>
            <button
              onClick={() => setShowBookModal(true)}
              className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-lg shadow-sky-600/30 transition flex items-center gap-2"
            >
              <Plus className="h-4 w-4" /> Book New Appointment
            </button>
          </div>

          {/* Appointments Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-3.5">Appointment No</th>
                    <th className="px-6 py-3.5">Doctor & Department</th>
                    <th className="px-6 py-3.5">Date & Time Slot</th>
                    <th className="px-6 py-3.5">Reason</th>
                    <th className="px-6 py-3.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {appointments.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                        You have no scheduled appointments. Click "Book New Appointment" to schedule one.
                      </td>
                    </tr>
                  ) : (
                    appointments.map((apt) => (
                      <tr key={apt.id} className="hover:bg-slate-50 transition">
                        <td className="px-6 py-4 font-mono font-bold text-sky-600">{apt.appointmentNo}</td>
                        <td className="px-6 py-4">
                          <p className="font-bold text-slate-900">{apt.doctor?.user?.name}</p>
                          <p className="text-[10px] text-teal-600 font-medium">{apt.doctor?.specialization}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-semibold text-slate-800">{formatDate(apt.date)}</p>
                          <p className="text-[10px] text-slate-500">{apt.timeSlot}</p>
                        </td>
                        <td className="px-6 py-4 text-slate-700">{apt.reason}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            apt.status === 'CONFIRMED' ? 'bg-sky-100 text-sky-700' :
                            apt.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                            {apt.status}
                          </span>
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

      {/* Booking Wizard Modal */}
      {showBookModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 max-w-2xl w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Stethoscope className="h-5 w-5 text-sky-600" /> Book Specialist Appointment
              </h3>
              <button onClick={() => setShowBookModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleBook} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">1. Department (Optional Filter)</label>
                  <select
                    value={selectedDept}
                    onChange={(e) => setSelectedDept(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50"
                  >
                    <option value="">All Departments</option>
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">2. Select Active Doctor *</label>
                  <select
                    required
                    value={selectedDoctor}
                    onChange={(e) => setSelectedDoctor(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 font-medium"
                  >
                    <option value="">Choose Doctor Specialist</option>
                    {filteredDoctors.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} — {d.specialization} (${d.consultationFee})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Selected Doctor Card Preview */}
              {currentDoc && (
                <div className="bg-sky-50/60 p-3 rounded-2xl border border-sky-200 flex items-center gap-3 text-xs">
                  <img src={currentDoc.avatarUrl} alt="" className="h-12 w-12 rounded-xl object-cover ring-2 ring-sky-500/20" />
                  <div>
                    <h4 className="font-bold text-slate-900">{currentDoc.name}</h4>
                    <p className="text-teal-700 font-semibold">{currentDoc.specialization} • {currentDoc.departmentName}</p>
                    <p className="text-slate-500 text-[11px]">{currentDoc.experienceYears} Years Exp • Fee: ${currentDoc.consultationFee}</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">3. Select Appointment Date *</label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">4. Appointment Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50"
                  >
                    <option value="In-Person">In-Person Visit</option>
                    <option value="Online">Online Video Consultation</option>
                  </select>
                </div>
              </div>

              {/* Dynamic Time Slot Selector */}
              {selectedDoctor && date && (
                <div className="space-y-2 border-t border-slate-100 pt-3">
                  <label className="block text-xs font-semibold text-slate-700">5. Real-Time Available Time Slots *</label>
                  
                  {loadingSlots ? (
                    <p className="text-xs text-slate-400 py-2">Calculating doctor slot availability...</p>
                  ) : slotMessage ? (
                    <p className="text-xs text-rose-600 font-medium bg-rose-50 p-2.5 rounded-xl border border-rose-200">{slotMessage}</p>
                  ) : availableSlots.length === 0 ? (
                    <p className="text-xs text-amber-600 bg-amber-50 p-2.5 rounded-xl border border-amber-200">No available slots for this date.</p>
                  ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {availableSlots.map((slotObj, idx) => (
                        <button
                          key={idx}
                          type="button"
                          disabled={slotObj.isBooked}
                          onClick={() => setTimeSlot(slotObj.slot)}
                          className={`py-2 px-2.5 rounded-xl border text-[11px] font-bold transition ${
                            slotObj.isBooked
                              ? 'bg-slate-100 border-slate-200 text-slate-400 line-through cursor-not-allowed'
                              : timeSlot === slotObj.slot
                              ? 'bg-sky-600 border-sky-600 text-white shadow-md'
                              : 'bg-white border-slate-200 text-slate-800 hover:border-sky-400'
                          }`}
                        >
                          {slotObj.slot.split(' - ')[0]}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">6. Chief Complaint / Reason for Visit *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Chest tightness, persistent cough, blood pressure checkup..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Additional Message for Doctor / Admin (Optional)</label>
                <input
                  type="text"
                  placeholder="Any specific requests or prior medical notes..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setShowBookModal(false)} className="px-4 py-2 rounded-xl text-xs text-slate-600 bg-slate-100">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !timeSlot}
                  className="px-6 py-2 rounded-xl text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 shadow-md transition disabled:opacity-50"
                >
                  {loading ? 'Booking...' : 'Confirm Appointment Booking'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
