import { SkeletonProfile } from '@/components/Skeletons'

/**
 * Loading state pour la page Profile
 * Affiche un skeleton pendant le chargement du profil et des stats
 */
export default function ProfileLoading() {
  return <SkeletonProfile />
}
