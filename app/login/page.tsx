'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import { LogIn, LogOut, User, Loader2, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';

import { getDictionary } from '@/lib/locales';

export default function LoginPage() {
  const { data: session, status } = useSession();
  const d = getDictionary('id');

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8fafc] text-zinc-950 flex flex-col items-center justify-center p-6 relative overflow-hidden shadow-2xl">
      <div className="absolute inset-0 noise opacity-40 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md bg-white p-12 rounded-[3.5rem] border border-zinc-200 text-center relative z-10 shadow-2xl"
      >
        <div className="w-24 h-24 bg-emerald-500 rounded-[2rem] flex items-center justify-center mx-auto mb-10 shadow-lg shadow-emerald-500/20">
          <User className="w-12 h-12 text-white" />
        </div>

        <h1 className="text-5xl font-black tracking-tightest mb-4 uppercase text-zinc-950">
          {d.login.identity}
        </h1>
        <p className="text-zinc-400 font-bold mb-12 text-[10px] uppercase tracking-widest">
           {session ? d.login.welcome_owner : d.login.login_prompt}
        </p>
        
        {session ? (
          <div className="space-y-6">
            <div className="p-6 bg-zinc-50 rounded-3xl border border-zinc-100">
              <div className="text-[8px] font-black text-zinc-400 uppercase tracking-widest mb-2">{d.login.login_as}</div>
              <div className="text-xl font-black truncate text-zinc-950">{session.user?.email}</div>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
               <Link 
                href="/admin"
                className="w-full py-6 bg-zinc-950 text-white rounded-[2rem] font-black flex items-center justify-center gap-3 hover:scale-[0.98] transition-all shadow-xl"
               >
                 {d.landing.owner_cta}
               </Link>
               <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="w-full py-6 bg-zinc-50 text-zinc-500 rounded-[2rem] font-black flex items-center justify-center gap-3 hover:bg-zinc-100 transition-all border border-zinc-200"
               >
                 <LogOut className="w-5 h-5" />
                 {d.solo_admin.served === 'Selesai' ? 'Keluar' : 'Logout'} 
               </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <button
              onClick={async () => {
                await signIn('credentials', { 
                  username: 'admin', 
                  password: 'admin', 
                  callbackUrl: '/admin',
                  redirect: true 
                });
              }}
              className="group w-full py-6 bg-zinc-950 text-white rounded-[2rem] font-black flex items-center justify-center gap-4 hover:scale-[0.98] transition-all shadow-xl relative overflow-hidden"
            >
              <ShieldCheck className="w-6 h-6" />
              <span>{d.login.dev_login}</span>
              <div className="absolute inset-0 bg-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>

            <button
              onClick={() => signIn('google')}
              className="w-full py-6 bg-white text-zinc-950 border border-zinc-200 rounded-[2rem] font-black flex items-center justify-center gap-4 hover:bg-zinc-50 transition-all shadow-sm"
            >
              <LogIn className="w-6 h-6 text-zinc-400" />
              <span>{d.login.google_login}</span>
            </button>
          </div>
        )}

        <div className="mt-16 flex flex-col items-center gap-6">
           <Link 
            href="/"
            className="text-zinc-400 font-black text-[10px] uppercase tracking-[0.3em] hover:text-emerald-500 transition-colors"
           >
             {d.common.back_to_home}
           </Link>
        </div>
      </motion.div>
    </main>


  );
}
