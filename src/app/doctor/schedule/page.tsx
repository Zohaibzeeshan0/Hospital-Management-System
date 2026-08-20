'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { Clock, Calendar, Check, Save } from 'lucide-react';

export default function DoctorSchedulePage() {
  const [user, setUser] = useState<any>(null);
  const [schedule, setSchedule] = useState([
    { day: 'Monday', start: '09:00 AM', end: '05:00 PM', available: true },
    { day: 'Tuesday', start: '09:00 AM', end: '05:00 PM', available: true },
    { day: 'Wednesday', start: '09:00 AM', end: '05:00 PM', available: true },
    { day: 'Thursday', start: '09:00 AM', end: '05:00 PM', available: true },
    { day: 'Friday', start: '09:00 AM', end: '05:00 PM', available: true },
    { day: 'Saturday', start: '10:00 AM', end: '02:00 PM', available: false },
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

  const toggleDay = (idx: number) => {
    const updated = [...schedule];
    updated[idx].available = !updated[idx].available;
    setSchedule(updated);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header user={user} />
      <div className="flex flex-1">
        <Sidebar role="DOCTOR" />
        <main className="flex-1 p-6 md:p-8 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Doctor Weekly Schedule</h1>
            <p className="text-xs text-slate-500">Define working hours and available consultation slots for patient bookings.</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4 max-w-2xl">
            <h3 className="text-sm font-bold text-slate-900">Weekly Availability Hours</h3>
            <div className="space-y-3">
              {schedule.map((item, idx) => (
                <div key={item.day} className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 text-xs">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={item.available}
                      onChange={() => toggleDay(idx)}
                      className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                    />
                    <span className="font-bold text-slate-900 w-24">{item.day}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">{item.start} — {item.end}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      item.available ? 'bg-teal-100 text-teal-700' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {item.available ? 'Available' : 'Off'}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button onClick={() => alert('Schedule saved!')} className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow flex items-center gap-1.5">
                <Save className="h-4 w-4" /> Save Schedule Preferences
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
