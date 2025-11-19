/**
 * Système d'emojis débloquables par niveau
 * 
 * Règles :
 * - 8 emojis de base (niveau 1)
 * - 1 emoji débloqué par niveau (niveaux 2-50)
 * - Total : 50 emojis
 */

export type EmojiReward = {
  emoji: string
  level: number
  category: string
  name: string
}

/**
 * Liste complète des 50 emojis
 * - Niveaux 1-8 : Emojis de base (gratuits)
 * - Niveaux 9-50 : Emojis à débloquer
 */
export const EMOJI_REWARDS: EmojiReward[] = [
  // === EMOJIS DE BASE (Niveau 1-8) ===
  { emoji: '💪', level: 1, category: 'Sport', name: 'Muscle' },
  { emoji: '📚', level: 1, category: 'Apprentissage', name: 'Livres' },
  { emoji: '🎨', level: 1, category: 'Créativité', name: 'Palette' },
  { emoji: '🧘', level: 1, category: 'Santé', name: 'Méditation' },
  { emoji: '💼', level: 1, category: 'Productivité', name: 'Travail' },
  { emoji: '❤️', level: 1, category: 'Social', name: 'Cœur' },
  { emoji: '🌟', level: 1, category: 'Motivation', name: 'Étoile' },
  { emoji: '✅', level: 1, category: 'Productivité', name: 'Check' },
  
  // === EMOJIS DÉBLOQUABLES (Niveau 2-50) ===
  // Niveau 2-10
  { emoji: '🏃', level: 2, category: 'Sport', name: 'Course' },
  { emoji: '🚴', level: 3, category: 'Sport', name: 'Vélo' },
  { emoji: '🏋️', level: 4, category: 'Sport', name: 'Haltères' },
  { emoji: '🧗', level: 5, category: 'Sport', name: 'Escalade' },
  { emoji: '🏊', level: 6, category: 'Sport', name: 'Natation' },
  { emoji: '⚽', level: 7, category: 'Sport', name: 'Football' },
  { emoji: '🎯', level: 8, category: 'Productivité', name: 'Cible' },
  { emoji: '📝', level: 9, category: 'Productivité', name: 'Note' },
  { emoji: '💡', level: 10, category: 'Créativité', name: 'Idée' },
  
  // Niveau 11-20
  { emoji: '🎭', level: 11, category: 'Créativité', name: 'Théâtre' },
  { emoji: '🎬', level: 12, category: 'Créativité', name: 'Cinéma' },
  { emoji: '🎵', level: 13, category: 'Créativité', name: 'Musique' },
  { emoji: '🎸', level: 14, category: 'Créativité', name: 'Guitare' },
  { emoji: '🎹', level: 15, category: 'Créativité', name: 'Piano' },
  { emoji: '📖', level: 16, category: 'Apprentissage', name: 'Livre ouvert' },
  { emoji: '🎓', level: 17, category: 'Apprentissage', name: 'Diplôme' },
  { emoji: '🧠', level: 18, category: 'Apprentissage', name: 'Cerveau' },
  { emoji: '🔬', level: 19, category: 'Apprentissage', name: 'Science' },
  { emoji: '💻', level: 20, category: 'Productivité', name: 'Ordinateur' },
  
  // Niveau 21-30
  { emoji: '☕', level: 21, category: 'Santé', name: 'Café' },
  { emoji: '🥗', level: 22, category: 'Santé', name: 'Salade' },
  { emoji: '🍎', level: 23, category: 'Santé', name: 'Pomme' },
  { emoji: '💧', level: 24, category: 'Santé', name: 'Eau' },
  { emoji: '😴', level: 25, category: 'Santé', name: 'Sommeil' },
  { emoji: '🌅', level: 26, category: 'Santé', name: 'Lever soleil' },
  { emoji: '🌙', level: 27, category: 'Santé', name: 'Nuit' },
  { emoji: '🧘‍♀️', level: 28, category: 'Santé', name: 'Yoga femme' },
  { emoji: '💆', level: 29, category: 'Santé', name: 'Massage' },
  { emoji: '🛀', level: 30, category: 'Santé', name: 'Bain' },
  
  // Niveau 31-40
  { emoji: '👥', level: 31, category: 'Social', name: 'Amis' },
  { emoji: '🤝', level: 32, category: 'Social', name: 'Poignée de main' },
  { emoji: '💬', level: 33, category: 'Social', name: 'Discussion' },
  { emoji: '📞', level: 34, category: 'Social', name: 'Téléphone' },
  { emoji: '🎉', level: 35, category: 'Social', name: 'Fête' },
  { emoji: '🎁', level: 36, category: 'Social', name: 'Cadeau' },
  { emoji: '🌻', level: 37, category: 'Nature', name: 'Tournesol' },
  { emoji: '🌳', level: 38, category: 'Nature', name: 'Arbre' },
  { emoji: '🌊', level: 39, category: 'Nature', name: 'Vague' },
  { emoji: '⛰️', level: 40, category: 'Nature', name: 'Montagne' },
  
  // Niveau 41-50 (Emojis prestigieux)
  { emoji: '🏆', level: 41, category: 'Motivation', name: 'Trophée' },
  { emoji: '👑', level: 42, category: 'Motivation', name: 'Couronne' },
  { emoji: '💎', level: 43, category: 'Motivation', name: 'Diamant' },
  { emoji: '🔥', level: 44, category: 'Motivation', name: 'Feu' },
  { emoji: '⚡', level: 45, category: 'Motivation', name: 'Éclair' },
  { emoji: '🌈', level: 46, category: 'Motivation', name: 'Arc-en-ciel' },
  { emoji: '🚀', level: 47, category: 'Motivation', name: 'Fusée' },
  { emoji: '🎖️', level: 48, category: 'Motivation', name: 'Médaille' },
  { emoji: '⭐', level: 49, category: 'Motivation', name: 'Étoile brillante' },
  { emoji: '🌠', level: 50, category: 'Motivation', name: 'Étoile filante' },
]

