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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { HABIT_COLORS, HABIT_COLOR_KEYS } from '@/lib/design-tokens'
import { cn } from '@/lib/utils'
import { EmojiPickerDrawer } from '@/components/habits/EmojiPickerDrawer'
import { Check, Calendar as CalendarIcon, X, Info } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

/**
 * CreateHabitForm - Formulaire de création d'habitude (Version refactorisée)
 * 
 * Amélioration UX :
 * - Organisation en sections visuelles (Cards)
 * - Options avancées repliables (Accordion)
 * - Hiérarchie claire et progressive
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
  weekDays: z.array(z.number().min(0).max(6)).optional(),
  weeklyGoal: z.number().min(1).max(7).optional(),
  monthlyGoal: z.number().min(1).max(31).optional(),
  monthDays: z.array(z.number().min(1).max(31)).optional(),
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

const CATEGORIES = [
  'Santé',
  'Productivité',
  'Sport',
  'Créativité',
  'Social',
  'Apprentissage',
  'Autre',
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
  const selectedCategory = watch('category')
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
      if (useSpecificMonthDays && (!data.monthDays || data.monthDays.length === 0)) {
        toast.error('Sélectionnez au moins un jour du mois')
        return
      }
      if (!useSpecificMonthDays && !data.monthlyGoal) {
        toast.error('Définissez un objectif mensuel')
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
      {/* SECTION 1: IDENTITÉ DE L'HABITUDE */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">{selectedEmoji}</span>
            Identité de l&apos;habitude
          </CardTitle>
          <CardDescription>
            Donnez un nom, un emoji et une couleur à votre habitude
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Nom */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-base font-semibold">
              Nom de l&apos;habitude *
            </Label>
            <Input
              id="name"
              placeholder="Ex: Méditer 10 minutes"
              {...register('name')}
              className={cn(
                'text-base',
                errors.name ? 'border-[var(--error)]' : ''
              )}
            />
            {errors.name && (
              <p className="text-sm text-[var(--error)]">{errors.name.message}</p>
            )}
          </div>

          {/* Emoji + Couleur */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Emoji */}
            <div className="space-y-2">
              <Label className="text-base font-semibold">Emoji *</Label>
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
              <Label className="text-base font-semibold">Couleur *</Label>
              <div className="grid grid-cols-6 gap-2">
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
                    title={HABIT_COLORS[colorKey].name}
                  >
                    {selectedColor === colorKey && (
                      <Check className="h-5 w-5 text-background-100 mx-auto" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Catégorie */}
          <div className="space-y-2">
            <Label className="text-base font-semibold">Catégorie *</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setValue('category', cat as CreateHabitFormData['category'])}
                  className={cn(
                    'py-3 px-4 rounded-lg text-sm font-medium transition-all cursor-pointer',
                    selectedCategory === cat
                      ? 'bg-[var(--accent-purple)] text-background-100'
                      : 'bg-background-300 text-foreground-600 hover:bg-background-400'
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SECTION 2: FRÉQUENCE ET RÉCURRENCE */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle>Fréquence et récurrence</CardTitle>
          <CardDescription>
            Définissez à quelle fréquence vous souhaitez pratiquer cette habitude
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Fréquence */}
          <div className="space-y-2">
            <Label className="text-base font-semibold">Type de fréquence *</Label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'daily', label: 'Quotidienne' },
                { value: 'weekly', label: 'Hebdo' },
                { value: 'monthly', label: 'Mensuelle' },
              ].map((freq) => (
                <button
                  key={freq.value}
                  type="button"
                  onClick={() => setValue('frequency', freq.value as CreateHabitFormData['frequency'])}
                  className={cn(
                    'py-4 px-2 rounded-lg text-sm font-medium transition-all cursor-pointer',
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

          {/* Configuration hebdomadaire */}
          {selectedFrequency === 'weekly' && (
            <div className="space-y-4 pt-4 border-t border-background-400">
              <div className="flex items-start gap-2 bg-background-200 p-3 rounded-lg">
                <Info className="h-5 w-5 text-[var(--accent-blue)] flex-shrink-0 mt-0.5" />
                <div className="text-sm text-foreground-600">
                  Choisissez un <strong>nombre de fois par semaine</strong> ou des <strong>jours précis</strong>.
                </div>
              </div>

              {!useSpecificWeekDays ? (
                <div className="space-y-2">
                  <Label htmlFor="weeklyGoal" className="text-base font-semibold">
                    Nombre de fois par semaine *
                  </Label>
                  <Input
                    id="weeklyGoal"
                    type="number"
                    min="1"
                    max="7"
                    placeholder="Ex: 3"
                    {...register('weeklyGoal', { valueAsNumber: true })}
                    className={cn('text-base', errors.weeklyGoal ? 'border-[var(--error)]' : '')}
                  />
                  {errors.weeklyGoal && (
                    <p className="text-sm text-[var(--error)]">{errors.weeklyGoal.message}</p>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <Label className="text-base font-semibold">Jours de la semaine *</Label>
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
                  {selectedDays.length > 0 && (
                    <p className="text-sm text-foreground-500">
                      ✓ {selectedDays.length} jour{selectedDays.length > 1 ? 's' : ''} sélectionné{selectedDays.length > 1 ? 's' : ''}
                    </p>
                  )}
                </div>
              )}

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
                  ? '← Revenir au nombre de fois' 
                  : 'Choisir des jours précis →'}
              </Button>
            </div>
          )}

          {/* Configuration mensuelle */}
          {selectedFrequency === 'monthly' && (
            <div className="space-y-4 pt-4 border-t border-background-400">
              <div className="flex items-start gap-2 bg-background-200 p-3 rounded-lg">
                <Info className="h-5 w-5 text-[var(--accent-blue)] flex-shrink-0 mt-0.5" />
                <div className="text-sm text-foreground-600">
                  Choisissez un <strong>objectif mensuel</strong> ou des <strong>jours précis du mois</strong>.
                </div>
              </div>

              {!useSpecificMonthDays ? (
                <div className="space-y-2">
                  <Label htmlFor="monthlyGoal" className="text-base font-semibold">
                    Objectif mensuel *
                  </Label>
                  <Input
                    id="monthlyGoal"
                    type="number"
                    min="1"
                    max="31"
                    placeholder="Ex: 20"
                    {...register('monthlyGoal', { valueAsNumber: true })}
                    className={cn('text-base', errors.monthlyGoal ? 'border-[var(--error)]' : '')}
                  />
                  {errors.monthlyGoal && (
                    <p className="text-sm text-[var(--error)]">{errors.monthlyGoal.message}</p>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <Label className="text-base font-semibold">Jours du mois *</Label>
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
                  {selectedMonthDays.length > 0 && (
                    <p className="text-sm text-foreground-500">
                      ✓ {selectedMonthDays.length} jour{selectedMonthDays.length > 1 ? 's' : ''} sélectionné{selectedMonthDays.length > 1 ? 's' : ''}
                    </p>
                  )}
                  {selectedMonthDays.some(d => d > 28) && (
                    <p className="text-sm text-[var(--warning)] bg-[var(--warning)]/10 p-2 rounded flex items-start gap-2">
                      <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
                      Les jours &gt; 28 ne seront pas disponibles pour les mois courts (ex: février)
                    </p>
                  )}
                </div>
              )}

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setUseSpecificMonthDays(!useSpecificMonthDays)
                  if (!useSpecificMonthDays) {
                    setSelectedMonthDays([])
                    setValue('monthDays', undefined)
                    setValue('monthlyGoal', undefined)
                  } else {
                    setSelectedMonthDays([])
                    setValue('monthDays', undefined)
                  }
                }}
                className="w-full"
              >
                {useSpecificMonthDays 
                  ? '← Revenir à l\'objectif mensuel' 
                  : 'Choisir des jours précis →'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* SECTION 3: OPTIONS AVANCÉES (Accordion) */}
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="advanced" className="border-2 rounded-lg px-4 bg-background-200">
          <AccordionTrigger className="text-base font-semibold hover:no-underline">
            Options avancées (facultatif)
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-base font-semibold">
                Description
              </Label>
              <Input
                id="description"
                placeholder="Ex: Chaque matin à 7h"
                {...register('description')}
                className="text-base"
              />
              <p className="text-sm text-foreground-400">
                Ajoutez des détails sur votre habitude (optionnel)
              </p>
            </div>

            {/* Date de fin */}
            <div className="space-y-2">
              <Label className="text-base font-semibold">Date de fin</Label>
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
                    {endDate ? format(endDate, 'PPP', { locale: fr }) : 'Aucune date de fin'}
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
              <p className="text-sm text-foreground-400">
                Définissez une date limite pour cette habitude (optionnel)
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* ACTIONS */}
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
        <Button 
          type="submit" 
          disabled={isPending} 
          className="flex-1 bg-[var(--accent-purple)] hover:bg-[var(--accent-purple)] hover:opacity-90"
        >
          {isPending ? 'Création...' : 'Créer l\'habitude'}
        </Button>
      </div>
    </form>
  )
}
