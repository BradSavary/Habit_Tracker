import { Skeleton } from '@/components/ui/skeleton'
import { SkeletonProgressionTimeline } from '../composed'

/**
 * SkeletonProgression - Skeleton pour la page de progression complète
 * Affiche le header compact + timeline des niveaux
 */
export function SkeletonProgression() {
  return (
    <div className="container mx-auto px-4 py-6 space-y-6 max-w-2xl">
      {/* Header sticky */}
      <div className="sticky top-0 z-10 bg-background-100 pb-4 border-b border-background-500">
        <div className="rounded-lg bg-background-300 p-4">
          <div className="flex items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-2 w-full rounded-full" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        </div>
      </div>

      {/* Timeline de progression */}
      <SkeletonProgressionTimeline levelsCount={10} />
    </div>
  )
}
