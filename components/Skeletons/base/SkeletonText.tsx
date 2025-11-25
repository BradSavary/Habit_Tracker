import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

interface SkeletonTextProps {
  lines?: number
  className?: string
}

/**
 * SkeletonText - Skeleton pour lignes de texte
 * Simule des paragraphes ou du contenu textuel en chargement
 */
export function SkeletonText({ lines = 3, className }: SkeletonTextProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          className={cn(
            'h-4',
            index === lines - 1 ? 'w-2/3' : 'w-full' // Dernière ligne plus courte
          )}
        />
      ))}
    </div>
  )
}
