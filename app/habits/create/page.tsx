import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { CreateHabitForm } from '@/components/habits/CreateHabitForm'
import { PageHeader } from '@/components/navigation/PageHeader'
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
      <PageHeader 
        title="Nouvelle habitude"
        subtitle="Créez une nouvelle habitude"
        backHref="/dashboard"
      />

      {/* Form */}
      <main className="container mx-auto px-4 py-6 pb-20">
        <CreateHabitForm userId={session.user.id} userLevel={user?.level || 1} />
      </main>
    </div>
  )
}
