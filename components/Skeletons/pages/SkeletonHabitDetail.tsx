import { Skeleton } from '@/components/ui/skeleton'
import { SkeletonText, SkeletonButton } from '../base'

/**
 * SkeletonHabitDetail - Skeleton pour la page de détail d'habitude
 * Affiche le header avec emoji + info + stats + historique
 */
export function SkeletonHabitDetail() {
  return (
    <div className="container mx-auto px-4 py-6 space-y-6 max-w-2xl">
      {/* Header avec emoji et titre */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Skeleton className="h-16 w-16 rounded-lg" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>

        {/* Badges (catégorie, fréquence) */}
        <div className="flex gap-2">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Skeleton className="h-5 w-28" />
        <SkeletonText lines={2} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-lg bg-background-300 p-4 space-y-2">
            <Skeleton className="h-8 w-12 mx-auto" />
            <Skeleton className="h-3 w-20 mx-auto" />
          </div>
        ))}
      </div>

      {/* Historique récent */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-40" />
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-background-300">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-5 w-5 rounded-full" />
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t border-background-500">
        <SkeletonButton variant="outline" className="flex-1" />
        <SkeletonButton variant="default" className="flex-1" />
      </div>
    </div>
  )
}
