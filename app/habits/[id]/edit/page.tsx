import { redirect, notFound } from 'next/navigation'
import { auth } from '@/lib/auth'
import { getHabitById } from '@/lib/actions/habits'
import { EditHabitForm } from '@/components/habits/EditHabitForm'
import { PageHeader } from '@/components/navigation/PageHeader'
import { Habit } from '@prisma/client'

/**
 * Page d'édition d'une habitude
 * 
 * Server Component:
 * - Vérifie l'authentification
 * - Fetch l'habitude à éditer
 * - Render le formulaire d'édition
 */

export default async function EditHabitPage({
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

  const habit = result.habit as unknown as Habit

  return (
    <div className="min-h-screen bg-background-100 pb-20">
      <PageHeader
        title="Modifier l'habitude"
        backHref={`/habits/${id}`}
      />

      {/* Content */}
      <main className="container mx-auto px-4 py-6">
        <EditHabitForm habit={habit} userId={session.user.id} />
      </main>
    </div>
  )
}
