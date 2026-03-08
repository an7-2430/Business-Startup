'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const [stages, setStages] = useState([
    { id: 1, title: 'Business Identity & Setup', status: 'completed', desc: 'Basic details and location.' },
    { id: 2, title: 'Registration & Legal Basics', status: 'unlocked', desc: 'Legal entity and tax documentation.' },
    { id: 3, title: 'Location, Premises & Approvals', status: 'locked', desc: 'Council and zoning requirements.' },
    { id: 4, title: 'Compliance, Insurance & Safety', status: 'locked', desc: 'Workplace safety and insurance.' },
    { id: 5, title: 'Equipment, Operations & Workflow', status: 'locked', desc: 'Tools, machinery and processes.' },
    { id: 6, title: 'Digital Tools, Finance & Payments', status: 'locked', desc: 'Accounting and payment gateways.' },
    { id: 7, title: 'Launch Readiness & Tracking', status: 'locked', desc: 'Final checklist and trading start.' },
  ]);

  const [overallProgress, setOverallProgress] = useState(14); // Mock progress

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/proxy/stats');
        const json = await res.json();
        if (json.success && json.data) {
          const fetchedStages = [
            { id: 1, title: 'Business Identity & Setup', status: 'completed', desc: 'Basic details and location.' },
            { id: 2, title: 'Registration & Legal Basics', status: json.data.stage_2_status || 'unlocked', desc: 'Legal entity and tax documentation.' },
            { id: 3, title: 'Location, Premises & Approvals', status: json.data.stage_3_status || 'locked', desc: 'Council and zoning requirements.' },
            { id: 4, title: 'Compliance, Insurance & Safety', status: json.data.stage_4_status || 'locked', desc: 'Workplace safety and insurance.' },
            { id: 5, title: 'Equipment, Operations & Workflow', status: json.data.stage_5_status || 'locked', desc: 'Tools, machinery and processes.' },
            { id: 6, title: 'Digital Tools, Finance & Payments', status: json.data.stage_6_status || 'locked', desc: 'Accounting and payment gateways.' },
            { id: 7, title: 'Launch Readiness & Tracking', status: json.data.stage_7_status || 'locked', desc: 'Final checklist and trading start.' },
          ];
          setStages(fetchedStages);
          setOverallProgress(json.data.completion_percentage || 0);
        }
      } catch (e) {
        console.error('Stats fetch failed:', e);
      }
    }
    fetchStats();
  }, []);

  const renderMilestone = (stage, index) => {
    const isCompleted = stage.status === 'completed';
    const isUnlocked = stage.status === 'unlocked' || stage.status === 'in_progress';
    const isLocked = stage.status === 'locked';

    if (isCompleted) {
      return (
        <div key={stage.id} className="flex flex-col items-center">
          <div className="size-8 rounded-full bg-success-neon flex items-center justify-center shadow-[0_0_15px_#0bda50]">
            <span className="material-symbols-outlined text-black text-sm font-bold">check</span>
          </div>
          <div className="glass-card mt-4 p-4 rounded-xl w-full border-l-4 border-l-success-neon">
            <span className="text-[10px] text-success-neon font-bold uppercase tracking-wider">Completed</span>
            <h3 className="text-white font-bold text-lg">{stage.title}</h3>
            <p className="text-slate-400 text-xs mt-1">{stage.desc}</p>
          </div>
        </div>
      );
    }

    if (isUnlocked) {
      return (
        <div key={stage.id} className="flex flex-col items-center">
          <div className="size-16 rounded-full border-2 border-primary pulse-cyan flex items-center justify-center bg-[#0A0C10]">
            <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-2xl">
                {stage.id === 1 ? 'rocket_launch' : 'flag'}
              </span>
            </div>
          </div>
          <div className="glass-card mt-6 p-6 rounded-xl w-full border-t-2 border-t-primary relative overflow-hidden">
            <div className="absolute -right-4 -top-4 size-24 bg-primary/5 rounded-full blur-2xl"></div>
            <span className="text-[10px] text-primary font-bold uppercase tracking-wider">Current Quest</span>
            <h3 className="text-white font-bold text-xl mt-1">{stage.title}</h3>
            <p className="text-slate-300 text-sm mt-2 mb-6">{stage.desc}</p>
            <button 
              onClick={() => router.push(`/dashboard/setup/${stage.id}`)}
              className="w-full py-3 px-4 bg-primary text-black font-bold rounded-lg flex items-center justify-center gap-2 hover:brightness-110 transition-all shadow-[0_4px_20px_rgba(6,237,249,0.3)]"
            >
              JUMP IN
              <span className="material-symbols-outlined text-sm">arrow_forward_ios</span>
            </button>
          </div>
        </div>
      );
    }

    // Locked
    return (
      <div key={stage.id} className="flex flex-col items-center opacity-60">
        <div className="size-8 rounded-full border-2 border-future-neon flex items-center justify-center bg-[#0A0C10]/50">
          <span className="material-symbols-outlined text-future-neon text-sm">lock</span>
        </div>
        <div className="glass-card mt-4 p-4 rounded-xl w-full border-dashed border-white/20">
          <span className="text-[10px] text-future-neon font-bold uppercase tracking-wider">Locked Stage</span>
          <h3 className="text-slate-400 font-bold text-lg">{stage.title}</h3>
          <p className="text-slate-500 text-xs mt-1">{stage.desc}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden bg-glitch font-display">
      {/* Glitch Particles Background */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="glitch-particle top-10 left-1/4 scale-150"></div>
        <div className="glitch-particle top-1/3 right-1/4"></div>
        <div className="glitch-particle bottom-1/4 left-10 scale-125"></div>
        <div className="glitch-particle top-1/2 right-10"></div>
        <div className="glitch-particle bottom-10 left-1/2 opacity-50"></div>
      </div>

      {/* Sticky Header */}
      <header className="sticky top-0 z-50 glass-card px-4 py-3 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="relative size-12 flex items-center justify-center">
            <svg className="size-full -rotate-90" viewBox="0 0 36 36">
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#21484a" strokeWidth="3"></path>
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#06edf9" strokeDasharray={`${overallProgress}, 100`} strokeWidth="3"></path>
            </svg>
            <span className="absolute text-[10px] font-bold text-primary">{Math.round(overallProgress)}%</span>
          </div>
          <div>
            <h1 className="text-sm font-bold uppercase tracking-widest text-white/90">BuildPath</h1>
            <p className="text-[10px] text-slate-400 font-medium tracking-tighter uppercase whitespace-nowrap">Venture Dashboard</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-orange-500 text-sm font-normal">local_fire_department</span>
              <span className="text-sm font-bold text-white uppercase tracking-tighter">7 Stages</span>
            </div>
            <span className="bg-primary/10 text-primary text-[9px] px-2 py-0.5 rounded-full font-bold border border-primary/20">ACTIVE</span>
          </div>
          <div className="size-10 rounded-lg overflow-hidden border border-white/10 bg-white/5 flex items-center justify-center">
             <span className="material-symbols-outlined text-slate-400 text-xl font-normal">account_circle</span>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Navigation (Desktop) */}
        <nav className="hidden md:flex w-20 flex-col items-center py-8 gap-8 glass-card border-r border-white/10">
          <a className="text-primary hover:brightness-125 transition-all cursor-pointer">
            <span className="material-symbols-outlined text-2xl font-normal">rocket_launch</span>
          </a>
          <a className="text-slate-500 hover:text-white transition-colors cursor-pointer" onClick={() => alert('Vault feature locked')}>
            <span className="material-symbols-outlined text-2xl font-normal">inventory_2</span>
          </a>
          <a className="text-slate-500 hover:text-white transition-colors cursor-pointer" onClick={() => alert('Network feature locked')}>
            <span className="material-symbols-outlined text-2xl font-normal">hub</span>
          </a>
          <div className="mt-auto">
            <a className="text-slate-500 hover:text-white transition-colors cursor-pointer" onClick={() => router.push('/onboarding')}>
              <span className="material-symbols-outlined text-2xl font-normal">settings</span>
            </a>
          </div>
        </nav>

        {/* Main Content Area: Vertical Questline */}
        <main className="flex-1 overflow-y-auto px-6 py-10 relative scroll-smooth bg-transparent">
          <div className="absolute left-1/2 top-0 bottom-0 w-1 -translate-x-1/2 quest-line-gradient opacity-40"></div>
          <div className="flex flex-col gap-24 relative z-10 max-w-md mx-auto">
            {stages.map((stage, idx) => renderMilestone(stage, idx))}
           
            {/* End Milestone */}
            <div className="flex flex-col items-center opacity-40 mb-10">
              <div className="size-8 rounded-full border border-white/20 flex items-center justify-center bg-background-dark/50">
                <span className="material-symbols-outlined text-slate-600 text-sm font-normal">lock</span>
              </div>
              <div className="glass-card mt-4 p-4 rounded-xl w-full border-dashed border-white/10">
                <span className="text-[10px] text-slate-600 font-bold uppercase tracking-wider">Future Expansion</span>
                <h3 className="text-slate-600 font-bold text-lg">Scale & Exit</h3>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Bottom Navigation (Mobile Style) */}
      <nav className="md:hidden flex gap-2 border-t border-white/10 bg-[#0A0C10]/80 backdrop-blur-lg px-4 pb-8 pt-3 z-50">
        <a className="flex flex-1 flex-col items-center justify-center gap-1 text-primary cursor-pointer">
          <span className="material-symbols-outlined text-2xl font-normal" style={{ fontVariationSettings: "'FILL' 1" }}>map</span>
          <p className="text-[9px] font-bold tracking-widest uppercase">Quest</p>
        </a>
        <a onClick={() => alert('Locked')} className="flex flex-1 flex-col items-center justify-center gap-1 text-slate-500 cursor-pointer">
          <span className="material-symbols-outlined text-2xl font-normal">inventory_2</span>
          <p className="text-[9px] font-bold tracking-widest uppercase">Vault</p>
        </a>
        <a onClick={() => alert('Locked')} className="flex flex-1 flex-col items-center justify-center gap-1 text-slate-500 cursor-pointer">
          <span className="material-symbols-outlined text-2xl font-normal">group</span>
          <p className="text-[9px] font-bold tracking-widest uppercase">Network</p>
        </a>
        <a onClick={() => alert('Locked')} className="flex flex-1 flex-col items-center justify-center gap-1 text-slate-500 cursor-pointer">
          <span className="material-symbols-outlined text-2xl font-normal">equalizer</span>
          <p className="text-[9px] font-bold tracking-widest uppercase">Intel</p>
        </a>
      </nav>
    </div>
  );
}
