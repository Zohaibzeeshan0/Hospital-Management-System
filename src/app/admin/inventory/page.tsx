'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { Package, Search, Plus, AlertTriangle, CheckCircle2, Shield, Stethoscope } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function AdminInventoryPage() {
  const [user, setUser] = useState<any>(null);
  const [items, setItems] = useState<any[]>([
    { id: '1', name: 'Amoxicillin 500mg', category: 'MEDICINE', sku: 'MED-AMOX-500', quantity: 450, minStockLevel: 50, purchasePrice: 8.0, supplier: 'Pfizer Health', status: 'IN_STOCK' },
    { id: '2', name: 'N95 Respirator Masks', category: 'PPE', sku: 'PPE-N95-01', quantity: 1200, minStockLevel: 200, purchasePrice: 1.5, supplier: '3M Medical', status: 'IN_STOCK' },
    { id: '3', name: 'Digital ECG Machine (12-Lead)', category: 'EQUIPMENT', sku: 'EQP-ECG-12L', quantity: 8, minStockLevel: 2, purchasePrice: 2400.0, supplier: 'GE Healthcare', status: 'IN_STOCK' },
    { id: '4', name: 'Surgical Gloves (Sterile Size M)', category: 'SURGICAL', sku: 'SURG-GLV-M', quantity: 15, minStockLevel: 50, purchasePrice: 0.4, supplier: 'Medline Industries', status: 'LOW_STOCK' },
  ]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

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

  const filtered = items.filter((item) => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase()) || item.sku.toLowerCase().includes(search.toLowerCase());
    const matchCat = !selectedCategory || item.category === selectedCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header user={user} />
      <div className="flex flex-1">
        <Sidebar role="ADMIN" />
        <main className="flex-1 p-6 md:p-8 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Hospital General Inventory</h1>
            <p className="text-xs text-slate-500">Track equipment, PPE, surgical supplies, laboratory consumables, and minimum stock alerts.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 font-medium">Total Inventory SKUs</p>
                <p className="text-xl font-bold text-slate-900 mt-1">{items.length}</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                <Package className="h-5 w-5" />
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 font-medium">Low Stock Alerts</p>
                <p className="text-xl font-bold text-amber-600 mt-1">1 Item</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5" />
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 font-medium">Total Units</p>
                <p className="text-xl font-bold text-emerald-600 mt-1">1,673</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5" />
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 font-medium">Suppliers</p>
                <p className="text-xl font-bold text-purple-600 mt-1">4 Active</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Shield className="h-5 w-5" />
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search inventory item name or SKU..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-800"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-700"
            >
              <option value="">All Categories</option>
              <option value="MEDICINE">MEDICINE</option>
              <option value="EQUIPMENT">EQUIPMENT</option>
              <option value="CONSUMABLES">CONSUMABLES</option>
              <option value="PPE">PPE</option>
              <option value="SURGICAL">SURGICAL</option>
              <option value="LAB_SUPPLIES">LAB_SUPPLIES</option>
            </select>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-3.5">SKU & Item Name</th>
                    <th className="px-6 py-3.5">Category</th>
                    <th className="px-6 py-3.5">Quantity / Min Threshold</th>
                    <th className="px-6 py-3.5">Purchase Unit Price</th>
                    <th className="px-6 py-3.5">Supplier</th>
                    <th className="px-6 py-3.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 transition">
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-900">{item.name}</p>
                        <p className="text-[10px] font-mono text-sky-600">{item.sku}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-0.5 rounded bg-slate-100 font-semibold text-[10px] text-slate-700">{item.category}</span>
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-900">
                        {item.quantity} Units <span className="text-[10px] text-slate-400 font-normal">(Min: {item.minStockLevel})</span>
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-800">{formatCurrency(item.purchasePrice)}</td>
                      <td className="px-6 py-4 text-slate-600">{item.supplier}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          item.status === 'IN_STOCK' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {item.status}
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
