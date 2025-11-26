import prisma from './prisma'
import { startOfMonth, endOfMonth, subMonths, eachDayOfInterval, startOfDay, endOfDay, format, startOfWeek, endOfWeek } from 'date-fns'

/**
 * Calculer les statistiques globales pour un utilisateur
 */
export async function getUserStats(userId: string) {
  const now = new Date()
  const startOfCurrentMonth = startOfMonth(now)
  const endOfCurrentMonth = endOfMonth(now)
  const startOfLastMonth = startOfMonth(subMonths(now, 1))
  const endOfLastMonth = endOfMonth(subMonths(now, 1))

  // Récupérer toutes les habitudes de l'utilisateur
  const habits = await prisma.habit.findMany({
    where: { userId },
    include: {
      completions: {
        where: {
          completedAt: {
            gte: startOfLastMonth, // Depuis le début du mois dernier
          },
        },
      },
    },
  })

  // Statistiques générales
  const totalHabits = habits.length
  const activeHabits = habits.filter(h => !h.endDate || new Date(h.endDate) >= now).length

  // Complétions ce mois
  const completionsThisMonth = habits.flatMap(h =>
    h.completions.filter(c => c.completedAt >= startOfCurrentMonth && c.completedAt <= endOfCurrentMonth)
  )

  // Complétions mois dernier
  const completionsLastMonth = habits.flatMap(h =>
    h.completions.filter(c => c.completedAt >= startOfLastMonth && c.completedAt <= endOfLastMonth)
  )

  // Taux de complétion ce mois (complétions / nombre d'habitudes * jours)
  const daysInMonth = now.getDate() // Nombre de jours écoulés ce mois
  const expectedCompletions = activeHabits * daysInMonth
  const completionRate = expectedCompletions > 0 ? Math.round((completionsThisMonth.length / expectedCompletions) * 100) : 0

  // Comparaison mensuelle
  const monthComparison = completionsLastMonth.length > 0
    ? Math.round(((completionsThisMonth.length - completionsLastMonth.length) / completionsLastMonth.length) * 100)
    : 0

  // Plus longue streak actuelle
  const longestStreak = calculateLongestStreak(habits)

  // Jours consécutifs d'activité (au moins 1 habitude complétée par jour)
  const consecutiveDays = calculateConsecutiveActivityDays(completionsThisMonth)

  return {
    totalHabits,
    activeHabits,
    completionsThisMonth: completionsThisMonth.length,
    completionsLastMonth: completionsLastMonth.length,
    completionRate,
    monthComparison,
    longestStreak,
    consecutiveDays,
  }
}

/**
 * Obtenir les complétions des 7 derniers jours (pour le graphique)
 */
export async function getWeeklyCompletions(userId: string) {
  const now = new Date()
  const weekStart = startOfWeek(now, { weekStartsOn: 1 }) // Lundi
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 }) // Dimanche

  const habits = await prisma.habit.findMany({
    where: { userId },
    include: {
      completions: {
        where: {
          completedAt: {
            gte: weekStart,
            lte: weekEnd,
          },
        },
      },
    },
  })

  // Générer les 7 jours de la semaine
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd })

  return weekDays.map((day: any) => {
    const dayStart = startOfDay(day)
    const dayEnd = endOfDay(day)
    
    const completions = habits.flatMap((h: any) =>
      h.completions.filter((c: any) => c.completedAt >= dayStart && c.completedAt <= dayEnd)
    ).length

    // Traduire les jours en français
    const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']
    const dayName = dayNames[day.getDay()]

    return {
      date: dayName,
      completions,
    }
  })
}

/**
 * Obtenir les complétions du mois calendaire en cours (pour le line chart)
 */
export async function getMonthlyTrend(userId: string) {
  const now = new Date()
  const startDate = startOfMonth(now) // 1er jour du mois
  const endDate = endOfMonth(now) // Dernier jour du mois

  const habits = await prisma.habit.findMany({
    where: { userId },
    include: {
      completions: {
        where: {
          completedAt: {
            gte: startDate,
            lte: endDate,
          },
        },
      },
    },
  })

  // Générer tous les jours du mois en cours
  const days = eachDayOfInterval({ start: startDate, end: endDate })

  return days.map((day: any) => {
    const dayStart = startOfDay(day)
    const dayEnd = endOfDay(day)
    
    const completions = habits.flatMap((h: any) =>
      h.completions.filter((c: any) => c.completedAt >= dayStart && c.completedAt <= dayEnd)
    ).length

    return {
      date: format(day, 'd'), // Juste le numéro du jour
      completions,
    }
  })
}

/**
 * Répartition des habitudes par fréquence
 */
