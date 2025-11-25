import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

interface SkeletonFormProps {
  fields?: number
  className?: string
}

/**
 * SkeletonForm - Skeleton pour un formulaire
 * Simule le chargement d'un formulaire avec plusieurs champs
 */
export function SkeletonForm({ fields = 6, className }: SkeletonFormProps) {
  return (
    <div className={cn('container mx-auto px-4 py-6 space-y-6 max-w-2xl', className)}>
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>

      {/* Formulaire */}
      <div className="space-y-6 rounded-lg bg-background-200 p-6">
        {Array.from({ length: fields }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
        ))}

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Skeleton className="h-10 flex-1 rounded-lg" />
          <Skeleton className="h-10 flex-1 rounded-lg" />
        </div>
      </div>
    </div>
  )
}
