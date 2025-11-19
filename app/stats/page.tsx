import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { BottomNav } from '@/components/navigation/BottomNav'
import { BarChart3 } from 'lucide-react'

/**
 * Stats Page - Placeholder pour les statistiques
 * 
 * À implémenter plus tard:
 * - Graphiques de progression
 * - Taux de complétion
 * - Comparaisons mensuelles
 */

export default async function StatsPage() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-background-100 pb-20">
      {/* Header */}
      <header className="bg-background-200 border-b border-background-500 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-foreground-800">
            Statistiques
          </h1>
        </div>
      </header>

      {/* Placeholder Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <BarChart3 className="h-24 w-24 text-foreground-300 mb-6" />
          <h2 className="text-2xl font-bold text-foreground-700 mb-2">
            Page à venir
          </h2>
          <p className="text-foreground-400 max-w-md">
            Les statistiques détaillées seront bientôt disponibles. Vous pourrez
            visualiser vos progrès, vos streaks et bien plus !
          </p>
        </div>
      </main>

      <BottomNav />
    </div>
  )
}
