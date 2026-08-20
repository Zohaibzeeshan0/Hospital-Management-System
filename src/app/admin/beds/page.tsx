'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { Bed, Plus, Search, CheckCircle2, AlertCircle, Clock, User } from 'lucide-react';

export default function AdminBedsPage() {
  const [user, setUser] = useState<any>(null);
  const [beds, setBeds] = useState<any[]>([
    { id: '1', bedNumber: 'BED-ICU-101', roomNumber: 'RM-101', wardName: 'Cardiac ICU Ward', type: 'ICU', dailyRate: 500, status: 'Occupied', patientName: 'Robert Vance' },
    { id: '2', bedNumber: 'BED-ICU-102', roomNumber: 'RM-101', wardName: 'Cardiac ICU Ward', type: 'ICU', dailyRate: 500, status: 'Available', patientName: null },
    { id: '3', bedNumber: 'BED-GEN-201', roomNumber: 'RM-201', wardName: 'General Surgery Ward', type: 'General', dailyRate: 150, status: 'Occupied', patientName: 'John Doe' },
    { id: '4', bedNumber: 'BED-GEN-202', roomNumber: 'RM-201', wardName: 'General Surgery Ward', type: 'General', dailyRate: 150, status: 'Available', patientName: null },
    { id: '5', bedNumber: 'BED-PVT-301', roomNumber: 'RM-301', wardName: 'Private Suite Ward', type: 'Private', dailyRate: 350, status: 'Reserved', patientName: 'Emma Watson' },
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

  const totalBeds = beds.length;
  const occupiedCount = beds.filter(b => b.status === 'Occupied').length;
  const availableCount = beds.filter(b => b.status === 'Available').length;
  const reservedCount = beds.filter(b => b.status === 'Reserved').length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header user={user} />
      <div className="flex flex-1">
        <Sidebar role="ADMIN" />
        <main className="flex-1 p-6 md:p-8 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Hospital Wards & Bed Occupancy</h1>
            <p className="text-xs text-slate-500">Monitor inpatient rooms, ICU beds, general ward availability, and daily ward rates.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 font-medium">Total Beds Capacity</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{totalBeds}</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                <Bed className="h-5 w-5" />
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 font-medium">Available Beds</p>
                <p className="text-2xl font-bold text-emerald-600 mt-1">{availableCount}</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5" />
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 font-medium">Occupied Beds</p>
                <p className="text-2xl font-bold text-rose-600 mt-1">{occupiedCount}</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <User className="h-5 w-5" />
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 font-medium">Reserved</p>
                <p className="text-2xl font-bold text-amber-600 mt-1">{reservedCount}</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Clock className="h-5 w-5" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {beds.map((b) => (
              <div key={b.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bed className={`h-5 w-5 ${b.status === 'Available' ? 'text-emerald-600' : 'text-rose-600'}`} />
                    <h3 className="font-bold text-slate-900 text-sm">{b.bedNumber}</h3>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    b.status === 'Available' ? 'bg-emerald-100 text-emerald-700' : b.status === 'Occupied' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {b.status}
                  </span>
                </div>

                <p className="text-xs text-slate-500">{b.wardName} • {b.roomNumber}</p>
                <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-100">
                  <span className="text-slate-600 font-medium">{b.patientName ? `Patient: ${b.patientName}` : 'Vacant Bed'}</span>
                  <span className="font-bold text-slate-900">${b.dailyRate}/day</span>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
