import { redirect, notFound } from 'next/navigation'
import { auth } from '@/lib/auth'
import { getHabitById } from '@/lib/actions/habits'
import { EditHabitForm } from '@/components/habits/EditHabitForm'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
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
      {/* Header */}
      <header className="bg-background-200 border-b border-background-500 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href={`/habits/${id}`}>
              <Button variant="ghost" size="icon">
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold text-foreground-800">
              Modifier l&apos;habitude
            </h1>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-6">
        <EditHabitForm habit={habit} userId={session.user.id} />
      </main>
    </div>
  )
}
