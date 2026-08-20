'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  UserCheck,
  Users,
  Calendar,
  Building2,
  Receipt,
  ShieldCheck,
  Stethoscope,
  Clock,
  FileText,
  CreditCard,
  FolderHeart,
  Pill,
  TestTube,
  Package,
  ShieldAlert,
  Bed,
  Mail,
  LogOut,
} from 'lucide-react';

interface SidebarProps {
  role: 'ADMIN' | 'DOCTOR' | 'PATIENT';
}

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();

  const adminNav = [
    { label: 'Overview', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Doctors Roster', href: '/admin/doctors', icon: UserCheck },
    { label: 'Patients Directory', href: '/admin/patients', icon: Users },
    { label: 'Master Appointments', href: '/admin/appointments', icon: Calendar },
    { label: 'Emergency Trauma', href: '/admin/emergency', icon: ShieldAlert },
    { label: 'Wards & Beds', href: '/admin/beds', icon: Bed },
    { label: 'Inpatient Admissions', href: '/admin/admissions', icon: LogOut },
    { label: 'Patient Messages', href: '/admin/messages', icon: Mail },
    { label: 'Departments', href: '/admin/departments', icon: Building2 },
    { label: 'Lab Diagnostics', href: '/admin/lab', icon: TestTube },
    { label: 'Pharmacy Stock', href: '/admin/pharmacy', icon: Pill },
    { label: 'Hospital Supplies', href: '/admin/inventory', icon: Package },
    { label: 'Billing & Invoices', href: '/admin/billing', icon: Receipt },
    { label: 'Security Audit Logs', href: '/admin/audit-logs', icon: ShieldCheck },
  ];

  const doctorNav = [
    { label: 'Doctor Workspace', href: '/doctor/dashboard', icon: LayoutDashboard },
    { label: 'My Consultations', href: '/doctor/appointments', icon: Stethoscope },
    { label: 'My Patients & History', href: '/doctor/patients', icon: Users },
    { label: 'Availability Hours', href: '/doctor/schedule', icon: Clock },
  ];

  const patientNav = [
    { label: 'Health Summary', href: '/patient/dashboard', icon: LayoutDashboard },
    { label: 'Find Specialists', href: '/patient/doctors', icon: Stethoscope },
    { label: 'My Appointments', href: '/patient/appointments', icon: Calendar },
    { label: 'Medical Vault & Rx', href: '/patient/records', icon: FolderHeart },
    { label: 'Contact Admin', href: '/patient/messages', icon: Mail },
    { label: 'Invoices & Checkout', href: '/patient/billing', icon: CreditCard },
  ];

  const navItems = role === 'ADMIN' ? adminNav : role === 'DOCTOR' ? doctorNav : patientNav;

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 hidden md:flex flex-col shrink-0 min-h-[calc(100vh-65px)]">
      <div className="p-4 flex-1 space-y-1">
        <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
          {role} WORKSPACE
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                isActive
                  ? 'bg-gradient-to-r from-sky-600 to-teal-500 text-white shadow-md shadow-sky-600/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
        <span>MediCare Nexus System</span>
        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
      </div>
    </aside>
  );
}
