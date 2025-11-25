'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Flame, Check, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getHabitBorderStyle, getHabitBadgeStyle } from '@/lib/design-tokens'
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
  isLoading?: boolean
}

// ========================================
// DAILY HABIT CARD
// ========================================

export function DailyHabitCard({ habit, onToggleComplete, onOpen, className, isLoading = false }: BaseHabitCardProps) {
  const [clickTimeout, setClickTimeout] = useState<NodeJS.Timeout | null>(null)
  
  const streak = calculateStreak(habit)
  const completed = isCompletedToday(habit)
  const habitColor = (habit.color || 'purple') as 'purple' | 'blue' | 'green' | 'orange' | 'pink' | 'teal'
  const borderStyle = getHabitBorderStyle(habitColor)
  const badgeStyle = getHabitBadgeStyle(habitColor)

  const handleCircleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isLoading) return
    onToggleComplete()
  }

  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    
    if (isLoading) return
    
    if (clickTimeout) {
      clearTimeout(clickTimeout)
      setClickTimeout(null)
      onToggleComplete()
    } else {
      const timeout = setTimeout(() => {
        setClickTimeout(null)
        onOpen()
      }, 300)
      setClickTimeout(timeout)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <Card
        className={cn(
          'p-4 cursor-pointer transition-shadow',
          completed && 'opacity-75',
          className
        )}
        style={borderStyle}
        onClick={handleCardClick}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            {/* Emoji */}
            <motion.div 
              className="text-4xl"
              style={{ fontFamily: '"Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif' }}
              animate={completed ? { scale: 1.1 } : { scale: 1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {habit.emoji || '✨'}
            </motion.div>

            {/* Info */}
            <div className="flex-1">
              <h3 className="font-semibold text-foreground-800">{habit.name}</h3>
              {habit.category && (
                <Badge className="text-xs mt-1" style={badgeStyle}>
                  {habit.category}
                </Badge>
              )}
            </div>
          </div>

          {/* Streak & Completion */}
          <div className="flex items-center gap-3">
            {streak > 0 && (
              <motion.div 
                className="flex items-center gap-1 text-[var(--accent-orange)]"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <Flame className="h-4 w-4" />
                <span className="font-bold text-sm">{streak}</span>
              </motion.div>
            )}

            {/* Checkmark - Cliquable pour toggle */}
            <motion.div
              onClick={handleCircleClick}
              className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all',
                isLoading ? 'cursor-wait' : 'cursor-pointer',
                completed
                  ? 'bg-[var(--success)] border-[var(--success)] text-background-100'
                  : 'border-foreground-300'
              )}
              whileTap={{ scale: 0.85 }}
              animate={completed ? { scale: 1.05 } : { scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                completed && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 180 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Check className="h-5 w-5" />
                  </motion.div>
                )
              )}
            </motion.div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

// ========================================
// WEEKLY HABIT CARD
// ========================================

