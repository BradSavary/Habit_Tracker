import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { getHabits } from '@/lib/actions/habits'
import { groupHabits } from '@/lib/habits-utils'
import { BottomNav } from '@/components/navigation/BottomNav'
import { DashboardContent } from '@/components/dashboard/DashboardContent'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

/**
 * Dashboard Page - Vue principale de l'application
 * 
 * Server Component:
 * - Fetch des habitudes depuis la BDD
 * - Protection de la route (authentification)
 * - Groupement des habitudes (Aujourd'hui vs Autres)
 */

export default async function DashboardPage() {
  // Vérifier l'authentification
  const session = await auth()
  if (!session?.user?.id) {
    redirect('/login')
  }

  // Récupérer les habitudes de l'utilisateur
  const { habits } = await getHabits(session.user.id)

  // Grouper les habitudes
  const { todayHabits, otherHabits } = groupHabits(habits || [])

  return (
    <div className="min-h-screen bg-background-100 pb-20">
      {/* Header */}
      <header className="bg-background-200 border-b border-background-500 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground-800">
                Mes Habitudes
              </h1>
              <p className="text-sm text-foreground-400">
                {new Date().toLocaleDateString('fr-FR', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                })}
              </p>
            </div>

            {/* Bouton créer une habitude */}
            <Link href="/habits/create">
              <Button className="bg-[var(--accent-purple)] hover:bg-[var(--accent-purple)] hover:opacity-90">
                <Plus className="h-4 w-4 mr-2" />
                Créer
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-6">
        <Suspense fallback={<div>Chargement...</div>}>
          <DashboardContent
            todayHabits={todayHabits}
            otherHabits={otherHabits}
            userId={session.user.id}
          />
        </Suspense>
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  )
}
