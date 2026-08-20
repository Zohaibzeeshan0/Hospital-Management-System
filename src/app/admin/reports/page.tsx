'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { FileSpreadsheet, Download, Printer, Filter, BarChart3, DollarSign, Calendar, Users } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function AdminReportsPage() {
  const [user, setUser] = useState<any>(null);
  const [reportType, setReportType] = useState('REVENUE');

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

  const exportCSV = () => {
    alert(`Exporting ${reportType} report data to CSV file...`);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header user={user} />
      <div className="flex flex-1">
        <Sidebar role="ADMIN" />
        <main className="flex-1 p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Hospital Analytics & Export Reports</h1>
              <p className="text-xs text-slate-500">Generate executive financial reports, doctor workload metrics, and inventory utilization data.</p>
            </div>
            <div className="flex gap-2">
              <button onClick={exportCSV} className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow flex items-center gap-1.5">
                <Download className="h-4 w-4" /> Export CSV
              </button>
              <button onClick={() => window.print()} className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold shadow flex items-center gap-1.5">
                <Printer className="h-4 w-4" /> Print PDF Report
              </button>
            </div>
          </div>

          <div className="flex gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <select value={reportType} onChange={(e) => setReportType(e.target.value)} className="px-3 py-2 border rounded-xl text-xs bg-slate-50 font-bold">
              <option value="REVENUE">Revenue & Financial Transactions</option>
              <option value="APPOINTMENTS">Appointments & Consultation Volume</option>
              <option value="DOCTOR_PERFORMANCE">Doctor Performance & Utilization</option>
              <option value="LAB_PHARMACY">Laboratory & Pharmacy Sales</option>
            </select>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Executive Report Summary ({reportType})</h3>
            <div className="grid grid-cols-3 gap-4 text-xs">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <p className="text-slate-400 font-medium">Total Metric Volume</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">$48,250.00</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <p className="text-slate-400 font-medium">Completed Transactions</p>
                <p className="text-2xl font-bold text-emerald-600 mt-1">142 Cases</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <p className="text-slate-400 font-medium">Audit Status</p>
                <p className="text-2xl font-bold text-sky-600 mt-1">Verified Clean</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
