'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Flame, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getHabitColorClass } from '@/lib/design-tokens'
import {
  HabitWithCompletions,
  calculateStreak,
  isCompletedToday,
  getCompletionProgress,
  getWeekDaysLabels,
} from '@/lib/habits-utils'

/**
 * HabitCard - Composants adaptatifs pour afficher une habitude
 * 
 * Justification 'use client':
 * - Gère les interactions touch (double-tap, swipe à venir)
 * - Gère l'animation de complétion
 * - Navigation vers la page de détail
 */

interface BaseHabitCardProps {
  habit: HabitWithCompletions
  onToggleComplete: () => void
  onOpen: () => void
  className?: string
}

// ========================================
// DAILY HABIT CARD
// ========================================

export function DailyHabitCard({ habit, onToggleComplete, onOpen, className }: BaseHabitCardProps) {
  const streak = calculateStreak(habit)
  const completed = isCompletedToday(habit)
  const colorClass = getHabitColorClass((habit.color || 'purple') as 'purple' | 'blue' | 'green' | 'orange' | 'pink' | 'teal', 'light')

  return (
    <Card
      className={cn(
        'p-4 cursor-pointer transition-all hover:shadow-md hover:scale-[1.02]',
        colorClass,
        completed && 'opacity-75',
        className
      )}
      onClick={onOpen}
      onDoubleClick={(e) => {
        e.stopPropagation()
        onToggleComplete()
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          {/* Emoji */}
          <div 
            className="text-4xl"
            style={{ fontFamily: '"Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif' }}
          >
            {habit.emoji || '✨'}
          </div>

          {/* Info */}
          <div className="flex-1">
            <h3 className="font-semibold text-foreground-800">{habit.name}</h3>
            {habit.category && (
              <p className="text-sm text-foreground-400">{habit.category}</p>
            )}
          </div>
        </div>

        {/* Streak & Completion */}
        <div className="flex items-center gap-3">
          {streak > 0 && (
            <div className="flex items-center gap-1 text-[var(--accent-orange)]">
              <Flame className="h-4 w-4" />
              <span className="font-bold text-sm">{streak}</span>
            </div>
          )}

          {/* Checkmark */}
          <div
            className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all',
              completed
                ? 'bg-[var(--success)] border-[var(--success)] text-background-100'
                : 'border-foreground-300'
            )}
          >
            {completed && <Check className="h-5 w-5" />}
          </div>
        </div>
      </div>
    </Card>
  )
}

// ========================================
// WEEKLY HABIT CARD
// ========================================

export function WeeklyHabitCard({ habit, onToggleComplete, onOpen, className }: BaseHabitCardProps) {
  const streak = calculateStreak(habit)
  const colorClass = getHabitColorClass((habit.color || 'purple') as 'purple' | 'blue' | 'green' | 'orange' | 'pink' | 'teal', 'light')
  const weekDaysLabel = getWeekDaysLabels(habit.weekDays as number[] | null)

  // Calculer la progression de la semaine
  const today = new Date()
  const weekStart = new Date(today)
  weekStart.setDate(today.getDate() - today.getDay() + 1) // Lundi
  weekStart.setHours(0, 0, 0, 0)

  const weekCompletions = habit.completions.filter((c) => {
    const completionDate = new Date(c.completedAt)
    return completionDate >= weekStart
  })

  const targetDays = (habit.weekDays as number[] | null)?.length || 7
  const completedDays = weekCompletions.length
  const progressPercentage = (completedDays / targetDays) * 100

  // Générer les 7 jours de la semaine avec leur état
  const weekDays = []
  for (let i = 0; i < 7; i++) {
    const dayDate = new Date(weekStart)
    dayDate.setDate(weekStart.getDate() + i)
    const isCompleted = weekCompletions.some((c) => {
      const cDate = new Date(c.completedAt)
      cDate.setHours(0, 0, 0, 0)
      return cDate.getTime() === dayDate.getTime()
    })
    weekDays.push({ day: i, date: dayDate, isCompleted })
  }

  return (
    <Card
      className={cn('p-4 cursor-pointer transition-all hover:shadow-md hover:scale-[1.02]', colorClass, className)}
      onClick={onOpen}
      onDoubleClick={(e) => {
        e.stopPropagation()
        onToggleComplete()
      }}
    >
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="text-4xl"
              style={{ fontFamily: '"Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif' }}
            >
              {habit.emoji || '✨'}
            </div>
            <div>
              <h3 className="font-semibold text-foreground-800">{habit.name}</h3>
              <p className="text-xs text-foreground-400">{weekDaysLabel}</p>
            </div>
          </div>

          {streak > 0 && (
            <div className="flex items-center gap-1 text-[var(--accent-orange)]">
              <Flame className="h-4 w-4" />
              <span className="font-bold text-sm">{streak}</span>
            </div>
          )}
        </div>

        {/* Week Days Indicators */}
        <div className="flex items-center justify-between gap-2">
          {weekDays.map((day, index) => (
            <div
              key={day.day}
              className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all',
                day.isCompleted
                  ? 'bg-[var(--success)] text-background-100'
                  : 'bg-background-400 text-foreground-400'
              )}
            >
              {['L', 'M', 'M', 'J', 'V', 'S', 'D'][index]}
            </div>
          ))}
        </div>

        {/* Progress */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-foreground-500">
              {completedDays}/{targetDays} jours
            </span>
            <span className="text-foreground-500">{Math.round(progressPercentage)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
      </div>
    </Card>
  )
}

// ========================================
// MONTHLY HABIT CARD
// ========================================

export function MonthlyHabitCard({ habit, onToggleComplete, onOpen, className }: BaseHabitCardProps) {
  const streak = calculateStreak(habit)
  const { current, goal, percentage } = getCompletionProgress(habit)
  const colorClass = getHabitColorClass((habit.color || 'purple') as 'purple' | 'blue' | 'green' | 'orange' | 'pink' | 'teal', 'light')

  return (
    <Card
      className={cn('p-4 cursor-pointer transition-all hover:shadow-md hover:scale-[1.02]', colorClass, className)}
      onClick={onOpen}
      onDoubleClick={(e) => {
        e.stopPropagation()
        onToggleComplete()
      }}
    >
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="text-4xl"
              style={{ fontFamily: '"Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif' }}
            >
              {habit.emoji || '✨'}
            </div>
            <div>
              <h3 className="font-semibold text-foreground-800">{habit.name}</h3>
              <p className="text-xs text-foreground-400">
                Objectif: {goal} fois par mois
              </p>
            </div>
          </div>

          {streak > 0 && (
            <div className="flex items-center gap-1 text-[var(--accent-orange)]">
              <Flame className="h-4 w-4" />
              <span className="font-bold text-sm">{streak} mois</span>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-foreground-500">
              {current}/{goal} fois ce mois
            </span>
            <span className="text-foreground-500">{Math.round(percentage)}%</span>
          </div>
          <Progress value={percentage} className="h-2" />
        </div>

        {/* Status Badge */}
        {current >= goal && (
          <Badge className="bg-[var(--success)] text-background-100">
            Objectif atteint ! 🎉
          </Badge>
        )}
      </div>
    </Card>
  )
}

// ========================================
// WRAPPER COMPONENT (Auto-select based on frequency)
// ========================================

export function HabitCard(props: BaseHabitCardProps) {
  const { habit } = props

  if (habit.frequency === 'weekly') {
    return <WeeklyHabitCard {...props} />
  }

  if (habit.frequency === 'monthly') {
    return <MonthlyHabitCard {...props} />
  }

  // Default: daily
  return <DailyHabitCard {...props} />
}
