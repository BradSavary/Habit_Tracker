import { Skeleton } from '@/components/ui/skeleton'
import { Card } from '@/components/ui/card'
import { SkeletonText } from '../base/SkeletonText'
import { SkeletonStat } from '../base/SkeletonStat'

/**
 * Skeleton pour la page Statistiques
 * 
 * Structure:
 * - Header avec titre
 * - Carte de stats générales (3 statistiques)
 * - Placeholder pour graphiques futurs
 */
export function SkeletonStats() {
  return (
    <div className="min-h-screen bg-background-100 pb-20">
      {/* Header */}
      <header className="bg-background-200 border-b border-background-500 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <Skeleton className="h-8 w-40 bg-background-400" />
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Carte de stats générales */}
        <Card className="bg-background-300">
          <div className="p-4 space-y-4">
            <SkeletonText lines={1} className="w-32" />
            <div className="grid grid-cols-3 gap-4">
              <SkeletonStat />
              <SkeletonStat />
              <SkeletonStat />
            </div>
          </div>
        </Card>

        {/* Placeholder graphiques */}
        <Card className="bg-background-300">
          <div className="p-6 space-y-4">
            <SkeletonText lines={1} className="w-48" />
            <div className="space-y-2">
              <Skeleton className="h-40 w-full bg-background-400 rounded-lg" />
            </div>
          </div>
        </Card>

        {/* Carte secondaire */}
        <Card className="bg-background-300">
          <div className="p-6 space-y-4">
            <SkeletonText lines={1} className="w-48" />
            <div className="space-y-2">
              <Skeleton className="h-32 w-full bg-background-400 rounded-lg" />
            </div>
          </div>
        </Card>
      </main>
    </div>
  )
}
