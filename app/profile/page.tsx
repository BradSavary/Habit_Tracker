import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { BottomNav } from '@/components/navigation/BottomNav'
import { PageHeader } from '@/components/navigation/PageHeader'
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
          frequency: true,
        },
      },
    },
  })

  if (!user) {
    redirect('/login')
  }

  // Compter les habitudes par fréquence
  const dailyHabits = user.habits.filter(h => h.frequency === 'daily').length
  const weeklyHabits = user.habits.filter(h => h.frequency === 'weekly').length
  const monthlyHabits = user.habits.filter(h => h.frequency === 'monthly').length

  return (
    <div className="min-h-screen bg-background-100 pb-20">
      <PageHeader title="Profil" />

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
            dailyHabits,
            weeklyHabits,
            monthlyHabits,
          }}
        />
      </main>

      <BottomNav />
    </div>
  )
}
