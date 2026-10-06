'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { BottomNav } from '@/components/layout/BottomNav';
import { AlertCard } from '@/components/ui/AlertCard';
import { AlertWithContext, UserRole } from '@/types/domain';

export default function AlertsPage() {
  const [role, setRole] = useState<UserRole>('coo');
  const [alerts, setAlerts] = useState<AlertWithContext[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/alerts?status=active');
      if (res.ok) {
        const json = await res.json();
        setAlerts(json.data || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleAction = async (alertId: string, action: 'mark_sent' | 'snooze' | 'dismiss') => {
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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-24 md:pb-12 font-sans selection:bg-emerald-500 selection:text-slate-950">
      <Navbar activeRole={role} onRoleChange={setRole} />

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        <div>
          <h1 className="text-xl font-bold font-serif text-white">Actionable Reminders & Alerts</h1>
          <p className="text-xs text-slate-400">All customer follow-ups, quotes, and payment due alerts requiring attention</p>
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-500 font-mono text-xs">
            Loading alerts...
          </div>
        ) : alerts.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-400 text-sm">
            🎉 No active alerts or overdue milestones right now!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {alerts.map((item) => (
              <AlertCard
                key={item.alert.id}
                alertContext={item}
                userRole={role}
                onAction={(action) => handleAction(item.alert.id, action)}
              />
            ))}
          </div>
        )}
      </main>

      <BottomNav alertCount={alerts.length} />
    </div>
  );
}