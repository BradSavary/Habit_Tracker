'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createHabit } from '@/lib/actions/habits'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { HABIT_COLORS, HABIT_COLOR_KEYS } from '@/lib/design-tokens'
import { cn } from '@/lib/utils'
import { EmojiPickerDrawer } from '@/components/habits/EmojiPickerDrawer'
import { Check } from 'lucide-react'

/**
 * CreateHabitForm - Formulaire de création d'habitude
 * 
 * Justification 'use client':
 * - React Hook Form pour gestion du formulaire
 * - Interactions complexes (emoji picker, sélection de jours)
 * - Validation client-side + server-side
 */

// ========================================
// VALIDATION SCHEMA
// ========================================

const createHabitSchema = z.object({
  name: z.string().min(1, 'Le nom est requis').max(100, 'Le nom est trop long'),
  emoji: z.string().min(1, 'Sélectionnez un emoji'),
  color: z.enum(['purple', 'blue', 'green', 'orange', 'pink', 'teal']),
  category: z.enum([
    'Santé',
    'Productivité',
    'Sport',
    'Créativité',
    'Social',
    'Apprentissage',
    'Autre',
  ]),
  frequency: z.enum(['daily', 'weekly', 'monthly']),
  description: z.string().max(500, 'La description est trop longue').optional(),
  weekDays: z.array(z.number().min(0).max(6)).optional(),
  monthlyGoal: z.number().min(1).max(31).optional(),
})

type CreateHabitFormData = z.infer<typeof createHabitSchema>

const DAYS_OF_WEEK = [
  { value: 1, label: 'Lun' },
  { value: 2, label: 'Mar' },
  { value: 3, label: 'Mer' },
  { value: 4, label: 'Jeu' },
  { value: 5, label: 'Ven' },
  { value: 6, label: 'Sam' },
  { value: 0, label: 'Dim' },
]

// ========================================
// COMPONENT
// ========================================

interface CreateHabitFormProps {
  userId: string
  userLevel: number
}

