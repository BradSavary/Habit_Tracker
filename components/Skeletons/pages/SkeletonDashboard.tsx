import { Skeleton } from '@/components/ui/skeleton'
import { SkeletonHabitCard } from '../composed'
import { Separator } from '@/components/ui/separator'

/**
 * SkeletonDashboard - Skeleton pour la page dashboard complète
 * 
 * Structure correspondant exactement à DashboardPage:
 * - Header sticky avec titre, date, et bouton "Créer"
 * - Section "Aujourd'hui" avec titre et habitudes
 * - Séparateur
 * - Section "Autres habitudes"
 * - Bottom navigation (espace réservé)
 */
export function SkeletonDashboard() {
  return (
    <div className="min-h-screen bg-background-100 pb-20">
      {/* Header */}
      <header className="bg-background-200 border-b border-background-500 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              {/* Titre "Mes Habitudes" */}
              <Skeleton className="h-8 w-40 bg-background-400" />
              {/* Date "lundi 25 novembre" */}
              <Skeleton className="h-4 w-56 bg-background-400" />
            </div>

            {/* Bouton "Créer" */}
            <Skeleton className="h-10 w-24 rounded-md bg-background-400" />
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="space-y-6">
          {/* Section: Aujourd'hui */}
          <section>
            <div className="mb-4">
              {/* Titre section */}
              <Skeleton className="h-6 w-32 mb-2 bg-background-400" />
              {/* Description "3 habitudes restantes" */}
              <Skeleton className="h-4 w-48 bg-background-400" />
            </div>

            {/* Liste d'habitudes du jour */}
            <div className="space-y-3">
              <SkeletonHabitCard variant="daily" />
              <SkeletonHabitCard variant="weekly" />
              <SkeletonHabitCard variant="daily" />
            </div>
          </section>

          {/* Separator */}
          <Separator className="my-6" />

          {/* Section: Autres habitudes */}
          <section>
            <div className="mb-4">
              {/* Titre section */}
              <Skeleton className="h-6 w-40 mb-2 bg-background-400" />
              {/* Description "2 habitudes" */}
              <Skeleton className="h-4 w-32 bg-background-400" />
            </div>

            {/* Liste autres habitudes */}
            <div className="space-y-3">
              <SkeletonHabitCard variant="monthly" />
              <SkeletonHabitCard variant="weekly" />
            </div>
          </section>
        </div>
      </main>

      {/* Espace pour Bottom Navigation (non visible mais présent pour layout) */}
    </div>
  )
}
