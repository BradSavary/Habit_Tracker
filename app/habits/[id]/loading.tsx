import { SkeletonHabitDetail } from '@/components/Skeletons'

/**
 * Loading state pour la page de détail d'habitude
 * Affiche un skeleton pendant le chargement des informations de l'habitude
 */
export default function HabitDetailLoading() {
  return <SkeletonHabitDetail />
}
