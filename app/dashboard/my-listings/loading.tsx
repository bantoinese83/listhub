import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"
import DashboardNav from "@/components/dashboard-nav"

export default function Loading() {
  return (
    <div className="container py-10">
      <div className="flex items-center justify-between mb-6">
        <Skeleton className="h-10 w-48" />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-4 md:gap-8">
        <div className="md:col-span-1">
          <DashboardNav />
        </div>

        <div className="md:col-span-3">
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 justify-between">
              <Skeleton className="h-10 w-full md:w-1/2" />
              <div className="flex gap-2">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-32" />
              </div>
            </div>

            <Skeleton className="h-10 w-full" />

            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    <Skeleton className="h-48 md:h-auto md:w-48 flex-shrink-0" />

                    <CardContent className="flex-1 p-4 md:p-6">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div className="space-y-2">
                          <Skeleton className="h-6 w-48" />
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-5 w-24" />
                          <Skeleton className="h-4 w-20" />
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <Skeleton className="h-9 w-20" />
                          <Skeleton className="h-9 w-20" />
                          <Skeleton className="h-9 w-24" />
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

