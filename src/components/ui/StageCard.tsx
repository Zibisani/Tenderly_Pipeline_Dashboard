'use client';

import React from 'react';
import { FunnelStageData } from '../../types/domain';
import { formatBWP } from '../../lib/format';

export function StageCard({ stage, onClick }: { stage: FunnelStageData; onClick?: () => void }) {
  const getStageColor = (num: number) => {
    switch (num) {
      case 1: return 'from-teal-900/60 to-emerald-950/80 border-teal-700/50 text-teal-300';
      case 2: return 'from-slate-900/60 to-slate-950/80 border-slate-700/50 text-slate-300';
      case 3: return 'from-amber-950/60 to-slate-950/80 border-amber-800/50 text-amber-300';
      case 4: return 'from-rose-950/60 to-slate-950/80 border-rose-800/50 text-rose-300';
      case 5: return 'from-emerald-950/60 to-slate-950/80 border-emerald-800/50 text-emerald-300';
      case 6: return 'from-indigo-950/60 to-slate-950/80 border-indigo-800/50 text-indigo-300';
      case 7: return 'from-slate-900/60 to-slate-900/80 border-slate-800/50 text-slate-400';
      default: return 'from-slate-900 to-slate-950 border-slate-800 text-slate-300';
    }
  };

  return (
    <div
      onClick={onClick}
      className={`relative bg-gradient-to-br ${getStageColor(stage.stage)} border rounded-2xl p-4 cursor-pointer hover:scale-[1.01] transition-all shadow-lg hover:shadow-xl backdrop-blur-sm group`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-slate-950/60 border border-current flex items-center justify-center text-xs font-bold font-mono">
            {stage.stage}
          </span>
          <h4 className="font-semibold text-sm text-slate-100 group-hover:text-emerald-300 transition-colors">
            {stage.label}
          </h4>
        </div>
        <span className="text-xl font-bold text-white bg-slate-950/60 px-3 py-0.5 rounded-full border border-slate-800 font-mono">
          {stage.customerCount}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-800/60 text-[11px]">
        <div>
          <span className="text-slate-400 block">Received</span>
          <span className="font-mono font-medium text-emerald-400">{formatBWP(stage.cashReceived)}</span>
        </div>
        <div>
          <span className="text-slate-400 block">Committed</span>
          <span className="font-mono font-medium text-amber-400">{formatBWP(stage.cashCommitted)}</span>
        </div>
        <div>
          <span className="text-slate-400 block">Expected</span>
          <span className="font-mono font-medium text-teal-400">{formatBWP(stage.cashExpected)}</span>
        </div>
      </div>

      {stage.stuckCount > 0 && (
        <div className="mt-3 bg-rose-950/60 border border-rose-800/50 rounded-lg px-2.5 py-1 flex items-center justify-between text-xs text-rose-300">
          <span>?? {stage.stuckCount} stuck over threshold</span>
          <span className="text-[10px] underline font-medium">Review</span>
        </div>
      )}
    </div>
  );
}
