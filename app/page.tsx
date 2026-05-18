'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { Sparkles, Store, ArrowRight, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { getDictionary } from '@/lib/locales';

export default function LandingPage() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const d = getDictionary('id');

  const handleJoinByCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length < 4 || code.length > 6) return;
    
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch(`/api/shops/find?code=${code}`);
      const shop = await res.json();
      
      if (res.ok && shop.id) {
        router.push(`/s/${shop.id}/take`);
      } else {
        setError('Toko tidak ditemukan');
      }
    } catch (err) {
      setError('Gagal mencari toko');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f8fafc] text-zinc-950 flex flex-col items-center justify-center p-6 overflow-hidden relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] aspect-square bg-emerald-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] aspect-square bg-blue-500/10 rounded-full blur-[120px]" />
        <div className="absolute inset-0 noise pointer-events-none opacity-40" />
      </div>

      <div className="relative z-10 max-w-4xl w-full text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 border border-zinc-200 rounded-full mb-12 backdrop-blur-sm shadow-sm">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">{d.landing.future_tag}</span>
          </div>
          
          <h1 className="text-7xl md:text-[10rem] font-black tracking-tightest leading-[0.8] uppercase mb-8">
            {d.landing.title_1}<br />
            <span className="text-emerald-500">{d.landing.title_2}</span>
          </h1>
          
          <p className="text-zinc-500 font-bold text-lg max-w-sm mx-auto mb-12 leading-relaxed">
            {d.landing.subtitle}
          </p>

          <form onSubmit={handleJoinByCode} className="max-w-xs mx-auto mb-20 space-y-4">
             <div className="relative">
                <input 
                  type="text" 
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
                  placeholder={d.landing.shop_code_placeholder}
                  className="w-full px-8 py-6 bg-white border border-zinc-200 rounded-[2rem] text-center text-2xl font-black tracking-[0.5em] placeholder:tracking-normal placeholder:text-[10px] placeholder:font-black focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 focus:outline-none transition-all shadow-sm"
                />
                {loading && (
                  <div className="absolute right-6 top-1/2 -translate-y-1/2">
                    <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
             </div>
             {error && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest">{error}</p>}
             <button 
              type="submit"
              disabled={code.length < 4 || loading}
              className="w-full py-5 bg-emerald-500 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-500/20 disabled:opacity-50 active:scale-95 transition-all cursor-pointer"
             >
                {d.landing.join_button}
             </button>
          </form>
        </motion.div>
      </div>

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Link 
            href="/admin"
            className="group block h-full p-10 bg-white border border-zinc-200 rounded-[3rem] hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-500/5 transition-all shadow-sm"
          >
            <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-emerald-500/20">
              <Store className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-3xl font-black tracking-tighter mb-4">{d.landing.owner_title}</h2>
            <p className="text-zinc-500 font-bold text-sm leading-relaxed mb-8">
              {d.landing.owner_desc}
            </p>
            <div className="flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase tracking-widest">
              {d.landing.owner_cta} <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
            </div>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Link 
            href="/login"
            className="group block h-full p-10 bg-zinc-950 text-white rounded-[3rem] hover:scale-[1.02] transition-all shadow-xl shadow-black/10"
          >
            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-8">
              <UserPlus className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-3xl font-black tracking-tighter mb-4">{d.landing.customer_title}</h2>
            <p className="text-zinc-300 font-bold text-sm leading-relaxed mb-8">
              {d.landing.customer_desc}
            </p>
            <div className="flex items-center gap-2 text-emerald-400 font-black text-[10px] uppercase tracking-widest">
              {d.landing.customer_cta} <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
            </div>
          </Link>
        </motion.div>
      </div>

      <footer className="relative z-10 mt-32 flex flex-col items-center gap-6 opacity-40">
        <div className="flex gap-8 items-center">
           <span className="font-black tracking-[0.2em] text-[8px] uppercase text-zinc-500">{d.landing.footer_made_for}</span>
           <div className="w-1.5 h-1.5 bg-zinc-300 rounded-full" />
           <span className="font-black tracking-[0.2em] text-[8px] uppercase text-zinc-500">{d.landing.footer_mode}</span>
        </div>
      </footer>
    </main>
  );
}

