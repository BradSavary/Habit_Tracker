'use client'

import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { ThemeToggle } from '@/components/theme-toggle'
import { Trophy, Star, Lock } from 'lucide-react'
import { getProgressionStats } from '@/lib/progression'
import { getAvailableEmojis, EMOJI_REWARDS, countUnlockedEmojis, getNextEmojis } from '@/lib/emojis-system'

/**
 * ProfileContent - Contenu de la page profil
 * 
 * Justification 'use client':
 * - Aucune logique client nécessaire ici mais ThemeToggle est client
 * - Pourrait devenir client si interactions ajoutées
 */

type ProfileContentProps = {
  user: {
    name: string
    email: string
    level: number
    xp: number
  }
  stats: {
    totalHabits: number
    totalCompletions: number
  }
}

export function ProfileContent({ user, stats }: ProfileContentProps) {
  const progression = getProgressionStats(user.xp)
  const unlockedEmojis = getAvailableEmojis(user.level)
  const emojiStats = countUnlockedEmojis(user.level)
  const nextEmojis = getNextEmojis(user.level, 5)

  return (
    <div className="space-y-6">
      {/* Header avec nom et toggle thème */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground-800">{user.name}</h2>
          <p className="text-sm text-foreground-400">{user.email}</p>
        </div>
        <ThemeToggle />
      </div>

      {/* Carte Niveau & XP */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-primary/10">
              <Trophy className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-foreground-400">Niveau</p>
              <p className="text-3xl font-bold text-foreground-800">{progression.level}</p>
            </div>
          </div>
          {!progression.isMaxLevel && (
            <div className="text-right">
              <p className="text-sm text-foreground-400">Prochain niveau</p>
              <p className="text-lg font-semibold text-foreground-700">
                {progression.xpRemaining} XP
              </p>
            </div>
          )}
        </div>

        {/* Barre de progression */}
        {!progression.isMaxLevel && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-foreground-500">
                {progression.currentLevelXp} / {progression.xpForNextLevel} XP
              </span>
              <span className="text-foreground-400">{progression.progressPercentage}%</span>
            </div>
            <Progress value={progression.progressPercentage} className="h-3" />
          </div>
        )}

        {progression.isMaxLevel && (
          <div className="text-center py-2">
            <p className="text-lg font-semibold text-primary">
              🎉 Niveau maximum atteint !
            </p>
          </div>
        )}
      </Card>

      {/* Statistiques */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4">
          <p className="text-sm text-foreground-400 mb-1">Habitudes</p>
          <p className="text-2xl font-bold text-foreground-800">{stats.totalHabits}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-foreground-400 mb-1">Complétions</p>
          <p className="text-2xl font-bold text-foreground-800">{stats.totalCompletions}</p>
        </Card>
      </div>

      {/* Galerie d'emojis débloqués + 5 prochains */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground-800">Emojis</h3>
          </div>
          <span className="text-sm text-foreground-400">
            {emojiStats.unlocked} / {emojiStats.total} débloqués
          </span>
        </div>

        <Progress value={emojiStats.percentage} className="h-2" />

        {/* Grille d'emojis - tous les 50 emojis avec 3 états: débloqués, 5 prochains en grisé, reste locked */}
        <div className="grid grid-cols-6 gap-3">
          {EMOJI_REWARDS.map((reward) => {
            const isUnlocked = reward.level <= user.level
            const isNextReward = !isUnlocked && reward.level <= user.level + 5

            return (
              <div
                key={reward.emoji}
                className={`relative flex flex-col items-center justify-center p-3 rounded-lg border ${
                  isUnlocked
                    ? 'border-muted bg-card'
                    : isNextReward
                    ? 'border-dashed border-muted-foreground/30 bg-muted/10'
                    : 'border-muted/50 bg-muted/20 opacity-50'
                }`}
                title={isUnlocked ? reward.name : `Niveau ${reward.level} requis`}
              >
                {isUnlocked ? (
                  <>
                    <span
                      className="text-3xl"
                      style={{
                        fontFamily:
                          '"Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif',
                      }}
                    >
                      {reward.emoji}
                    </span>
                    <span className="absolute top-1 right-1 text-[8px] bg-primary text-primary-foreground rounded-full w-4 h-4 flex items-center justify-center font-semibold">
                      {reward.level}
                    </span>
                  </>
                ) : isNextReward ? (
                  <>
                    <span
                      className="text-3xl grayscale opacity-60"
                      style={{
                        fontFamily:
                          '"Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif',
                      }}
                    >
                      {reward.emoji}
                    </span>
                    <span className="absolute top-1 right-1 text-[8px] bg-muted-foreground/60 text-background rounded-full w-4 h-4 flex items-center justify-center font-semibold">
                      {reward.level}
                    </span>
                  </>
                ) : (
                  <>
                    <Lock className="h-6 w-6 text-muted-foreground" />
                    <span className="absolute top-1 right-1 text-[8px] bg-muted text-muted-foreground rounded-full w-4 h-4 flex items-center justify-center font-semibold">
                      {reward.level}
                    </span>
                  </>
                )}
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}
