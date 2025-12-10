import { redirect, notFound } from 'next/navigation'
import { auth } from '@/lib/auth'
import { getHabitById } from '@/lib/actions/habits'
import { HabitDetailContent } from '@/components/habits/HabitDetailContent'
import { BottomNav } from '@/components/navigation/BottomNav'
import { PageHeader } from '@/components/navigation/PageHeader'
import { Habit, HabitCompletion } from '@prisma/client'

/**
 * Page de détail d'une habitude
 * 
 * Server Component:
 * - Vérifie l'authentification
 * - Fetch les détails de l'habitude
 * - Render le contenu détaillé
 */

export default async function HabitDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()
  if (!session?.user?.id) {
    redirect('/login')
  }

  // Await params avant de l'utiliser (Next.js 15)
  const { id } = await params

  // Récupérer l'habitude
  const result = await getHabitById(id, session.user.id)

  if (!result.success || !result.habit) {
    notFound()
  }

  // Cast du type pour inclure tous les champs du modèle Habit
  const habit = result.habit as unknown as Habit & { completions: HabitCompletion[] }

  return (
    <div className="min-h-screen bg-background-100 pb-20">
      <PageHeader 
        title={
          <div className="flex items-center gap-3">
            <div 
              className="text-3xl"
              style={{ fontFamily: '"Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif' }}
            >
              {habit.emoji || '✨'}
            </div>
            <span>{habit.name}</span>
          </div>
        }
        subtitle={habit.category}
        backHref="/dashboard"
      />

      {/* Content */}
      <main className="container mx-auto px-4 py-6">
        <HabitDetailContent habit={habit} userId={session.user.id} />
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  )
}
