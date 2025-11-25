import { Skeleton } from '@/components/ui/skeleton'
import { Card } from '@/components/ui/card'

/**
 * SkeletonProfile - Skeleton pour la page profil complète
 * 
 * Structure correspondant à ProfileContent:
 * - Header avec nom/email et toggle thème
 * - Carte Niveau & XP avec barre de progression
 * - Carte Statistiques habitudes (3 colonnes)
 * - Carte Emojis avec grille 6 colonnes
 */
export function SkeletonProfile() {
  return (
    <div className="min-h-screen bg-background-100 pb-20">
      {/* Header */}
      <header className="bg-background-200 border-b border-background-500 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <Skeleton className="h-8 w-32 bg-background-400" />
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="space-y-6">
          {/* Header avec nom et toggle thème */}
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              {/* Nom */}
              <Skeleton className="h-8 w-40 bg-background-400" />
              {/* Email */}
              <Skeleton className="h-4 w-56 bg-background-400" />
            </div>
            {/* Toggle thème */}
            <Skeleton className="h-10 w-10 rounded-md bg-background-400" />
          </div>

          {/* Carte Niveau & XP */}
          <Card className="p-6 space-y-4 bg-background-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Icône Trophy */}
                <Skeleton className="h-12 w-12 rounded-full bg-background-400" />
                <div className="space-y-2">
                  {/* Label "Niveau" */}
                  <Skeleton className="h-4 w-16 bg-background-400" />
                  {/* Numéro niveau */}
                  <Skeleton className="h-10 w-12 bg-background-400" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-right space-y-2">
                  {/* Label "Prochain niveau" */}
                  <Skeleton className="h-4 w-32 bg-background-400" />
                  {/* XP restant */}
                  <Skeleton className="h-6 w-16 bg-background-400" />
                </div>
                <Skeleton className="h-5 w-5 bg-background-400" />
              </div>
            </div>

            {/* Barre de progression */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-24 bg-background-400" />
                <Skeleton className="h-4 w-12 bg-background-400" />
              </div>
              <Skeleton className="h-3 w-full rounded-full bg-background-400" />
            </div>
          </Card>

          {/* Statistiques Habitudes */}
          <Card className="p-6 space-y-4 bg-background-300">
            <Skeleton className="h-6 w-32 bg-background-400" />
            <div className="grid grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="text-center space-y-2">
                  <Skeleton className="h-8 w-12 mx-auto bg-background-400" />
                  <Skeleton className="h-4 w-20 mx-auto bg-background-400" />
                </div>
              ))}
            </div>
          </Card>

          {/* Carte Emojis */}
          <Card className="p-6 space-y-4 bg-background-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-5 bg-background-400" />
                <Skeleton className="h-6 w-20 bg-background-400" />
              </div>
              <Skeleton className="h-4 w-32 bg-background-400" />
            </div>

            {/* Barre de progression emojis */}
            <Skeleton className="h-2 w-full rounded-full bg-background-400" />

            {/* Grille d'emojis (6 colonnes × 9 lignes = 54 emojis) */}
            <div className="grid grid-cols-6 gap-3">
              {Array.from({ length: 54 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded-lg bg-background-400" />
              ))}
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}
