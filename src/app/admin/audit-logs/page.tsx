'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { ShieldCheck, Activity, Clock, User } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function AdminAuditLogsPage() {
  const [user, setUser] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const userRes = await fetch('/api/auth/me');
      const userData = await userRes.json();
      setUser(userData.user);

      const res = await fetch('/api/audit-logs');
      const data = await res.json();
      setLogs(data.auditLogs || []);
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
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Security Audit Logs</h1>
            <p className="text-xs text-slate-500">System activity trail tracking user logins, doctor account creations, and prescription events.</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center gap-2 text-xs font-semibold text-slate-700">
              <ShieldCheck className="h-4 w-4 text-purple-600" />
              <span>Real-Time Audit Stream</span>
            </div>
            <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
              {logs.map((log) => (
                <div key={log.id} className="p-4 hover:bg-slate-50 transition flex items-center justify-between text-xs">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{log.action}</span>
                      <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 font-mono text-[10px]">{log.module}</span>
                    </div>
                    <p className="text-slate-600">{log.details}</p>
                    <p className="text-[10px] text-slate-400">Initiated by: {log.user?.name || 'System Auto'} ({log.user?.role || 'SYSTEM'})</p>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono shrink-0">{formatDate(log.createdAt, 'MMM dd, hh:mm a')}</span>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
