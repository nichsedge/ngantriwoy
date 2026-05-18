'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DisplayRedirect() {
  const router = useRouter();

  useEffect(() => {
    // In a real app, we might check localStorage for the last shopId
    // For now, redirect back home to select a shop
    router.replace('/');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 font-sans">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-zinc-400 font-bold uppercase tracking-widest text-[10px]">Menuju Layar Monitoring...</p>
      </div>
    </div>
  );
}
