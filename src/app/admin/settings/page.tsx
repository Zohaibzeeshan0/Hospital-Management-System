'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { Settings, Building2, Save, Bell, Shield, Moon, Sun } from 'lucide-react';

export default function AdminSettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [hospitalName, setHospitalName] = useState('MediPulse Medical Center');
  const [emergencyPhone, setEmergencyPhone] = useState('+1 (800) 999-EMERGENCY');
  const [taxRate, setTaxRate] = useState('0');
  const [currency, setCurrency] = useState('USD ($)');

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

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Hospital System Settings saved successfully!');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header user={user} />
      <div className="flex flex-1">
        <Sidebar role="ADMIN" />
        <main className="flex-1 p-6 md:p-8 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">System & Hospital Configuration</h1>
            <p className="text-xs text-slate-500">Configure global hospital branding, emergency hotline, default tax, currency, and portal preferences.</p>
          </div>

          <form onSubmit={handleSave} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6 max-w-3xl">
            <div className="space-y-4 border-b border-slate-100 pb-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Building2 className="h-4 w-4 text-sky-600" /> Hospital Identity Settings
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Hospital Name</label>
                  <input type="text" value={hospitalName} onChange={(e) => setHospitalName(e.target.value)} className="w-full px-3 py-2 border rounded-xl text-xs bg-slate-50" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">24/7 Emergency Hotline</label>
                  <input type="text" value={emergencyPhone} onChange={(e) => setEmergencyPhone(e.target.value)} className="w-full px-3 py-2 border rounded-xl text-xs bg-slate-50" />
                </div>
              </div>
            </div>

            <div className="space-y-4 border-b border-slate-100 pb-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Settings className="h-4 w-4 text-teal-600" /> Financial & Currency Options
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Default Currency</label>
                  <input type="text" value={currency} onChange={(e) => setCurrency(e.target.value)} className="w-full px-3 py-2 border rounded-xl text-xs bg-slate-50" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Sales Tax (%)</label>
                  <input type="text" value={taxRate} onChange={(e) => setTaxRate(e.target.value)} className="w-full px-3 py-2 border rounded-xl text-xs bg-slate-50" />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button type="submit" className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md flex items-center gap-2">
                <Save className="h-4 w-4" /> Save System Settings
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
