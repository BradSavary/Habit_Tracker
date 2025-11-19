'use server'

import { z } from 'zod'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

// ========================================
// SCHEMAS DE VALIDATION ZOD
// ========================================

const moodSchema = z.object({
  emoji: z.string().min(1, 'Un emoji est requis'),
  date: z.date().optional(),
  notes: z.string().max(500, 'Les notes sont trop longues').optional(),
})

// ========================================
// TYPES
// ========================================

type CreateMoodInput = z.infer<typeof moodSchema> & { userId: string }
type UpdateMoodInput = z.infer<typeof moodSchema> & { userId: string; id: string }

// ========================================
// SERVER ACTIONS
// ========================================

/**
 * Créer ou mettre à jour une entrée de mood pour une date donnée
 */
export async function createMoodEntry(data: CreateMoodInput) {
  try {
    const validatedData = moodSchema.parse(data)

    // Normaliser la date au début de la journée
    const moodDate = validatedData.date || new Date()
    moodDate.setHours(0, 0, 0, 0)

    // Vérifier si un mood existe déjà pour cette date
    const existingMood = await prisma.moodEntry.findFirst({
      where: {
        userId: data.userId,
        date: moodDate,
      },
    })

    if (existingMood) {
      // Mettre à jour le mood existant
      const updatedMood = await prisma.moodEntry.update({
        where: { id: existingMood.id },
        data: {
          emoji: validatedData.emoji,
          notes: validatedData.notes,
        },
      })
      revalidatePath('/mood')
      return { success: true, mood: updatedMood, isNew: false }
    } else {
      // Créer un nouveau mood
      const newMood = await prisma.moodEntry.create({
        data: {
          userId: data.userId,
          emoji: validatedData.emoji,
          date: moodDate,
          notes: validatedData.notes,
        },
      })
      revalidatePath('/mood')
      return { success: true, mood: newMood, isNew: true }
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message }
    }
    console.error('Error creating/updating mood:', error)
    return { success: false, error: 'Erreur lors de l\'enregistrement du mood' }
  }
}

/**
 * Récupérer les moods d'un utilisateur pour une période donnée
 */
export async function getMoodEntries(userId: string, startDate?: Date, endDate?: Date) {
  try {
    const whereClause: any = { userId }

    // Si des dates sont fournies, filtrer par période
    if (startDate || endDate) {
      whereClause.date = {}
      if (startDate) {
        const start = new Date(startDate)
        start.setHours(0, 0, 0, 0)
        whereClause.date.gte = start
      }
      if (endDate) {
        const end = new Date(endDate)
        end.setHours(23, 59, 59, 999)
        whereClause.date.lte = end
      }
    }

    const moods = await prisma.moodEntry.findMany({
      where: whereClause,
      orderBy: { date: 'desc' },
    })

    return { success: true, moods }
  } catch (error) {
    console.error('Error fetching moods:', error)
    return { success: false, error: 'Erreur lors de la récupération des moods', moods: [] }
  }
}

/**
 * Récupérer le mood d'une date spécifique
 */
export async function getMoodByDate(userId: string, date: Date) {
  try {
    const moodDate = new Date(date)
    moodDate.setHours(0, 0, 0, 0)

    const mood = await prisma.moodEntry.findFirst({
      where: {
        userId,
        date: moodDate,
      },
    })

    if (!mood) {
      return { success: true, mood: null }
    }

    return { success: true, mood }
  } catch (error) {
    console.error('Error fetching mood by date:', error)
    return { success: false, error: 'Erreur lors de la récupération du mood' }
  }
}

/**
 * Supprimer un mood
 */
export async function deleteMoodEntry(moodId: string, userId: string) {
  try {
    // Vérifier que le mood appartient à l'utilisateur
    const existingMood = await prisma.moodEntry.findFirst({
      where: {
        id: moodId,
        userId,
      },
    })

    if (!existingMood) {
      return { success: false, error: 'Mood introuvable ou non autorisé' }
    }

    await prisma.moodEntry.delete({
      where: { id: moodId },
    })

    revalidatePath('/mood')
    return { success: true }
  } catch (error) {
    console.error('Error deleting mood:', error)
    return { success: false, error: 'Erreur lors de la suppression du mood' }
  }
}
