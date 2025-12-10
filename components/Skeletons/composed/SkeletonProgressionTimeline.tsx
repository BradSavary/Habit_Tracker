import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

interface SkeletonProgressionTimelineProps {
  levelsCount?: number
  className?: string
}

/**
 * SkeletonProgressionTimeline - Skeleton pour la timeline de progression
 * Simule les niveaux avec emojis et barres XP
 */
export function SkeletonProgressionTimeline({ 
  levelsCount = 10, 
  className 
}: SkeletonProgressionTimelineProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {Array.from({ length: levelsCount }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          {/* Ligne verticale */}
          <div className="w-0.5 h-16 bg-muted" />
          
          {/* Niveau */}
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-3">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
