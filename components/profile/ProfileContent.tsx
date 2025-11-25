'use client'

import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { ThemeToggle } from '@/components/theme-toggle'
import { Trophy, Star, Lock, ChevronRight, LogOut } from 'lucide-react'
import { getProgressionStats } from '@/lib/progression'
import { EMOJI_REWARDS, countUnlockedEmojis } from '@/lib/emojis-system'
import { logoutUser } from '@/lib/actions/auth'

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
    dailyHabits: number
    weeklyHabits: number
    monthlyHabits: number
  }
}

export function ProfileContent({ user, stats }: ProfileContentProps) {
  const router = useRouter()
  const progression = getProgressionStats(user.xp)
  const emojiStats = countUnlockedEmojis(user.level)

  const handleSignOut = async () => {
    await logoutUser()
  }

  return (
    <div className="space-y-6">
      {/* Header avec nom et toggle thème */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground-800">{user.name}</h2>
          <p className="text-sm text-foreground-400">{user.email}</p>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button 
            variant="outline" 
            size="icon"
            onClick={handleSignOut}
            title="Se déconnecter"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Carte Niveau & XP - Cliquable */}
      <Card 
        className="p-6 space-y-4 cursor-pointer hover:bg-background-400 transition-colors"
        onClick={() => router.push('/profile/progression')}
      >
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
          <div className="flex items-center gap-2">
            {!progression.isMaxLevel && (
              <div className="text-right">
                <p className="text-sm text-foreground-400">Prochain niveau</p>
                <p className="text-lg font-semibold text-foreground-700">
                  {progression.xpRemaining} XP
                </p>
              </div>
            )}
            <ChevronRight className="h-5 w-5 text-foreground-400" />
          </div>
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

      {/* Statistiques Habitudes */}
      <Card className="p-6 space-y-4">
        <h3 className="font-semibold text-foreground-800">Mes habitudes</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground-800">{stats.dailyHabits}</p>
            <p className="text-sm text-foreground-400">Quotidiennes</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground-800">{stats.weeklyHabits}</p>
            <p className="text-sm text-foreground-400">Hebdomadaires</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground-800">{stats.monthlyHabits}</p>
            <p className="text-sm text-foreground-400">Mensuelles</p>
          </div>
        </div>
      </Card>

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
