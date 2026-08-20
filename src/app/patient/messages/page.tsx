'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { Mail, Send, CheckCircle2, MessageSquare, Clock } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function PatientMessagesPage() {
  const [user, setUser] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [subject, setSubject] = useState('');
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const userRes = await fetch('/api/auth/me');
      const userData = await userRes.json();
      setUser(userData.user);

      const msgRes = await fetch('/api/messages');
      const msgData = await msgRes.json();
      setMessages(msgData.messages || []);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !subject.trim()) return;
    setLoading(true);

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, message: messageText }),
      });

      if (res.ok) {
        setSubject('');
        setMessageText('');
        setSentSuccess(true);
        fetchData();
        setTimeout(() => setSentSuccess(false), 4000);
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
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Hospital Support & Messages</h1>
            <p className="text-xs text-slate-500">Contact MediCare Nexus hospital administration directly, ask clinical questions, or view support ticket replies.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* New Inquiry Form */}
            <form onSubmit={handleSendMessage} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Mail className="h-5 w-5 text-sky-600" /> Send Inquiry to Admin
              </h3>

              {sentSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>Message sent to Hospital Admin successfully!</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Subject / Topic *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Question about appointment insurance coverage"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl text-xs bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Detailed Message *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Type your question or message here..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  className="w-full p-3 border rounded-xl text-xs bg-slate-50"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2"
              >
                <Send className="h-4 w-4" /> {loading ? 'Sending Message...' : 'Send Message'}
              </button>
            </form>

            {/* Conversation History */}
            <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900">My Message History ({messages.length})</h3>

              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
                {messages.length === 0 ? (
                  <p className="text-xs text-slate-400 py-6 text-center">You have not sent any messages yet.</p>
                ) : (
                  messages.map((m) => (
                    <div key={m.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-2">
                      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                        <span className="font-bold text-slate-900 text-sm">{m.subject}</span>
                        <span className="text-slate-400 font-mono text-[11px]">{formatDate(m.createdAt)}</span>
                      </div>

                      <p className="text-slate-700">{m.message}</p>

                      {/* Admin Replies */}
                      {(m.replies || []).length > 0 && (
                        <div className="mt-3 pt-3 border-t border-slate-200 space-y-2">
                          <span className="text-[10px] font-bold text-sky-600 uppercase tracking-wider block">Admin Reply</span>
                          {m.replies.map((rep: any) => (
                            <div key={rep.id} className="bg-sky-50 p-3 rounded-xl border border-sky-200 text-xs text-slate-800">
                              <p className="font-semibold text-sky-900 mb-1">MediCare Nexus Admin:</p>
                              <p>{rep.message}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
