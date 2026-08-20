'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { Calendar, Filter, Search, Clock, User, Stethoscope, CheckCircle2, XCircle, AlertCircle, RefreshCw, X } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function AdminAppointmentsPage() {
  const [user, setUser] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [doctorFilter, setDoctorFilter] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [rescheduleAppt, setRescheduleAppt] = useState<any>(null);
  const [newDate, setNewDate] = useState('');
  const [newSlot, setNewSlot] = useState('');

  useEffect(() => {
    fetchData();
  }, [search, statusFilter, doctorFilter, deptFilter]);

  const fetchData = async () => {
    try {
      const userRes = await fetch('/api/auth/me');
      const userData = await userRes.json();
      setUser(userData.user);

      const [docs, depts] = await Promise.all([
        fetch('/api/admin/doctors').then((r) => r.json()),
        fetch('/api/admin/departments').then((r) => r.json()),
      ]);
      setDoctors(docs.doctors || []);
      setDepartments(depts.departments || []);

      const q = new URLSearchParams();
      if (search) q.set('search', search);
      if (statusFilter) q.set('status', statusFilter);
      if (doctorFilter) q.set('doctorId', doctorFilter);
      if (deptFilter) q.set('departmentId', deptFilter);

      const apptRes = await fetch(`/api/admin/appointments?${q.toString()}`);
      const apptData = await apptRes.json();
      setAppointments(apptData.appointments || []);
    } catch (e) {
      console.error(e);
    }
  };

  const updateAppointmentStatus = async (appointmentId: string, status: string) => {
    try {
      await fetch('/api/admin/appointments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appointmentId, status }),
      });
      fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleReschedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rescheduleAppt || !newDate || !newSlot) return;

    try {
      await fetch('/api/admin/appointments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appointmentId: rescheduleAppt.id,
          date: newDate,
          timeSlot: newSlot,
          status: 'CONFIRMED',
        }),
      });
      setRescheduleAppt(null);
      fetchData();
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
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Master Appointment Control</h1>
              <p className="text-xs text-slate-500">Monitor all hospital appointments, reschedule visits, and override status flags.</p>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="relative">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search patient or doctor..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-800 focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-700"
            >
              <option value="">All Statuses</option>
              <option value="PENDING">PENDING</option>
              <option value="CONFIRMED">CONFIRMED</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="CANCELLED">CANCELLED</option>
              <option value="NO_SHOW">NO_SHOW</option>
            </select>
            <select
              value={doctorFilter}
              onChange={(e) => setDoctorFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-700"
            >
              <option value="">All Doctors</option>
              {doctors.map((d) => (
                <option key={d.id} value={d.id}>{d.user.name}</option>
              ))}
            </select>
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-700"
            >
              <option value="">All Departments</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>

          {/* Master Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-3.5">Appointment ID</th>
                    <th className="px-6 py-3.5">Patient</th>
                    <th className="px-6 py-3.5">Doctor & Dept</th>
                    <th className="px-6 py-3.5">Date & Time Slot</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5 text-right">Admin Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {appointments.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-slate-400">
                        No appointments found.
                      </td>
                    </tr>
                  ) : (
                    appointments.map((apt) => (
                      <tr key={apt.id} className="hover:bg-slate-50/80 transition">
                        <td className="px-6 py-4 font-mono font-bold text-sky-600">
                          {apt.appointmentNo}
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-bold text-slate-900">{apt.patient.user.name}</p>
                          <p className="text-[10px] text-slate-400">{apt.patient.patientCode}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-semibold text-slate-800">{apt.doctor.user.name}</p>
                          <p className="text-[10px] text-sky-600">{apt.department?.name}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-medium text-slate-800">{formatDate(apt.date)}</p>
                          <p className="text-[10px] text-slate-500">{apt.timeSlot}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            apt.status === 'CONFIRMED' ? 'bg-sky-100 text-sky-700' :
                            apt.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' :
                            apt.status === 'CANCELLED' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                            {apt.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right space-x-1.5">
                          {apt.status === 'PENDING' && (
                            <button
                              onClick={() => updateAppointmentStatus(apt.id, 'CONFIRMED')}
                              className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-600 hover:bg-emerald-100 font-semibold"
                            >
                              Approve
                            </button>
                          )}
                          <button
                            onClick={() => { setRescheduleAppt(apt); setNewDate(apt.date.split('T')[0]); setNewSlot(apt.timeSlot); }}
                            className="px-2.5 py-1 rounded bg-sky-50 text-sky-600 hover:bg-sky-100 font-semibold"
                          >
                            Reschedule
                          </button>
                          {apt.status !== 'CANCELLED' && apt.status !== 'COMPLETED' && (
                            <button
                              onClick={() => updateAppointmentStatus(apt.id, 'CANCELLED')}
                              className="px-2.5 py-1 rounded bg-rose-50 text-rose-600 hover:bg-rose-100 font-semibold"
                            >
                              Cancel
                            </button>
                          )}
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

      {/* Reschedule Modal */}
      {rescheduleAppt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Reschedule {rescheduleAppt.appointmentNo}</h3>
              <button onClick={() => setRescheduleAppt(null)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleReschedule} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">New Appointment Date</label>
                <input
                  type="date"
                  required
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Time Slot</label>
                <select
                  required
                  value={newSlot}
                  onChange={(e) => setNewSlot(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                >
                  <option value="09:00 AM - 09:30 AM">09:00 AM - 09:30 AM</option>
                  <option value="10:00 AM - 10:30 AM">10:00 AM - 10:30 AM</option>
                  <option value="11:00 AM - 11:30 AM">11:00 AM - 11:30 AM</option>
                  <option value="02:00 PM - 02:30 PM">02:00 PM - 02:30 PM</option>
                  <option value="04:00 PM - 04:30 PM">04:00 PM - 04:30 PM</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRescheduleAppt(null)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-600 bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-sky-600 shadow"
                >
                  Confirm Reschedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
