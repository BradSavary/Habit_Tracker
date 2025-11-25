import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

interface SkeletonStatProps {
  className?: string
}

/**
 * SkeletonStat - Skeleton pour une statistique (nombre + label)
 * Utilisé dans ProfileContent, ProgressionContent, etc.
 */
export function SkeletonStat({ className }: SkeletonStatProps) {
  return (
    <div className={cn('flex flex-col items-center gap-1', className)}>
      <Skeleton className="h-8 w-16" /> {/* Nombre */}
      <Skeleton className="h-3 w-20" /> {/* Label */}
    </div>
  )
}
