'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { Mail, Send, User, Clock, CheckCircle2, MessageSquare, Reply } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function AdminMessagesPage() {
  const [user, setUser] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [selectedMsg, setSelectedMsg] = useState<any>(null);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(false);

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

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMsg || !replyText.trim()) return;
    setLoading(true);

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientId: selectedMsg.senderId,
          replyToId: selectedMsg.id,
          subject: `Re: ${selectedMsg.subject}`,
          message: replyText,
        }),
      });

      if (res.ok) {
        setReplyText('');
        fetchData();
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
        <Sidebar role="ADMIN" />
        <main className="flex-1 p-6 md:p-8 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Patient Messages & Support Center</h1>
            <p className="text-xs text-slate-500">Read patient inquiries, respond to hospital support tickets, and manage message logs.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Messages List Sidebar */}
            <div className="bg-white rounded-3xl border border-slate-200 p-4 shadow-sm space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2">Patient Inquiries ({messages.length})</h3>
              <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
                {messages.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-6">No patient messages received yet.</p>
                ) : (
                  messages.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setSelectedMsg(m)}
                      className={`w-full text-left p-3 rounded-2xl border transition space-y-1 ${
                        selectedMsg?.id === m.id ? 'bg-sky-50 border-sky-300 ring-2 ring-sky-500/20' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900 truncate">{m.sender?.name || 'Patient'}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{formatDate(m.createdAt, 'MMM dd')}</span>
                      </div>
                      <p className="text-xs font-semibold text-sky-700 truncate">{m.subject}</p>
                      <p className="text-[11px] text-slate-500 line-clamp-1">{m.message}</p>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Message Detail & Reply Box */}
            <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col min-h-[500px]">
              {selectedMsg ? (
                <div className="flex-1 flex flex-col space-y-6">
                  <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-slate-900">{selectedMsg.subject}</h2>
                      <p className="text-xs text-slate-500">From: <strong className="text-slate-800">{selectedMsg.sender?.name}</strong> ({selectedMsg.sender?.email})</p>
                    </div>
                    <span className="text-xs text-slate-400 font-mono">{formatDate(selectedMsg.createdAt)}</span>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-800 leading-relaxed flex-1">
                    {selectedMsg.message}
                  </div>

                  {/* Previous Replies */}
                  {(selectedMsg.replies || []).length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Previous Replies</h4>
                      {selectedMsg.replies.map((rep: any) => (
                        <div key={rep.id} className="bg-sky-50/60 p-3 rounded-2xl border border-sky-100 text-xs space-y-1">
                          <span className="font-bold text-sky-800">{rep.sender?.name || 'Admin'}</span>
                          <p className="text-slate-700">{rep.message}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Reply Form */}
                  <form onSubmit={handleSendReply} className="space-y-3 pt-2">
                    <textarea
                      rows={3}
                      required
                      placeholder="Type your response to the patient..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="w-full p-3 border border-slate-200 rounded-2xl text-xs bg-slate-50 text-slate-800 focus:ring-2 focus:ring-sky-500"
                    />
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md flex items-center gap-2"
                      >
                        <Send className="h-4 w-4" /> {loading ? 'Sending Reply...' : 'Send Reply to Patient'}
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-2">
                  <Mail className="h-12 w-12 text-slate-300" />
                  <h3 className="text-base font-bold text-slate-700">Select a Message</h3>
                  <p className="text-xs text-slate-400 max-w-sm">Choose an inquiry from the patient list on the left to read and send a reply.</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
