/**
 * Loading Fallback Components
 * Reusable skeleton/loading states for Suspense boundaries
 */

export function ParticlesSkeleton() {
  return (
    <div
      className="absolute inset-0 animate-pulse bg-gradient-to-br from-blue-500/10 to-purple-500/10"
      aria-label="Loading particles animation"
    />
  );
}

export function ContentSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="p-6 space-y-4 animate-pulse border border-gray-200 dark:border-gray-800 rounded-lg">
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
    </div>
  );
}
