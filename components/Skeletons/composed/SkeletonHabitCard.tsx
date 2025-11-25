import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

interface SkeletonHabitCardProps {
  variant?: 'daily' | 'weekly' | 'monthly'
  className?: string
}

/**
 * SkeletonHabitCard - Skeleton pour une HabitCard
 * Adapte l'affichage selon la fréquence de l'habitude
 */
export function SkeletonHabitCard({ variant = 'daily', className }: SkeletonHabitCardProps) {
  return (
    <div className={cn('rounded-lg bg-background-300 p-4 space-y-3', className)}>
      <div className="flex items-center justify-between">
        {/* Gauche : Emoji + Info */}
        <div className="flex items-center gap-3 flex-1">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>

        {/* Droite : Streak + Action */}
        <div className="flex items-center gap-3">
          <Skeleton className="h-5 w-8" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>

      {/* Contenu spécifique selon variant */}
      {variant === 'weekly' && (
        <div className="space-y-2">
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 7 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-full rounded-lg" />
            ))}
          </div>
          <Skeleton className="h-2 w-full rounded-full" />
        </div>
      )}

      {variant === 'monthly' && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-12" />
          </div>
          <Skeleton className="h-2 w-full rounded-full" />
        </div>
      )}
    </div>
  )
}
