import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

interface SkeletonCardProps {
  className?: string
}

/**
 * SkeletonCard - Skeleton de base pour une carte
 * Utilisé pour simuler le chargement d'une HabitCard ou autre contenu en carte
 */
export function SkeletonCard({ className }: SkeletonCardProps) {
  return (
    <div className={cn('rounded-lg bg-background-300 p-4 space-y-3', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          {/* Emoji placeholder */}
          <Skeleton className="h-10 w-10 rounded-full" />
          
          {/* Texte placeholder */}
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>

        {/* Action placeholder */}
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
    </div>
  )
}
