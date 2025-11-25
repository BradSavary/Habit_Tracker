import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

interface SkeletonButtonProps {
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

/**
 * SkeletonButton - Skeleton pour un bouton
 * Simule le chargement d'actions ou de boutons interactifs
 */
export function SkeletonButton({ 
  variant = 'default', 
  size = 'md',
  className 
}: SkeletonButtonProps) {
  const sizeClasses = {
    sm: 'h-8 w-20',
    md: 'h-10 w-24',
    lg: 'h-12 w-32',
  }

  return (
    <Skeleton 
      className={cn(
        'rounded-lg',
        sizeClasses[size],
        variant === 'outline' && 'border border-muted',
        className
      )} 
    />
  )
}
