import { Skeleton } from "@/components/ui/skeleton";

/**
 * Loading skeletons that mimic the customer screens' card grids/lists.
 */

export function ProductCardSkeleton() {
  return (
    <div className="bg-card rounded-2xl overflow-hidden border border-border shadow-sm">
      <Skeleton className="h-28 w-full rounded-none" />
      <div className="p-3 space-y-2">
        <Skeleton className="h-3.5 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <div className="flex items-center justify-between pt-1.5">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-7 w-14 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function HorizontalScrollSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="flex gap-3 overflow-hidden pb-2">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="min-w-[140px] bg-card rounded-2xl overflow-hidden border border-border shadow-sm">
          <Skeleton className="h-24 w-full rounded-none" />
          <div className="p-2.5 space-y-1.5">
            <Skeleton className="h-3 w-3/4" />
            <Skeleton className="h-2.5 w-1/2" />
            <div className="flex items-center justify-between pt-1">
              <Skeleton className="h-3.5 w-10" />
              <Skeleton className="h-6 w-12 rounded-xl" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function CategoryRowSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="flex gap-3.5 overflow-hidden pb-1">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex flex-col items-center gap-1.5 min-w-[64px]">
          <Skeleton className="h-16 w-16 rounded-2xl" />
          <Skeleton className="h-2.5 w-12" />
        </div>
      ))}
    </div>
  );
}

export function BannerSkeleton() {
  return (
    <Skeleton className="w-full h-[110px] rounded-2xl" />
  );
}