/**
 * Récupère les emojis disponibles pour un niveau donné
 * (tous les emojis jusqu'à ce niveau)
 */
export function getAvailableEmojis(userLevel: number): EmojiReward[] {
  return EMOJI_REWARDS.filter(reward => reward.level <= userLevel)
}

/**
 * Récupère les 8 emojis de base (niveau 1)
 */
export function getBaseEmojis(): EmojiReward[] {
  return EMOJI_REWARDS.filter(reward => reward.level === 1)
}

/**
 * Récupère l'emoji reward pour un niveau spécifique
 */
export function getEmojiForLevel(level: number): EmojiReward | undefined {
  return EMOJI_REWARDS.find(reward => reward.level === level)
}

/**
 * Vérifie si un emoji est débloqué pour un utilisateur
 */
export function isEmojiUnlocked(emoji: string, userLevel: number): boolean {
  const emojiReward = EMOJI_REWARDS.find(reward => reward.emoji === emoji)
  if (!emojiReward) return false
  
  return emojiReward.level <= userLevel
}

/**
 * Récupère les emojis par catégorie
 */
export function getEmojisByCategory(
  userLevel: number
): Record<string, EmojiReward[]> {
  const availableEmojis = getAvailableEmojis(userLevel)
  
  return availableEmojis.reduce(
    (acc, emoji) => {
      if (!acc[emoji.category]) {
        acc[emoji.category] = []
      }
      acc[emoji.category].push(emoji)
      return acc
    },
    {} as Record<string, EmojiReward[]>
  )
}

/**
 * Compte le nombre d'emojis débloqués par l'utilisateur
 */
export function countUnlockedEmojis(userLevel: number): {
  unlocked: number
  total: number
  percentage: number
} {
  const unlocked = getAvailableEmojis(userLevel).length
  const total = EMOJI_REWARDS.length
  const percentage = Math.floor((unlocked / total) * 100)
  
  return { unlocked, total, percentage }
}

/**
 * Récupère le prochain emoji à débloquer
 */
export function getNextEmojiReward(userLevel: number): EmojiReward | null {
  const nextLevel = userLevel + 1
  return getEmojiForLevel(nextLevel) || null
}

/**
 * Récupère les N prochains emojis à débloquer
 * @param userLevel - Niveau actuel de l'utilisateur
 * @param count - Nombre d'emojis à récupérer (par défaut 5)
 * @returns Array des prochains emojis ou array vide si niveau max
 */
export function getNextEmojis(userLevel: number, count: number = 5): EmojiReward[] {
  return EMOJI_REWARDS.filter(reward => reward.level > userLevel && reward.level <= userLevel + count)
    .slice(0, count)
}
