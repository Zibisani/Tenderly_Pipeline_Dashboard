'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { BottomNav } from '@/components/layout/BottomNav';
import { CustomerCard } from '@/components/ui/CustomerCard';
import { CustomerCard as CustomerCardType, UserRole } from '@/types/domain';

export default function CustomersPage() {
  const [role, setRole] = useState<UserRole>('coo');
  const [search, setSearch] = useState('');
  const [customers, setCustomers] = useState<any[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerCardType | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/customers?q=${encodeURIComponent(search)}`);
        if (res.ok) {
          const json = await res.json();
          setCustomers(json.data || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchCustomers, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const loadCustomerDetail = async (id: string) => {
    try {
      const res = await fetch(`/api/customers/${id}`);
      if (res.ok) {
        const json = await res.json();
        setSelectedCustomer(json.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-24 md:pb-12 font-sans selection:bg-emerald-500 selection:text-slate-950">
      <Navbar activeRole={role} onRoleChange={setRole} />

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold font-serif text-white">Customer Search & Pipeline Profile</h1>
            <p className="text-xs text-slate-400">Search by customer name, phone number, or stage</p>
          </div>

          <div className="w-full sm:w-80">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="🔍 Search name or phone (e.g. 71234001)..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {selectedCustomer ? (
          <div className="space-y-4">
            <button
              onClick={() => setSelectedCustomer(null)}
              className="text-xs text-emerald-400 font-mono hover:underline flex items-center gap-1"
            >
              ← Back to customer list
            </button>
            <CustomerCard data={selectedCustomer} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {loading ? (
              <div className="col-span-full text-center py-12 text-slate-500 font-mono text-xs">
                Searching customers...
              </div>
            ) : customers.length === 0 ? (
              <div className="col-span-full text-center py-12 text-slate-500 text-sm">
                No customers found matching search.
              </div>
            ) : (
              customers.map((c) => (
                <div
                  key={c.id}
                  onClick={() => loadCustomerDetail(c.id)}
                  className="bg-slate-900 border border-slate-800 hover:border-emerald-700/60 rounded-2xl p-4 cursor-pointer transition-all hover:scale-[1.01] shadow-md"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-slate-100">{c.name}</h3>
                    <span className="text-[11px] bg-slate-800 text-emerald-300 font-mono px-2.5 py-0.5 rounded-full border border-slate-700">
                      Stage {c.current_stage}
                    </span>
                  </div>
                  <p className="text-xs font-mono text-slate-400">{c.phone_normalised}</p>
                </div>
              ))
            )}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}