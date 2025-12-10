import { SkeletonForm } from '@/components/Skeletons'

/**
 * Loading state pour la page de création d'habitude
 * Affiche un skeleton pendant le chargement du formulaire
 */
export default function CreateHabitLoading() {
  return <SkeletonForm fields={8} />
}
