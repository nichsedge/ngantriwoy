'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  SkipForward, 
  RefreshCcw, 
  Settings, 
  History, 
  User,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Share2,
  QrCode,
  Users,
  Volume2,
  VolumeX,
  Plus,
  Sparkles,
  ExternalLink,
  X
} from 'lucide-react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { getDictionary } from '@/lib/locales';

export default function SoloAdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const shopId = params.shopId as string;

  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [isCalling, setIsCalling] = useState(false);
  const [data, setData] = useState<{
    serving: { number: string; note?: string } | null;
    waiting: { number: string; note?: string }[];
    history: { number: string; status: string }[];
    waitingCount: number;
    totalToday: number;
    servedCount: number;
    nextNumber: string;
    avgServiceMinutes: number;
  }>({
    serving: null,
    waiting: [],
    history: [],
    waitingCount: 0,
    totalToday: 0,
    servedCount: 0,
    nextNumber: '---',
    avgServiceMinutes: 5
  });

  const [view, setView] = useState<'control' | 'waiting' | 'history'>('control');
  const [manualNote, setManualNote] = useState('');
  const [isManualInput, setIsManualInput] = useState(false);
  const d = getDictionary('id');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  const refreshData = async () => {
    try {
      const res = await fetch(`/api/queue?shopId=${shopId}`);
      if (res.ok) {
        const newData = await res.json();
        setData(newData);
      }
    } catch (error) {
      console.error('Error refreshing data:', error);
    }
  };

  useEffect(() => {
    if (!shopId) return;
    const eventSource = new EventSource(`/api/queue/events?shopId=${shopId}`);

    eventSource.onmessage = (event) => {
      try {
        const newData = JSON.parse(event.data);
        
        setData(prevData => {
          // Trigger voice if number changed and audio is on
          if (isAudioEnabled && newData.serving?.number && newData.serving?.number !== prevData.serving?.number) {
            speak(newData.serving.number);
          }
          return newData;
        });
      } catch (error) {
        console.error('Error parsing SSE data:', error);
      }
    };

    eventSource.onerror = (error) => {
      console.error('SSE Error:', error);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [shopId, isAudioEnabled]); // Removed data.serving?.number from dependencies

  const speak = (number: string) => {
    setIsCalling(true);
    const msg = new SpeechSynthesisUtterance(`Nomor antrean ${number}, silakan masuk`);
    msg.lang = 'id-ID';
    msg.rate = 0.9;
    msg.pitch = 1.1;
    msg.onend = () => setIsCalling(false);
    window.speechSynthesis.speak(msg);
  };

  const handleAction = async (action: string) => {
    // Play haptic-like sound
    if (typeof window !== 'undefined') {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.frequency.value = 800;
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.1);
    }

    await fetch('/api/queue', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, shopId }),
    });

    await refreshData();
  };

  const handleManualTake = () => {
    setIsManualInput(true);
  };

  const handleManualAdd = async () => {
    await fetch('/api/queue', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'take', shopId, note: manualNote }),
    });
    setManualNote('');
    setIsManualInput(false);
    await refreshData();
  };

  if (status === 'loading') return null;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-zinc-950 flex flex-col font-sans max-w-md mx-auto border-x border-zinc-200 relative overflow-hidden shadow-2xl">
      <div className="absolute inset-0 noise opacity-40 pointer-events-none" />
      <div className={`absolute top-0 left-0 right-0 h-1 bg-emerald-500 transition-all duration-1000 ${isCalling ? 'opacity-100' : 'opacity-0'}`} />

      <header className="sticky top-0 z-30 glass p-6 flex items-center justify-between border-b border-zinc-200">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-zinc-100 transition-colors">
            <ChevronLeft className="w-5 h-5 text-zinc-400" />
          </Link>
          <div>
            <h1 className="font-black tracking-tighter text-lg uppercase leading-none text-zinc-950">{d.solo_admin.title}</h1>
            <p className="text-[8px] font-black tracking-[0.3em] text-emerald-600 mt-1 uppercase">{d.solo_admin.live_control}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
           <button 
            onClick={() => setIsAudioEnabled(!isAudioEnabled)}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${isAudioEnabled ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-zinc-100 text-zinc-400'}`}
           >
              {isAudioEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
           </button>
        </div>
      </header>

      <div className="px-6 py-4 flex items-center justify-between bg-zinc-50 border-b border-zinc-200">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isCalling ? 'bg-emerald-400 animate-ping' : 'bg-emerald-500'}`} />
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
            {isCalling ? 'Memanggil...' : 'Menunggu Aksi'}
          </span>
        </div>
        <div className="text-[10px] font-black uppercase tracking-widest flex gap-4 text-zinc-400">
           <span>Rata-rata: <span className="text-zinc-950">{data.avgServiceMinutes}m</span></span>
           <span className="text-zinc-200">|</span>
           <span>Tiket: <span className="text-zinc-950">{data.totalToday}</span></span>
           <span className="text-zinc-200">|</span>
           <span>Selesai: <span className="text-emerald-600">{data.servedCount}</span></span>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-32">
        <AnimatePresence>
          {view === 'control' && (
            <motion.div 
              key="control"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="p-8 space-y-10"
            >
              {/* Serving Display */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-[3rem] blur opacity-[0.08] group-hover:opacity-[0.12] transition duration-1000" />
                <div className="relative bg-white border border-zinc-200 p-10 rounded-[3rem] text-center shadow-sm">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-8 border border-emerald-100">
                    <Sparkles className="w-3 h-3" />
                    Sedang Dilayani
                  </div>
                  
                  <div className="text-[10rem] font-black tracking-tightest leading-none text-zinc-950 mb-8 tabular-nums">
                    {data.serving?.number || '---'}
                  </div>

                  {data.serving?.note && (
                    <div className="mb-10 p-6 bg-zinc-50 rounded-3xl border border-zinc-200">
                       <div className="text-[8px] font-black text-zinc-400 uppercase tracking-widest mb-2">Catatan Pesanan</div>
                       <div className="text-xl font-black text-emerald-600">"{data.serving.note}"</div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-6">
                    <button 
                      onClick={() => handleAction('next')}
                      className="group relative w-full py-10 bg-zinc-950 text-white rounded-[2.5rem] font-black text-xl uppercase tracking-widest overflow-hidden hover:scale-[0.98] active:scale-95 transition-all shadow-xl shadow-zinc-950/20"
                    >
                      <div className="absolute inset-0 bg-emerald-500 opacity-0 group-active:opacity-10 transition-opacity" />
                      <div className="flex items-center justify-center gap-4">
                         <Play className="w-8 h-8 fill-white" />
                         <span>Panggil Antrean</span>
                      </div>
                    </button>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <button 
                        onClick={() => handleAction('skip')}
                        className="py-6 bg-zinc-50 border border-zinc-200 rounded-3xl flex flex-col items-center gap-2 font-black text-[10px] uppercase tracking-widest text-zinc-500 hover:bg-zinc-100 transition-all"
                      >
                        <SkipForward className="w-5 h-5" />
                        Lewati
                      </button>
                      <button 
                        onClick={() => handleAction('reset')}
                        className="py-6 bg-red-50 border border-red-100 rounded-3xl flex flex-col items-center gap-2 font-black text-[10px] uppercase tracking-widest text-red-400 hover:bg-red-100 hover:text-red-600 transition-all"
                      >
                        <RefreshCcw className="w-5 h-5" />
                        Reset Hari
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Manual Entry */}
              <button 
                onClick={handleManualTake}
                className="w-full py-8 bg-white border border-zinc-200 rounded-[2.5rem] flex items-center justify-center gap-4 group hover:bg-zinc-50 transition-all shadow-sm"
              >
                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform border border-emerald-100">
                   <Plus className="w-6 h-6 text-emerald-500" />
                </div>
                <div className="text-left">
                   <div className="font-black text-sm uppercase tracking-widest text-zinc-950">Input Manual</div>
                   <div className="text-[10px] font-bold text-zinc-400">Tambah pelanggan manual</div>
                </div>
              </button>

              {/* Stats & Links */}
              <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm">
                    <div className="flex items-center gap-2 text-zinc-400 mb-2">
                       <Users className="w-4 h-4" />
                       <span className="text-[10px] font-black uppercase tracking-widest">Menunggu</span>
                    </div>
                    <div className="text-3xl font-black text-zinc-950">{data.waitingCount}</div>
                 </div>
                 <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm">
                    <div className="flex items-center gap-2 text-emerald-500 mb-2">
                       <User className="w-4 h-4" />
                       <span className="text-[10px] font-black uppercase tracking-widest">Dilayani</span>
                    </div>
                    <div className="text-3xl font-black text-emerald-600">{data.servedCount}</div>
                 </div>
              </div>
              <div className="grid grid-cols-1 gap-4">
                 <Link 
                  href={`/s/${shopId}/display`}
                  target="_blank"
                  className="bg-emerald-50 p-8 rounded-[2.5rem] border border-emerald-100 flex items-center justify-between group hover:bg-emerald-100 transition-colors"
                 >
                    <div>
                       <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 block mb-1">Halaman Publik</span>
                       <div className="text-sm font-bold text-zinc-500">Buka Layar Antrean</div>
                    </div>
                    <ExternalLink className="w-6 h-6 text-emerald-500 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                 </Link>
              </div>
            </motion.div>
          )}

          {view === 'waiting' && (
             <motion.div 
               key="waiting"
               initial={{ opacity: 0, x: 10 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: -10 }}
               transition={{ duration: 0.15 }}
               className="p-8"
             >
                <div className="flex items-center justify-between mb-10">
                   <div>
                      <h2 className="text-4xl font-black tracking-tighter uppercase leading-none text-zinc-950">Antrean</h2>
                      <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mt-2">Daftar Tunggu Pelanggan</p>
                   </div>
                   <button onClick={() => setView('control')} className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center hover:bg-zinc-200 transition-colors">
                      <ArrowLeft className="w-5 h-5 text-zinc-400" />
                   </button>
                </div>
                
                <div className="space-y-4">
                   {data.waiting.map((ticket, i) => (
                     <div key={ticket.number} className="p-6 bg-white border border-zinc-200 rounded-[2.5rem] flex items-center justify-between group shadow-sm">
                        <div className="flex items-center gap-6 flex-1 min-w-0">
                           <span className="w-10 h-10 bg-zinc-50 border border-zinc-100 rounded-full flex items-center justify-center text-[10px] font-black text-zinc-400">#{i + 1}</span>
                           <div className="flex-1 min-w-0">
                              <span className="text-3xl font-black tracking-tightest tabular-nums block text-zinc-950">{ticket.number}</span>
                              {ticket.note && (
                                 <p className="text-[10px] font-bold text-emerald-600 truncate uppercase tracking-widest mt-1">
                                    {ticket.note}
                                 </p>
                              )}
                           </div>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1 bg-zinc-50 border border-zinc-100 rounded-full text-[8px] font-black uppercase tracking-widest text-zinc-400">
                           Menunggu
                        </div>
                     </div>
                   ))}
                   {data.waiting.length === 0 && (
                      <div className="text-center py-32 opacity-20 flex flex-col items-center gap-4 text-zinc-950">
                         <Users className="w-12 h-12" />
                         <span className="text-xs font-black uppercase tracking-widest">Tidak ada antrean</span>
                      </div>
                   )}
                </div>
             </motion.div>
          )}

          {view === 'history' && (
             <motion.div 
               key="history"
               initial={{ opacity: 0, x: 10 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: -10 }}
               transition={{ duration: 0.15 }}
               className="p-8"
             >
                <div className="flex items-center justify-between mb-10">
                   <div>
                      <h2 className="text-4xl font-black tracking-tighter uppercase leading-none text-zinc-950">Riwayat</h2>
                      <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mt-2">Aktivitas Terakhir</p>
                   </div>
                   <button onClick={() => setView('control')} className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center hover:bg-zinc-200 transition-colors">
                      <ArrowLeft className="w-5 h-5 text-zinc-400" />
                   </button>
                </div>

                <div className="space-y-6">
                   {data.history.map((ticket, i) => (
                     <div key={ticket.number + i} className="flex items-center gap-4 group">
                        <div className={`w-3 h-3 rounded-full ${ticket.status === 'skipped' ? 'bg-amber-500' : 'bg-emerald-500'} group-hover:scale-150 transition-transform`} />
                        <div className="flex-1">
                           <div className="text-2xl font-black tracking-tightest tabular-nums leading-none mb-1 text-zinc-950">{ticket.number}</div>
                           <div className="text-[8px] font-black uppercase tracking-widest text-zinc-400">{ticket.status === 'skipped' ? 'Dilewati' : 'Dilayani'}</div>
                        </div>
                        <div className="text-[10px] font-bold text-zinc-300">Hari Ini</div>
                     </div>
                   ))}
                </div>
             </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Navigation (Floating Glass) */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-[calc(28rem-3rem)] z-50">
         <nav className="glass border border-zinc-200 rounded-[2.5rem] p-2 flex gap-2 shadow-2xl shadow-zinc-200/50">
            <button 
             onClick={() => setView('control')}
             className={`flex-1 py-4 rounded-[2rem] flex flex-col items-center gap-1 transition-all ${view === 'control' ? 'bg-zinc-950 text-white shadow-lg' : 'text-zinc-400 hover:text-zinc-600 hover:bg-zinc-50'}`}
            >
               <Play className={`w-5 h-5 ${view === 'control' ? 'fill-white' : ''}`} />
               <span className="text-[8px] font-black uppercase tracking-tighter">Utama</span>
            </button>
            <button 
             onClick={() => setView('waiting')}
             className={`flex-1 py-4 rounded-[2rem] flex flex-col items-center gap-1 transition-all ${view === 'waiting' ? 'bg-zinc-950 text-white shadow-lg' : 'text-zinc-400 hover:text-zinc-600 hover:bg-zinc-50'}`}
            >
               <Users className={`w-5 h-5 ${view === 'waiting' ? 'fill-white' : ''}`} />
               <span className="text-[8px] font-black uppercase tracking-tighter">Antrean</span>
            </button>
            <button 
             onClick={() => setView('history')}
             className={`flex-1 py-4 rounded-[2rem] flex flex-col items-center gap-1 transition-all ${view === 'history' ? 'bg-zinc-950 text-white shadow-lg' : 'text-zinc-400 hover:text-zinc-600 hover:bg-zinc-50'}`}
            >
               <History className="w-5 h-5" />
               <span className="text-[8px] font-black uppercase tracking-tighter">Riwayat</span>
            </button>
         </nav>
      </div>

      {/* Manual Input Modal */}
      <AnimatePresence>
        {isManualInput && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-zinc-950/20 backdrop-blur-md flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-sm rounded-[3.5rem] p-10 border border-zinc-200 shadow-2xl"
            >
              <div className="flex justify-between items-start mb-8">
                 <div className="text-left">
                    <h2 className="text-2xl font-black tracking-tighter leading-none text-zinc-950 uppercase">{d.solo_admin.manual_entry}</h2>
                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mt-2">{d.solo_admin.add_walk_in}</p>
                 </div>
                 <button onClick={() => setIsManualInput(false)} className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center hover:bg-zinc-200 transition-colors">
                    <X className="w-5 h-5 text-zinc-400" />
                 </button>
              </div>
              
              <div className="space-y-6">
                <div>
                   <label className="text-[8px] font-black text-zinc-400 uppercase tracking-widest mb-2 block ml-4">{d.kiosk.note_label}</label>
                   <input 
                    autoFocus
                    type="text" 
                    value={manualNote}
                    onChange={(e) => setManualNote(e.target.value)}
                    placeholder={d.kiosk.note_placeholder}
                    className="w-full px-8 py-6 bg-zinc-50 border border-zinc-200 rounded-3xl font-bold text-lg placeholder:text-zinc-300 focus:border-emerald-500 focus:outline-none transition-all text-zinc-950"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                   <button 
                    onClick={() => setIsManualInput(false)}
                    className="py-6 bg-zinc-100 text-zinc-500 rounded-3xl font-black text-[10px] uppercase tracking-widest hover:bg-zinc-200 transition-colors"
                   >
                      {d.common.cancel}
                   </button>
                   <button 
                    onClick={handleManualAdd}
                    className="py-6 bg-emerald-500 text-white rounded-3xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-colors"
                   >
                      {d.common.save}
                   </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .tracking-tightest {
          letter-spacing: -0.06em;
        }
      `}</style>
    </div>
  );

}
