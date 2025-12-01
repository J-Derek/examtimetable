export function SkeletonCard() {
  return (
    <div className="bg-card rounded-2xl p-5 shadow-card border border-border/50">
      {/* Header skeleton */}
      <div className="flex gap-2 mb-4">
        <div className="h-8 w-28 rounded-lg animate-shimmer" />
        <div className="h-8 w-24 rounded-lg animate-shimmer" />
      </div>
      
      {/* Course code skeleton */}
      <div className="h-8 w-32 rounded-lg animate-shimmer mb-3" />
      
      {/* Venue skeleton */}
      <div className="h-5 w-20 rounded-lg animate-shimmer" />
      
      {/* Campus skeleton */}
      <div className="mt-4 pt-4 border-t border-border/50">
        <div className="h-4 w-24 rounded animate-shimmer" />
      </div>
    </div>
  );
}

export function SkeletonGroup() {
  return (
    <div className="space-y-4">
      {/* Date header skeleton */}
      <div className="h-6 w-32 rounded-lg animate-shimmer mb-4" />
      
      {/* Cards skeleton */}
      <div className="grid gap-4 sm:grid-cols-2">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  );
}
