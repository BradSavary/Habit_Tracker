import { SkeletonProgression } from '@/components/Skeletons'

/**
 * Loading state pour la page Progression
 * Affiche un skeleton pendant le chargement de la timeline des niveaux
 */
export default function ProgressionLoading() {
  return <SkeletonProgression />
}
