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
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { HABIT_COLORS, HABIT_COLOR_KEYS } from '@/lib/design-tokens'
import { cn } from '@/lib/utils'
import { EmojiPickerDrawer } from '@/components/habits/EmojiPickerDrawer'
import { Check, Calendar as CalendarIcon, X } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

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
  endDate: z.date().optional(),
  weekDays: z.array(z.number().min(0).max(6)).optional(), // Jours spécifiques pour weekly
  weeklyGoal: z.number().min(1).max(7).optional(), // Nombre de fois par semaine
  monthlyGoal: z.number().min(1).max(31).optional(),
  monthDays: z.array(z.number().min(1).max(31)).optional(), // Jours spécifiques du mois
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
  const [selectedMonthDays, setSelectedMonthDays] = useState<number[]>([])
  const [useSpecificWeekDays, setUseSpecificWeekDays] = useState(false)
  const [useSpecificMonthDays, setUseSpecificMonthDays] = useState(false)

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
  const endDate = watch('endDate')

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

  // Toggle jour du mois
  const toggleMonthDay = (day: number) => {
    setSelectedMonthDays((prev) => {
      if (prev.includes(day)) {
        const newDays = prev.filter((d) => d !== day)
        setValue('monthDays', newDays)
        return newDays
      } else {
        const newDays = [...prev, day].sort((a, b) => a - b)
        setValue('monthDays', newDays)
        return newDays
      }
    })
  }

  const onSubmit = (data: CreateHabitFormData) => {
    // Validation custom pour weekly
    if (data.frequency === 'weekly') {
      if (useSpecificWeekDays && (!data.weekDays || data.weekDays.length === 0)) {
        toast.error('Sélectionnez au moins un jour de la semaine')
        return
      }
      if (!useSpecificWeekDays && !data.weeklyGoal) {
        toast.error('Définissez un nombre de fois par semaine')
        return
      }
    }

    // Validation pour monthly
    if (data.frequency === 'monthly') {
      if (!data.monthlyGoal) {
        toast.error('Définissez un objectif mensuel')
        return
      }
      if (useSpecificMonthDays && (!data.monthDays || data.monthDays.length === 0)) {
        toast.error('Sélectionnez au moins un jour du mois')
        return
      }
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

      {/* Weekly: Configuration */}
      {selectedFrequency === 'weekly' && (
        <div className="space-y-4">
          {/* Choix: nombre de fois OU jours spécifiques */}
          <div className="space-y-2">
            <Label>Configuration hebdomadaire *</Label>
            
            {/* Nombre de fois par semaine */}
            {!useSpecificWeekDays && (
              <div className="space-y-2">
                <Input
                  type="number"
                  min="1"
                  max="7"
                  placeholder="Ex: 3 fois par semaine"
                  {...register('weeklyGoal', { valueAsNumber: true })}
                  className={errors.weeklyGoal ? 'border-[var(--error)]' : ''}
                />
                {errors.weeklyGoal && (
                  <p className="text-sm text-[var(--error)]">{errors.weeklyGoal.message}</p>
                )}
              </div>
            )}

            {/* Toggle vers jours spécifiques */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setUseSpecificWeekDays(!useSpecificWeekDays)
                if (!useSpecificWeekDays) {
                  setValue('weeklyGoal', undefined)
                } else {
                  setValue('weekDays', undefined)
                  setSelectedDays([])
                }
              }}
              className="w-full"
            >
              {useSpecificWeekDays 
                ? '← Utiliser un nombre de fois par semaine' 
                : 'Spécifier les jours précis →'}
            </Button>
          </div>

          {/* Sélection des jours spécifiques */}
          {useSpecificWeekDays && (
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
              {selectedDays.length === 0 && (
                <p className="text-sm text-foreground-400">
                  Sélectionnez au moins un jour
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Monthly: Configuration */}
      {selectedFrequency === 'monthly' && (
        <div className="space-y-4">
          {/* Objectif mensuel (toujours requis) */}
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

          {/* Toggle vers jours spécifiques */}
          <div className="space-y-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setUseSpecificMonthDays(!useSpecificMonthDays)
                if (!useSpecificMonthDays) {
                  setSelectedMonthDays([])
                  setValue('monthDays', undefined)
                }
              }}
              className="w-full"
            >
              {useSpecificMonthDays 
                ? '← N\'importe quels jours du mois' 
                : 'Spécifier les jours précis du mois →'}
            </Button>
          </div>

          {/* Sélection des jours spécifiques du mois */}
          {useSpecificMonthDays && (
            <div className="space-y-2">
              <Label>Jours du mois *</Label>
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleMonthDay(day)}
                    className={cn(
                      'py-2 rounded-lg text-xs font-medium transition-all cursor-pointer',
                      selectedMonthDays.includes(day)
                        ? 'bg-[var(--accent-purple)] text-background-100'
                        : 'bg-background-300 text-foreground-600 hover:bg-background-400'
                    )}
                  >
                    {day}
                  </button>
                ))}
              </div>
              {selectedMonthDays.length === 0 && (
                <p className="text-sm text-foreground-400">
                  Sélectionnez au moins un jour
                </p>
              )}
              {selectedMonthDays.some(d => d > 28) && (
                <p className="text-sm text-[var(--warning)] bg-background-200 p-2 rounded">
                  ⚠️ Attention : Les jours &gt; 28 ne seront pas disponibles pour les mois courts (ex: février)
                </p>
              )}
            </div>
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

      {/* Date de fin (optionnelle) */}
      <div className="space-y-2">
        <Label>Date de fin (optionnel)</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className={cn(
                'w-full justify-start text-left font-normal',
                !endDate && 'text-foreground-400'
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {endDate ? format(endDate, 'PPP', { locale: fr }) : 'Sélectionner une date'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={endDate}
              onSelect={(date) => setValue('endDate', date)}
              disabled={(date) => date < new Date()}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        {endDate && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setValue('endDate', undefined)}
            className="w-full text-foreground-400 hover:text-foreground-600"
          >
            <X className="mr-2 h-4 w-4" />
            Retirer la date de fin
          </Button>
        )}
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