export async function getHabitsByFrequency(userId: string) {
  const habits = await prisma.habit.findMany({
    where: { userId },
  })

  const daily = habits.filter(h => h.frequency === 'daily').length
  const weekly = habits.filter(h => h.frequency === 'weekly').length
  const monthly = habits.filter(h => h.frequency === 'monthly').length

  return [
    { name: 'Quotidiennes', value: daily, color: 'var(--accent-blue)' },
    { name: 'Hebdomadaires', value: weekly, color: 'var(--accent-green)' },
    { name: 'Mensuelles', value: monthly, color: 'var(--accent-orange)' },
  ]
}

/**
 * Top 3 des habitudes avec le meilleur taux de complétion ce mois
 */
export async function getTopHabits(userId: string) {
  const now = new Date()
  const startOfCurrentMonth = startOfMonth(now)
  const endOfCurrentMonth = endOfMonth(now)

  const habits = await prisma.habit.findMany({
    where: { userId },
    include: {
      completions: {
        where: {
          completedAt: {
            gte: startOfCurrentMonth,
            lte: endOfCurrentMonth,
          },
        },
      },
    },
  })

  // Calculer le taux de complétion pour chaque habitude
  const daysInMonth = now.getDate()
  const habitsWithRate = habits.map((habit: any) => {
    const completions = habit.completions.length
    const expected = daysInMonth // Simplifié : suppose daily pour l'instant
    const rate = expected > 0 ? Math.round((completions / expected) * 100) : 0

    return {
      id: habit.id,
      name: habit.name,
      emoji: habit.emoji || '📌',
      color: habit.color || 'purple',
      completions,
      rate: Math.min(rate, 100), // Cap à 100%
    }
  })

  // Trier par taux décroissant et prendre le top 3
  return habitsWithRate
    .sort((a: any, b: any) => b.rate - a.rate)
    .slice(0, 3)
}

/**
 * Calculer la plus longue streak actuelle
 */
function calculateLongestStreak(habits: any[]): number {
  let maxStreak = 0

  habits.forEach(habit => {
    const completions = habit.completions
      .map((c: any) => new Date(c.completedAt))
      .sort((a: Date, b: Date) => b.getTime() - a.getTime()) // Du plus récent au plus ancien

    let currentStreak = 0
    let expectedDate = new Date()
    expectedDate.setHours(0, 0, 0, 0)

    for (const completion of completions) {
      const completionDate = new Date(completion)
      completionDate.setHours(0, 0, 0, 0)

      if (completionDate.getTime() === expectedDate.getTime()) {
        currentStreak++
        expectedDate.setDate(expectedDate.getDate() - 1)
      } else {
        break
      }
    }

    maxStreak = Math.max(maxStreak, currentStreak)
  })

  return maxStreak
}

/**
 * Calculer les jours consécutifs d'activité
 */
function calculateConsecutiveActivityDays(completions: any[]): number {
  if (completions.length === 0) return 0

  const dates = completions
    .map(c => {
      const date = new Date(c.completedAt)
      date.setHours(0, 0, 0, 0)
      return date.getTime()
    })
    .filter((value, index, self) => self.indexOf(value) === index) // Unique dates
    .sort((a, b) => b - a) // Du plus récent au plus ancien

  let streak = 0
  let expectedTime = new Date().setHours(0, 0, 0, 0)

  for (const dateTime of dates) {
    if (dateTime === expectedTime) {
      streak++
      expectedTime -= 24 * 60 * 60 * 1000 // Jour précédent
    } else {
      break
    }
  }

  return streak
}

/**
 * Meilleur jour de la semaine (plus de complétions)
 */
export async function getBestDayOfWeek(userId: string) {
  const now = new Date()
  const startDate = subMonths(now, 1) // 30 derniers jours

  const habits = await prisma.habit.findMany({
    where: { userId },
    include: {
      completions: {
        where: {
          completedAt: {
            gte: startDate,
          },
        },
      },
    },
  })

  const dayStats = {
    0: { name: 'Dimanche', count: 0 },
    1: { name: 'Lundi', count: 0 },
    2: { name: 'Mardi', count: 0 },
    3: { name: 'Mercredi', count: 0 },
    4: { name: 'Jeudi', count: 0 },
    5: { name: 'Vendredi', count: 0 },
    6: { name: 'Samedi', count: 0 },
  }

  habits.forEach(habit => {
    habit.completions.forEach(completion => {
      const day = new Date(completion.completedAt).getDay()
      dayStats[day as keyof typeof dayStats].count++
    })
  })

  const bestDay = Object.values(dayStats).sort((a, b) => b.count - a.count)[0]
  return bestDay
}
