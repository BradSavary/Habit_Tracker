/**
 * Système de progression et niveaux
 * 
 * Règles :
 * - Niveau max : 50
 * - XP nécessaire augmente progressivement (formule exponentielle)
 * - Récompenses : emoji débloqué à chaque niveau
 * - XP gagné : varie selon la fréquence de l'habitude
 */

export const MAX_LEVEL = 50
export const BASE_XP = 100 // XP nécessaire pour level 2

/**
 * Calcule le niveau actuel basé sur l'XP total
 * Formule progressive : XP requis augmente de 15% par niveau
 */
export function calculateLevel(xp: number): number {
  if (xp < 0) return 1
  
  let currentLevel = 1
  let xpRequired = 0
  
  while (currentLevel < MAX_LEVEL) {
    const xpForNextLevel = getXpForNextLevel(currentLevel)
    xpRequired += xpForNextLevel
    
    if (xp < xpRequired) {
      return currentLevel
    }
    
    currentLevel++
  }
  
  return MAX_LEVEL
}

/**
 * Calcule l'XP nécessaire pour passer au niveau suivant
 * Formule exponentielle pour difficulté croissante
 */
export function getXpForNextLevel(currentLevel: number): number {
  if (currentLevel >= MAX_LEVEL) return 0
  
  // Formule : BASE_XP * (1.15 ^ (level - 1))
  // Exemple : Level 1→2 = 100 XP, Level 2→3 = 115 XP, Level 10→11 = 371 XP
  return Math.floor(BASE_XP * Math.pow(1.15, currentLevel - 1))
}

/**
 * Calcule l'XP déjà accumulé dans le niveau actuel
 */
export function getCurrentLevelXp(xp: number): number {
  const level = calculateLevel(xp)
  if (level === 1) return xp
  
  let totalXpForPreviousLevels = 0
  for (let i = 1; i < level; i++) {
    totalXpForPreviousLevels += getXpForNextLevel(i)
  }
  
  return xp - totalXpForPreviousLevels
}

/**
 * Calcule le pourcentage de progression vers le niveau suivant
 */
export function getLevelProgress(xp: number): number {
  const level = calculateLevel(xp)
  if (level >= MAX_LEVEL) return 100
  
  const currentLevelXp = getCurrentLevelXp(xp)
  const xpForNext = getXpForNextLevel(level)
  
  return Math.min(100, Math.floor((currentLevelXp / xpForNext) * 100))
}

/**
 * Calcule l'XP total nécessaire pour atteindre un niveau donné
 */
export function getTotalXpForLevel(targetLevel: number): number {
  if (targetLevel <= 1) return 0
  
  let totalXp = 0
  for (let i = 1; i < targetLevel && i <= MAX_LEVEL; i++) {
    totalXp += getXpForNextLevel(i)
  }
  
  return totalXp
}

/**
 * Calcule l'XP gagné selon la fréquence de l'habitude
 * Plus c'est difficile (moins fréquent), plus on gagne d'XP
 */
export function getXpForCompletion(frequency: string): number {
  const XP_REWARDS = {
    daily: 10,    // Quotidien = petit gain (mais additionné = beaucoup)
    weekly: 25,   // Hebdomadaire = gain moyen
    monthly: 50,  // Mensuel = gros gain
  }
  
  return XP_REWARDS[frequency as keyof typeof XP_REWARDS] || 10
}

/**
 * Vérifie si l'utilisateur a monté de niveau après l'ajout d'XP
 * Retourne le nouveau niveau si level up, sinon null
 */
export function checkLevelUp(currentXp: number, xpGained: number): {
  hasLeveledUp: boolean
  newLevel: number
  previousLevel: number
} {
  const previousLevel = calculateLevel(currentXp)
  const newXp = currentXp + xpGained
  const newLevel = calculateLevel(newXp)
  
  return {
    hasLeveledUp: newLevel > previousLevel,
    newLevel,
    previousLevel,
  }
}

/**
 * Génère les statistiques de progression pour l'affichage
 */
export function getProgressionStats(xp: number) {
  const level = calculateLevel(xp)
  const currentLevelXp = getCurrentLevelXp(xp)
  const xpForNext = getXpForNextLevel(level)
  const progress = getLevelProgress(xp)
  const xpRemaining = xpForNext - currentLevelXp
  
  return {
    level,
    xp,
    currentLevelXp,
    xpForNextLevel: xpForNext,
    progressPercentage: progress,
    xpRemaining,
    isMaxLevel: level >= MAX_LEVEL,
  }
}
