'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import {
  Users,
  UserCheck,
  Calendar,
  DollarSign,
  Clock,
  TrendingUp,
  Activity,
  Bed,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Building2,
  Plus,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts';

export default function AdminDashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const userRes = await fetch('/api/auth/me');
      const userData = await userRes.json();
      setUser(userData.user);

      const statsRes = await fetch('/api/admin/stats');
      const statsData = await statsRes.json();
      setStats(statsData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const revenueData = [
    { month: 'Jan', revenue: 42000, appointments: 320 },
    { month: 'Feb', revenue: 48000, appointments: 380 },
    { month: 'Mar', revenue: 55000, appointments: 420 },
    { month: 'Apr', revenue: 51000, appointments: 390 },
    { month: 'May', revenue: 64000, appointments: 490 },
    { month: 'Jun', revenue: 72000, appointments: 560 },
  ];

  const COLORS = ['#0284c7', '#0d9488', '#8b5cf6', '#f59e0b', '#ec4899'];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header user={user} />
      <div className="flex flex-1">
        <Sidebar role="ADMIN" />
        <main className="flex-1 p-6 md:p-8 space-y-8 overflow-y-auto">
          {/* Welcome Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-800 to-sky-900 text-white p-6 rounded-3xl shadow-xl">
            <div>
              <span className="text-xs font-semibold text-sky-400 uppercase tracking-wider">Hospital Administration</span>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Executive Dashboard</h1>
              <p className="text-xs text-slate-300 mt-1">Real-time clinical metrics, bed occupancy, doctor rosters, and financial performance.</p>
            </div>
            <div className="flex gap-3">
              <a href="/admin/doctors" className="px-4 py-2.5 rounded-xl bg-sky-600 text-white text-xs font-semibold hover:bg-sky-500 transition shadow-lg flex items-center gap-1.5">
                <Plus className="h-4 w-4" /> Add Doctor
              </a>
              <a href="/admin/appointments" className="px-4 py-2.5 rounded-xl bg-white/10 text-white text-xs font-semibold hover:bg-white/20 transition flex items-center gap-1.5">
                <Calendar className="h-4 w-4" /> Manage Visits
              </a>
            </div>
          </div>

          {/* Overview Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { title: 'Total Patients', value: stats?.stats?.totalPatients || 0, icon: Users, color: 'text-sky-600', bg: 'bg-sky-50', change: '+12% from last month' },
              { title: 'Active Doctors', value: stats?.stats?.totalDoctors || 0, icon: UserCheck, color: 'text-teal-600', bg: 'bg-teal-50', change: '8 Departments' },
              { title: 'Today\'s Appointments', value: stats?.stats?.todaysAppointments || 0, icon: Clock, color: 'text-purple-600', bg: 'bg-purple-50', change: 'On schedule' },
              { title: 'Total Revenue', value: `$${(stats?.stats?.revenue || 0).toLocaleString()}`, icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50', change: '+18.4% YTD' },
            ].map((card, idx) => {
              const Icon = card.icon;
              return (
                <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-slate-500">{card.title}</p>
                      <p className="text-2xl font-bold text-slate-900 mt-1">{card.value}</p>
                    </div>
                    <div className={`h-12 w-12 rounded-xl ${card.bg} ${card.color} flex items-center justify-center`}>
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>
                  <p className="mt-3 text-[11px] font-medium text-emerald-600 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" /> {card.change}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Secondary Operational Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-amber-100 text-amber-700">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Pending Visits</p>
                <p className="text-lg font-bold text-slate-900">{stats?.stats?.pendingAppointments || 0}</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-emerald-100 text-emerald-700">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Completed</p>
                <p className="text-lg font-bold text-slate-900">{stats?.stats?.completedAppointments || 0}</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-sky-100 text-sky-700">
                <Bed className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Beds Available</p>
                <p className="text-lg font-bold text-slate-900">{stats?.stats?.availableBeds || 42}</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-rose-100 text-rose-700">
                <AlertTriangle className="h-5 w-5 animate-pulse" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Emergency ER</p>
                <p className="text-lg font-bold text-slate-900">{stats?.stats?.emergencyCases || 3} Active</p>
              </div>
            </div>
          </div>

          {/* Recharts Analytics Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Revenue Analytics Chart */}
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Hospital Revenue & Visit Trends</h3>
                  <p className="text-xs text-slate-500">Monthly breakdown of consultations and billing</p>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-xs font-semibold text-slate-600">2026 Financial Year</span>
              </div>
              <div className="h-72 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0284c7" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#0284c7" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <Tooltip />
                    <Area type="monotone" dataKey="revenue" stroke="#0284c7" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Department Doctor Distribution */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Department Rosters</h3>
                <p className="text-xs text-slate-500">Doctor distribution across clinical specialties</p>
              </div>
              <div className="h-60 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats?.departmentDistribution || [
                        { name: 'Cardiology', doctors: 4 },
                        { name: 'Neurology', doctors: 3 },
                        { name: 'Pediatrics', doctors: 5 },
                        { name: 'Orthopedics', doctors: 3 },
                        { name: 'Dermatology', doctors: 2 },
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={85}
                      paddingAngle={5}
                      dataKey="doctors"
                    >
                      {(stats?.departmentDistribution || [1, 2, 3, 4, 5]).map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-1.5 text-xs">
                {(stats?.departmentDistribution || []).slice(0, 4).map((d: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                      {d.name}
                    </span>
                    <span className="font-semibold text-slate-900">{d.doctors} Specialists</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
