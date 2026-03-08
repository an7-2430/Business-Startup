'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    async function loadUsers() {
      try {
        const res = await fetch('/api/proxy/admin/users', { credentials: 'include' });
        const json = await res.json();
        if (json.success) {
          setUsers(json.data);
        } else {
          setError(json.error?.message || 'Failed to fetch users');
        }
      } catch (e) {
        setError('Network error');
      } finally {
        setLoading(false);
      }
    }
    loadUsers();
  }, []);

  if (loading) return <div className="p-8"><div className="animate-spin h-8 w-8 border-4 border-[#00F5FF]/30 border-t-[#00F5FF] rounded-full"></div></div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">User Setup Submissions</h1>
      
      {error && <div className="mb-6 p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {users.map((u) => (
          <div key={u.id} className="card-glass p-6 hover:border-[#00F5FF]/50 transition-colors cursor-pointer" onClick={() => setSelectedUser(u)}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-white truncate max-w-[200px]">{u.email}</h3>
                <p className="text-sm text-slate-400 capitalize">{u.role} • {u.state || 'Unknown State'}</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-[#00F5FF]">{u.profile?.overall_progress_percent || 0}%</span>
                <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider">Setup Progress</p>
              </div>
            </div>
            
            <div className="space-y-1 text-sm border-t border-white/5 pt-4">
              <p className="text-slate-300"><strong>Industry:</strong> {u.industry_name || 'Not selected'}</p>
              <p className="text-slate-300"><strong>Type:</strong> {u.business_type || 'Not selected'}</p>
            </div>
          </div>
        ))}
        {users.length === 0 && <p className="text-slate-500">No users found.</p>}
      </div>

      {selectedUser && (
        <UserDetailModal user={selectedUser} onClose={() => setSelectedUser(null)} />
      )}
    </div>
  );
}

