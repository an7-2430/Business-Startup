export default function LoadingSkeleton({ lines = 4, className = '' }) {
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Title skeleton */}
      <div className="skeleton h-8 w-48" />

      {/* Subtitle skeleton */}
      <div className="skeleton h-4 w-72" />

      {/* Content skeletons */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i} className="card space-y-3">
            <div className="skeleton h-4 w-3/4" />
            <div className="skeleton h-3 w-full" />
            <div className="skeleton h-3 w-5/6" />
            <div className="skeleton h-8 w-24 mt-2" />
          </div>
        ))}
      </div>
    </div>
  );
}
