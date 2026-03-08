'use client';

import { useRouter } from 'next/navigation';

export default function BillingPage() {
  const router = useRouter();

  return (
    <main className="flex-1 relative px-6 pb-24 font-display">
      {/* Ambient Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-radial-glow pointer-events-none -z-10"></div>
      
      <div className="max-w-md mx-auto space-y-8 mt-4">
        {/* Header Section */}
        <div className="text-center space-y-2">
          <h1 className="text-white text-3xl md:text-4xl font-bold tracking-tight">Unlock Your Business Roadmap</h1>
          <p className="text-slate-400 text-sm font-medium">Scale your vision with AI-powered logic</p>
        </div>

        {/* Pro Plan Card */}
        <div className="glass-card rounded-2xl p-8 relative overflow-hidden group">
          {/* Most Popular Badge */}
          <div className="absolute top-0 right-0">
            <div className="bg-primary text-background-dark text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-bl-lg">
              Most Popular
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-primary text-sm font-bold uppercase tracking-widest mb-1">Pro Roadmap Builder</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-white text-5xl font-bold tracking-tighter">$49</span>
                <span className="text-slate-400 text-lg font-medium">/mo</span>
              </div>
            </div>

            {/* CTA Button */}
            <button 
              onClick={() => router.push('/dashboard/billing/success')}
              className="w-full py-4 px-6 bg-primary text-black font-bold text-lg rounded-xl neon-glow-primary transition-transform active:scale-95 flex items-center justify-center gap-2"
            >
              Upgrade to Pro
              <span className="material-symbols-outlined text-xl font-normal">bolt</span>
            </button>

            {/* Features List */}
            <div className="space-y-4 pt-4 border-t border-slate-800/50">
              {[
                "AI-Powered Business Logic & Analysis",
                "Priority Gamified Milestones & Rewards",
                "Unlimited Roadmap Exports (PDF/JSON)",
                "Exclusive Founder Discord Access",
                "Advanced Revenue Forecasting Tools"
              ].map((feature, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-emerald-400 text-xl font-bold font-normal">check_circle</span>
                  <p className="text-slate-200 text-sm leading-snug">{feature}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Current Plan / Free Tier */}
        <div className="bg-[#0A0C10]/40 border border-white/5 rounded-xl p-5 flex items-center justify-between opacity-80 backdrop-blur-sm">
          <div className="space-y-1">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Your Status</p>
            <p className="text-white font-bold">Current Plan: Free Tier</p>
            <p className="text-slate-500 text-xs italic">Limited to 3 roadmap steps</p>
          </div>
          <div className="bg-white/5 p-2 rounded-lg border border-white/10">
            <span className="material-symbols-outlined text-slate-500 font-normal">lock</span>
          </div>
        </div>

        {/* Stripe Credit */}
        <div className="flex flex-col items-center justify-center gap-2 pt-4">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
            <span className="material-symbols-outlined text-sm text-[var(--color-neon-purple)] font-normal">shield_with_heart</span>
            Secure payment powered by 
            <span className="text-slate-300 font-bold tracking-tight">stripe</span>
          </div>
          <p className="text-[10px] text-slate-600 uppercase tracking-widest">Cancel anytime • No hidden fees</p>
        </div>
      </div>
    </main>
  );
}
