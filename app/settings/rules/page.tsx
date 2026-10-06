'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { BottomNav } from '@/components/layout/BottomNav';
import { AlertRule, StageConfig, UserRole } from '@/types/domain';

export default function RulesPage() {
  const [role, setRole] = useState<UserRole>('coo');
  const [rules, setRules] = useState<AlertRule[]>([]);
  const [stages, setStages] = useState<StageConfig[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRules = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/rules');
        if (res.ok) {
          const json = await res.json();
          setRules(json.data?.alertRules || []);
          setStages(json.data?.stageConfigs || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchRules();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-24 md:pb-12 font-sans selection:bg-emerald-500 selection:text-slate-950">
      <Navbar activeRole={role} onRoleChange={setRole} />

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-8">
        <div>
          <h1 className="text-xl font-bold font-serif text-white">Alert Rules & Stage Configurations</h1>
          <p className="text-xs text-slate-400">Configure milestone lead times, severities, and stage stuck thresholds (COO Only)</p>
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-500 font-mono text-xs">
            Loading configuration...
          </div>
        ) : (
          <>
            {/* Stage Stuck Thresholds */}
            <section className="space-y-4">
              <h2 className="text-sm uppercase font-semibold tracking-wider text-slate-300">
                ⚙️ Stage Stuck Thresholds (Days)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {stages.map((stg) => (
                  <div key={stg.id || stg.stage} className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex justify-between items-center text-xs">
                    <div>
                      <span className="font-bold text-slate-200 font-mono">Stage {stg.stage}: {stg.label}</span>
                      <p className="text-[11px] text-slate-500">{stg.description}</p>
                    </div>
                    <span className="font-mono bg-slate-950 px-3 py-1 rounded-lg border border-slate-800 text-emerald-400 font-bold">
                      {stg.stuck_threshold_days ? `${stg.stuck_threshold_days} days` : 'No limit'}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Alert Rules */}
            <section className="space-y-4">
              <h2 className="text-sm uppercase font-semibold tracking-wider text-slate-300">
                🔔 Milestone Notification Rules
              </h2>
              <div className="space-y-3">
                {rules.map((rule) => (
                  <div key={rule.id || rule.milestone_type} className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap justify-between items-center gap-3 text-xs">
                    <div>
                      <h4 className="font-bold text-slate-100 font-mono">{rule.milestone_type}</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">{rule.label}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="bg-slate-950 px-3 py-1 rounded-lg border border-slate-800 text-amber-400 font-mono">
                        Lead: {rule.lead_times_hours ? rule.lead_times_hours.join(', ') : 0}h
                      </span>
                      <span className="capitalize bg-slate-950 px-3 py-1 rounded-lg border border-slate-800 text-emerald-400 font-mono">
                        {rule.severities ? rule.severities.join('/') : 'normal'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </main>

      <BottomNav />
    </div>
  );
}