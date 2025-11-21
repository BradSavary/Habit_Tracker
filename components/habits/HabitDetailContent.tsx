'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Habit, HabitCompletion } from '@prisma/client'
import {
  calculateStreak,
  isCompletedToday,
  getCompletionProgress,
  getWeekDaysLabels,
} from '@/lib/habits-utils'
import { deleteHabit, toggleHabitCompletion } from '@/lib/actions/habits'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Flame, Trash2, Edit, Check, Calendar } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { getHabitColorClass } from '@/lib/design-tokens'

/**
 * HabitDetailContent - Contenu de la page de détail d'une habitude
 * 
 * Justification 'use client':
 * - Interactions utilisateur (suppression, complétion)
 * - useRouter pour navigation
 * - Gestion des états loading
 */

interface HabitDetailContentProps {
  habit: Habit & { completions: HabitCompletion[] }
  userId: string
}

export function HabitDetailContent({ habit, userId }: HabitDetailContentProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [isDeleting, setIsDeleting] = useState(false)

  const streak = calculateStreak({
    ...habit,
    weekDays: (habit.weekDays as number[] | null) || null,
  })
  const completed = isCompletedToday({
    ...habit,
    weekDays: (habit.weekDays as number[] | null) || null,
  })
  const { current, goal, percentage } = getCompletionProgress({
    ...habit,
    weekDays: (habit.weekDays as number[] | null) || null,
  })

  const colorClass = getHabitColorClass((habit.color || 'purple') as 'purple' | 'blue' | 'green' | 'orange' | 'pink' | 'teal', 'light')

  // Calculer les stats
  const totalCompletions = habit.completions.length
  const last7DaysCompletions = habit.completions.filter((c) => {
    const completionDate = new Date(c.completedAt)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    return completionDate >= sevenDaysAgo
  }).length

  const handleToggleToday = () => {
    startTransition(async () => {
      const result = await toggleHabitCompletion(habit.id, userId)
      if (result.success) {
        if (result.completed) {
          // Vérifier si level up
          if (result.levelUp) {
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
            toast.success(`Habitude complétée ! +${result.xpGained} XP 🎉`)
          } else {
            toast.success('Habitude complétée ! 🎉')
          }
        } else {
          toast.info('Complétion annulée')
        }
      } else {
        toast.error(result.error || 'Erreur lors de la mise à jour')
      }
    })
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    const result = await deleteHabit(habit.id, userId)

    if (result.success) {
      toast.success('Habitude supprimée')
      router.push('/dashboard')
    } else {
      toast.error(result.error || 'Erreur lors de la suppression')
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Stats principales */}
      <Card className={cn('p-6', colorClass)}>
        <div className="grid grid-cols-3 gap-4">
          {/* Streak */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-[var(--accent-orange)] mb-1">
              <Flame className="h-6 w-6" />
              <span className="text-3xl font-bold">{streak}</span>
            </div>
            <p className="text-sm text-foreground-500">
              {habit.frequency === 'monthly' ? 'Mois' : 'Jours'}
            </p>
          </div>

          {/* Total */}
          <div className="text-center">
            <div className="text-3xl font-bold text-foreground-800 mb-1">
              {totalCompletions}
            </div>
            <p className="text-sm text-foreground-500">Total</p>
          </div>

          {/* 7 derniers jours */}
          <div className="text-center">
            <div className="text-3xl font-bold text-foreground-800 mb-1">
              {last7DaysCompletions}
            </div>
            <p className="text-sm text-foreground-500">Cette semaine</p>
          </div>
        </div>
      </Card>

      {/* Visualisation des complétions (si daily) */}
      {habit.frequency === 'daily' && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground-800">Historique</h3>
            <Calendar className="h-5 w-5 text-foreground-400" />
          </div>
          
          <div className="w-full overflow-x-auto">
            <div className="min-w-max space-y-2">
              {/* Légende des jours */}
              <div className="grid grid-cols-7 gap-1.5 place-items-center mb-3">
                {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, i) => (
                  <div key={i} className="text-[10px] text-foreground-400 font-medium w-3 text-center">
                    {day}
                  </div>
                ))}
              </div>
              
              {/* Grille de points */}
              <div className="grid grid-cols-7 gap-1.5 place-items-center">
                {(() => {
                  const today = new Date()
                  today.setHours(0, 0, 0, 0)
                  
                  const startDate = new Date(today)
                  startDate.setDate(startDate.getDate() - 90)
                  
                  const dayOfWeek = startDate.getDay()
                  const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1
                  startDate.setDate(startDate.getDate() - daysToMonday)
                  
                  const days = []
                  const currentDate = new Date(startDate)
                  
                  while (currentDate <= today) {
                    days.push(new Date(currentDate))
                    currentDate.setDate(currentDate.getDate() + 1)
                  }
                  
                  const completionDates = new Set(
                    habit.completions.map(c => {
                      const d = new Date(c.completedAt)
                      d.setHours(0, 0, 0, 0)
                      return d.getTime()
                    })
                  )
                  
                  return days.map((date, index) => {
                    const isCompleted = completionDates.has(date.getTime())
                    const isToday = date.getTime() === today.getTime()
                    const isFuture = date > today
                    
                    return (
                      <div
                        key={index}
                        className={cn(
                          'w-3 h-3 rounded-[2px] transition-colors',
                          isCompleted && 'bg-primary',
                          !isCompleted && !isFuture && 'bg-muted',
                          isFuture && 'bg-background-200',
                          isToday && 'ring-1 ring-primary ring-offset-1'
                        )}
                        title={date.toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      />
                    )
                  })
                })()}
              </div>
              
              {/* Légende */}
              <div className="flex items-center gap-4 text-[10px] text-foreground-400 mt-4 pt-3 border-t border-background-300">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-[2px] bg-primary" />
                  <span>Complété</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-[2px] bg-muted" />
                  <span>Manqué</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-[2px] ring-1 ring-primary ring-offset-1" />
                  <span>Aujourd&apos;hui</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Progression (si monthly) */}
      {habit.frequency === 'monthly' && (
        <Card className="p-6">
          <h3 className="font-semibold text-foreground-800 mb-4">
            Progression ce mois
          </h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-foreground-600">
                {current}/{goal} fois
              </span>
              <span className="text-foreground-600">{Math.round(percentage)}%</span>
            </div>
            <Progress value={percentage} className="h-3" />
          </div>
          {current >= goal && (
            <Badge className="mt-3 bg-[var(--success)] text-background-100">
              Objectif atteint ! 🎉
            </Badge>
          )}
        </Card>
      )}

      {/* Infos */}
      <Card className="p-6">
        <h3 className="font-semibold text-foreground-800 mb-4">Informations</h3>
        <div className="space-y-3">
          <div>
            <p className="text-sm text-foreground-500">Fréquence</p>
            <p className="text-foreground-800">
              {habit.frequency === 'daily' && 'Quotidienne'}
              {habit.frequency === 'weekly' && `Hebdomadaire - ${getWeekDaysLabels(habit.weekDays as number[] | null)}`}
              {habit.frequency === 'monthly' && `Mensuelle - ${habit.monthlyGoal} fois par mois`}
            </p>
          </div>

          {habit.description && (
            <>
              <Separator />
              <div>
                <p className="text-sm text-foreground-500">Description</p>
                <p className="text-foreground-800">{habit.description}</p>
              </div>
            </>
          )}

          <Separator />
          <div>
            <p className="text-sm text-foreground-500">Créée le</p>
            <p className="text-foreground-800">
              {new Date(habit.createdAt).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>
        </div>
      </Card>

      {/* Historique récent */}
      <Card className="p-6">
        <h3 className="font-semibold text-foreground-800 mb-4">
          Historique récent
        </h3>
        {habit.completions.length > 0 ? (
          <div className="space-y-2">
            {habit.completions.slice(0, 10).map((completion) => (
              <div
                key={completion.id}
                className="flex items-center justify-between py-2 border-b border-background-300 last:border-0"
              >
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[var(--success)]" />
                  <span className="text-sm text-foreground-700">
                    {new Date(completion.completedAt).toLocaleDateString('fr-FR', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-foreground-400">Aucune complétion pour le moment</p>
        )}
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        {/* Toggle Today */}
        <Button
          onClick={handleToggleToday}
          disabled={isPending}
          className="flex-1"
          variant={completed ? 'outline' : 'default'}
        >
          {completed ? 'Annuler aujourd\'hui' : 'Compléter aujourd\'hui'}
        </Button>

        {/* Éditer */}
        <Button
          onClick={() => router.push(`/habits/${habit.id}/edit`)}
          variant="outline"
          size="icon"
        >
          <Edit className="h-5 w-5" />
        </Button>

        {/* Supprimer */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="icon" className="text-[var(--error)]">
              <Trash2 className="h-5 w-5" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Supprimer cette habitude ?</AlertDialogTitle>
              <AlertDialogDescription>
                Cette action est irréversible. Toutes les données de complétion seront
                supprimées.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={isDeleting}
                className="bg-[var(--error)]"
              >
                {isDeleting ? 'Suppression...' : 'Supprimer'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}
