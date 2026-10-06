'use client';

import React from 'react';
import { AlertWithContext } from '../../types/domain';
import { formatPhoneDisplay } from '../../lib/phone';

interface AlertCardProps {
  alertContext: AlertWithContext;
  userRole: 'coo' | 'ceo';
  onAction?: (action: 'mark_sent' | 'snooze' | 'dismiss') => void;
}

export function AlertCard({ alertContext, userRole, onAction }: AlertCardProps) {
  const { alert, milestone, customer } = alertContext;

  const severityStyles = {
    normal: 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300',
    amber: 'bg-amber-950/50 border-amber-800/80 text-amber-300 shadow-amber-950/30',
    red: 'bg-rose-950/60 border-rose-800 text-rose-200 shadow-rose-950/50 animate-pulse-subtle'
  };

  const severityBadge = {
    normal: 'bg-emerald-900/60 text-emerald-300 border-emerald-700',
    amber: 'bg-amber-900/60 text-amber-300 border-amber-700',
    red: 'bg-rose-900/80 text-rose-200 border-rose-600 font-bold'
  };

  return (
    <div className={`border rounded-2xl p-4 transition-all shadow-md ${severityStyles[alert.severity] || severityStyles.normal}`}>
      <div className="flex items-start justify-between gap-3 mb-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full border ${severityBadge[alert.severity]}`}>
              {alert.severity}
            </span>
            <span className="text-xs text-slate-400 font-mono">Stage {customer.current_stage}</span>
          </div>
          <h4 className="font-bold text-base text-slate-100">{customer.name}</h4>
          <p className="text-xs text-slate-400 font-mono">{formatPhoneDisplay(customer.phone_normalised)}</p>
        </div>

        <span className="text-xs text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800 font-mono">
          Milestone: {milestone.type}
        </span>
      </div>

      {alert.suggested_message && (
        <div className="my-3 bg-slate-950/80 border border-slate-800/80 rounded-xl p-3 text-xs text-slate-300 font-sans leading-relaxed">
          <p className="text-[10px] text-slate-500 font-mono uppercase mb-1">Suggested WhatsApp Message:</p>
          <p className="italic">"{alert.suggested_message}"</p>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/40">
        {alert.wa_link ? (
          <a
            href={alert.wa_link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs px-3.5 py-1.5 rounded-xl transition-all shadow-md shadow-emerald-900/30"
          >
            <span>?? Send WhatsApp</span>
          </a>
        ) : (
          <div />
        )}

        {userRole === 'coo' && onAction && (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onAction('mark_sent')}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-2.5 py-1 rounded-lg border border-slate-700 transition-colors"
            >
              ? Mark Sent
            </button>
            <button
              onClick={() => onAction('snooze')}
              className="bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs px-2.5 py-1 rounded-lg border border-slate-700 transition-colors"
            >
              ? Snooze
            </button>
            <button
              onClick={() => onAction('dismiss')}
              className="bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-rose-400 text-xs px-2.5 py-1 rounded-lg border border-slate-700 transition-colors"
            >
              ? Dismiss
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
