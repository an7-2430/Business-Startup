import LoadingSkeleton from '@/components/ui/LoadingSkeleton';

export default function DashboardLoading() {
  return (
    <div className="space-y-8">
      {/* Header skeleton */}
      <div>
        <div className="skeleton h-8 w-64 mb-2" />
        <div className="skeleton h-4 w-96" />
      </div>

      {/* Stats cards skeleton */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="card">
            <div className="skeleton h-3 w-24 mb-3" />
            <div className="skeleton h-8 w-20" />
          </div>
        ))}
      </div>

      {/* Roadmap area skeleton */}
      <LoadingSkeleton lines={3} />
    </div>
  );
}
