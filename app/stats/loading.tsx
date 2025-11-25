import { SkeletonStats } from '@/components/Skeletons'

/**
 * Loading state pour la page Statistiques
 * Affiche un skeleton pendant le chargement des données de stats
 */
export default function StatsLoading() {
  return <SkeletonStats />
}
