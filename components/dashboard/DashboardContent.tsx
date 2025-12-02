'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { HabitCard } from '@/components/habits/HabitCard'
import { HabitWithCompletions } from '@/lib/habits-utils'
import { toggleHabitCompletion } from '@/lib/actions/habits'
import { toast } from 'sonner'
import { Separator } from '@/components/ui/separator'

/**
 * DashboardContent - Affichage du contenu du dashboard
 * 
 * Justification 'use client':
 * - Gère les interactions utilisateur (toggle completion, navigation)
 * - Utilise useTransition pour les updates optimistes
 * - Affiche les toasts de feedback
 */

interface DashboardContentProps {
  todayHabits: HabitWithCompletions[]
  otherHabits: HabitWithCompletions[]
  userId: string
}

export function DashboardContent({ todayHabits, otherHabits, userId }: DashboardContentProps) {
  const router = useRouter()
  const [, startTransition] = useTransition()
  const [loadingHabitId, setLoadingHabitId] = useState<string | null>(null)

  const handleToggleComplete = async (habitId: string, habitName: string) => {
    setLoadingHabitId(habitId)
    startTransition(async () => {
      const result = await toggleHabitCompletion(habitId, userId)

      // Toujours retirer le loading après la réponse
      setLoadingHabitId(null)

      if (result.success) {
        // Forcer le refresh des données du serveur
        router.refresh()

        if (result.completed) {
          // Vérifier si level up
          if (result.levelUp) {
            // Toast spécial level up
            toast.success(
              `🎉 NIVEAU ${result.levelUp.newLevel} ATTEINT !`,
              {
                description: result.levelUp.unlockedEmoji
                  ? `${result.levelUp.unlockedEmoji.emoji} ${result.levelUp.unlockedEmoji.name} débloqué ! (+${result.xpGained} XP)`
                  : `Bravo ! Tu as monté de niveau ! (+${result.xpGained} XP)`,
                duration: 6000,
              }
            )
          } else if (result.xpGained) {
            // Toast normal avec XP
            toast.success(`✅ ${habitName} complétée !`, {
              description: `Continue comme ça ! +${result.xpGained} XP 🎉`,
            })
          } else {
            // Fallback sans XP
            toast.success(`✅ ${habitName} complétée !`, {
              description: 'Continue comme ça ! 🎉',
            })
          }
        } else {
          toast.info(`↩️ ${habitName} marquée comme non complétée`)
        }
      } else {
        toast.error('Erreur', {
          description: result.error || 'Impossible de mettre à jour l&apos;habitude',
        })
      }
    })
  }

  const handleOpenHabit = (habitId: string) => {
    router.push(`/habits/${habitId}`)
  }

  return (
    <div className="space-y-6">
      {/* Section: Aujourd'hui */}
      {todayHabits.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="mb-4">
            <h2 className="text-xl font-bold text-foreground-800">
              Aujourd&apos;hui
            </h2>
            <p className="text-sm text-foreground-400">
              {todayHabits.length} habitude{todayHabits.length > 1 ? 's' : ''} restante{todayHabits.length > 1 ? 's' : ''} aujourd&apos;hui
            </p>
          </div>

          <motion.div 
            className="space-y-3"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
            initial="hidden"
            animate="show"
          >
            {todayHabits.map((habit, index) => (
              <motion.div
                key={habit.id}
                variants={{
                  hidden: { opacity: 0, x: -20 },
                  show: { opacity: 1, x: 0 }
                }}
              >
                <HabitCard
                  habit={habit}
                  onToggleComplete={() => handleToggleComplete(habit.id, habit.name)}
                  onOpen={() => handleOpenHabit(habit.id)}
                  isLoading={loadingHabitId === habit.id}
                />
              </motion.div>
            ))}
          </motion.div>
        </motion.section>
      )}

      {/* Separator si les deux sections existent */}
      {todayHabits.length > 0 && otherHabits.length > 0 && (
        <Separator className="my-6" />
      )}

      {/* Section: Autres habitudes */}
      {otherHabits.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="mb-4">
            <h2 className="text-xl font-bold text-foreground-800">
              Autres habitudes
            </h2>
            <p className="text-sm text-foreground-400">
              {otherHabits.length} habitude{otherHabits.length > 1 ? 's' : ''}
            </p>
          </div>

          <motion.div 
            className="space-y-3"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
            initial="hidden"
            animate="show"
          >
            {otherHabits.map((habit, index) => (
              <motion.div
                key={habit.id}
                variants={{
                  hidden: { opacity: 0, x: -20 },
                  show: { opacity: 1, x: 0 }
                }}
              >
                <HabitCard
                  habit={habit}
                  onToggleComplete={() => handleToggleComplete(habit.id, habit.name)}
                  onOpen={() => handleOpenHabit(habit.id)}
                  isLoading={loadingHabitId === habit.id}
                />
              </motion.div>
            ))}
          </motion.div>
        </motion.section>
      )}

      {/* Empty state */}
      {todayHabits.length === 0 && otherHabits.length === 0 && (
        <motion.div 
          className="flex flex-col items-center justify-center py-12 text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <motion.div 
            className="text-6xl mb-4"
            animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            🎯
          </motion.div>
          <h3 className="text-xl font-semibold text-foreground-700 mb-2">
            Aucune habitude pour le moment
          </h3>
          <p className="text-foreground-400 mb-6">
            Créez votre première habitude pour commencer !
          </p>
        </motion.div>
      )}
    </div>
  )
}
