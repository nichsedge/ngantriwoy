'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Store, 
  ChevronRight, 
  LogOut, 
  User,
  Bell,
  QrCode,
  X,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';

import { getDictionary } from '@/lib/locales';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [shops, setShops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newShopName, setNewShopName] = useState('');
  const [selectedShopForQR, setSelectedShopForQR] = useState<any | null>(null);
  const d = getDictionary('id');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  const fetchShops = async () => {
    if (!session?.user?.id) return;
    try {
      const res = await fetch('/api/shops');
      const data = await res.json();
      setShops(data);
    } catch (err) {
      console.error('Error fetching shops:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      fetchShops();
    }
  }, [session]);

  const handleCreateShop = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newShopName) return;
    
    try {
      const res = await fetch('/api/shops', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newShopName }),
      });
      if (res.ok) {
        setNewShopName('');
        setIsCreating(false);
        fetchShops();
      }
    } catch (err) {
      console.error('Error creating shop:', err);
    }
  };

  if (status === 'loading' || loading) return null;

  return (
    <main className="min-h-screen bg-[#f8fafc] text-zinc-950 flex flex-col font-sans max-w-md mx-auto border-x border-zinc-200 relative shadow-2xl">
      <div className="absolute inset-0 noise opacity-30 pointer-events-none" />
      
      {/* Header */}
      <header className="p-8 glass border-b border-zinc-200 relative z-10">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <span className="text-white font-black">AK</span>
             </div>
             <div>
                <h1 className="font-black text-2xl tracking-tighter">{d.common.app_name}</h1>
                <p className="text-[8px] font-black text-emerald-500 uppercase tracking-[0.3em]">{d.admin_dashboard.panel_title}</p>
             </div>
          </div>
          <button className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center text-zinc-400 hover:bg-zinc-200 transition-colors">
             <Bell className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-4 p-4 bg-white rounded-[2.5rem] border border-zinc-200 shadow-sm">
           <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center overflow-hidden border border-zinc-200">
              {session?.user?.image ? (
                <img src={session.user.image} alt="" className="w-full h-full object-cover" />
              ) : (
                <User className="w-6 h-6 text-zinc-400" />
              )}
           </div>
           <div className="flex-1 min-w-0">
              <div className="text-sm font-black tracking-tight truncate text-zinc-950">{session?.user?.name}</div>
              <div className="text-[10px] font-bold text-zinc-500 truncate">{session?.user?.email}</div>
           </div>
           <button 
            onClick={() => signOut({ callbackUrl: '/' })}
            className="w-12 h-12 bg-zinc-50 rounded-full flex items-center justify-center hover:bg-red-50 text-red-500 transition-colors border border-zinc-200"
           >
              <LogOut className="w-5 h-5" />
           </button>
        </div>
      </header>

      {/* Shop List / Onboarding */}
      <div className="flex-1 p-8 space-y-10 relative z-10">
        <div className="flex items-center justify-between">
           <h2 className="text-xl font-black tracking-tighter uppercase text-zinc-950">{d.admin_dashboard.shop_list_title}</h2>
           <button 
            onClick={() => setIsCreating(true)}
            className="w-14 h-14 bg-emerald-500 text-white rounded-[1.5rem] flex items-center justify-center shadow-lg shadow-emerald-500/20 active:scale-95 transition-all hover:bg-emerald-600"
           >
              <Plus className="w-7 h-7" />
           </button>
        </div>

        <div className="space-y-6">
           {shops.map((shop) => (
             <div key={shop.id} className="relative group">
                <Link 
                  href={`/admin/${shop.id}`}
                  className="block p-8 bg-white border border-zinc-200 rounded-[3rem] group active:scale-[0.98] transition-all relative overflow-hidden shadow-sm hover:shadow-md hover:border-emerald-500/30"
                >
                    <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
                      <QrCode className="w-24 h-24" />
                    </div>
                    
                    <div className="relative z-10">
                      <div className="flex items-center gap-5 mb-8">
                          <div className="w-16 h-16 bg-zinc-50 rounded-3xl flex items-center justify-center group-hover:bg-emerald-500 transition-colors border border-zinc-100">
                            <Store className="w-8 h-8 text-emerald-500 group-hover:text-white transition-colors" />
                          </div>
                          <div>
                            <h3 className="font-black text-2xl tracking-tight leading-none text-zinc-950">{shop.name}</h3>
                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mt-2">{d.admin_dashboard.open_control}</p>
                          </div>
                      </div>

                      <div className="flex items-center justify-between p-5 bg-zinc-50 rounded-[1.5rem] border border-zinc-100">
                          <div className="flex items-center gap-6">
                             <div>
                                <div className="text-[8px] font-black text-zinc-400 uppercase tracking-widest mb-1">{d.admin_dashboard.shop_code}</div>
                                <div className="text-2xl font-black tracking-[0.1em] text-emerald-600">{shop.shortCode}</div>
                             </div>
                             <button 
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setSelectedShopForQR(shop);
                              }}
                              className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center hover:bg-zinc-950 text-zinc-400 hover:text-white transition-all shadow-sm border border-zinc-200"
                             >
                                <QrCode className="w-6 h-6" />
                             </button>
                          </div>
                          <ChevronRight className="w-6 h-6 text-zinc-300 group-hover:text-emerald-500 transition-colors" />
                      </div>
                    </div>
                </Link>
             </div>
           ))}

           {shops.length === 0 && !isCreating && (
              <div className="text-center py-20 bg-white border border-zinc-200 rounded-[3.5rem] p-10 flex flex-col items-center shadow-sm">
                 <div className="w-24 h-24 bg-emerald-50 rounded-[2.5rem] flex items-center justify-center mb-8 border border-emerald-100">
                    <Store className="w-12 h-12 text-emerald-500" />
                 </div>
                 <h3 className="text-3xl font-black text-zinc-950 tracking-tighter mb-4">{d.admin_dashboard.start_now}</h3>
                 <p className="text-zinc-500 font-bold text-sm text-center mb-10 leading-relaxed uppercase tracking-widest text-[10px]">
                    {d.admin_dashboard.onboarding_desc}
                 </p>
                 <button 
                  onClick={() => setIsCreating(true)}
                  className="w-full py-6 bg-zinc-950 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all hover:bg-zinc-800"
                 >
                    {d.admin_dashboard.create_first_shop}
                 </button>
              </div>
           )}
        </div>
      </div>

      {/* QR Modal */}
      <AnimatePresence>
        {selectedShopForQR && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-white/80 backdrop-blur-xl flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-sm rounded-[4rem] p-12 text-zinc-950 text-center border border-zinc-200 shadow-2xl"
            >
               <div className="flex justify-between items-start mb-8">
                  <div className="text-left">
                     <h2 className="text-2xl font-black tracking-tighter leading-none">{selectedShopForQR.name}</h2>
                     <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mt-2">{d.admin_dashboard.scan_to_queue}</p>
                  </div>
                  <button onClick={() => setSelectedShopForQR(null)} className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center hover:bg-zinc-200 transition-colors">
                     <X className="w-5 h-5 text-zinc-400" />
                  </button>
               </div>

               <div className="bg-zinc-50 p-8 rounded-[3rem] mb-10 inline-block border border-zinc-100">
                  <QRCodeSVG 
                    value={`${window.location.origin}/s/${selectedShopForQR.id}/take`} 
                    size={200}
                    level="H"
                    includeMargin={false}
                  />
               </div>

               <div className="space-y-4">
                  <div className="p-6 bg-zinc-950 text-white rounded-3xl shadow-xl">
                     <div className="text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-1">{d.admin_dashboard.shop_code}</div>
                     <div className="text-3xl font-black tracking-[0.2em] tabular-nums">{selectedShopForQR.shortCode}</div>
                  </div>
                  <Link 
                    href={`/s/${selectedShopForQR.id}/take`}
                    target="_blank"
                    className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-emerald-600 transition-colors"
                  >
                     {d.common.open_monitor} <ExternalLink className="w-3 h-3" />
                  </Link>
               </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Modal */}
      <AnimatePresence>
        {isCreating && (
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
              className="bg-white w-full max-w-sm rounded-[3.5rem] p-12 border border-zinc-200 shadow-2xl"
            >
              <h2 className="text-3xl font-black tracking-tighter mb-2 text-center uppercase text-zinc-950">{d.admin_dashboard.new_shop_title}</h2>
              <p className="text-[10px] font-black text-zinc-400 text-center mb-10 uppercase tracking-widest">{d.admin_dashboard.new_shop_desc}</p>
              
              <form onSubmit={handleCreateShop} className="space-y-6">
                <input 
                  autoFocus
                  type="text" 
                  value={newShopName}
                  onChange={(e) => setNewShopName(e.target.value)}
                  placeholder={d.admin_dashboard.new_shop_placeholder}
                  className="w-full px-8 py-6 bg-zinc-50 border border-zinc-200 rounded-3xl font-black text-xl placeholder:text-zinc-300 focus:border-emerald-500 focus:outline-none transition-all text-center text-zinc-950"
                />
                
                <div className="grid grid-cols-2 gap-4">
                   <button 
                    type="button"
                    onClick={() => setIsCreating(false)}
                    className="py-6 bg-zinc-100 text-zinc-500 rounded-3xl font-black text-[10px] uppercase tracking-widest hover:bg-zinc-200 transition-colors"
                   >
                      {d.common.cancel}
                   </button>
                   <button 
                    type="submit"
                    className="py-6 bg-emerald-500 text-white rounded-3xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-colors"
                   >
                      {d.common.save}
                   </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>



      <style jsx>{`
        .tracking-tightest {
          letter-spacing: -0.06em;
        }
      `}</style>
    </main>
  );
}
