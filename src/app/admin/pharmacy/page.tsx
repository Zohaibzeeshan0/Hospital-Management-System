'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { Pill, Search, Plus, AlertTriangle, CheckCircle2, Package, Calendar } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function AdminPharmacyPage() {
  const [user, setUser] = useState<any>(null);
  const [medicines, setMedicines] = useState<any[]>([
    { id: '1', name: 'Amoxicillin 500mg', genericName: 'Amoxicillin', category: 'Antibiotic', manufacturer: 'Pfizer Inc.', price: 15.5, stockQuantity: 450, status: 'IN_STOCK', expiryDate: '2027-12-31' },
    { id: '2', name: 'Lipitor 20mg', genericName: 'Atorvastatin', category: 'Cardiovascular', manufacturer: 'Viatris', price: 28.0, stockQuantity: 320, status: 'IN_STOCK', expiryDate: '2028-06-30' },
    { id: '3', name: 'Metformin 850mg', genericName: 'Metformin HCl', category: 'Antidiabetic', manufacturer: 'Novartis', price: 12.0, stockQuantity: 600, status: 'IN_STOCK', expiryDate: '2027-09-15' },
    { id: '4', name: 'Ventolin HFA Inhaler', genericName: 'Albuterol Sulfate', category: 'Respiratory', manufacturer: 'GSK', price: 45.0, stockQuantity: 12, status: 'LOW_STOCK', expiryDate: '2026-11-20' },
  ]);
  const [search, setSearch] = useState('');

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

  const filtered = medicines.filter(m => m.name.toLowerCase().includes(search.toLowerCase()) || m.genericName.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header user={user} />
      <div className="flex flex-1">
        <Sidebar role="ADMIN" />
        <main className="flex-1 p-6 md:p-8 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Pharmacy & Medicine Inventory</h1>
            <p className="text-xs text-slate-500">Monitor pharmaceuticals stock levels, generic formulas, pricing, and expiration dates.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 font-medium">Total Products</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{medicines.length}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
                <Pill className="h-6 w-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 font-medium">Low Stock Warning</p>
                <p className="text-2xl font-bold text-amber-600 mt-1">1 Item</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <AlertTriangle className="h-6 w-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 font-medium">Total Units in Stock</p>
                <p className="text-2xl font-bold text-sky-600 mt-1">1,382</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
                <Package className="h-6 w-6" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="relative">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search medicine name or generic formula..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-800"
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-3.5">Medicine Name</th>
                    <th className="px-6 py-3.5">Category</th>
                    <th className="px-6 py-3.5">Manufacturer</th>
                    <th className="px-6 py-3.5">Price</th>
                    <th className="px-6 py-3.5">Stock Quantity</th>
                    <th className="px-6 py-3.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((med) => (
                    <tr key={med.id} className="hover:bg-slate-50 transition">
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-900">{med.name}</p>
                        <p className="text-[10px] text-slate-400">{med.genericName}</p>
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-700">{med.category}</td>
                      <td className="px-6 py-4 text-slate-600">{med.manufacturer}</td>
                      <td className="px-6 py-4 font-bold text-slate-900">{formatCurrency(med.price)}</td>
                      <td className="px-6 py-4 font-bold text-slate-800">{med.stockQuantity} Units</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          med.status === 'IN_STOCK' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {med.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
