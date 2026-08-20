'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { TestTube, Search, Plus, CheckCircle2, Clock, FileText, Activity, X } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function AdminLabPage() {
  const [user, setUser] = useState<any>(null);
  const [catalog, setCatalog] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'orders' | 'catalog'>('orders');

  const [showAddTestModal, setShowAddTestModal] = useState(false);
  const [testForm, setTestForm] = useState({
    name: '',
    testCode: '',
    category: 'Hematology',
    price: 50,
    sampleType: 'Blood',
    turnaround: '24 Hours',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const userRes = await fetch('/api/auth/me');
      const userData = await userRes.json();
      setUser(userData.user);

      const [catRes, recRes] = await Promise.all([
        fetch('/api/lab/catalog'),
        fetch('/api/patient/records'),
      ]);

      setCatalog((await catRes.json()).catalog || []);
      setReports((await recRes.json()).labReports || []);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateTest = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/lab/catalog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testForm),
      });

      if (res.ok) {
        setShowAddTestModal(false);
        fetchData();
      }
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Laboratory & Diagnostics Management</h1>
              <p className="text-xs text-slate-500">Manage diagnostic test catalogs, processing statuses (Sample Collected, Processing, Completed), and patient results.</p>
            </div>
            <button
              onClick={() => setShowAddTestModal(true)}
              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md flex items-center gap-2"
            >
              <Plus className="h-4 w-4" /> Add Diagnostic Test
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-200 gap-6 text-xs font-bold">
            <button
              onClick={() => setActiveTab('orders')}
              className={`pb-3 transition border-b-2 ${
                activeTab === 'orders'
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Lab Orders & Processing Stream ({reports.length})
            </button>
            <button
              onClick={() => setActiveTab('catalog')}
              className={`pb-3 transition border-b-2 ${
                activeTab === 'catalog'
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Test Catalog ({catalog.length})
            </button>
          </div>

          {activeTab === 'orders' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-3.5">Report #</th>
                      <th className="px-6 py-3.5">Patient</th>
                      <th className="px-6 py-3.5">Test Name & Category</th>
                      <th className="px-6 py-3.5">Result Findings</th>
                      <th className="px-6 py-3.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {reports.map((rep) => (
                      <tr key={rep.id} className="hover:bg-slate-50 transition">
                        <td className="px-6 py-4 font-mono font-bold text-purple-600">{rep.reportNo}</td>
                        <td className="px-6 py-4 font-semibold text-slate-800">{rep.patient?.user?.name || 'John Doe'}</td>
                        <td className="px-6 py-4">
                          <p className="font-bold text-slate-900">{rep.testName}</p>
                          <span className="text-[10px] text-purple-600 font-medium">{rep.category}</span>
                        </td>
                        <td className="px-6 py-4 font-mono text-slate-700 max-w-xs">{rep.result}</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                            <CheckCircle2 className="h-3 w-3" /> {rep.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'catalog' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {catalog.map((test) => (
                <div key={test.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TestTube className="h-5 w-5 text-purple-600" />
                      <h3 className="font-bold text-slate-900 text-sm">{test.name}</h3>
                    </div>
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-700">{test.testCode}</span>
                  </div>

                  <p className="text-xs text-slate-500">Category: {test.category}</p>
                  <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-100">
                    <span className="text-slate-400">Sample: {test.sampleType} ({test.turnaround})</span>
                    <span className="font-bold text-slate-900 text-sm">{formatCurrency(test.price)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {showAddTestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Add Diagnostic Test Catalog</h3>
              <button onClick={() => setShowAddTestModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleCreateTest} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Test Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Thyroid Profile (T3, T4, TSH)"
                  value={testForm.name}
                  onChange={(e) => setTestForm({ ...testForm, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Test Code</label>
                  <input
                    type="text"
                    required
                    placeholder="LAB-TSH"
                    value={testForm.testCode}
                    onChange={(e) => setTestForm({ ...testForm, testCode: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Price ($)</label>
                  <input
                    type="number"
                    required
                    value={testForm.price}
                    onChange={(e) => setTestForm({ ...testForm, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-xl text-xs"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowAddTestModal(false)} className="px-4 py-2 rounded-xl text-xs text-slate-600 bg-slate-100">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 shadow">
                  Save Test to Catalog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
