import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { SkeletonStat } from '../base'

interface SkeletonStatCardProps {
  statsCount?: number
  className?: string
}

/**
 * SkeletonStatCard - Skeleton pour une carte de statistiques
 * Utilisé dans ProfileContent (niveau, XP, habitudes, etc.)
 */
export function SkeletonStatCard({ statsCount = 4, className }: SkeletonStatCardProps) {
  return (
    <div className={cn('rounded-lg bg-background-300 p-6 space-y-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="flex-1 ml-4 space-y-2">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-3 w-48" />
        </div>
      </div>

      {/* Stats Grid */}
      <div className={cn(
        'grid gap-4',
        statsCount === 3 ? 'grid-cols-3' : 'grid-cols-2 sm:grid-cols-4'
      )}>
        {Array.from({ length: statsCount }).map((_, i) => (
          <SkeletonStat key={i} />
        ))}
      </div>
    </div>
  )
}
