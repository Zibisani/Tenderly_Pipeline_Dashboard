'use client';

import React from 'react';
import { formatBWP } from '../../lib/format';

interface CashBucketsProps {
  cashReceived: number;
  cashCommitted: number;
  cashExpected: number;
}

export function CashBuckets({ cashReceived, cashCommitted, cashExpected }: CashBucketsProps) {
  const total = cashReceived + cashCommitted + cashExpected;

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-sm">
      <h3 className="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-4 flex items-center gap-2">
        <span>??</span> Pipeline Cash Flow Summary (BWP)
      </h3>

      <div className="grid grid-cols-3 gap-3 mb-4 text-center">
        <div className="bg-emerald-950/40 border border-emerald-800/40 rounded-xl p-3">
          <p className="text-[11px] text-emerald-400 font-medium">Cash Received</p>
          <p className="text-lg font-bold text-emerald-300 font-mono mt-1">{formatBWP(cashReceived)}</p>
        </div>

        <div className="bg-amber-950/40 border border-amber-800/40 rounded-xl p-3">
          <p className="text-[11px] text-amber-400 font-medium">Cash Committed</p>
          <p className="text-lg font-bold text-amber-300 font-mono mt-1">{formatBWP(cashCommitted)}</p>
        </div>

        <div className="bg-teal-950/40 border border-teal-800/40 rounded-xl p-3">
          <p className="text-[11px] text-teal-400 font-medium">Cash Expected</p>
          <p className="text-lg font-bold text-teal-300 font-mono mt-1">{formatBWP(cashExpected)}</p>
        </div>
      </div>

      {total > 0 && (
        <div className="w-full bg-slate-800 rounded-full h-2.5 flex overflow-hidden">
          <div
            className="bg-emerald-500 h-full transition-all duration-500"
            style={{ width: `${(cashReceived / total) * 100}%` }}
            title={`Received: ${formatBWP(cashReceived)}`}
          />
          <div
            className="bg-amber-500 h-full transition-all duration-500"
            style={{ width: `${(cashCommitted / total) * 100}%` }}
            title={`Committed: ${formatBWP(cashCommitted)}`}
          />
          <div
            className="bg-teal-500 h-full transition-all duration-500"
            style={{ width: `${(cashExpected / total) * 100}%` }}
            title={`Expected: ${formatBWP(cashExpected)}`}
          />
        </div>
      )}
    </div>
  );
}
