'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { usePathname } from 'next/navigation';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

export default function TopBar() {
  const { user } = useUser();
  const pathname = usePathname();
  const [sessionData, setSessionData] = useState({
    industry: 'Business Setup',
    state: '',
    progress: { percent: 0, completed: 0, total: 0 }
  });

  useEffect(() => {
    async function loadData() {
      if (!user) return;
      try {
        const [profileRes, roadmapRes] = await Promise.all([
          fetch(`${API_BASE}/me`, { credentials: 'include' }),
          fetch(`${API_BASE}/roadmap`, { credentials: 'include' })
        ]);
        
        const profile = await profileRes.json();
        const roadmap = await roadmapRes.json();
        
        setSessionData({
          industry: profile.success && profile.data.industry_name ? profile.data.industry_name : 'Business Setup',
          state: profile.success && profile.data.state ? profile.data.state : '',
          progress: roadmap.success && roadmap.data.progress ? roadmap.data.progress : { percent: 0, completed: 0, total: 0 }
        });
      } catch (e) {
        // fail silently for top bar
      }
    }
    loadData();
  }, [user, pathname]);

  // Format title based on path
  let pageTitle = 'Dashboard';
  if (pathname.includes('/documents')) pageTitle = 'Documents';
  if (pathname.includes('/settings')) pageTitle = 'Settings';
  if (pathname.includes('/billing')) pageTitle = 'Billing';

  return (
    <header className="flex h-16 items-center justify-between border-b border-white/5 bg-dark-900/80 backdrop-blur-sm px-6">
      {/* Left: Page context / breadcrumb */}
      <div>
        <h2 className="text-lg font-semibold text-white">{pageTitle}</h2>
      </div>

      {/* Center: Progress overview */}
      <div className="hidden md:flex items-center gap-6">
        <div className="text-center">
          <p className="text-xs text-slate-500 uppercase tracking-wider">Progress</p>
          <div className="flex items-center gap-2 mt-1">
            <div className="progress-bar-track w-32 bg-white/5">
              <div className="progress-bar-fill" style={{ width: `${sessionData.progress.percent}%` }} />
            </div>
            <span className="text-sm font-medium text-[#00F5FF]">{sessionData.progress.percent}%</span>
          </div>
        </div>
        <div className="text-center">
          <p className="text-xs text-slate-500 uppercase tracking-wider">Steps</p>
          <p className="text-sm font-semibold text-white mt-1">
            {sessionData.progress.completed} / {sessionData.progress.total}
          </p>
        </div>
      </div>

      {/* Right: User menu */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:block text-right">
          <p className="text-sm font-medium text-white truncate max-w-[150px]">
            {user?.name || user?.email || 'User'}
          </p>
          <p className="text-xs text-slate-500 truncate max-w-[150px]">
            {sessionData.industry}{sessionData.state ? ` · ${sessionData.state}` : ''}
          </p>
        </div>
        <div className="flex shrink-0 h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#00F5FF]/20 to-[#BF5AF2]/20 border border-white/10 text-sm font-bold text-[#00F5FF]">
          {user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || '?'}
        </div>
      </div>
    </header>
  );
}