export function CreateHabitForm({ userId, userLevel }: CreateHabitFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [selectedDays, setSelectedDays] = useState<number[]>([])

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<CreateHabitFormData>({
    resolver: zodResolver(createHabitSchema),
    defaultValues: {
      color: 'purple',
      category: 'Santé',
      frequency: 'daily',
      emoji: '✨',
    },
  })

  const selectedEmoji = watch('emoji')
  const selectedColor = watch('color')
  const selectedFrequency = watch('frequency')

  // Toggle jour de la semaine
  const toggleDay = (day: number) => {
    setSelectedDays((prev) => {
      if (prev.includes(day)) {
        const newDays = prev.filter((d) => d !== day)
        setValue('weekDays', newDays)
        return newDays
      } else {
        const newDays = [...prev, day]
        setValue('weekDays', newDays)
        return newDays
      }
    })
  }

  const onSubmit = (data: CreateHabitFormData) => {
    // Validation custom pour weekly
    if (data.frequency === 'weekly' && (!data.weekDays || data.weekDays.length === 0)) {
      toast.error('Sélectionnez au moins un jour de la semaine')
      return
    }

    // Validation pour monthly
    if (data.frequency === 'monthly' && !data.monthlyGoal) {
      toast.error('Définissez un objectif mensuel')
      return
    }

    startTransition(async () => {
      const result = await createHabit({
        ...data,
        userId,
      })

      if (result.success) {
        toast.success('Habitude créée ! 🎉', {
          description: `"${data.name}" a été ajoutée à vos habitudes`,
        })
        router.push('/dashboard')
      } else {
        toast.error('Erreur', {
          description: result.error || 'Impossible de créer l\'habitude',
        })
      }
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Nom */}
      <div className="space-y-2">
        <Label htmlFor="name">Nom de l&apos;habitude *</Label>
        <Input
          id="name"
          placeholder="Ex: Méditer 10 minutes"
          {...register('name')}
          className={errors.name ? 'border-[var(--error)]' : ''}
        />
        {errors.name && (
          <p className="text-sm text-[var(--error)]">{errors.name.message}</p>
        )}
      </div>

      {/* Emoji */}
      <div className="space-y-2">
        <Label>Emoji *</Label>
        <EmojiPickerDrawer
          selectedEmoji={selectedEmoji}
          onEmojiSelect={(emoji: string) => setValue('emoji', emoji)}
          userLevel={userLevel}
        />
        {errors.emoji && (
          <p className="text-sm text-[var(--error)]">{errors.emoji.message}</p>
        )}
      </div>

      {/* Couleur */}
      <div className="space-y-2">
        <Label>Couleur *</Label>
        <div className="grid grid-cols-6 gap-3">
          {HABIT_COLOR_KEYS.map((colorKey) => (
            <button
              key={colorKey}
              type="button"
              onClick={() => setValue('color', colorKey)}
              className={cn(
                'w-full aspect-square rounded-lg transition-all cursor-pointer hover:scale-105',
                HABIT_COLORS[colorKey].class,
                selectedColor === colorKey &&
                  'ring-4 ring-foreground-800 ring-offset-2 ring-offset-background-100'
              )}
            >
              {selectedColor === colorKey && (
                <Check className="h-6 w-6 text-background-100 mx-auto" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Catégorie */}
      <div className="space-y-2">
        <Label>Catégorie *</Label>
        <div className="grid grid-cols-2 gap-2">
          {['Santé', 'Productivité', 'Sport', 'Créativité', 'Social', 'Apprentissage', 'Autre'].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setValue('category', cat as CreateHabitFormData['category'])}
              className={cn(
                'py-3 px-4 rounded-lg text-sm font-medium transition-all cursor-pointer',
                watch('category') === cat
                  ? 'bg-[var(--accent-purple)] text-background-100'
                  : 'bg-background-300 text-foreground-600 hover:bg-background-400'
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Fréquence */}
      <div className="space-y-2">
        <Label>Fréquence *</Label>
        <div className="flex justify-between gap-1">
          {[
            { value: 'daily', label: 'Quotidienne' },
            { value: 'weekly', label: 'Hebdomadaire' },
            { value: 'monthly', label: 'Mensuelle' },
          ].map((freq) => (
            <button
              key={freq.value}
              type="button"
              onClick={() => setValue('frequency', freq.value as CreateHabitFormData['frequency'])}
              className={cn(
                'min-w-fit py-3 rounded-lg text-sm font-medium transition-all cursor-pointer pl-[0.5rem] pr-[0.5rem]',
                selectedFrequency === freq.value
                  ? 'bg-[var(--accent-purple)] text-background-100'
                  : 'bg-background-300 text-foreground-600 hover:bg-background-400'
              )}
            >
              {freq.label}
            </button>
          ))}
        </div>
      </div>

      {/* Weekly: Sélection des jours */}
      {selectedFrequency === 'weekly' && (
        <div className="space-y-2">
          <Label>Jours de la semaine *</Label>
          <div className="grid grid-cols-7 gap-2">
            {DAYS_OF_WEEK.map((day) => (
              <button
                key={day.value}
                type="button"
                onClick={() => toggleDay(day.value)}
                className={cn(
                  'py-3 rounded-lg text-sm font-medium transition-all cursor-pointer',
                  selectedDays.includes(day.value)
                    ? 'bg-[var(--accent-purple)] text-background-100'
                    : 'bg-background-300 text-foreground-600 hover:bg-background-400'
                )}
              >
                {day.label}
              </button>
            ))}
          </div>
          {selectedFrequency === 'weekly' && selectedDays.length === 0 && (
            <p className="text-sm text-foreground-400">
              Sélectionnez au moins un jour
            </p>
          )}
        </div>
      )}

      {/* Monthly: Objectif */}
      {selectedFrequency === 'monthly' && (
        <div className="space-y-2">
          <Label htmlFor="monthlyGoal">Objectif mensuel *</Label>
          <Input
            id="monthlyGoal"
            type="number"
            min="1"
            max="31"
            placeholder="Ex: 20 fois par mois"
            {...register('monthlyGoal', { valueAsNumber: true })}
            className={errors.monthlyGoal ? 'border-[var(--error)]' : ''}
          />
          {errors.monthlyGoal && (
            <p className="text-sm text-[var(--error)]">{errors.monthlyGoal.message}</p>
          )}
        </div>
      )}

      {/* Description (optionnelle) */}
      <div className="space-y-2">
        <Label htmlFor="description">Description (optionnel)</Label>
        <Input
          id="description"
          placeholder="Ex: Chaque matin à 7h"
          {...register('description')}
        />
      </div>

      {/* Submit */}
      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isPending}
          className="flex-1"
        >
          Annuler
        </Button>
        <Button type="submit" disabled={isPending} className="flex-1">
          {isPending ? 'Création...' : 'Créer l\'habitude'}
        </Button>
      </div>
    </form>
  )
}
