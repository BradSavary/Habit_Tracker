import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { CreateHabitForm } from '@/components/habits/CreateHabitForm'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import prisma from '@/lib/prisma'

/**
 * Page de création d'une habitude
 * 
 * Server Component:
 * - Vérifie l'authentification
 * - Render le formulaire client-side
 */

export default async function CreateHabitPage() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect('/login')
  }

  // Récupérer le niveau de l'utilisateur pour l'emoji picker
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { level: true },
  })

  return (
    <div className="min-h-screen bg-background-100">
      {/* Header */}
      <header className="bg-background-200 border-b border-background-500 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon">
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-foreground-800">
                Nouvelle habitude
              </h1>
              <p className="text-sm text-foreground-400">
                Créez une habitude pour atteindre vos objectifs
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Form */}
      <main className="container mx-auto px-4 py-6 pb-20">
        <CreateHabitForm userId={session.user.id} userLevel={user?.level || 1} />
      </main>
    </div>
  )
}
