'use client';

import { useRouter } from 'next/navigation';

export default function UpgradeSuccessPage() {
  const router = useRouter();

  return (
    <div className="relative flex flex-1 flex-col items-center justify-center px-6 overflow-hidden min-h-screen bg-[#0A0C10] font-display">
      {/* Background Decor / Neon Confetti Motif */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Radial Gradients for Depth */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]"></div>
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-[var(--color-neon-purple)]/10 rounded-full blur-[100px]"></div>
        
        {/* Simulated Confetti Particles */}
        <div className="absolute w-2 h-2 bg-primary/40 top-[15%] left-[20%] rotate-45 rounded-sm"></div>
        <div className="absolute w-2 h-2 bg-[var(--color-neon-purple)]/40 top-[25%] right-[15%] rotate-12 rounded-sm"></div>
        <div className="absolute w-3 h-3 bg-primary/60 bottom-[30%] left-[10%] -rotate-12 rounded-sm"></div>
        <div className="absolute w-2 h-4 bg-[var(--color-neon-purple)]/50 bottom-[20%] right-[25%] rotate-[60deg] rounded-sm"></div>
      </div>

      {/* Success Content */}
      <div className="relative z-10 w-full max-w-sm flex flex-col items-center mt-[-10vh]">
        {/* Trophy Icon */}
        <div className="mb-8 relative">
          <div className="absolute inset-0 bg-primary blur-3xl opacity-30 rounded-full"></div>
          <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 border-2 border-primary/30">
            <span className="material-symbols-outlined text-primary text-5xl font-light font-normal">workspace_premium</span>
          </div>
        </div>

        {/* Glassmorphic Card */}
        <div className="glass-card w-full p-8 rounded-2xl text-center flex flex-col gap-6 shadow-2xl">
          <div>
            <h1 className="text-3xl font-bold tracking-tighter text-white uppercase mb-2">Welcome to Pro</h1>
            <p className="text-slate-400 text-base leading-relaxed">
              You&apos;ve unlocked the full potential of BuildPath. Your journey to business mastery starts now.
            </p>
          </div>

          {/* Divider */}
          <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>

          {/* Features Unlocked */}
          <div className="space-y-4 text-left">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(6,237,249,0.8)]"></div>
              <p className="text-sm font-medium text-slate-200">Unlimited Projects & Workspaces</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-[var(--color-neon-purple)] shadow-[0_0_8px_rgba(168,85,247,0.8)]"></div>
              <p className="text-sm font-medium text-slate-200">Advanced Business AI Strategist</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(6,237,249,0.8)]"></div>
              <p className="text-sm font-medium text-slate-200">Priority 24/7 Expert Support</p>
            </div>
          </div>

          {/* Action Button */}
          <button 
            onClick={() => router.push('/dashboard')}
            className="w-full bg-primary text-black font-bold py-4 rounded-xl neon-glow-primary hover:brightness-110 transition-all uppercase tracking-widest text-sm mt-2"
          >
            Get Started
          </button>
        </div>

        {/* Secondary Action */}
        <button 
          onClick={() => router.push('/dashboard/billing')}
          className="mt-8 text-slate-500 hover:text-primary transition-colors text-sm font-bold tracking-widest uppercase"
        >
          View Subscription Details
        </button>
      </div>
    </div>
  );
}
