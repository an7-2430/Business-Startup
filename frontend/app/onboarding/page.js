'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@auth0/nextjs-auth0/client';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

// ── Step indicator ────────────────────────────────────────────────────────────
function StepIndicator({ currentStep, totalSteps, title, subtitle }) {
  return (
    <header className="pt-6 w-full max-w-md mx-auto mb-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-widest text-primary font-bold">Step {currentStep} of {totalSteps}</span>
          <span className="text-xs text-slate-400">{subtitle}</span>
        </div>
      </div>
      {/* Segmented Progress Bar */}
      <div className="flex gap-2 h-1.5 w-full">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div 
            key={i} 
            className={`flex-1 rounded-full overflow-hidden relative ${
              i + 1 === currentStep ? 'progress-gradient' : 
              i + 1 < currentStep ? 'bg-primary' : 'bg-slate-800'
            }`}
          >
            {i + 1 === currentStep && (
              <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
            )}
          </div>
        ))}
      </div>
    </header>
  );
}

// ── Option card ──────────────────────────────────────────────────────────────
function OptionCard({ label, selected, onClick, icon, sublabel }) {
  return (
    <button
      onClick={onClick}
      className={`relative group flex flex-col items-center justify-center p-4 min-h-[140px] rounded-2xl transition-all duration-300 ${
        selected ? 'glass-card neon-border-glow-cyan border-primary' : 'glass-card border-white/10 hover:border-primary/50'
      }`}
    >
      {selected && (
        <div className="absolute top-3 right-3">
          <div className="size-5 rounded-full bg-primary flex items-center justify-center">
             <span className="text-[#0A0C10] text-xs font-bold">✓</span>
          </div>
        </div>
      )}
      <div className={`mb-3 flex items-center justify-center size-12 rounded-xl transition-colors ${
        selected ? 'bg-primary/10 text-primary' : 'bg-slate-800 text-slate-400 group-hover:text-primary/70'
      }`}>
        <span className="text-2xl">{icon}</span>
      </div>
      <span className="font-bold text-lg tracking-wide text-white text-center leading-tight mb-1">{label}</span>
      {sublabel && (
        <span className="text-[10px] text-slate-500 uppercase font-medium text-center">{sublabel}</span>
      )}
    </button>
  );
}

