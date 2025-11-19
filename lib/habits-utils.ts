/**
 * Helpers pour la gestion des habitudes
 * Calculs de streaks, vérification de complétion, gestion des fréquences
 */

import { HabitCompletion } from '@prisma/client'

// ========================================
// TYPES
// ========================================

export type FrequencyType = 'daily' | 'weekly' | 'monthly'

export interface HabitWithCompletions {
  id: string
  name: string
  emoji?: string | null
  category?: string | null
  color?: string | null
  frequency: string
  weekDays?: number[] | null // Json type de Prisma contenant un tableau de nombres
  monthlyGoal?: number | null
  completions: HabitCompletion[]
}

// ========================================
// CONSTANTES
// ========================================

const DAYS_OF_WEEK = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']

// ========================================
// STREAK CALCULATION
// ========================================

/**
 * Calculer le streak actuel d'une habitude (nombre de jours consécutifs)
 */
export function calculateStreak(habit: HabitWithCompletions, today: Date = new Date()): number {
  if (habit.completions.length === 0) return 0

  // Normaliser aujourd'hui
  const currentDate = new Date(today)
  currentDate.setHours(0, 0, 0, 0)

  // Trier les complétions par date décroissante
  const sortedCompletions = [...habit.completions].sort(
    (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
  )

  let streak = 0
  const checkDate = new Date(currentDate)

  // Pour daily: vérifier chaque jour consécutif
  if (habit.frequency === 'daily') {
    for (const completion of sortedCompletions) {
      const completionDate = new Date(completion.completedAt)
      completionDate.setHours(0, 0, 0, 0)

      if (completionDate.getTime() === checkDate.getTime()) {
        streak++
        checkDate.setDate(checkDate.getDate() - 1) // Jour précédent
      } else if (completionDate.getTime() < checkDate.getTime()) {
        // Trou dans le streak
        break
      }
    }
  }

  // Pour weekly et monthly: logique simplifiée (compte le nombre de complétions récentes)
  if (habit.frequency === 'weekly') {
    // Compte les semaines consécutives avec au moins une complétion
    streak = calculateWeeklyStreak(sortedCompletions, currentDate)
  }

  if (habit.frequency === 'monthly') {
    // Compte les mois consécutifs avec au moins une complétion
    streak = calculateMonthlyStreak(sortedCompletions, currentDate)
  }

  return streak
}

/**
 * Calculer le streak hebdomadaire
 */
function calculateWeeklyStreak(completions: HabitCompletion[], currentDate: Date): number {
  let streak = 0
  const checkWeekStart = getWeekStart(currentDate)

  const completionsByWeek = new Map<string, boolean>()

  // Grouper les complétions par semaine
  for (const completion of completions) {
    const weekStart = getWeekStart(new Date(completion.completedAt))
    const weekKey = weekStart.toISOString()
    completionsByWeek.set(weekKey, true)
  }

  // Vérifier les semaines consécutives
  while (completionsByWeek.has(checkWeekStart.toISOString())) {
    streak++
    checkWeekStart.setDate(checkWeekStart.getDate() - 7) // Semaine précédente
  }

  return streak
}

/**
 * Calculer le streak mensuel
 */
function calculateMonthlyStreak(completions: HabitCompletion[], currentDate: Date): number {
  let streak = 0
  const checkMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)

  const completionsByMonth = new Map<string, boolean>()

  // Grouper les complétions par mois
  for (const completion of completions) {
    const completionDate = new Date(completion.completedAt)
    const monthKey = `${completionDate.getFullYear()}-${completionDate.getMonth()}`
    completionsByMonth.set(monthKey, true)
  }

  // Vérifier les mois consécutifs
  while (completionsByMonth.has(`${checkMonth.getFullYear()}-${checkMonth.getMonth()}`)) {
    streak++
    checkMonth.setMonth(checkMonth.getMonth() - 1) // Mois précédent
  }

  return streak
}

/**
 * Obtenir le début de la semaine (lundi)
 */
function getWeekStart(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1) // Lundi = début de semaine
  d.setDate(diff)
  d.setHours(0, 0, 0, 0)
  return d
}

// ========================================
// COMPLETION STATUS
// ========================================

/**
 * Vérifier si l'habitude est complétée aujourd'hui
 */
export function isCompletedToday(habit: HabitWithCompletions, today: Date = new Date()): boolean {
  const todayNormalized = new Date(today)
  todayNormalized.setHours(0, 0, 0, 0)

  return habit.completions.some((completion) => {
    const completionDate = new Date(completion.completedAt)
    completionDate.setHours(0, 0, 0, 0)
    return completionDate.getTime() === todayNormalized.getTime()
  })
}

/**
 * Vérifier si l'habitude doit être affichée aujourd'hui (selon sa fréquence)
 */
export function shouldShowToday(habit: HabitWithCompletions, today: Date = new Date()): boolean {
  if (habit.frequency === 'daily') {
    return true // Toujours afficher les habitudes quotidiennes
  }

  if (habit.frequency === 'weekly' && habit.weekDays) {
    const dayOfWeek = today.getDay()
    const weekDays = habit.weekDays as number[]
    return weekDays.includes(dayOfWeek)
  }

  if (habit.frequency === 'monthly') {
    return true // Afficher toujours (on vérifie le goal dans le mois)
  }

  return true // Par défaut, afficher
}

/**
 * Obtenir la progression d'une habitude mensuelle
 */
export function getCompletionProgress(habit: HabitWithCompletions): {
  current: number
  goal: number
  percentage: number
} {
  if (habit.frequency !== 'monthly' || !habit.monthlyGoal) {
    return { current: 0, goal: 0, percentage: 0 }
  }

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  startOfMonth.setHours(0, 0, 0, 0)

  const completionsThisMonth = habit.completions.filter((completion) => {
    const completionDate = new Date(completion.completedAt)
    return completionDate >= startOfMonth
  })

  const current = completionsThisMonth.length
  const goal = habit.monthlyGoal
  const percentage = Math.min((current / goal) * 100, 100)

  return { current, goal, percentage }
}

/**
 * Obtenir les jours de la semaine pour une habitude hebdomadaire
 */
export function getWeekDaysLabels(weekDays: number[] | null | undefined): string {
  if (!weekDays || weekDays.length === 0) return 'Aucun jour'

  if (weekDays.length === 7) return 'Tous les jours'

  return weekDays
    .sort()
    .map((day) => DAYS_OF_WEEK[day])
    .join(', ')
}

/**
 * Grouper les habitudes : Aujourd'hui vs Autres
 */
export function groupHabits(habits: HabitWithCompletions[], today: Date = new Date()) {
  const todayHabits = habits.filter((habit) => shouldShowToday(habit, today))
  const otherHabits = habits.filter((habit) => !shouldShowToday(habit, today))

  return { todayHabits, otherHabits }
}
