// Exemples d'utilisation de Prisma dans l'application Habit Tracker
// Ce fichier est à titre d'exemple uniquement

import prisma from '@/lib/prisma'

/**
 * Exemple 1: Créer un nouvel utilisateur
 */
export async function createUser(email: string, name: string, password: string) {
  const user = await prisma.user.create({
    data: {
      email,
      name,
      password, // ⚠️ En production, hasher le mot de passe avec bcrypt
    },
  })
  return user
}

/**
 * Exemple 2: Trouver un utilisateur par email
 */
export async function getUserByEmail(email: string) {
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      habits: true, // Inclure les habitudes de l'utilisateur
    },
  })
  return user
}

/**
 * Exemple 3: Créer une nouvelle habitude pour un utilisateur
 */
export async function createHabit(userId: string, habitData: {
  name: string
  description?: string
  color?: string
  icon?: string
  frequency?: string
}) {
  const habit = await prisma.habit.create({
    data: {
      ...habitData,
      userId,
    },
  })
  return habit
}

/**
 * Exemple 4: Récupérer toutes les habitudes d'un utilisateur
 */
export async function getUserHabits(userId: string) {
  const habits = await prisma.habit.findMany({
    where: { userId },
    include: {
      completions: {
        orderBy: { completedAt: 'desc' },
        take: 30, // Les 30 dernières validations
      },
    },
    orderBy: { createdAt: 'desc' },
  })
  return habits
}

/**
 * Exemple 5: Valider une habitude (marquer comme complétée)
 */
export async function completeHabit(habitId: string, notes?: string) {
  const completion = await prisma.habitCompletion.create({
    data: {
      habitId,
      completedAt: new Date(),
      notes,
    },
  })
  return completion
}

/**
 * Exemple 6: Vérifier si une habitude a été validée aujourd'hui
 */
export async function isHabitCompletedToday(habitId: string) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const completion = await prisma.habitCompletion.findFirst({
    where: {
      habitId,
      completedAt: {
        gte: today,
        lt: tomorrow,
      },
    },
  })

  return completion !== null
}

/**
 * Exemple 7: Calculer le streak (série de jours consécutifs)
 */
export async function calculateStreak(habitId: string): Promise<number> {
  const completions = await prisma.habitCompletion.findMany({
    where: { habitId },
    orderBy: { completedAt: 'desc' },
  })

  if (completions.length === 0) return 0

  let streak = 0
  let currentDate = new Date()
  currentDate.setHours(0, 0, 0, 0)

  for (const completion of completions) {
    const completionDate = new Date(completion.completedAt)
    completionDate.setHours(0, 0, 0, 0)

    const diffInDays = Math.floor(
      (currentDate.getTime() - completionDate.getTime()) / (1000 * 60 * 60 * 24)
    )

    if (diffInDays === streak) {
      streak++
    } else {
      break
    }
  }

  return streak
}

/**
 * Exemple 8: Mettre à jour une habitude
 */
export async function updateHabit(habitId: string, data: {
  name?: string
  description?: string
  color?: string
  icon?: string
  frequency?: string
}) {
  const habit = await prisma.habit.update({
    where: { id: habitId },
    data,
  })
  return habit
}

/**
 * Exemple 9: Supprimer une habitude (cascade: supprime aussi les completions)
 */
export async function deleteHabit(habitId: string) {
  await prisma.habit.delete({
    where: { id: habitId },
  })
}

/**
 * Exemple 10: Statistiques utilisateur (transaction)
 */
export async function getUserStats(userId: string) {
  const [totalHabits, totalCompletions, habits] = await prisma.$transaction([
    // Nombre total d'habitudes
    prisma.habit.count({
      where: { userId },
    }),
    // Nombre total de validations
    prisma.habitCompletion.count({
      where: {
        habit: { userId },
      },
    }),
    // Détails des habitudes avec completions
    prisma.habit.findMany({
      where: { userId },
      include: {
        _count: {
          select: { completions: true },
        },
      },
    }),
  ])

  return {
    totalHabits,
    totalCompletions,
    habits,
  }
}

/**
 * Exemple 11: Récupérer les habitudes du jour
 */
export async function getTodayHabits(userId: string) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const habits = await prisma.habit.findMany({
    where: { userId },
    include: {
      completions: {
        where: {
          completedAt: {
            gte: today,
            lt: tomorrow,
          },
        },
      },
    },
  })

  return habits.map(habit => ({
    ...habit,
    isCompletedToday: habit.completions.length > 0,
  }))
}
