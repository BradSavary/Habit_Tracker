'use server'

import { z } from 'zod'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { getXpForCompletion, checkLevelUp } from '@/lib/progression'
import { getEmojiForLevel } from '@/lib/emojis-system'

// ========================================
// SCHEMAS DE VALIDATION ZOD
// ========================================

const habitSchema = z.object({
  name: z.string().min(1, 'Le nom est requis').max(100, 'Le nom est trop long'),
  description: z.string().max(500, 'La description est trop longue').optional(),
  emoji: z.string().optional(),
  category: z.enum([
    'Santé',
    'Productivité',
    'Sport',
    'Créativité',
    'Social',
    'Apprentissage',
    'Autre'
  ]).optional(),
  color: z.enum(['purple', 'blue', 'green', 'orange', 'pink', 'teal']).optional(),
  frequency: z.enum(['daily', 'weekly', 'monthly']).default('daily'),
  weekDays: z.array(z.number().min(0).max(6)).optional(), // 0 = dimanche, 6 = samedi
  monthlyGoal: z.number().min(1).max(31).optional(),
})

const updateHabitSchema = habitSchema.extend({
  id: z.string(),
})

// ========================================
// TYPES
// ========================================

type CreateHabitInput = z.infer<typeof habitSchema> & { userId: string }
type UpdateHabitInput = z.infer<typeof updateHabitSchema> & { userId: string }

// ========================================
// SERVER ACTIONS
// ========================================

/**
 * Créer une nouvelle habitude
 */
export async function createHabit(data: CreateHabitInput) {
  try {
    const validatedData = habitSchema.parse(data)

    const habit = await prisma.habit.create({
      data: {
        ...validatedData,
        userId: data.userId,
        weekDays: validatedData.weekDays || undefined,
      },
    })

    revalidatePath('/dashboard')
    return { success: true, habit }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message }
    }
    console.error('Error creating habit:', error)
    return { success: false, error: 'Erreur lors de la création de l\'habitude' }
  }
}

/**
 * Récupérer toutes les habitudes d'un utilisateur
 */
