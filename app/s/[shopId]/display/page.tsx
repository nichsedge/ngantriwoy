'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, Clock, MapPin, Smartphone } from 'lucide-react';
import { useParams } from 'next/navigation';

import { getDictionary } from '@/lib/locales';

export default function MobileDisplayPage() {
  const params = useParams();
  const shopId = params.shopId as string;
  const [data, setData] = useState<{
    serving: { number: string } | null;
    waiting: { number: string }[];
    waitingCount: number;
    avgServiceMinutes: number;
  }>({
    serving: null,
    waiting: [],
    waitingCount: 0,
    avgServiceMinutes: 5
  });
  const d = getDictionary('id');

  useEffect(() => {
    if (!shopId) return;
    const eventSource = new EventSource(`/api/queue/events?shopId=${shopId}`);

    eventSource.onmessage = (event) => {
      const newData = JSON.parse(event.data);
      setData(newData);
    };

    return () => {
      eventSource.close();
    };
  }, [shopId]);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-zinc-950 flex flex-col font-sans max-w-md mx-auto relative overflow-hidden shadow-2xl">
      <div className="absolute inset-0 noise opacity-40 pointer-events-none" />
      <div className="absolute top-[-20%] left-[-20%] w-[100%] aspect-square bg-emerald-500/5 rounded-full blur-[150px] animate-pulse" />

      <header className="p-10 relative z-10 flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-zinc-200 shadow-sm rounded-full mb-8">
           <Smartphone className="w-3 h-3 text-emerald-500" />
           <span className="text-[8px] font-black uppercase tracking-[0.3em] text-zinc-400">{d.display.live_monitor}</span>
        </div>
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <span className="text-white font-black">AK</span>
           </div>
           <h1 className="text-2xl font-black tracking-tightest uppercase text-zinc-950">{d.landing.title_1}<span className="text-emerald-500">{d.landing.title_2}</span></h1>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-10 relative z-10">
        <div className="text-zinc-400 font-black text-[10px] uppercase tracking-[0.5em] mb-8">{d.display.now_calling}</div>
        
        <div className="relative mb-24 w-full aspect-square max-w-[320px] flex items-center justify-center">
           <div className="relative w-full h-full bg-white border border-zinc-100 rounded-[4.5rem] flex items-center justify-center shadow-[0_40px_100px_-10px_rgba(0,0,0,0.08)]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={data.serving?.number || 'none'}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-[11rem] font-black tracking-tightest text-zinc-950 tabular-nums"
                >
                  {data.serving?.number || '---'}
                </motion.div>
              </AnimatePresence>
           </div>
        </div>

        <div className="w-full bg-white border border-zinc-200 p-8 rounded-[2.5rem] space-y-8 shadow-sm">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-zinc-400">
                 <Users className="w-5 h-5" />
                 <span className="text-[10px] font-black uppercase tracking-widest">{d.display.remaining}</span>
              </div>
              <span className="text-xl font-black text-emerald-600">{data.waitingCount} {d.common.people}</span>
           </div>
           
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-zinc-400">
                 <Clock className="w-5 h-5" />
                 <span className="text-[10px] font-black uppercase tracking-widest">{d.display.estimate}</span>
              </div>
              <span className="text-xl font-black text-zinc-950">~{data.waitingCount * data.avgServiceMinutes} {d.common.minutes}</span>
           </div>
        </div>
      </main>

      <footer className="p-10 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-zinc-200 shadow-sm rounded-full mb-4">
            <MapPin className="w-3 h-3 text-emerald-500" />
            <span className="text-[8px] font-black uppercase tracking-widest text-zinc-400">{d.display.wait_around}</span>
         </div>
      </footer>

      <style jsx>{`
        .tracking-tightest {
          letter-spacing: -0.06em;
        }
      `}</style>
    </div>
  );
}
