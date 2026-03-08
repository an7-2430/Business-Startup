'use client';

import { useAuth } from '@/lib/useAuth';

export default function SettingsPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings ⚙️</h1>
        <p className="mt-1 text-slate-400">
          Manage your account preferences and profile.
        </p>
      </div>

      <div className="card space-y-6">
        <div>
          <h2 className="text-lg font-medium text-white mb-4">Profile Information</h2>
          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Email</label>
              <input type="text" disabled value={user?.email || ''} className="field opacity-60 cursor-not-allowed" />
              <p className="text-xs text-slate-500 mt-1">Managed securely by Auth0.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Name</label>
              <input type="text" disabled value={user?.name || ''} className="field opacity-60 cursor-not-allowed" />
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-white/10">
          <h2 className="text-lg font-medium text-white mb-2">Danger Zone</h2>
          <p className="text-sm text-slate-400 mb-4">Permanently delete your account and all associated data.</p>
          <button className="btn-danger w-full sm:w-auto">Delete Account</button>
        </div>
      </div>
    </div>
  );
}
