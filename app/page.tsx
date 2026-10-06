'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { BottomNav } from '@/components/layout/BottomNav';
import { SyncStatusBanner } from '@/components/ui/SyncStatusBanner';
import { CashBuckets } from '@/components/ui/CashBuckets';
import { StageCard } from '@/components/ui/StageCard';
import { AlertCard } from '@/components/ui/AlertCard';
import { FunnelStageData, SyncStatus, AlertWithContext, UserRole } from '@/types/domain';

export default function PipelineDashboard() {
  const [role, setRole] = useState<UserRole>('coo');
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [stages, setStages] = useState<FunnelStageData[]>([]);
  const [syncStatuses, setSyncStatuses] = useState<SyncStatus[]>([]);
  const [alerts, setAlerts] = useState<AlertWithContext[]>([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [funnelRes, alertsRes] = await Promise.all([
        fetch('/api/funnel'),
        fetch('/api/alerts?status=active')
      ]);

      if (funnelRes.ok) {
        const funnelJson = await funnelRes.json();
        if (funnelJson.data) {
          setStages(funnelJson.data.stages || []);
          setSyncStatuses(funnelJson.data.syncStatuses || []);
        }
      }

      if (alertsRes.ok) {
        const alertsJson = await alertsRes.json();
        if (alertsJson.data) {
          setAlerts(alertsJson.data || []);
        }
      }
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSync = async () => {
    try {
      setIsSyncing(true);
      await fetch('/api/sync', { method: 'POST' });
      await fetchData();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleAlertAction = async (alertId: string, action: 'mark_sent' | 'snooze' | 'dismiss') => {
    try {
      await fetch(`/api/alerts/${alertId}/act`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      });
      setAlerts((prev) => prev.filter((a) => a.alert.id !== alertId));
    } catch (e) {
      console.error(e);
    }
  };

  const totalReceived = stages.reduce((acc, s) => acc + s.cashReceived, 0);
  const totalCommitted = stages.reduce((acc, s) => acc + s.cashCommitted, 0);
  const totalExpected = stages.reduce((acc, s) => acc + s.cashExpected, 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-24 md:pb-12 font-sans selection:bg-emerald-500 selection:text-slate-950">
      <Navbar activeRole={role} onRoleChange={setRole} />

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-8">
        <SyncStatusBanner
          statuses={syncStatuses}
          onTriggerSync={role === 'coo' ? handleSync : undefined}
          isSyncing={isSyncing}
        />

        <CashBuckets
          cashReceived={totalReceived}
          cashCommitted={totalCommitted}
          cashExpected={totalExpected}
        />

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">🚨</span>
              <h2 className="text-lg font-bold font-serif tracking-wide text-slate-100">
                Action Needed Now ({alerts.length})
              </h2>
            </div>
            <span className="text-xs font-mono text-slate-400">Sorted by Severity</span>
          </div>

          {alerts.length === 0 ? (
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 text-center text-slate-400 text-sm">
              All customer reminders and milestones up to date!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {alerts.map((item) => (
                <AlertCard
                  key={item.alert.id}
                  alertContext={item}
                  userRole={role}
                  onAction={(action) => handleAlertAction(item.alert.id, action)}
                />
              ))}
            </div>
          )}
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold font-serif tracking-wide text-slate-100 flex items-center gap-2">
              <span>🎯</span> Customer Funnel Stages (1–7)
            </h2>
            <span className="text-xs text-slate-400 font-mono">
              Total Customers: {stages.reduce((acc, s) => acc + s.customerCount, 0)}
            </span>
          </div>

          {loading ? (
            <div className="text-center py-12 text-slate-500 font-mono text-xs">
              Loading pipeline data...
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {stages.map((stg) => (
                <StageCard key={stg.stage} stage={stg} />
              ))}
            </div>
          )}
        </section>
      </main>

      <BottomNav alertCount={alerts.length} />
    </div>
  );
}