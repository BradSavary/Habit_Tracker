import { SkeletonMoodPage } from '@/components/Skeletons'

/**
 * Loading state pour la page Mood
 * Affiche un skeleton pendant le chargement du calendrier d'humeur
 */
export default function MoodLoading() {
  return <SkeletonMoodPage />
}
