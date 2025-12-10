import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { ProgressionContent } from '@/components/profile/ProgressionContent'
import { PageHeader } from '@/components/navigation/PageHeader'
import prisma from '@/lib/prisma'

/**
 * Progression Page - Affichage détaillé de la progression des niveaux
 * 
 * Server Component:
 * - Vérifie l'authentification
 * - Fetch niveau et XP de l'utilisateur
 * - Render le contenu de progression
 */

export default async function ProgressionPage() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect('/login')
  }

  // Récupérer les données utilisateur
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      level: true,
      xp: true,
    },
  })

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-background-100 pb-20">
      <PageHeader 
        title="Progression"
        backHref="/profile"
      />

      {/* Content */}
      <main className="container mx-auto px-4 py-6">
        <ProgressionContent level={user.level} xp={user.xp} />
      </main>
    </div>
  )
}
