'use client';

import React from 'react';
import { CustomerCard as CustomerCardType, STAGE_LABELS } from '../../types/domain';
import { formatBWP, formatDateDisplay } from '../../lib/format';
import { formatPhoneDisplay, buildWaLink } from '../../lib/phone';

export function CustomerCard({ data }: { data: CustomerCardType }) {
  const { customer, consultations, orders, membership, stage_history, source_links, active_alerts } = data;

  const waLink = buildWaLink(customer.phone_normalised, `Hi ${customer.name}, reaching out from Tenderly Skincare.`);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
      {/* Top Profile Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold px-3 py-1 rounded-full font-mono">
              Stage {customer.current_stage}: {STAGE_LABELS[customer.current_stage]}
            </span>
            {customer.manual_override && (
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs px-2.5 py-0.5 rounded-full">
                ?? Manual Override
              </span>
            )}
          </div>
          <h2 className="text-2xl font-bold text-white font-serif">{customer.name}</h2>
          <p className="text-sm font-mono text-slate-400 mt-0.5">{formatPhoneDisplay(customer.phone_normalised)}</p>
        </div>

        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold px-4 py-2.5 rounded-2xl text-xs flex items-center gap-2 shadow-lg shadow-emerald-900/30 transition-all hover:scale-105"
        >
          <span>?? Open WhatsApp</span>
        </a>
      </div>

      {/* Cash Summary Cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-3.5 text-center">
          <span className="text-[11px] text-slate-400 uppercase font-medium">Received</span>
          <p className="text-base font-mono font-bold text-emerald-400 mt-1">{formatBWP(customer.cash_received)}</p>
        </div>
        <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-3.5 text-center">
          <span className="text-[11px] text-slate-400 uppercase font-medium">Committed</span>
          <p className="text-base font-mono font-bold text-amber-400 mt-1">{formatBWP(customer.cash_committed)}</p>
        </div>
        <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-3.5 text-center">
          <span className="text-[11px] text-slate-400 uppercase font-medium">Expected</span>
          <p className="text-base font-mono font-bold text-teal-400 mt-1">{formatBWP(customer.cash_expected)}</p>
        </div>
      </div>

      {/* Next Milestone */}
      <div className="bg-emerald-950/30 border border-emerald-900/50 rounded-2xl p-4">
        <h3 className="text-xs uppercase font-semibold tracking-wider text-emerald-400 mb-2 flex items-center gap-2">
          <span>?</span> Next Milestone
        </h3>
        {customer.next_milestone_type ? (
          <div className="flex items-center justify-between text-sm">
            <span className="font-mono text-slate-200">{customer.next_milestone_type}</span>
            <span className="font-mono text-emerald-300 font-bold">
              {customer.next_milestone_date ? formatDateDisplay(new Date(customer.next_milestone_date)) : 'Pending'}
            </span>
          </div>
        ) : (
          <p className="text-xs text-slate-500 italic">No upcoming milestone scheduled.</p>
        )}
      </div>

      {/* Consultations */}
      {consultations && consultations.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-xs uppercase font-semibold tracking-wider text-slate-400">Consultations ({consultations.length})</h3>
          <div className="space-y-2">
            {consultations.map((c) => (
              <div key={c.id} className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 text-xs flex justify-between items-center font-mono">
                <div>
                  <span className="text-slate-300 font-bold">{c.cl_id}</span>
                  <span className="text-slate-500 ml-2">({c.ticket_status})</span>
                </div>
                <span className="text-amber-400">{formatBWP(c.quote_value)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Orders */}
      {orders && orders.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-xs uppercase font-semibold tracking-wider text-slate-400">Take App Orders ({orders.length})</h3>
          <div className="space-y-2">
            {orders.map((o) => (
              <div key={o.id} className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 text-xs space-y-1 font-mono">
                <div className="flex justify-between text-slate-300">
                  <span className="font-bold">{o.takeapp_order_id}</span>
                  <span className="text-emerald-400">{formatBWP(o.total)}</span>
                </div>
                <div className="flex justify-between text-slate-500 text-[11px]">
                  <span>Paid: {formatBWP(o.paid)}</span>
                  <span>Balance: {formatBWP(o.balance)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Membership */}
      {membership && (
        <div className="bg-indigo-950/30 border border-indigo-900/50 rounded-2xl p-4 space-y-2 text-xs">
          <h3 className="uppercase font-semibold tracking-wider text-indigo-400 flex items-center justify-between">
            <span>?? Membership Status</span>
            <span className="capitalize text-indigo-300 bg-indigo-900/60 px-2.5 py-0.5 rounded-full">{membership.status}</span>
          </h3>
          <div className="grid grid-cols-2 gap-2 font-mono pt-1">
            <div>
              <span className="text-slate-500 block">Tier:</span>
              <span className="text-slate-200 font-bold">{membership.tier}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Monthly:</span>
              <span className="text-emerald-400 font-bold">{formatBWP(membership.monthly_amount)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
