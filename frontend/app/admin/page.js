'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/useAuth';
import Link from 'next/link';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

export default function AdminDashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const [tab, setTab] = useState('industries');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check admin role
  const roles = user?.['https://buildpath.app/roles'] || [];
  const isAdmin = roles.includes('admin');

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/admin/${tab}`, { credentials: 'include' });
      const json = await res.json();
      if (json.success) setData(json.data || []);
      else setError(json.error?.message || 'Failed to load');
    } catch {
      setError('Could not connect to API');
    } finally {
      setLoading(false);
    }
  }, [tab]);

  useEffect(() => {
    if (user && isAdmin) fetchData();
  }, [user, isAdmin, fetchData]);

  if (authLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-dark-950">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#00F5FF]/30 border-t-[#00F5FF]" />
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-dark-950 px-4">
        <div className="text-center max-w-md">
          <div className="mb-6 text-6xl">🚫</div>
          <h1 className="mb-3 text-2xl font-bold text-white">Access Denied</h1>
          <p className="mb-8 text-slate-400">
            You need admin privileges to access this page.
          </p>
          <Link href="/dashboard" className="btn-primary">← Back to Dashboard</Link>
        </div>
      </main>
    );
  }

  const tabs = [
    { key: 'submissions', label: 'Submissions', icon: '👤', href: '/admin/users' },
    { key: 'industries', label: 'Industries', icon: '🏭' },
    { key: 'stages', label: 'Stages', icon: '📋' },
    { key: 'steps', label: 'Steps', icon: '✅' },
    { key: 'audit-log', label: 'Audit Log', icon: '📜' },
    { key: 'webhook-events', label: 'Webhooks', icon: '🔔' },
  ];

  return (
    <main className="min-h-screen bg-[#0A0C10] text-slate-100 font-display flex flex-col overflow-hidden">
      {/* Header Section */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/10 glass-card bg-[#0A0C10]/80 backdrop-blur-md sticky top-0 z-40">
        <div className="flex flex-col">
          <h1 className="text-xl font-bold tracking-tight text-[var(--color-neon-purple)] neon-glow-purple uppercase">
            BuildPath Admin
          </h1>
          <span className="text-[10px] uppercase tracking-widest text-slate-500 font-medium">
            System Operational • {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10 group">
            <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors font-normal">history</span>
          </button>
          <div className="w-9 h-9 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center overflow-hidden">
             <span className="material-symbols-outlined text-primary font-normal">admin_panel_settings</span>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar Navigation */}
        <nav className="w-20 hidden md:flex flex-col items-center py-8 border-r border-white/5 bg-[#0A0C10]/50 backdrop-blur-xl">
          <div className="flex flex-col gap-6">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => !t.href && setTab(t.key)}
                className={`p-3 rounded-xl transition-all duration-300 ${
                  tab === t.key
                    ? 'text-primary bg-primary/10 shadow-[0_0_15px_rgba(6,237,249,0.1)] border border-primary/20'
                    : 'text-slate-500 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="material-symbols-outlined text-2xl font-normal">
                  {t.key === 'industries' ? 'factory' : 
                   t.key === 'stages' ? 'account_tree' : 
                   t.key === 'steps' ? 'format_list_numbered' : 
                   t.key === 'submissions' ? 'group' : 'settings'}
                </span>
              </button>
            ))}
          </div>
        </nav>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 pb-24 nebula-bg">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-white tracking-tight">{tabs.find(t => t.key === tab)?.label}</h2>
              <p className="text-sm text-slate-400 mt-1">Management console for BuildPath core logic.</p>
            </div>
            <button className="bg-primary hover:brightness-110 text-black font-bold py-2.5 px-6 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-primary/20 uppercase tracking-widest text-xs">
              <span className="material-symbols-outlined text-sm font-bold">add</span>
              New Entry
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Data Table */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary/30 border-t-primary" />
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {data.length === 0 ? (
                <div className="glass-card p-20 text-center rounded-2xl border-dashed border-white/10">
                  <span className="material-symbols-outlined text-slate-600 text-5xl mb-4 font-normal">inventory_2</span>
                  <p className="text-slate-500 font-medium">No records found for {tab}</p>
                </div>
              ) : (
                data.map((item, i) => (
                  <div key={item.id || i} className="glass-card p-4 rounded-xl flex items-center justify-between group hover:neon-border-cyan transition-all duration-300 cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:bg-primary/20 transition-colors">
                        <span className="material-symbols-outlined text-primary font-normal">
                           {tab === 'industries' ? 'factory' : 'description'}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-bold text-white leading-tight group-hover:text-primary transition-colors">
                          {item.name || item.title || item.provider || item.action}
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                           {tab === 'industries' ? `${item.active ? 'Active' : 'Draft'} • ${new Date(item.created_at).toLocaleDateString()}` : 
                            tab === 'stages' ? `Industry: ${item.industries?.name || 'Global'} • Order: ${item.order_index}` :
                            `Updated: ${new Date(item.created_at).toLocaleTimeString()}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {item.active !== undefined && (
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${item.active ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-500/10 text-slate-500'}`}>
                          {item.active ? 'Active' : 'Inactive'}
                        </span>
                      )}
                      <button className="p-2 rounded-lg bg-white/5 hover:bg-primary/20 text-slate-400 hover:text-primary transition-all">
                        <span className="material-symbols-outlined font-normal">edit</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 glass-card bg-[#0A0C10]/90 backdrop-blur-xl border-t border-white/10 px-4 pb-8 pt-3 z-50 flex justify-between">
        {tabs.slice(0, 5).map((t) => (
          <button
            key={t.key}
            onClick={() => !t.href && setTab(t.key)}
            className={`flex flex-col items-center gap-1 ${tab === t.key ? 'text-primary' : 'text-slate-500'}`}
          >
            <span className="material-symbols-outlined text-2xl font-normal">
              {t.key === 'industries' ? 'factory' : 
               t.key === 'stages' ? 'account_tree' : 
               t.key === 'steps' ? 'format_list_numbered' : 
               t.key === 'submissions' ? 'group' : 'settings'}
            </span>
            <span className="text-[9px] font-bold uppercase tracking-tighter">{t.label}</span>
          </button>
        ))}
      </nav>
    </main>
  );
}
