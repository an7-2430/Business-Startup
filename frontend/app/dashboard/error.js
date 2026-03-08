'use client';

export default function DashboardError({ error, reset }) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center max-w-md">
        <div className="mb-6 text-5xl">⚠️</div>
        <h2 className="mb-3 text-xl font-bold text-white">Something went wrong</h2>
        <p className="mb-6 text-sm text-slate-400">
          {error?.message || 'An unexpected error occurred while loading the dashboard.'}
        </p>
        <button onClick={() => reset()} className="btn-primary">
          Try again
        </button>
      </div>
    </div>
  );
}
