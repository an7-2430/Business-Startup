'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SIDEBAR_NAV } from '@/lib/constants';

export default function Sidebar() {
  const { user } = useUser();
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-64 flex-col border-r border-white/5 bg-dark-900">
      {/* Logo */}
      <div className="flex items-center gap-2 px-6 py-5 border-b border-white/5">
        <Link href="/" className="text-xl font-bold text-white">
          Build<span className="text-neon">Path</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {SIDEBAR_NAV.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors duration-150
                ${
                  isActive
                    ? 'bg-[#00F5FF]/10 text-[#00F5FF] shadow-[inset_0_0_12px_rgba(0,245,255,0.06)]'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="border-t border-white/5 px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#00F5FF]/10 text-xs font-bold text-[#00F5FF]">
            {user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || '?'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {user?.name || user?.email || 'User'}
            </p>
          </div>
        </div>
        <a
          href="/api/auth/logout"
          className="mt-3 block w-full rounded-lg px-3 py-2 text-center text-xs font-medium text-slate-400 hover:bg-white/5 hover:text-white transition-colors"
        >
          Sign out
        </a>
      </div>
    </aside>
  );
}
