import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { ProgressionContent } from '@/components/profile/ProgressionContent'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
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
      {/* Header */}
      <header className="bg-background-200 border-b border-background-500 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/profile">
              <Button variant="ghost" size="icon">
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-foreground-800">
              Progression
            </h1>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-6">
        <ProgressionContent level={user.level} xp={user.xp} />
      </main>
    </div>
  )
}
