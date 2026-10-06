'use client';

import React from 'react';
import { SyncStatus } from '../../types/domain';
import { formatTimeAgo } from '../../lib/format';

interface SyncStatusBannerProps {
  statuses: SyncStatus[];
  onTriggerSync?: () => void;
  isSyncing?: boolean;
}

export function SyncStatusBanner({ statuses, onTriggerSync, isSyncing }: SyncStatusBannerProps) {
  const hasStale = statuses.some((s) => s.status === 'stale' || s.status === 'failed');

  return (
    <div className={`border rounded-2xl p-4 mb-6 backdrop-blur-md transition-all ${
      hasStale ? 'bg-amber-950/40 border-amber-800/60' : 'bg-slate-900/80 border-slate-800'
    }`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${hasStale ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'}`} />
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              {hasStale ? '?? Sync Staleness Warning' : '? Sync Engines Operational'}
            </h4>
            <div className="flex flex-wrap gap-4 text-xs text-slate-400 font-mono mt-1">
              {statuses.map((s) => (
                <span key={s.id || s.source} className="flex items-center gap-1">
                  <span className="capitalize">{s.source.replace('_', ' ')}:</span>
                  <span className={s.status === 'ok' ? 'text-emerald-400' : 'text-amber-400 font-bold'}>
                    {s.last_success_at ? formatTimeAgo(new Date(s.last_success_at)) : 'Never'}
                  </span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {onTriggerSync && (
          <button
            onClick={onTriggerSync}
            disabled={isSyncing}
            className="bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-emerald-400 border border-slate-700 px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-md active:scale-95"
          >
            <span className={isSyncing ? 'animate-spin' : ''}>??</span>
            <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
          </button>
        )}
      </div>
    </div>
  );
}
