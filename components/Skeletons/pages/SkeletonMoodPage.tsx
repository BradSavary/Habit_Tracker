import { Skeleton } from '@/components/ui/skeleton'
import { SkeletonMoodCalendar } from '../composed'

/**
 * SkeletonMoodPage - Skeleton pour la page mood complète
 * Affiche le header + calendrier d'humeur
 */
export function SkeletonMoodPage() {
  return (
    <div className="container mx-auto px-4 py-6 space-y-6 max-w-2xl">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-4 w-64" />
      </div>

      {/* Calendrier d'humeur */}
      <SkeletonMoodCalendar />

      {/* Section statistiques (optionnelle) */}
      <div className="grid grid-cols-2 gap-4 pt-6">
        <div className="rounded-lg bg-background-300 p-4 space-y-2">
          <Skeleton className="h-6 w-16 mx-auto" />
          <Skeleton className="h-3 w-24 mx-auto" />
        </div>
        <div className="rounded-lg bg-background-300 p-4 space-y-2">
          <Skeleton className="h-6 w-16 mx-auto" />
          <Skeleton className="h-3 w-24 mx-auto" />
        </div>
      </div>
    </div>
  )
}