// ── Main wizard ──────────────────────────────────────────────────────────────
export default function OnboardingPage() {
  const { user, isLoading: authLoading } = useUser();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [options, setOptions] = useState({ states: [], industries: [], businessTypes: [] });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Selections
  const [selectedState, setSelectedState] = useState(null);
  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const [selectedBusinessType, setSelectedBusinessType] = useState(null);

  // Hardcoded MVP Options to ensure onboarding always loads
  useEffect(() => {
    setOptions({
      states: [
        { code: 'NSW', name: 'New South Wales' },
        { code: 'VIC', name: 'Victoria' },
        { code: 'QLD', name: 'Queensland' },
        { code: 'SA', name: 'South Australia' },
        { code: 'WA', name: 'Western Australia' },
        { code: 'TAS', name: 'Tasmania' },
        { code: 'NT', name: 'Northern Territory' },
        { code: 'ACT', name: 'Australian Capital Territory' },
      ],
      industries: [
        { id: '1', name: 'Cabinet Manufacturing' },
        { id: '2', name: 'Shopfitting' },
        { id: '3', name: 'Carpentry & Joinery' }
      ],
      businessTypes: [
        { code: 'sole-trader', name: 'Sole Trader' },
        { code: 'partnership', name: 'Partnership' },
        { code: 'company', name: 'Company (Pty Ltd)' },
        { code: 'trust', name: 'Trust' },
      ]
    });
    setLoading(false);
  }, []);

  // Check if user already completed onboarding
  useEffect(() => {
    async function checkProfile() {
      try {
        const res = await fetch('/api/proxy/me', { credentials: 'include' });
        const json = await res.json();
        if (json.success && json.data.onboarding_complete) {
          router.push('/dashboard');
        }
      } catch {
        // Ignore — profile might not exist yet
      }
    }
    if (user) checkProfile();
  }, [user, router]);

  const stateIcons = { NSW: '🏖️', VIC: '🏙️', QLD: '☀️', SA: '🍷', WA: '⛏️', TAS: '🏔️', NT: '🐊', ACT: '🏛️' };
  const bizIcons = { 'sole-trader': '👤', partnership: '🤝', company: '🏢', trust: '🛡️' };

  const canNext =
    (step === 1 && selectedState) ||
    (step === 2 && selectedIndustry) ||
    (step === 3 && selectedBusinessType);

  async function handleComplete() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch('/api/proxy/me', {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          state: selectedState,
          industryId: selectedIndustry,
          businessType: selectedBusinessType,
          onboardingComplete: true,
        }),
      });
      const json = await res.json();
      if (json.success) {
        router.push('/dashboard');
      } else {
        setError(json.error?.message || 'Failed to save');
      }
    } catch {
      setError('Could not save selections');
    } finally {
      setSaving(false);
    }
  }

  if (authLoading || loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0A0C10]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary/30 border-t-primary" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0A0C10] flex flex-col font-display px-4 pb-20 overflow-x-hidden">
       {/* Glitch Particles Background (Subtle) */}
      <div className="fixed inset-0 pointer-events-none opacity-10">
        <div className="glitch-particle top-20 left-10"></div>
        <div className="glitch-particle bottom-20 right-10"></div>
      </div>

      <StepIndicator 
        currentStep={step} 
        totalSteps={3} 
        subtitle={step === 1 ? 'Location Setup' : step === 2 ? 'Industry Classification' : 'Legal Structure'} 
      />

      <div className="flex-1 w-full max-w-md mx-auto flex flex-col mt-4 relative z-10">
        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Step 1: State */}
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="text-3xl font-bold leading-tight tracking-tight mb-3 text-white">
               Where is your <span className="text-primary neon-glow-cyan">business</span> located?
            </h1>
            <p className="text-slate-400 text-sm leading-relaxed mb-8">
               Choose the Australian state where your primary operations will begin. This affects legal structures and tax compliance.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {options.states.map((s) => (
                <OptionCard
                  key={s.code}
                  label={s.code}
                  sublabel={s.name}
                  icon={stateIcons[s.code] || '📍'}
                  selected={selectedState === s.code}
                  onClick={() => setSelectedState(s.code)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Industry */}
        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="text-3xl font-bold leading-tight tracking-tight mb-3 text-white">
               What is your <span className="text-primary neon-glow-cyan">industry</span>?
            </h1>
            <p className="text-slate-400 text-sm leading-relaxed mb-8">
               We tailor your roadmap requirements and checklists specifically to your industry operations.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {options.industries.map((ind) => (
                <OptionCard
                  key={ind.id}
                  label={ind.name}
                  icon="🏭"
                  selected={selectedIndustry === ind.id}
                  onClick={() => setSelectedIndustry(ind.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Business Type */}
        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="text-3xl font-bold leading-tight tracking-tight mb-3 text-white">
               Select your <span className="text-primary neon-glow-cyan">structure</span>.
            </h1>
            <p className="text-slate-400 text-sm leading-relaxed mb-8">
               How will you legally structure and register your business entity?
            </p>
            <div className="grid grid-cols-2 gap-4">
              {options.businessTypes.map((bt) => (
                <OptionCard
                  key={bt.code}
                  label={bt.name}
                  icon={bizIcons[bt.code] || '📋'}
                  selected={selectedBusinessType === bt.code}
                  onClick={() => setSelectedBusinessType(bt.code)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Sticky Action Footer */}
        <footer className="mt-8 py-6 w-full max-w-md mx-auto">
          <div className="flex gap-4">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="w-16 items-center flex justify-center rounded-xl glass-card text-primary hover:bg-white/5 transition-colors border border-primary/30 font-bold"
              >
                <span className="material-symbols-outlined font-normal">arrow_back</span>
              </button>
            )}

            {step < 3 ? (
              <button
                onClick={() => setStep(step + 1)}
                disabled={!canNext}
                className="flex-1 flex items-center justify-center gap-2 bg-primary text-[#0A0C10] font-bold py-4 px-8 rounded-xl bg-opacity-100 disabled:opacity-30 disabled:shadow-none hover:shadow-[0_0_20px_rgba(6,237,249,0.5)] transition-all uppercase tracking-widest"
              >
                <span>NEXT STEP</span>
              </button>
            ) : (
              <button
                onClick={handleComplete}
                disabled={!canNext || saving}
                className="flex-1 flex items-center justify-center gap-2 bg-primary text-[#0A0C10] font-bold py-4 px-8 rounded-xl bg-opacity-100 disabled:opacity-30 disabled:shadow-none hover:shadow-[0_0_20px_rgba(6,237,249,0.5)] transition-all uppercase tracking-widest"
              >
                {saving ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#0A0A0F]/30 border-t-[#0A0A0F]" />
                    <span>SAVING...</span>
                  </span>
                ) : (
                  <span>FINISH SETUP</span>
                )}
              </button>
            )}
          </div>
        </footer>
      </div>
    </main>
  );
}
