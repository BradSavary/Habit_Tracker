import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

interface SkeletonMoodCalendarProps {
  className?: string
}

/**
 * SkeletonMoodCalendar - Skeleton pour le calendrier d'humeur
 * Simule la grille mensuelle avec les jours
 */
export function SkeletonMoodCalendar({ className }: SkeletonMoodCalendarProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {/* Header du mois */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-32" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <Skeleton className="h-8 w-8 rounded-lg" />
        </div>
      </div>

      {/* Légende */}
      <Skeleton className="h-10 w-full rounded-lg" />

      {/* Jours de la semaine */}
      <div className="grid grid-cols-7 gap-2">
        {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, i) => (
          <div key={i} className="text-center">
            <Skeleton className="h-4 w-4 mx-auto" />
          </div>
        ))}
      </div>

      {/* Grille des jours (5 semaines) */}
      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: 35 }).map((_, i) => (
          <Skeleton key={i} className="aspect-square rounded-lg" />
        ))}
      </div>
    </div>
  )
}
