'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { Search, Stethoscope, Star, Calendar, ArrowRight, DollarSign } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function PatientDoctorsPage() {
  const [user, setUser] = useState<any>(null);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('');

  useEffect(() => {
    fetchData();
  }, [search, selectedDept]);

  const fetchData = async () => {
    try {
      const userRes = await fetch('/api/auth/me');
      const userData = await userRes.json();
      setUser(userData.user);

      const [deptRes, docRes] = await Promise.all([
        fetch('/api/admin/departments'),
        fetch(`/api/admin/doctors?search=${encodeURIComponent(search)}${selectedDept ? `&departmentId=${selectedDept}` : ''}`),
      ]);

      setDepartments((await deptRes.json()).departments || []);
      setDoctors((await docRes.json()).doctors || []);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header user={user} />
      <div className="flex flex-1">
        <Sidebar role="PATIENT" />
        <main className="flex-1 p-6 md:p-8 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Find Medical Specialists</h1>
            <p className="text-xs text-slate-500">Search board-certified doctors by name, clinical department, specialization, or consultation fee.</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by doctor name or specialization (e.g. Cardiology)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-800"
              />
            </div>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-700"
            >
              <option value="">All Departments</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map((doc) => (
              <div key={doc.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition space-y-4">
                <div className="flex items-center gap-3">
                  <img src={doc.user.avatarUrl} alt="" className="h-14 w-14 rounded-2xl object-cover ring-2 ring-sky-500/20" />
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{doc.user.name}</h3>
                    <p className="text-xs text-teal-600 font-semibold">{doc.specialization}</p>
                    <p className="text-[11px] text-slate-400">{doc.department?.name} • {doc.experienceYears} Years Exp</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-1 text-amber-500 font-bold">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" /> {doc.rating || 4.9}
                  </div>
                  <div className="font-bold text-slate-900 text-sm">
                    {formatCurrency(doc.consultationFee)} <span className="text-[10px] font-normal text-slate-400">/ Visit</span>
                  </div>
                </div>

                <div className="pt-2 flex gap-2">
                  <Link
                    href={`/patient/doctors/${doc.id}`}
                    className="flex-1 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold text-center transition"
                  >
                    View Profile
                  </Link>
                  <Link
                    href={`/patient/appointments?doc=${doc.id}`}
                    className="flex-1 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold text-center shadow-md transition flex items-center justify-center gap-1"
                  >
                    Book Visit <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
