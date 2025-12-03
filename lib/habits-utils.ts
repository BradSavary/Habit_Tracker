/**
 * Helpers pour la gestion des habitudes
 * Calculs de streaks, vérification de complétion, gestion des fréquences
 */

import { HabitCompletion, Prisma } from '@prisma/client'

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
  weekDays?: Prisma.JsonValue // Json type de Prisma (peut être string, number[], null, etc.)
  weeklyGoal?: number | null
  monthlyGoal?: number | null
  monthDays?: Prisma.JsonValue // Json type de Prisma pour les jours du mois (1-31)
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

  if (habit.frequency === 'weekly') {
    // Si l'habitude a des jours précis définis
    if (habit.weekDays && Array.isArray(habit.weekDays) && habit.weekDays.length > 0) {
      const dayOfWeek = today.getDay()
      const weekDays = habit.weekDays as number[]
      return weekDays.includes(dayOfWeek)
    }
    
    // Si l'habitude n'a pas de jours précis (seulement weeklyGoal)
    // L'afficher SAUF si elle est complétée à 100% sur la semaine (depuis le lendemain)
    if (habit.weeklyGoal) {
      const weekStart = getWeekStart(today)
      const weekCompletions = habit.completions.filter((c) => {
        const completionDate = new Date(c.completedAt)
        return completionDate >= weekStart
      })
      
      const completedCount = weekCompletions.length
      const goal = habit.weeklyGoal
      
      // Si l'objectif n'est pas atteint, afficher
      if (completedCount < goal) {
        return true
      }
      
      // Si l'objectif est atteint, vérifier si c'était hier ou avant
      if (completedCount >= goal && weekCompletions.length > 0) {
        const lastCompletion = weekCompletions.sort((a, b) => 
          new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
        )[0]
        
        const lastCompletionDate = new Date(lastCompletion.completedAt)
        lastCompletionDate.setHours(0, 0, 0, 0)
        
        const todayStart = new Date(today)
        todayStart.setHours(0, 0, 0, 0)
        
        // Si la dernière complétion était hier ou avant, ne pas afficher
        return lastCompletionDate.getTime() >= todayStart.getTime()
      }
    }
    
    return false
  }

  if (habit.frequency === 'monthly') {
    // Si l'habitude a des jours précis définis
    if (habit.monthDays && Array.isArray(habit.monthDays) && habit.monthDays.length > 0) {
      const dayOfMonth = today.getDate() // 1-31
      const monthDays = habit.monthDays as number[]
      return monthDays.includes(dayOfMonth)
    }
    
    // Si l'habitude n'a pas de jours précis (seulement monthlyGoal)
    // L'afficher toujours
    return true
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
  if (habit.frequency !== 'monthly') {
    return { current: 0, goal: 0, percentage: 0 }
  }

  // Vérifier si l'habitude a des jours précis
  const hasSpecificDays = habit.monthDays && Array.isArray(habit.monthDays) && habit.monthDays.length > 0

  // Si pas de jours précis et pas de goal, retourner 0
  if (!hasSpecificDays && !habit.monthlyGoal) {
    return { current: 0, goal: 0, percentage: 0 }
  }

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  startOfMonth.setHours(0, 0, 0, 0)

  let completionsThisMonth = habit.completions.filter((completion) => {
    const completionDate = new Date(completion.completedAt)
    return completionDate >= startOfMonth
  })

  // Si jours précis, filtrer les complétions sur ces jours uniquement
  if (hasSpecificDays) {
    completionsThisMonth = completionsThisMonth.filter((c) => {
      const completionDate = new Date(c.completedAt)
      const dayOfMonth = completionDate.getDate()
      return (habit.monthDays as number[]).includes(dayOfMonth)
    })
  }

  // Compter les jours uniques complétés
  const uniqueCompletedDays = new Set(
    completionsThisMonth.map(c => {
      const d = new Date(c.completedAt)
      d.setHours(0, 0, 0, 0)
      return d.toISOString()
    })
  ).size

  const current = uniqueCompletedDays
  const goal = hasSpecificDays ? (habit.monthDays as number[]).length : (habit.monthlyGoal || 0)
  const percentage = goal > 0 ? Math.min((current / goal) * 100, 100) : 0

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
 * Vérifier si une habitude hebdo/mensuelle a atteint 100% et la dernière complétion date d'au moins hier
 * Retourne toujours false pour les habitudes quotidiennes
 */
export function isFullyCompletedSinceYesterday(habit: HabitWithCompletions, today: Date = new Date()): boolean {
  // Les habitudes quotidiennes ne peuvent jamais être dans cette catégorie
  if (habit.frequency === 'daily') {
    return false
  }

  const todayStart = new Date(today)
  todayStart.setHours(0, 0, 0, 0)

  if (habit.frequency === 'weekly') {
    // Vérifier si l'habitude a un objectif hebdomadaire
    if (!habit.weeklyGoal) {
      return false
    }

    const weekStart = getWeekStart(today)
    const weekCompletions = habit.completions.filter((c) => {
      const completionDate = new Date(c.completedAt)
      return completionDate >= weekStart
    })

    // Vérifier si l'objectif est atteint
    if (weekCompletions.length < habit.weeklyGoal) {
      return false
    }

    // Vérifier que la dernière complétion date d'au moins hier
    const sortedCompletions = [...weekCompletions].sort(
      (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
    )

    if (sortedCompletions.length === 0) {
      return false
    }

    const lastCompletionDate = new Date(sortedCompletions[0].completedAt)
    lastCompletionDate.setHours(0, 0, 0, 0)

    // La dernière complétion doit être strictement avant aujourd'hui
    return lastCompletionDate.getTime() < todayStart.getTime()
  }

  if (habit.frequency === 'monthly') {
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
    monthStart.setHours(0, 0, 0, 0)

    const hasSpecificDays = habit.monthDays && Array.isArray(habit.monthDays) && habit.monthDays.length > 0

    // Si pas de jours précis et pas de goal, retourner false
    if (!hasSpecificDays && !habit.monthlyGoal) {
      return false
    }

    let monthCompletions = habit.completions.filter((c) => {
      const completionDate = new Date(c.completedAt)
      return completionDate >= monthStart
    })

    // Si jours précis, filtrer les complétions sur ces jours uniquement
    if (hasSpecificDays) {
      monthCompletions = monthCompletions.filter((c) => {
        const completionDate = new Date(c.completedAt)
        const dayOfMonth = completionDate.getDate()
        return (habit.monthDays as number[]).includes(dayOfMonth)
      })
    }

    // Compter les jours uniques complétés
    const uniqueCompletedDays = new Set(
      monthCompletions.map(c => {
        const d = new Date(c.completedAt)
        d.setHours(0, 0, 0, 0)
        return d.toISOString()
      })
    )

    const goal = hasSpecificDays ? (habit.monthDays as number[]).length : (habit.monthlyGoal || 0)

    // Vérifier si l'objectif est atteint
    if (uniqueCompletedDays.size < goal) {
      return false
    }

    // Vérifier que la dernière complétion date d'au moins hier
    if (monthCompletions.length === 0) {
      return false
    }

    const sortedCompletions = [...monthCompletions].sort(
      (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
    )

    const lastCompletionDate = new Date(sortedCompletions[0].completedAt)
    lastCompletionDate.setHours(0, 0, 0, 0)

    // La dernière complétion doit être strictement avant aujourd'hui
    return lastCompletionDate.getTime() < todayStart.getTime()
  }

  return false
}

/**
 * Grouper les habitudes : Aujourd'hui vs Autres vs Complétées
 * Habitudes d'aujourd'hui triées : non complétées en premier, complétées à la fin
 */
export function groupHabits(habits: HabitWithCompletions[], today: Date = new Date()) {
  // Identifier les habitudes complétées (hebdo/mensuel 100% depuis hier)
  const completedHabits = habits.filter((habit) => isFullyCompletedSinceYesterday(habit, today))
  
  // Les autres habitudes (exclure les complétées)
  const remainingHabits = habits.filter((habit) => !isFullyCompletedSinceYesterday(habit, today))
  
  const todayHabitsUnsorted = remainingHabits.filter((habit) => shouldShowToday(habit, today))
  const otherHabits = remainingHabits.filter((habit) => !shouldShowToday(habit, today))

  // Trier les habitudes d'aujourd'hui : non complétées en premier
  const todayHabits = todayHabitsUnsorted.sort((a, b) => {
    const aCompleted = isCompletedToday(a, today)
    const bCompleted = isCompletedToday(b, today)
    
    // Non complétées (false) avant complétées (true)
    if (aCompleted === bCompleted) return 0
    return aCompleted ? 1 : -1
  })

  return { todayHabits, otherHabits, completedHabits }
}
