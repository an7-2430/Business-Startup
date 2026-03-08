'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SetupStagePage({ params }) {
  const router = useRouter();
  const stageMap = {
    '1': 'business_identity',
    '2': 'legal_and_registration',
    '3': 'location_and_premises',
    '4': 'compliance_and_safety',
    '5': 'equipment_and_operations',
    '6': 'digital_and_finance',
    '7': 'launch_readiness',
  };

  const stageNumber = params.stage;
  const stageKey = stageMap[stageNumber];

  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (stageNumber === '1') {
      router.push('/onboarding');
      return;
    }

    if (!stageKey) {
      router.push('/dashboard');
      return;
    }

    async function loadData() {
      try {
        const res = await fetch('/api/proxy/setup');
        const json = await res.json();
        if (json.success) {
          setFormData(json.data[`stage_${stageNumber}`] || {});
        }
      } catch (err) {
        setError('Failed to load saved data.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [stageNumber, stageKey, router]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSave = async (isDraft) => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/proxy/setup/${stageKey}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stageNumber,
          isDraft,
          data: formData,
        }),
      });
      const json = await res.json();

      if (json.success) {
        if (!isDraft) {
          router.push('/dashboard');
        } else {
          alert('Draft Saved Successfully!');
        }
      } else {
        setError(json.error?.message || 'Failed to save');
      }
    } catch (err) {
      setError('Network error. Could not save.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex nebula-bg items-center justify-center min-h-screen">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#00F5FF]/30 border-t-[#00F5FF]" />
      </div>
    );
  }

  // PRD Question Forms
  const renderFields = () => {
    const inputClass = "w-full bg-[#0a0c10]/80 border border-white/10 rounded-lg p-3 text-white focus:border-[#00F5FF] focus:ring-1 focus:ring-[#00F5FF]/50 transition-all outline-none";
    const labelClass = "block text-sm text-slate-400 mb-2 font-medium tracking-wide";
    const checkboxLabelClass = "flex items-center gap-3 p-4 rounded-lg bg-white/5 border border-white/5 hover:border-[#00F5FF]/30 transition-all cursor-pointer";
    const checkboxClass = "w-5 h-5 accent-[#00F5FF] shrink-0";

    switch (stageNumber) {
      case '2':
        return (
          <>
            <div className="mb-6">
              <label className={labelClass}>Do you already have an ABN?</label>
              <select name="has_abn" value={formData.has_abn || ''} onChange={handleChange} className={inputClass}>
                <option value="">Select...</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
            <div className="mb-6">
              <label className={labelClass}>Do you already have an ACN?</label>
              <select name="has_acn" value={formData.has_acn || ''} onChange={handleChange} className={inputClass}>
                <option value="">Select...</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
            <div className="mb-6">
              <label className={labelClass}>Business registration status</label>
              <select name="status" value={formData.status || ''} onChange={handleChange} className={inputClass}>
                <option value="">Select status...</option>
                <option value="not_started">Not Started</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <label className={`${checkboxLabelClass} mb-6`}>
              <input type="checkbox" name="needs_name_registration" checked={formData.needs_name_registration || false} onChange={handleChange} className={checkboxClass} />
              <span className="text-sm text-white font-medium">I need a business name registration</span>
            </label>
            <div className="mb-6">
              <label className={labelClass}>Reference Number or ABN</label>
              <input type="text" name="reference_number" value={formData.reference_number || ''} onChange={handleChange} className={inputClass} placeholder="e.g. 11 222 333 444" />
            </div>
          </>
        );
      case '3':
        return (
          <>
            <div className="mb-6">
              <label className={labelClass}>Business location type</label>
              <select name="location_type" value={formData.location_type || ''} onChange={handleChange} className={inputClass}>
                <option value="">Select...</option>
                <option value="home">Home</option>
                <option value="rented_workshop">Rented Workshop</option>
                <option value="owned_premises">Owned Premises</option>
              </select>
            </div>
            <div className="mb-6">
              <label className={labelClass}>Address / Suburb / Postcode</label>
              <input type="text" name="address" value={formData.address || ''} onChange={handleChange} className={inputClass} placeholder="e.g. 123 Builder St, Sydney 2000" />
            </div>
            <div className="mb-6 flex flex-col gap-3">
              <label className={checkboxLabelClass}>
                <input type="checkbox" name="council_approval_required" checked={formData.council_approval_required || false} onChange={handleChange} className={checkboxClass} />
                <span className="text-sm text-white font-medium">Is council approval required?</span>
              </label>
              <label className={checkboxLabelClass}>
                <input type="checkbox" name="zoning_checked" checked={formData.zoning_checked || false} onChange={handleChange} className={checkboxClass} />
                <span className="text-sm text-white font-medium">Is zoning already checked?</span>
              </label>
              <label className={checkboxLabelClass}>
                <input type="checkbox" name="workshop_fitout_needed" checked={formData.workshop_fitout_needed || false} onChange={handleChange} className={checkboxClass} />
                <span className="text-sm text-white font-medium">Do you need a workshop fit-out?</span>
              </label>
              <label className={checkboxLabelClass}>
                <input type="checkbox" name="utilities_needed" checked={formData.utilities_needed || false} onChange={handleChange} className={checkboxClass} />
                <span className="text-sm text-white font-medium">Do you need utilities setup?</span>
              </label>
            </div>
          </>
        );
      case '4':
        return (
          <>
             <div className="mb-6">
              <label className={labelClass}>Do you already have business insurance?</label>
              <select name="has_insurance" value={formData.has_insurance || ''} onChange={handleChange} className={inputClass}>
                <option value="">Select...</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
            <div className="mb-6">
              <label className={labelClass}>Insurance types needed</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {['Public Liability', 'Workers Compensation', 'Equipment', 'Property'].map((type) => (
                  <label key={type} className={checkboxLabelClass}>
                    <input 
                      type="checkbox" 
                      name={`insurance_needs_${type.toLowerCase().replace(' ', '_')}`}
                      checked={formData[`insurance_needs_${type.toLowerCase().replace(' ', '_')}`] || false} 
                      onChange={handleChange} 
                      className={checkboxClass} 
                    />
                    <span className="text-sm text-white font-medium">{type}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="mb-6 flex flex-col gap-3">
              <label className={checkboxLabelClass}>
                <input type="checkbox" name="needs_safework" checked={formData.needs_safework || false} onChange={handleChange} className={checkboxClass} />
                <span className="text-sm text-white font-medium">Need workplace safety compliance guidance?</span>
              </label>
              <label className={checkboxLabelClass}>
                <input type="checkbox" name="has_staff" checked={formData.has_staff || false} onChange={handleChange} className={checkboxClass} />
                <span className="text-sm text-white font-medium">Do you have any staff already?</span>
              </label>
              <label className={checkboxLabelClass}>
                <input type="checkbox" name="needs_permits" checked={formData.needs_permits || false} onChange={handleChange} className={checkboxClass} />
                <span className="text-sm text-white font-medium">Need specific licences or permits?</span>
              </label>
            </div>
          </>
        );
      case '5':
        return (
          <>
            <div className="mb-6">
              <label className={labelClass}>What services/products will you provide?</label>
              <textarea name="services" value={formData.services || ''} onChange={handleChange} className={`${inputClass} h-24`} placeholder="Describe your main offerings..."></textarea>
            </div>
            <div className="mb-6">
              <label className={labelClass}>What equipment do you already own?</label>
              <textarea name="equipment_owned" value={formData.equipment_owned || ''} onChange={handleChange} className={`${inputClass} h-20`} placeholder="List existing tools/machinery..."></textarea>
            </div>
            <div className="mb-6">
              <label className={labelClass}>What equipment do you still need?</label>
              <textarea name="equipment_needed" value={formData.equipment_needed || ''} onChange={handleChange} className={`${inputClass} h-20`} placeholder="List required tools/machinery..."></textarea>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className={labelClass}>Approximate setup budget</label>
                <input type="text" name="budget" value={formData.budget || ''} onChange={handleChange} className={inputClass} placeholder="$50,000" />
              </div>
              <div>
                <label className={labelClass}>Number of staff planned</label>
                <input type="number" name="staff_planned" value={formData.staff_planned || ''} onChange={handleChange} className={inputClass} placeholder="0" />
              </div>
            </div>
            <div className="mb-6 flex flex-col gap-3">
              <label className={checkboxLabelClass}>
                <input type="checkbox" name="needs_inventory_tracking" checked={formData.needs_inventory_tracking || false} onChange={handleChange} className={checkboxClass} />
                <span className="text-sm text-white font-medium">Do you need inventory tracking?</span>
              </label>
              <label className={checkboxLabelClass}>
                <input type="checkbox" name="needs_workflow_planning" checked={formData.needs_workflow_planning || false} onChange={handleChange} className={checkboxClass} />
                <span className="text-sm text-white font-medium">Do you need workflow planning support?</span>
              </label>
            </div>
            <div className="mb-6">
              <label className={labelClass}>Preferred operating model</label>
              <select name="operating_model" value={formData.operating_model || ''} onChange={handleChange} className={inputClass}>
                <option value="">Select...</option>
                <option value="small_workshop">Small workshop</option>
                <option value="larger_production">Larger production</option>
                <option value="custom_orders">Custom orders only</option>
              </select>
            </div>
          </>
        );
      case '6':
        return (
          <>
            <div className="mb-6 flex flex-col gap-3">
              <label className={checkboxLabelClass}>
                <input type="checkbox" name="needs_accounting_software" checked={formData.needs_accounting_software || false} onChange={handleChange} className={checkboxClass} />
                <span className="text-sm text-white font-medium">Do you need accounting software?</span>
              </label>
              <label className={checkboxLabelClass}>
                <input type="checkbox" name="needs_invoicing_crm" checked={formData.needs_invoicing_crm || false} onChange={handleChange} className={checkboxClass} />
                <span className="text-sm text-white font-medium">Do you need invoicing / payroll / CRM?</span>
              </label>
            </div>
            <div className="mb-6">
              <label className={labelClass}>Preferred payment method</label>
              <select name="payment_method" value={formData.payment_method || ''} onChange={handleChange} className={inputClass}>
                <option value="">Select...</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="card_online">Card / Online (Stripe)</option>
                <option value="cash">Cash</option>
              </select>
            </div>
            <div className="mb-6 flex flex-col gap-3">
               <label className={checkboxLabelClass}>
                <input type="checkbox" name="has_bank_account" checked={formData.has_bank_account || false} onChange={handleChange} className={checkboxClass} />
                <span className="text-sm text-white font-medium">Already have a business bank account?</span>
              </label>
              <label className={checkboxLabelClass}>
                <input type="checkbox" name="needs_stripe" checked={formData.needs_stripe || false} onChange={handleChange} className={checkboxClass} />
                <span className="text-sm text-white font-medium">Need Stripe / payment gateway setup?</span>
              </label>
            </div>
             <div className="mb-6">
              <label className={labelClass}>Estimated monthly software budget</label>
              <input type="text" name="software_budget" value={formData.software_budget || ''} onChange={handleChange} className={inputClass} placeholder="$100/mo" />
            </div>
          </>
        );
      case '7':
         return (
          <>
            <div className="mb-6">
              <label className={labelClass}>Launch target date</label>
              <input type="date" name="target_date" value={formData.target_date || ''} onChange={handleChange} className={inputClass} />
            </div>
            <div className="mb-6 flex flex-col gap-3">
              <label className={checkboxLabelClass}>
                <input type="checkbox" name="ready_to_trade" checked={formData.ready_to_trade || false} onChange={handleChange} className="w-5 h-5 accent-[#39FF14] shrink-0" />
                <span className="text-sm text-white font-bold">Are you ready to start trading?</span>
              </label>
               <label className={checkboxLabelClass}>
                <input type="checkbox" name="wants_reminders" checked={formData.wants_reminders || false} onChange={handleChange} className={checkboxClass} />
                <span className="text-sm text-white font-medium">Do you want reminders for incomplete steps?</span>
              </label>
              <label className={checkboxLabelClass}>
                <input type="checkbox" name="wants_admin_review" checked={formData.wants_admin_review || false} onChange={handleChange} className={checkboxClass} />
                <span className="text-sm text-white font-medium">Do you want admin review / checklist summary?</span>
              </label>
            </div>
             <div className="mb-6">
              <label className={labelClass}>Are there any missing approvals/documents?</label>
              <textarea name="missing_items" value={formData.missing_items || ''} onChange={handleChange} className={`${inputClass} h-20`} placeholder="List any blockers before launch..."></textarea>
            </div>
            
            <div className="mt-8 p-6 bg-[#39FF14]/5 border border-[#39FF14]/40 rounded-xl neon-border-glow-green">
               <label className="flex items-start gap-4 cursor-pointer">
                <input type="checkbox" name="final_confirmation" checked={formData.final_confirmation || false} onChange={handleChange} className="w-6 h-6 mt-0.5 accent-[#39FF14] shrink-0" />
                <span className="text-sm text-white leading-relaxed">
                  <strong className="text-[#39FF14] tracking-wide uppercase text-xs mb-1 block">Final Confirmation</strong>
                  I confirm the above information across all stages is accurate and I am ready to finalize my setup.
                </span>
              </label>
            </div>
          </>
        );
      default:
        return <p>Unknown stage.</p>;
    }
  };

  const stageTitles = {
    '2': 'Registration & Legal Basics',
    '3': 'Location, Premises & Approvals',
    '4': 'Compliance, Insurance & Safety',
    '5': 'Equipment, Operations & Workflow',
    '6': 'Digital Tools, Finance & Payments',
    '7': 'Launch Readiness & Tracking'
  };

  return (
    <div className="min-h-screen nebula-bg font-display flex flex-col overflow-x-hidden pb-32 md:pb-10">
      {/* Top Nav */}
      <header className="flex items-center justify-between px-6 py-4 sticky top-0 z-50 bg-[#0A0C10]/80 backdrop-blur-md border-b border-primary/10">
        <button onClick={() => router.push('/dashboard')} className="flex items-center gap-2 group">
          <span className="material-symbols-outlined text-primary font-normal group-hover:-translate-x-1 transition-transform">arrow_back_ios</span>
          <span className="text-sm font-medium tracking-widest uppercase text-slate-300 group-hover:text-white transition-colors">Back to Basecamp</span>
        </button>
      </header>

      <main className="flex-1 flex flex-col nebula-bg px-4 md:px-10 py-8 relative max-w-4xl mx-auto w-full">
        {error && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Main Task Detail Card */}
        <div className="glass-card rounded-2xl p-6 md:p-10 flex flex-col gap-8 relative z-10 shadow-2xl">
          {/* Hero Title */}
          <div className="flex flex-col gap-2 relative">
            <div className="absolute right-0 top-0 size-32 md:size-48 bg-primary/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>
            <div className="flex items-center gap-2 text-primary/60 text-xs font-bold uppercase tracking-[0.2em] mb-2">
              <span>Step 0{stageNumber}</span>
              <span className="h-px w-8 bg-primary/30"></span>
              <span>{stageNumber === '1' ? 'Onboarding' : 'Identity & Setup'}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white neon-glow-cyan leading-tight tracking-tight">
              {stageTitles[stageNumber]}
            </h1>
          </div>

          {/* Rationale Section */}
          <section className="space-y-3">
            <h3 className="text-primary font-bold text-sm tracking-wider uppercase">Why it matters</h3>
            <p className="text-slate-300 text-base leading-relaxed font-light">
              This stage is critical for establishing your business&apos;s legal and operational foundation. 
              Completing these steps ensures you&apos;re compliant with regulations and ready to scale without friction.
            </p>
          </section>

          {/* Dynamic Form Fields */}
          <section className="space-y-6 pt-4 border-t border-white/5">
             <h3 className="text-primary/60 font-bold text-xs tracking-wider uppercase mb-2">Requirements</h3>
             <div className="space-y-4">
                {renderFields()}
             </div>
          </section>

          {/* Action Suite */}
          <div className="flex flex-col gap-4 mt-6 relative">
            <div className="task-burst-placeholder absolute inset-x-0 -top-8 h-32 -z-10 blur-xl rounded-full opacity-50"></div>
            
            <button
              onClick={() => handleSave(false)}
              disabled={saving || (stageNumber === '7' && !formData.final_confirmation)}
              className="w-full bg-primary py-4 rounded-xl text-black font-bold text-lg flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(6,237,249,0.5)] active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined font-bold font-normal">verified</span>
              {saving ? 'Saving...' : 'Mark Stage Complete'}
            </button>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleSave(true)}
                disabled={saving}
                className="w-full border border-primary/40 py-3 rounded-lg text-primary font-medium flex items-center justify-center gap-2 hover:bg-primary/5 active:scale-95 transition-all text-sm uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined font-normal">save</span>
                Save Draft
              </button>
              
              <button
                onClick={() => alert('Document upload modal coming soon')}
                className="w-full border border-primary/40 py-3 rounded-lg text-primary font-medium flex items-center justify-center gap-2 hover:bg-primary/5 active:scale-95 transition-all text-sm uppercase tracking-wide"
              >
                <span className="material-symbols-outlined text-xl font-normal">upload_file</span>
                Upload Doc
              </button>
            </div>
            
            <button className="w-full py-2 text-primary/70 text-sm font-medium underline underline-offset-4 decoration-primary/30 hover:text-primary transition-colors text-center">
              Save Note for later
            </button>
          </div>
        </div>

        {/* Resources Section */}
        <div className="mt-12 mb-20 space-y-4 px-2">
          <h3 className="text-white font-bold text-lg flex items-center gap-2">
            <span className="material-symbols-outlined text-primary font-normal">auto_awesome</span>
            Resources & Tools
          </h3>
          <div className="flex flex-col gap-3">
            {[
              { title: "Business Portal", desc: "Official government requirements" },
              { title: "Tax Guidance", desc: "Financial essentials guide" },
              { title: "Compliance Checker", desc: "Instant verification tool" }
            ].map((res, idx) => (
              <a key={idx} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:border-primary/30 transition-all group cursor-pointer">
                <div className="flex flex-col">
                  <span className="text-slate-100 font-medium">{res.title}</span>
                  <span className="text-xs text-slate-400">{res.desc}</span>
                </div>
                <span className="material-symbols-outlined text-primary group-hover:translate-x-1 transition-transform font-normal">arrow_forward</span>
              </a>
            ))}
          </div>
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0A0C10]/90 backdrop-blur-xl border-t border-primary/20 pb-8 pt-2">
        <div className="flex items-center justify-around px-4">
          <a onClick={() => router.push('/dashboard')} className="flex flex-col items-center gap-1 text-primary/50 hover:text-primary transition-colors cursor-pointer">
            <span className="material-symbols-outlined font-normal">grid_view</span>
            <p className="text-[10px] font-bold tracking-widest uppercase text-slate-500">Basecamp</p>
          </a>
          <a className="flex flex-col items-center gap-1 text-primary">
             <span className="material-symbols-outlined font-normal" style={{ fontVariationSettings: "'FILL' 1" }}>check_box</span>
             <p className="text-[10px] font-bold tracking-widest uppercase">Setup</p>
          </a>
          <a onClick={() => alert('Vault feature coming soon')} className="flex flex-col items-center gap-1 text-primary/50 hover:text-primary transition-colors cursor-pointer">
            <span className="material-symbols-outlined font-normal">inventory_2</span>
            <p className="text-[10px] font-bold tracking-widest uppercase text-slate-500">Vault</p>
          </a>
        </div>
      </nav>
    </div>
  );
}
