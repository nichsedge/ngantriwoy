'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Ticket, 
  CheckCircle2,
  Smartphone,
  ScanQrCode,
  Share2,
  Loader2
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

import { getDictionary } from '@/lib/locales';

export default function TakeTicketPage() {
  const params = useParams();
  const shopId = params.shopId as string;
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState('');
  const [ticket, setTicket] = useState<{ number: string } | null>(null);
  const d = getDictionary('id');

  const handleTakeTicket = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/queue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'take', shopId, note }),
      });
      if (!res.ok) throw new Error('Gagal mengambil tiket');
      const data = await res.json();
      setTicket(data);
    } catch (error) {
      console.error('Error taking ticket:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShareToWA = () => {
    if (!ticket) return;
    const url = `${window.location.origin}/s/${shopId}/display`;
    const text = `Nomor antrean saya: *${ticket.number}*. Pantau antrean di sini: ${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-zinc-950 flex flex-col font-sans max-w-md mx-auto relative overflow-hidden shadow-2xl">
      <div className="absolute inset-0 noise opacity-40 pointer-events-none" />
      <div className="absolute top-[-10%] right-[-10%] w-[80%] aspect-square bg-emerald-500/5 rounded-full blur-[120px]" />
      
      <header className="p-10 relative z-10 flex flex-col items-center">
        <button onClick={() => router.push('/')} className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-zinc-200 shadow-sm rounded-full mb-8 hover:bg-zinc-50 transition-colors">
           <ScanQrCode className="w-3 h-3 text-emerald-500" />
           <span className="text-[8px] font-black uppercase tracking-[0.3em] text-zinc-400 text-center">{d.common.app_name} Kiosk</span>
        </button>
      </header>

      <main className="flex-1 flex flex-col p-10 relative z-10">
        <AnimatePresence mode="wait">
          {!ticket ? (
            <motion.div
              key="landing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex-1 flex flex-col"
            >
              <div className="mb-20 text-center">
                <h1 className="text-7xl font-black tracking-tightest leading-[0.8] uppercase mb-8 text-zinc-950">
                  {d.kiosk.title_1}<br />
                  <span className="text-emerald-500">{d.kiosk.title_2}</span>
                </h1>
                <p className="text-zinc-500 font-bold text-lg leading-relaxed">
                  {d.kiosk.subtitle}
                </p>
              </div>

              <div className="mb-10 w-full px-4">
                 <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-3 ml-2 text-center">
                    {d.kiosk.note_label}
                 </label>
                 <textarea 
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder={d.kiosk.note_placeholder}
                  className="w-full bg-white border border-zinc-200 shadow-sm rounded-3xl p-6 text-sm font-bold placeholder:text-zinc-300 focus:border-emerald-500 focus:outline-none transition-all resize-none h-24 text-center text-zinc-950"
                 />
              </div>

              <div className="flex-1 flex flex-col items-center justify-center">
                 <button
                  onClick={handleTakeTicket}
                  disabled={loading}
                  className="group relative w-full aspect-square max-w-[280px] bg-white rounded-[5rem] flex flex-col items-center justify-center gap-6 shadow-2xl shadow-zinc-200/50 border border-zinc-100 active:scale-95 transition-all overflow-hidden"
                 >
                    <div className="absolute inset-0 bg-emerald-500/5 scale-0 group-active:scale-150 transition-transform duration-700 rounded-full" />
                    <div className="relative z-10 w-32 h-32 bg-zinc-950 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-500">
                      {loading ? (
                         <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
                      ) : (
                         <Ticket className="w-16 h-16 text-white group-hover:rotate-12 transition-transform" />
                      )}
                    </div>
                    <div className="relative z-10 flex flex-col items-center">
                       <span className="text-zinc-950 font-black text-2xl tracking-tighter uppercase leading-none">{d.kiosk.take_button}</span>
                       <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mt-2">{d.kiosk.touch_here}</span>
                    </div>
                 </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="ticket"
              initial={{ opacity: 0, scale: 0.8, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="flex-1 flex flex-col items-center justify-center"
            >
              <div className="w-full bg-white text-zinc-950 rounded-[4rem] p-12 shadow-[0_40px_100px_-10px_rgba(0,0,0,0.1)] relative overflow-hidden text-center border border-zinc-200">
                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-10 border border-emerald-100">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                </div>
                <h2 className="text-zinc-400 font-black uppercase tracking-[0.2em] text-[10px] mb-4">{d.kiosk.your_number}</h2>
                <div className="text-9xl font-black tracking-tightest leading-none mb-10 tabular-nums">{ticket.number}</div>
                
                <div className="space-y-3">
                   <button 
                    onClick={handleShareToWA}
                    className="w-full py-5 bg-emerald-500 text-white rounded-2xl font-black flex items-center justify-center gap-3 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
                   >
                      <Share2 className="w-5 h-5" />
                      {d.kiosk.save_wa}
                   </button>
                   <button 
                    onClick={() => setTicket(null)}
                    className="w-full py-5 bg-zinc-100 text-zinc-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-zinc-200 transition-colors"
                   >
                      {d.common.close}
                   </button>
                </div>
              </div>

              <div className="mt-12 text-center flex flex-col items-center gap-4">
                 <div className="w-12 h-12 bg-zinc-100 rounded-2xl flex items-center justify-center border border-zinc-200">
                    <Smartphone className="w-6 h-6 text-zinc-400" />
                 </div>
                 <p className="text-zinc-400 font-bold text-sm max-w-[200px]">{d.kiosk.wa_remind}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="p-10 opacity-40 text-center">
         <span className="text-[10px] font-black tracking-[0.3em] uppercase text-zinc-400">{d.common.app_name} • {d.landing.footer_mode}</span>
      </footer>

      <style jsx>{`
        .tracking-tightest {
          letter-spacing: -0.06em;
        }
      `}</style>
    </div>

  );
}
