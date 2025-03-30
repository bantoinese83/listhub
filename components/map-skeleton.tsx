import { Skeleton } from "@/components/ui/skeleton"

export default function MapSkeleton() {
  return (
    <div className="relative h-full w-full bg-muted/50">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <Skeleton className="h-10 w-10 rounded-full mx-auto mb-4" />
          <Skeleton className="h-6 w-32 mx-auto mb-2" />
          <Skeleton className="h-4 w-48 mx-auto" />
        </div>
      </div>
    </div>
  )
}

