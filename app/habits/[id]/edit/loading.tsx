import { SkeletonForm } from '@/components/Skeletons'

/**
 * Loading state pour la page d'édition d'habitude
 * Affiche un skeleton pendant le chargement du formulaire de modification
 */
export default function EditHabitLoading() {
  return <SkeletonForm fields={8} />
}
