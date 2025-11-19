import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { getMoodEntries } from '@/lib/actions/mood'
import { BottomNav } from '@/components/navigation/BottomNav'
import { MoodContent } from '@/components/mood/MoodContent'

/**
 * Mood Page - Suivi de l'humeur quotidienne
 * 
 * Server Component:
 * - Fetch des moods du mois en cours
 * - Protection de la route (authentification)
 */

export default async function MoodPage() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect('/login')
  }

  // Récupérer les moods du mois en cours
  const today = new Date()
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)

  const { moods } = await getMoodEntries(session.user.id, startOfMonth, endOfMonth)

  return (
    <div className="min-h-screen bg-background-100 pb-20">
      {/* Header */}
      <header className="bg-background-200 border-b border-background-500 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-foreground-800">
            Mon Humeur
          </h1>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-6">
        <Suspense fallback={<div>Chargement...</div>}>
          <MoodContent userId={session.user.id} initialMoods={moods || []} />
        </Suspense>
      </main>

      <BottomNav />
    </div>
  )
}
