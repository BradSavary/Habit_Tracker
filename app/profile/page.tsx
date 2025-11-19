import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { BottomNav } from '@/components/navigation/BottomNav'
import { ProfileContent } from '@/components/profile/ProfileContent'
import prisma from '@/lib/prisma'

/**
 * Profile Page - Page de profil utilisateur
 * 
 * Server Component:
 * - Vérifie l'authentification
 * - Fetch données utilisateur (level, xp, stats)
 * - Render le contenu profil
 */

export default async function ProfilePage() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect('/login')
  }

  // Récupérer les données utilisateur
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      email: true,
      level: true,
      xp: true,
      habits: {
        select: {
          completions: {
            select: { completedAt: true },
          },
        },
      },
    },
  })

  if (!user) {
    redirect('/login')
  }

  // Compter les complétions totales
  const totalCompletions = user.habits.reduce(
    (sum, habit) => sum + habit.completions.length,
    0
  )

  return (
    <div className="min-h-screen bg-background-100 pb-20">
      {/* Header */}
      <header className="bg-background-200 border-b border-background-500 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-foreground-800">
            Profil
          </h1>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-6">
        <ProfileContent
          user={{
            name: user.name || 'Utilisateur',
            email: user.email,
            level: user.level,
            xp: user.xp,
          }}
          stats={{
            totalHabits: user.habits.length,
            totalCompletions,
          }}
        />
      </main>

      <BottomNav />
    </div>
  )
}