export function WeeklyHabitCard({ habit, onToggleComplete, onOpen, className, isLoading = false }: BaseHabitCardProps) {
  const [clickTimeout, setClickTimeout] = useState<NodeJS.Timeout | null>(null)
  
  const streak = calculateStreak(habit)
  const habitColor = (habit.color || 'purple') as 'purple' | 'blue' | 'green' | 'orange' | 'pink' | 'teal'
  const borderStyle = getHabitBorderStyle(habitColor)
  const badgeStyle = getHabitBadgeStyle(habitColor)
  const weekDaysLabel = getWeekDaysLabels(habit.weekDays as number[] | null)
  
  // Vérifier si l'habitude a des jours précis définis
  const hasSpecificDays = habit.weekDays && Array.isArray(habit.weekDays) && habit.weekDays.length > 0

  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    
    if (isLoading) return
    
    if (clickTimeout) {
      clearTimeout(clickTimeout)
      setClickTimeout(null)
      onToggleComplete()
    } else {
      const timeout = setTimeout(() => {
        setClickTimeout(null)
        onOpen()
      }, 300)
      setClickTimeout(timeout)
    }
  }

  // Calculer la progression de la semaine
  const today = new Date()
  const weekStart = new Date(today)
  weekStart.setDate(today.getDate() - today.getDay() + 1) // Lundi
  weekStart.setHours(0, 0, 0, 0)

  const weekCompletions = habit.completions.filter((c) => {
    const completionDate = new Date(c.completedAt)
    return completionDate >= weekStart
  })

  const targetDays = hasSpecificDays 
    ? (habit.weekDays as number[]).length 
    : (habit.weeklyGoal || 7)
  const completedDays = weekCompletions.length
  const progressPercentage = (completedDays / targetDays) * 100

  // Générer les 7 jours de la semaine avec leur état (uniquement si jours précis)
  type WeekDay = { day: number; date: Date; isCompleted: boolean; isActive: boolean; isToday: boolean }
  const weekDays: WeekDay[] = []
  if (hasSpecificDays) {
    for (let i = 0; i < 7; i++) {
      const dayDate = new Date(weekStart)
      dayDate.setDate(weekStart.getDate() + i)
      const isCompleted = weekCompletions.some((c) => {
        const cDate = new Date(c.completedAt)
        cDate.setHours(0, 0, 0, 0)
        return cDate.getTime() === dayDate.getTime()
      })
      // Le jour est activé si il fait partie des weekDays
      const isActive = (habit.weekDays as number[]).includes(i + 1) // +1 car weekDays est 1-7 (lun-dim)
      const isToday = dayDate.toDateString() === today.toDateString()
      weekDays.push({ day: i, date: dayDate, isCompleted, isActive, isToday })
    }
  }

  // Handler pour cliquer sur un jour spécifique (uniquement si jours précis et jour actif)
  const handleDayClick = (e: React.MouseEvent, dayInfo: WeekDay) => {
    e.stopPropagation()
    if (isLoading || !dayInfo.isActive || !dayInfo.isToday) return
    onToggleComplete()
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <Card
        className={cn('p-4 cursor-pointer transition-shadow', className)}
        style={borderStyle}
        onClick={handleCardClick}
      >
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div 
                className="text-4xl"
                style={{ fontFamily: '"Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif' }}
                whileTap={{ scale: 1.2, rotate: 360 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                {habit.emoji || '✨'}
              </motion.div>
              <div>
                <h3 className="font-semibold text-foreground-800">{habit.name}</h3>
                {hasSpecificDays ? (
                  <p className="text-xs text-foreground-400">{weekDaysLabel}</p>
                ) : (
                  <Badge className="text-xs mt-1" style={badgeStyle}>
                    {habit.category || 'Hebdomadaire'}
                  </Badge>
                )}
              </div>
            </div>

            {streak > 0 && (
              <motion.div 
                className="flex items-center gap-1 text-[var(--accent-orange)]"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <Flame className="h-4 w-4" />
                <span className="font-bold text-sm">{streak}</span>
              </motion.div>
            )}
          </div>

          {/* Week Days Indicators - Seulement si jours précis */}
          {hasSpecificDays && (
            <motion.div 
              className="flex items-center justify-between gap-2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {weekDays.map((day, index) => (
                <motion.div
                  key={day.day}
                  onClick={(e) => handleDayClick(e, day)}
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium',
                    day.isCompleted
                      ? 'bg-[var(--success)] text-background-100'
                      : day.isActive
                      ? day.isToday
                        ? 'bg-primary/20 text-primary border-2 border-primary cursor-pointer'
                        : 'bg-background-300 text-foreground-600'
                      : 'bg-background-200 text-foreground-300 opacity-50 cursor-not-allowed'
                  )}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.05, type: "spring", stiffness: 300 }}
                  whileTap={day.isActive && day.isToday ? { scale: 0.85, rotate: 15 } : {}}
                >
                  {['L', 'M', 'M', 'J', 'V', 'S', 'D'][index]}
                </motion.div>
              ))}
            </motion.div>
          )}

        {/* Progress */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-foreground-500">
              {completedDays}/{targetDays} {hasSpecificDays ? 'jours' : 'fois'}
            </span>
            <div className="flex items-center gap-1">
              {isLoading && <Loader2 className="h-3 w-3 animate-spin text-foreground-400" />}
              <span className="text-foreground-500">{Math.round(progressPercentage)}%</span>
            </div>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
        </div>
      </Card>
    </motion.div>
  )
}

// ========================================
// MONTHLY HABIT CARD
// ========================================

export function MonthlyHabitCard({ habit, onToggleComplete, onOpen, className, isLoading = false }: BaseHabitCardProps) {
  const [clickTimeout, setClickTimeout] = useState<NodeJS.Timeout | null>(null)
  
  const streak = calculateStreak(habit)
  const { current, goal, percentage } = getCompletionProgress(habit)
  const habitColor = (habit.color || 'purple') as 'purple' | 'blue' | 'green' | 'orange' | 'pink' | 'teal'
  const borderStyle = getHabitBorderStyle(habitColor)
  const badgeStyle = getHabitBadgeStyle(habitColor)

  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    
    if (isLoading) return
    
    if (clickTimeout) {
      clearTimeout(clickTimeout)
      setClickTimeout(null)
      onToggleComplete()
    } else {
      const timeout = setTimeout(() => {
        setClickTimeout(null)
        onOpen()
      }, 300)
      setClickTimeout(timeout)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <Card
        className={cn('p-4 cursor-pointer transition-shadow', className)}
        style={borderStyle}
        onClick={handleCardClick}
      >
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div 
              className="text-4xl"
              style={{ fontFamily: '"Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif' }}
              whileTap={{ scale: 1.2, rotate: 360 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              {habit.emoji || '✨'}
            </motion.div>
            <div>
              <h3 className="font-semibold text-foreground-800">{habit.name}</h3>
              <p className="text-xs text-foreground-400">
                Objectif: {goal} fois par mois
              </p>
            </div>
          </div>

          {streak > 0 && (
            <motion.div 
              className="flex items-center gap-1 text-[var(--accent-orange)]"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <Flame className="h-4 w-4" />
              <span className="font-bold text-sm">{streak} mois</span>
            </motion.div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-foreground-500">
              {current}/{goal} fois ce mois
            </span>
            <div className="flex items-center gap-1">
              {isLoading && <Loader2 className="h-3 w-3 animate-spin text-foreground-400" />}
              <span className="text-foreground-500">{Math.round(percentage)}%</span>
            </div>
          </div>
          <Progress value={percentage} className="h-2" />
        </div>

        {/* Status Badge */}
        {current >= goal && (
          <Badge style={badgeStyle}>
            Objectif atteint ! 🎉
          </Badge>
        )}
        </div>
      </Card>
    </motion.div>
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
