import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

interface SkeletonAvatarProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

/**
 * SkeletonAvatar - Skeleton pour un avatar circulaire
 * Utilisé pour le profil utilisateur, emojis, etc.
 */
export function SkeletonAvatar({ size = 'md', className }: SkeletonAvatarProps) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-16 w-16',
    xl: 'h-24 w-24',
  }

  return (
    <Skeleton 
      className={cn(
        'rounded-full',
        sizeClasses[size],
        className
      )} 
    />
  )
}
