'use client';

import React from 'react';
import Link from 'next/link';

export function Navbar({ activeRole, onRoleChange }: { activeRole: 'coo' | 'ceo'; onRoleChange: (role: 'coo' | 'ceo') => void }) {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-emerald-900/40 text-white px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-600 via-teal-500 to-amber-400 flex items-center justify-center text-slate-950 font-bold text-lg shadow-lg shadow-emerald-900/30">
            T
          </div>
          <div>
            <h1 className="font-serif text-lg font-semibold tracking-wide bg-gradient-to-r from-emerald-200 via-teal-100 to-amber-200 bg-clip-text text-transparent">
              TENDERLY
            </h1>
            <p className="text-[10px] text-emerald-400/80 uppercase tracking-widest font-mono">Skincare & Wellness • Botswana</p>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <div className="flex bg-slate-800 p-0.5 rounded-full border border-slate-700">
            <button
              onClick={() => onRoleChange('coo')}
              className={`px-3 py-1 text-xs font-medium rounded-full transition-all ${
                activeRole === 'coo'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              COO
            </button>
            <button
              onClick={() => onRoleChange('ceo')}
              className={`px-3 py-1 text-xs font-medium rounded-full transition-all ${
                activeRole === 'ceo'
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-400/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              CEO
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}