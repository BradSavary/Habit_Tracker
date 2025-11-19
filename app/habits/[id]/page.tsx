import { redirect, notFound } from 'next/navigation'
import { auth } from '@/lib/auth'
import { getHabitById } from '@/lib/actions/habits'
import { HabitDetailContent } from '@/components/habits/HabitDetailContent'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

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

  return (
    <div className="min-h-screen bg-background-100 pb-20">
      {/* Header */}
      <header className="bg-background-200 border-b border-background-500 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon">
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-3 flex-1">
              <div 
                className="text-3xl"
                style={{ fontFamily: '"Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif' }}
              >
                {result.habit.emoji || '✨'}
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground-800">
                  {result.habit.name}
                </h1>
                {result.habit.category && (
                  <p className="text-sm text-foreground-400">{result.habit.category}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-6">
        <HabitDetailContent habit={result.habit} userId={session.user.id} />
      </main>
    </div>
  )
}
