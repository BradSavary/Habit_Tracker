'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { createMoodEntry } from '@/lib/actions/mood'
import { toast } from 'sonner'

type MoodEntry = {
  id: string
  emoji: string
  date: Date
  notes: string | null
}

type MoodContentProps = {
  userId: string
  initialMoods: MoodEntry[]
}

const MOOD_EMOJIS = [
  { emoji: '😄', label: 'Très bien' },
  { emoji: '😊', label: 'Bien' },
  { emoji: '😐', label: 'Neutre' },
  { emoji: '😔', label: 'Pas bien' },
  { emoji: '😢', label: 'Très mal' },
]

const DAYS_OF_WEEK = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']

export function MoodContent({ userId, initialMoods }: MoodContentProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [isPending, startTransition] = useTransition()

  // Convertir les moods en map par date (YYYY-MM-DD)
  const moodsByDate = initialMoods.reduce(
    (acc, mood) => {
      const dateKey = new Date(mood.date).toISOString().split('T')[0]
      acc[dateKey] = mood
      return acc
    },
    {} as Record<string, MoodEntry>
  )

  // Générer les jours du calendrier
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    // Premier jour du mois
    const firstDay = new Date(year, month, 1)
    // Dernier jour du mois
    const lastDay = new Date(year, month + 1, 0)

    // Jour de la semaine du premier jour (0 = dimanche)
    let firstDayOfWeek = firstDay.getDay()
    // Convertir en format lundi = 0
    firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1

    const days: (Date | null)[] = []

    // Ajouter les jours vides avant le début du mois
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null)
    }

    // Ajouter tous les jours du mois
    for (let day = 1; day <= lastDay.getDate(); day++) {
      days.push(new Date(year, month, day))
    }

    return days
  }

  const handlePreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const handleAddMood = (date: Date) => {
    // Permettre la modification seulement pour aujourd'hui
    if (isToday(date)) {
      setSelectedDate(date)
      setIsDrawerOpen(true)
    }
  }

  const handleSelectMood = (emoji: string) => {
    if (!selectedDate) return

    const existingMood = getMoodForDate(selectedDate)

    startTransition(async () => {
      const result = await createMoodEntry({
        userId,
        emoji,
        date: selectedDate,
        notes: '',
      })

      if (result.success) {
        if (existingMood) {
          toast.success('Humeur modifiée')
        } else {
          toast.success('Humeur enregistrée')
        }
        setIsDrawerOpen(false)
        setSelectedDate(null)
        // Rafraîchir la page pour voir les changements
        window.location.reload()
      } else {
        toast.error(result.error || 'Erreur lors de l\'enregistrement')
      }
    })
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  const getMoodForDate = (date: Date): MoodEntry | undefined => {
    const dateKey = date.toISOString().split('T')[0]
    return moodsByDate[dateKey]
  }

  const calendarDays = generateCalendarDays()

  return (
    <div className="min-h-screen bg-background pb-20 px-4">
      {/* En-tête */}
      <div className="flex items-center justify-between py-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={handlePreviousMonth}
          className="h-10 w-10"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        
        <h2 className="text-xl font-semibold">
          {currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
        </h2>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={handleNextMonth}
          className="h-10 w-10"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>

      {/* Légende */}
      <div className="mb-4 p-3 bg-muted/30 rounded-lg border border-muted">
        <p className="text-xs text-muted-foreground text-center">
          Seul le jour actuel (surligné) peut être modifié. Les autres jours sont grisés.
        </p>
      </div>

      {/* Calendrier */}
      <div className="space-y-4">
        {/* En-têtes des jours */}
        <div className="grid grid-cols-7 gap-2 text-center">
          {DAYS_OF_WEEK.map((day) => (
            <div key={day} className="text-sm font-medium text-muted-foreground">
              {day}
            </div>
          ))}
        </div>

        {/* Grille des jours */}
        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map((date, index) => {
            if (!date) {
              return <div key={`empty-${index}`} className="aspect-square" />
            }

            const mood = getMoodForDate(date)
            const isTodayDate = isToday(date)

            return (
              <div
                key={date.toISOString()}
                className={`aspect-square relative flex flex-col items-center justify-center rounded-lg border ${
                  isTodayDate
                    ? 'bg-card border-primary/50'
                    : mood
                    ? 'bg-card opacity-70'
                    : 'bg-muted/30 opacity-50'
                }`}
              >
                {/* Numéro du jour */}
                <span
                  className={`text-sm ${
                    isTodayDate ? 'text-primary font-semibold' : 'text-muted-foreground'
                  }`}
                >
                  {date.getDate()}
                </span>

                {/* Contenu du jour */}
                {mood && isTodayDate ? (
                  // Emoji cliquable pour aujourd'hui avec mood
                  <button
                    onClick={() => handleAddMood(date)}
                    className="text-2xl hover:scale-110 transition-transform cursor-pointer"
                    style={{
                      fontFamily:
                        '"Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif',
                    }}
                    aria-label="Modifier l'humeur du jour"
                  >
                    {mood.emoji}
                  </button>
                ) : mood ? (
                  // Emoji non cliquable pour les jours passés/futurs
                  <div
                    className="text-2xl"
                    style={{
                      fontFamily:
                        '"Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif',
                    }}
                  >
                    {mood.emoji}
                  </div>
                ) : isTodayDate ? (
                  // Bouton + pour aujourd'hui sans mood
                  <button
                    onClick={() => handleAddMood(date)}
                    className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
                    aria-label="Ajouter une humeur"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                ) : (
                  // Cercle vide grisé pour les autres jours (non cliquable)
                  <div className="w-8 h-8 rounded-full border border-muted/50" />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Drawer pour sélectionner un emoji */}
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>
              {selectedDate && getMoodForDate(selectedDate)
                ? 'Modifier ton humeur'
                : 'Comment te sens-tu ?'}
            </DrawerTitle>
            <DrawerDescription>
              {selectedDate && getMoodForDate(selectedDate)
                ? 'Choisis un nouvel emoji pour modifier ton humeur du jour'
                : 'Sélectionne l\'emoji qui correspond le mieux à ton humeur du jour'}
            </DrawerDescription>
          </DrawerHeader>
          
          <div className="px-4 py-6">
            <div className="grid grid-cols-5 gap-4">
              {MOOD_EMOJIS.map(({ emoji, label }) => (
                <button
                  key={emoji}
                  onClick={() => handleSelectMood(emoji)}
                  disabled={isPending}
                  className="flex flex-col items-center gap-2 p-4 rounded-lg border bg-card hover:bg-accent hover:border-primary transition-all cursor-pointer disabled:opacity-50"
                >
                  <span
                    className="text-4xl"
                    style={{
                      fontFamily:
                        '"Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif',
                    }}
                  >
                    {emoji}
                  </span>
                  <span className="text-xs text-center text-muted-foreground">
                    {label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline" disabled={isPending}>
                Annuler
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  )
}
