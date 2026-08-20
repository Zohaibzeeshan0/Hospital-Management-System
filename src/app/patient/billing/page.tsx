'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { Receipt, DollarSign, CreditCard, CheckCircle2, Lock, X } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function PatientBillingPage() {
  const [user, setUser] = useState<any>(null);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [payInvoice, setPayInvoice] = useState<any>(null);
  const [cardNum, setCardNum] = useState('4242 •••• •••• 4242');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const userRes = await fetch('/api/auth/me');
      const userData = await userRes.json();
      setUser(userData.user);

      const res = await fetch('/api/billing/invoices');
      const data = await res.json();
      setInvoices(data.invoices || []);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!payInvoice) return;
    setLoading(true);

    try {
      const res = await fetch('/api/billing/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invoiceId: payInvoice.id,
          paymentMethod: 'Credit Card',
          amount: payInvoice.totalAmount - payInvoice.paidAmount,
        }),
      });

      if (res.ok) {
        setPayInvoice(null);
        fetchInvoices();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header user={user} />
      <div className="flex flex-1">
        <Sidebar role="PATIENT" />
        <main className="flex-1 p-6 md:p-8 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Billing & Invoices</h1>
            <p className="text-xs text-slate-500">Pay consultation fees online, view payment receipts, and settlement history.</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-3.5">Invoice #</th>
                    <th className="px-6 py-3.5">Total Amount</th>
                    <th className="px-6 py-3.5">Paid Amount</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5 text-right">Payment Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {invoices.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                        No invoices issued.
                      </td>
                    </tr>
                  ) : (
                    invoices.map((inv) => (
                      <tr key={inv.id} className="hover:bg-slate-50 transition">
                        <td className="px-6 py-4 font-mono font-bold text-slate-900">{inv.invoiceNo}</td>
                        <td className="px-6 py-4 font-bold text-slate-900">{formatCurrency(inv.totalAmount)}</td>
                        <td className="px-6 py-4 text-emerald-600 font-semibold">{formatCurrency(inv.paidAmount)}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            inv.status === 'PAID' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                            {inv.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          {inv.status !== 'PAID' ? (
                            <button
                              onClick={() => setPayInvoice(inv)}
                              className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md transition"
                            >
                              Pay Now ({formatCurrency(inv.totalAmount - inv.paidAmount)})
                            </button>
                          ) : (
                            <span className="text-[11px] text-emerald-600 font-bold flex items-center justify-end gap-1">
                              <CheckCircle2 className="h-4 w-4" /> Paid in Full
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Simulated Checkout Modal */}
      {payInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Secure Online Checkout</h3>
              <button onClick={() => setPayInvoice(null)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
              <p className="text-slate-500">Invoice: <strong className="text-slate-900">{payInvoice.invoiceNo}</strong></p>
              <p className="text-lg font-bold text-slate-900">Amount Due: {formatCurrency(payInvoice.totalAmount - payInvoice.paidAmount)}</p>
            </div>

            <form onSubmit={handleCheckout} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Card Number</label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={cardNum}
                    onChange={(e) => setCardNum(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Expiry</label>
                  <input type="text" defaultValue="12/28" className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">CVC</label>
                  <input type="text" defaultValue="882" className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg flex items-center justify-center gap-1.5 transition"
              >
                <Lock className="h-4 w-4" /> {loading ? 'Processing...' : `Pay ${formatCurrency(payInvoice.totalAmount - payInvoice.paidAmount)}`}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