function UserDetailModal({ user, onClose }) {
  const profile = user.profile || {};
  const s2 = profile.legal_and_registration || {};
  const s3 = profile.location_and_premises || {};
  const s4 = profile.compliance_and_safety || {};
  const s5 = profile.equipment_and_operations || {};
  const s6 = profile.digital_and_finance || {};
  const s7 = profile.launch_readiness || {};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4" onClick={onClose}>
      <div className="w-full max-w-4xl card-glass h-[80vh] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-dark-900">
          <div>
             <h2 className="text-xl font-bold text-white">{user.email}</h2>
             <p className="text-sm text-[#00F5FF] mt-1">{profile.overall_progress_percent || 0}% Setup Complete</p>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white text-xl">✕</button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-8 flex-1">
           {/* Section 1 */}
           <div>
              <h3 className="text-lg font-bold text-slate-200 border-b border-white/10 pb-2 mb-4">Stage 1: Identity & Target</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                 <div><span className="text-slate-500 block">State</span><span className="text-white">{user.state || '-'}</span></div>
                 <div><span className="text-slate-500 block">Industry</span><span className="text-white">{user.industry_name || '-'}</span></div>
                 <div><span className="text-slate-500 block">Type</span><span className="text-white">{user.business_type || '-'}</span></div>
              </div>
           </div>

           {/* Section 2 */}
           <div>
              <h3 className="text-lg font-bold text-slate-200 border-b border-white/10 pb-2 mb-4">Stage 2: Registration & Legal</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                 <div><span className="text-slate-500 block">Has ABN?</span><span className="text-white">{s2.has_abn || '-'}</span></div>
                 <div><span className="text-slate-500 block">Has ACN?</span><span className="text-white">{s2.has_acn || '-'}</span></div>
                 <div><span className="text-slate-500 block">Reg Status</span><span className="text-white">{s2.status || '-'}</span></div>
                 <div><span className="text-slate-500 block">Needs Name Reg?</span><span className="text-white">{s2.needs_name_registration ? 'Yes' : 'No'}</span></div>
                 <div className="col-span-2"><span className="text-slate-500 block">Reference #</span><span className="text-white">{s2.reference_number || '-'}</span></div>
              </div>
           </div>

           {/* Section 3 */}
           <div>
              <h3 className="text-lg font-bold text-slate-200 border-b border-white/10 pb-2 mb-4">Stage 3: Location</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                 <div><span className="text-slate-500 block">Location Type</span><span className="text-white">{s3.location_type || '-'}</span></div>
                 <div className="col-span-2"><span className="text-slate-500 block">Address</span><span className="text-white">{s3.address || '-'}</span></div>
                 <div><span className="text-slate-500 block">Needs Council Appr?</span><span className="text-white">{s3.council_approval_required ? 'Yes' : 'No'}</span></div>
                 <div><span className="text-slate-500 block">Needs Fitout?</span><span className="text-white">{s3.workshop_fitout_needed ? 'Yes' : 'No'}</span></div>
                 <div><span className="text-slate-500 block">Needs Utilities?</span><span className="text-white">{s3.utilities_needed ? 'Yes' : 'No'}</span></div>
              </div>
           </div>
           
           {/* Section 4 */}
           <div>
              <h3 className="text-lg font-bold text-slate-200 border-b border-white/10 pb-2 mb-4">Stage 4: Compliance & Safety</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                 <div><span className="text-slate-500 block">Has Insurance?</span><span className="text-white">{s4.has_insurance || '-'}</span></div>
                 <div><span className="text-slate-500 block">Has Staff?</span><span className="text-white">{s4.has_staff ? 'Yes' : 'No'}</span></div>
                 <div><span className="text-slate-500 block">Needs SafeWork?</span><span className="text-white">{s4.needs_safework ? 'Yes' : 'No'}</span></div>
                 <div><span className="text-slate-500 block">Needs Permits?</span><span className="text-white">{s4.needs_permits ? 'Yes' : 'No'}</span></div>
                 <div className="col-span-2 flex flex-wrap gap-2 mt-2">
                    {s4.insurance_needs_public_liability && <span className="bg-[#00F5FF]/10 text-[#00F5FF] px-2 py-1 rounded-md text-xs">Public Liability</span>}
                    {s4.insurance_needs_workers_compensation && <span className="bg-[#00F5FF]/10 text-[#00F5FF] px-2 py-1 rounded-md text-xs">Workers Comp</span>}
                    {s4.insurance_needs_equipment && <span className="bg-[#00F5FF]/10 text-[#00F5FF] px-2 py-1 rounded-md text-xs">Equipment</span>}
                    {s4.insurance_needs_property && <span className="bg-[#00F5FF]/10 text-[#00F5FF] px-2 py-1 rounded-md text-xs">Property</span>}
                 </div>
              </div>
           </div>

           {/* Section 5 */}
           <div>
              <h3 className="text-lg font-bold text-slate-200 border-b border-white/10 pb-2 mb-4">Stage 5: Operations & Workflow</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                 <div className="col-span-2"><span className="text-slate-500 block">Services/Products</span><span className="text-white whitespace-pre-wrap">{s5.services || '-'}</span></div>
                 <div className="col-span-2"><span className="text-slate-500 block">Equipment Owned</span><span className="text-white whitespace-pre-wrap">{s5.equipment_owned || '-'}</span></div>
                 <div className="col-span-2"><span className="text-slate-500 block">Equipment Needed</span><span className="text-white whitespace-pre-wrap">{s5.equipment_needed || '-'}</span></div>
                 <div><span className="text-slate-500 block">Setup Budget</span><span className="text-white">{s5.budget || '-'}</span></div>
                 <div><span className="text-slate-500 block">Staff Planned</span><span className="text-white">{s5.staff_planned || '-'}</span></div>
                 <div><span className="text-slate-500 block">Operating Model</span><span className="text-white">{s5.operating_model || '-'}</span></div>
              </div>
           </div>

            {/* Section 6 */}
           <div>
              <h3 className="text-lg font-bold text-slate-200 border-b border-white/10 pb-2 mb-4">Stage 6: Digital & Finance</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                 <div><span className="text-slate-500 block">Payment Method</span><span className="text-white">{s6.payment_method || '-'}</span></div>
                 <div><span className="text-slate-500 block">Software Budget</span><span className="text-white">{s6.software_budget || '-'}</span></div>
                 <div><span className="text-slate-500 block">Has Bank Acct?</span><span className="text-white">{s6.has_bank_account ? 'Yes' : 'No'}</span></div>
                 <div><span className="text-slate-500 block">Needs Stripe?</span><span className="text-white">{s6.needs_stripe ? 'Yes' : 'No'}</span></div>
                 <div className="flex gap-4 col-span-2 mt-2">
                    {s6.needs_accounting_software && <span className="bg-[#00F5FF]/10 text-[#00F5FF] px-2 py-1 rounded-md text-xs">Needs Accounting</span>}
                    {s6.needs_invoicing_crm && <span className="bg-[#00F5FF]/10 text-[#00F5FF] px-2 py-1 rounded-md text-xs">Needs CRM/Invoicing</span>}
                 </div>
              </div>
           </div>

           {/* Section 7 */}
           <div>
              <h3 className="text-lg font-bold text-[#30D158] border-b border-white/10 pb-2 mb-4">Stage 7: Launch Readiness</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                 <div><span className="text-slate-500 block">Target Date</span><span className="text-white">{s7.target_date || '-'}</span></div>
                 <div><span className="text-slate-500 block">Ready to Trade?</span><span className={s7.ready_to_trade ? 'text-[#30D158] font-bold' : 'text-slate-400'}>{s7.ready_to_trade ? 'YES' : 'NO'}</span></div>
                 <div className="col-span-2"><span className="text-slate-500 block">Missing Items</span><span className="text-white whitespace-pre-wrap">{s7.missing_items || 'None'}</span></div>
                 
                 {s7.final_confirmation && (
                    <div className="col-span-2 mt-4 p-3 bg-[#30D158]/10 border border-[#30D158]/30 rounded-lg text-[#30D158] text-xs">
                        ✓ User provided final confirmation of readiness.
                    </div>
                 )}
              </div>
           </div>

        </div>
      </div>
    </div>
  );
}
