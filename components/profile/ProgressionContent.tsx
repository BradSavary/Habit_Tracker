'use client'

import { useEffect, useRef } from 'react'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Trophy, Lock, Check, TrendingUp } from 'lucide-react'
import { getProgressionStats, getXpForNextLevel } from '@/lib/progression'
import { getEmojiForLevel } from '@/lib/emojis-system'

/**
 * ProgressionContent - Affichage vertical de la progression
 * 
 * Vue verticale avec ligne de progression:
 * - Scroll de bas en haut (anciens niveaux → futurs niveaux)
 * - Ligne verticale au centre guidant la progression
 * - Niveau actuel centré automatiquement au chargement
 */

type ProgressionContentProps = {
  level: number
  xp: number
}

export function ProgressionContent({ level, xp }: ProgressionContentProps) {
  const progression = getProgressionStats(xp)
  const currentLevelRef = useRef<HTMLDivElement>(null)

  // Scroll automatique vers le niveau actuel au chargement
  useEffect(() => {
    if (currentLevelRef.current) {
      currentLevelRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [])

  // Générer la liste des niveaux (du plus bas au plus haut)
  const levels = Array.from({ length: 50 }, (_, i) => i + 1)

  const getLevelStatus = (targetLevel: number): 'unlocked' | 'next' | 'locked' => {
    if (targetLevel <= level) return 'unlocked'
    if (targetLevel <= level + 5) return 'next'
    return 'locked'
  }

  return (
    <div className="space-y-6">
      {/* Résumé compact en haut */}
      <Card className="z-20 p-4 sticky top-20 bg-background-100/95 backdrop-blur-sm">
        <div className="flex items-center justify-between gap-4">
          {/* Niveau */}
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-primary/10">
              <Trophy className="h-5 w-5 text-primary" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-foreground-400">Niveau</span>
              <span className="text-2xl font-bold text-foreground-800">{progression.level}</span>
            </div>
          </div>

          {/* Barre de progression compacte */}
          {!progression.isMaxLevel ? (
            <div className="flex-1 flex items-center gap-3">
              <Progress value={progression.progressPercentage} className="h-2 flex-1" />
              <span className="text-sm font-medium text-foreground-500 whitespace-nowrap">
                {progression.currentLevelXp}/{progression.xpForNextLevel} XP
              </span>
            </div>
          ) : (
            <Badge variant="default" className="text-xs">
              🎉 Max
            </Badge>
          )}
        </div>
      </Card>

      {/* Timeline de progression verticale */}
      <div className="relative">
        {/* Ligne verticale centrale - gradient de bas en haut */}
        <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-t from-muted via-primary to-muted" />

        {/* Niveaux */}
        <div className="space-y-0">
          {levels.map((targetLevel) => {
            const status = getLevelStatus(targetLevel)
            const emojiReward = getEmojiForLevel(targetLevel)
            const xpForThisLevel = getXpForNextLevel(targetLevel - 1)
            const isCurrentLevel = targetLevel === level

            return (
              <div
                key={targetLevel}
                ref={isCurrentLevel ? currentLevelRef : null}
                className="relative flex items-start gap-4 pb-8"
              >
                {/* Point sur la ligne */}
                <div
                  className={`relative z-10 flex items-center justify-center w-16 h-16 rounded-full border-4 transition-all ${
                    status === 'unlocked'
                      ? 'bg-success border-success shadow-lg shadow-success/30'
                      : status === 'next'
                      ? 'bg-background-300 border-primary/40'
                      : 'bg-background-200 border-muted'
                  } ${isCurrentLevel ? 'scale-125 ring-4 ring-primary/30' : ''}`}
                >
                  {status === 'unlocked' ? (
                    <Check className="h-8 w-8 text-primary" />
                  ) : status === 'next' ? (
                    <TrendingUp className="h-6 w-6 text-primary" />
                  ) : (
                    <Lock className="h-6 w-6 text-muted-foreground" />
                  )}
                </div>

                {/* Carte niveau */}
                <Card
                  className={`flex-1 p-4 transition-all ${
                    status === 'unlocked'
                      ? 'border-success/50 bg-card'
                      : status === 'next'
                      ? 'border-dashed border-primary/30 bg-card'
                      : 'border-muted/50 bg-muted/10 opacity-60'
                  } ${isCurrentLevel ? 'ring-2 ring-primary shadow-xl' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    {/* Infos niveau */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="text-2xl font-bold text-foreground-800">
                          Niveau {targetLevel}
                        </p>
                        {/* {isCurrentLevel && (
                          <Badge variant="default" className="text-xs">
                            ← Actuellement
                          </Badge>
                        )} */}
                      </div>
                      
                      {status === 'unlocked' && emojiReward && (
                        <p className="text-sm text-foreground-500 flex items-center gap-2">
                          <span className="text-2xl">{emojiReward.emoji}</span>
                          <span>{emojiReward.name}</span>
                        </p>
                      )}
                      
                      {status === 'next' && (
                        <p className="text-sm text-foreground-400">
                          {xpForThisLevel} XP requis pour débloquer
                        </p>
                      )}
                      
                      {status === 'locked' && (
                        <p className="text-sm text-muted-foreground">
                          Niveau verrouillé
                        </p>
                      )}
                    </div>

                    {/* Emoji récompense */}
                    {emojiReward && (
                      <div
                        className={`text-5xl ${
                          status === 'next' ? 'grayscale opacity-50' : ''
                        } ${status === 'locked' ? 'hidden' : ''}`}
                        style={{
                          fontFamily:
                            '"Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif',
                        }}
                      >
                        {emojiReward.emoji}
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            )
          })}
        </div>
      </div>

      {/* Message de fin (niveau max) */}
      <div className="text-center py-8">
        <p className="text-sm text-foreground-400">
          {progression.isMaxLevel 
            ? '� Félicitations ! Tu as atteint le niveau maximum !'
            : '⬆️ Continue à compléter tes habitudes pour atteindre le sommet !'}
        </p>
      </div>
    </div>
  )
}
