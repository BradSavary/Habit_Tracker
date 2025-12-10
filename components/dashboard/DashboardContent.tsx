'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { HabitCard } from '@/components/habits/HabitCard'
import { HabitWithCompletions } from '@/lib/habits-utils'
import { toggleHabitCompletion } from '@/lib/actions/habits'
import { toast } from 'sonner'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

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
  completedToday: HabitWithCompletions[]
  completedPreviously: HabitWithCompletions[]
  userId: string
}

export function DashboardContent({ todayHabits, otherHabits, completedToday, completedPreviously, userId }: DashboardContentProps) {
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

  // Fonction pour rendre une liste d'habitudes
  const renderHabitsList = (habits: HabitWithCompletions[]) => {
    if (habits.length === 0) {
      return (
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
            Aucune habitude
          </h3>
          <p className="text-foreground-400">
            Aucune habitude dans cette catégorie pour le moment.
          </p>
        </motion.div>
      )
    }

    return (
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
        {habits.map((habit) => (
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
    )
  }

  // Si aucune habitude du tout
  if (todayHabits.length === 0 && otherHabits.length === 0 && completedToday.length === 0 && completedPreviously.length === 0) {
    return (
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
    )
  }

  return (
    <Tabs defaultValue="today" className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-6">
        <TabsTrigger value="today">Aujourd&apos;hui</TabsTrigger>
        <TabsTrigger value="completed">Complétées</TabsTrigger>
        <TabsTrigger value="others">Autres</TabsTrigger>
      </TabsList>

      <TabsContent value="today" className="mt-0">
        <p className="text-sm text-foreground-400 mb-4 text-center">
          Habitudes à faire aujourd&apos;hui
        </p>
        {renderHabitsList(todayHabits)}
      </TabsContent>

      <TabsContent value="completed" className="mt-0">
        <p className="text-sm text-foreground-400 mb-4 text-center">
          Habitudes complétées à 100% sur leur période
        </p>
        
        {/* Sous-section: Complétées aujourd'hui */}
        {completedToday.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-foreground-700 mb-3">
              Aujourd&apos;hui
            </h3>
            {renderHabitsList(completedToday)}
          </div>
        )}

        {/* Sous-section: Complétées précédemment */}
        {completedPreviously.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-foreground-700 mb-3">
              Complétées précédemment
            </h3>
            {renderHabitsList(completedPreviously)}
          </div>
        )}

        {/* Empty state si aucune habitude complétée */}
        {completedToday.length === 0 && completedPreviously.length === 0 && (
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
              Aucune habitude complétée
            </h3>
            <p className="text-foreground-400">
              Les habitudes complétées à 100% apparaîtront ici.
            </p>
          </motion.div>
        )}
      </TabsContent>

      <TabsContent value="others" className="mt-0">
        <p className="text-sm text-foreground-400 mb-4 text-center">
          Habitudes non prévues pour aujourd&apos;hui
        </p>
        {renderHabitsList(otherHabits)}
      </TabsContent>
    </Tabs>
  )
}