export async function getHabits(userId: string) {
  try {
    const habits = await prisma.habit.findMany({
      where: { userId },
      include: {
        completions: {
          orderBy: { completedAt: 'desc' },
          take: 30, // Derniers 30 jours pour calculer les streaks
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return { success: true, habits }
  } catch (error) {
    console.error('Error fetching habits:', error)
    return { success: false, error: 'Erreur lors de la récupération des habitudes', habits: [] }
  }
}

/**
 * Récupérer une habitude spécifique par son ID
 */
export async function getHabitById(habitId: string, userId: string) {
  try {
    const habit = await prisma.habit.findFirst({
      where: {
        id: habitId,
        userId, // Sécurité: vérifier que l'habitude appartient à l'utilisateur
      },
      include: {
        completions: {
          orderBy: { completedAt: 'desc' },
        },
      },
    })

    if (!habit) {
      return { success: false, error: 'Habitude introuvable' }
    }

    return { success: true, habit }
  } catch (error) {
    console.error('Error fetching habit:', error)
    return { success: false, error: 'Erreur lors de la récupération de l\'habitude' }
  }
}

/**
 * Mettre à jour une habitude
 */
export async function updateHabit(data: UpdateHabitInput) {
  try {
    const validatedData = updateHabitSchema.parse(data)

    // Vérifier que l'habitude appartient à l'utilisateur
    const existingHabit = await prisma.habit.findFirst({
      where: {
        id: validatedData.id,
        userId: data.userId,
      },
    })

    if (!existingHabit) {
      return { success: false, error: 'Habitude introuvable ou non autorisée' }
    }

    const habit = await prisma.habit.update({
      where: { id: validatedData.id },
      data: {
        name: validatedData.name,
        description: validatedData.description,
        emoji: validatedData.emoji,
        category: validatedData.category,
        color: validatedData.color,
        frequency: validatedData.frequency,
        weekDays: validatedData.weekDays || undefined,
        monthlyGoal: validatedData.monthlyGoal,
      },
    })

    revalidatePath('/dashboard')
    revalidatePath(`/habits/${validatedData.id}`)
    return { success: true, habit }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message }
    }
    console.error('Error updating habit:', error)
    return { success: false, error: 'Erreur lors de la mise à jour de l\'habitude' }
  }
}

/**
 * Supprimer une habitude
 */
export async function deleteHabit(habitId: string, userId: string) {
  try {
    // Vérifier que l'habitude appartient à l'utilisateur
    const existingHabit = await prisma.habit.findFirst({
      where: {
        id: habitId,
        userId,
      },
    })

    if (!existingHabit) {
      return { success: false, error: 'Habitude introuvable ou non autorisée' }
    }

    await prisma.habit.delete({
      where: { id: habitId },
    })

    revalidatePath('/dashboard')
    return { success: true }
  } catch (error) {
    console.error('Error deleting habit:', error)
    return { success: false, error: 'Erreur lors de la suppression de l\'habitude' }
  }
}

/**
 * Basculer la complétion d'une habitude (toggle)
 */
export async function toggleHabitCompletion(habitId: string, userId: string, date?: Date) {
  try {
    // Vérifier que l'habitude appartient à l'utilisateur
    const habit = await prisma.habit.findFirst({
      where: {
        id: habitId,
        userId,
      },
    })

    if (!habit) {
      return { success: false, error: 'Habitude introuvable ou non autorisée' }
    }

    // Normaliser la date au début de la journée
    const completionDate = date || new Date()
    completionDate.setHours(0, 0, 0, 0)
    
    // === VALIDATION DES JOURS POUR WEEKLY/MONTHLY ===
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    // Vérifier que la date de complétion est aujourd'hui
    if (completionDate.getTime() !== today.getTime()) {
      return { success: false, error: 'Vous ne pouvez compléter une habitude que pour aujourd\'hui' }
    }
    
    // Pour les habitudes hebdomadaires, vérifier que le jour actuel est dans weekDays
    if (habit.frequency === 'weekly' && habit.weekDays) {
      const currentDayOfWeek = today.getDay() // 0 = dimanche, 6 = samedi
      const weekDaysArray = habit.weekDays as number[] // Cast JSON to number[]
      
      if (!weekDaysArray.includes(currentDayOfWeek)) {
        const dayNames = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi']
        return { 
          success: false, 
          error: `Cette habitude ne peut être complétée qu'un ${weekDaysArray.map(d => dayNames[d]).join(', ')}` 
        }
      }
    }

    // Vérifier si une complétion existe déjà pour cette date
    const existingCompletion = await prisma.habitCompletion.findFirst({
      where: {
        habitId,
        completedAt: completionDate,
      },
    })

    if (existingCompletion) {
      // Si elle existe, la supprimer (toggle off)
      await prisma.habitCompletion.delete({
        where: { id: existingCompletion.id },
      })
      revalidatePath('/dashboard')
      revalidatePath(`/habits/${habitId}`)
      return { success: true, completed: false }
    } else {
      // Sinon, la créer (toggle on) + donner XP
      await prisma.habitCompletion.create({
        data: {
          habitId,
          completedAt: completionDate,
        },
      })
      
      // === SYSTÈME DE PROGRESSION ===
      // Calculer l'XP gagné selon la fréquence de l'habitude
      const xpGained = getXpForCompletion(habit.frequency)
      
      // Récupérer l'utilisateur pour vérifier le level up
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { xp: true, level: true },
      })
      
      if (user) {
        const newXp = user.xp + xpGained
        const levelUpData = checkLevelUp(user.xp, xpGained)
        
        // Mettre à jour l'XP et le level de l'utilisateur
        await prisma.user.update({
          where: { id: userId },
          data: {
            xp: newXp,
            level: levelUpData.newLevel,
          },
        })
        
        // Si level up, retourner les informations
        if (levelUpData.hasLeveledUp) {
          const newEmojiReward = getEmojiForLevel(levelUpData.newLevel)
          
          revalidatePath('/dashboard')
          revalidatePath(`/habits/${habitId}`)
          revalidatePath('/profile')
          
          return {
            success: true,
            completed: true,
            xpGained,
            levelUp: {
              newLevel: levelUpData.newLevel,
              previousLevel: levelUpData.previousLevel,
              unlockedEmoji: newEmojiReward,
            },
          }
        }
        
        // Pas de level up, juste retour normal avec XP
        revalidatePath('/dashboard')
        revalidatePath(`/habits/${habitId}`)
        return { success: true, completed: true, xpGained }
      }
      
      // Fallback si utilisateur pas trouvé (ne devrait jamais arriver)
      revalidatePath('/dashboard')
      revalidatePath(`/habits/${habitId}`)
      return { success: true, completed: true }
    }
  } catch (error) {
    console.error('Error toggling habit completion:', error)
    return { success: false, error: 'Erreur lors de la mise à jour de la complétion' }
  }
}
