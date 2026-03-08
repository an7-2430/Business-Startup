'use client';

import { useAuth } from '@/lib/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LoginPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-dark-950">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#00F5FF]/30 border-t-[#00F5FF]" />
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-dark-950 px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-white">
            Build<span className="text-neon">Path</span>
          </h1>
          <p className="mt-2 text-sm text-slate-400">Sign in to your account</p>
        </div>

        {/* Card */}
        <div className="card-glass text-center">
          <p className="mb-6 text-slate-300 text-sm">
            Click below to authenticate securely with Auth0.
          </p>

          {/* Auth0 login — triggers Auth0 redirect */}
          <a
            href="/api/auth/login"
            id="auth0-login-btn"
            className="btn-primary w-full py-3 text-base block"
          >
            Sign in with Auth0
          </a>

          <p className="mt-4 text-xs text-slate-500">
            Don&apos;t have an account? Auth0 handles sign-up automatically.
          </p>
        </div>

        <p className="mt-8 text-center text-xs text-slate-600">
          © 2026 BuildPath
        </p>
      </div>
    </main>
  );
}
