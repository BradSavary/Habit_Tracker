'use client'

import { useState, useMemo } from 'react'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Lock } from 'lucide-react'
import { getAvailableEmojis, EmojiReward } from '@/lib/emojis-system'

/**
 * EmojiPickerDrawer - Sélecteur d'emoji personnalisé avec système de niveaux
 * 
 * Justification 'use client':
 * - Gère l'état du drawer (ouvert/fermé)
 * - Gestion recherche locale (useState)
 * - Callbacks pour la sélection d'emoji
 * - Interactions utilisateur (click, search)
 */

interface EmojiPickerDrawerProps {
  selectedEmoji: string
  onEmojiSelect: (emoji: string) => void
  userLevel: number // Niveau de l'utilisateur pour filtrer les emojis
}

export function EmojiPickerDrawer({
  selectedEmoji,
  onEmojiSelect,
  userLevel,
}: EmojiPickerDrawerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [tempEmoji, setTempEmoji] = useState(selectedEmoji)
  const [searchQuery, setSearchQuery] = useState('')
  const [showAll, setShowAll] = useState(false)

  // Récupérer tous les emojis débloqués
  const unlockedEmojis = useMemo(() => getAvailableEmojis(userLevel), [userLevel])

  // Filtrer par recherche
  const filteredEmojis = useMemo(() => {
    if (!searchQuery.trim()) return unlockedEmojis
    
    const query = searchQuery.toLowerCase()
    return unlockedEmojis.filter(
      (reward) =>
        reward.name.toLowerCase().includes(query) ||
        reward.category.toLowerCase().includes(query) ||
        reward.emoji.includes(query)
    )
  }, [unlockedEmojis, searchQuery])

  // Afficher 8 ou tous selon le mode
  const displayedEmojis = showAll ? filteredEmojis : filteredEmojis.slice(0, 8)

  const handleEmojiClick = (emoji: string) => {
    setTempEmoji(emoji)
  }

  const handleConfirm = () => {
    onEmojiSelect(tempEmoji)
    setIsOpen(false)
    setSearchQuery('')
    setShowAll(false)
  }

  const handleCancel = () => {
    setTempEmoji(selectedEmoji)
    setIsOpen(false)
    setSearchQuery('')
    setShowAll(false)
  }

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="w-full h-20 text-6xl hover:bg-background-200 transition-all cursor-pointer"
          style={{
            fontFamily:
              '"Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif',
          }}
        >
          {selectedEmoji}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Choisissez un emoji</DrawerTitle>
          <DrawerDescription>
            {unlockedEmojis.length} emojis débloqués (Niveau {userLevel})
          </DrawerDescription>
        </DrawerHeader>

        <div className="px-4 pb-4 space-y-4">
          {/* Barre de recherche */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Rechercher par nom ou catégorie..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Grille d'emojis */}
          <div className="grid grid-cols-4 gap-3 max-h-[300px] overflow-y-auto">
            {displayedEmojis.map((reward) => (
              <button
                key={reward.emoji}
                type="button"
                onClick={() => handleEmojiClick(reward.emoji)}
                className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all cursor-pointer ${
                  tempEmoji === reward.emoji
                    ? 'border-primary bg-primary/10 '
                    : 'border-muted hover:border-primary/50 hover:bg-accent'
                }`}
              >
                <span
                  className="text-4xl mb-1"
                  style={{
                    fontFamily:
                      '"Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif',
                  }}
                >
                  {reward.emoji}
                </span>
                <span className="text-[10px] text-center text-muted-foreground line-clamp-1">
                  {reward.name}
                </span>
              </button>
            ))}
          </div>

          {/* Bouton "Voir plus" */}
          {!showAll && filteredEmojis.length > 8 && (
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowAll(true)}
              className="w-full"
            >
              Voir tous les emojis ({filteredEmojis.length - 8} de plus)
            </Button>
          )}

          {/* Message si aucun résultat */}
          {filteredEmojis.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Lock className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Aucun emoji trouvé</p>
              <p className="text-sm">
                Continue à compléter des habitudes pour en débloquer plus !
              </p>
            </div>
          )}
        </div>

        <DrawerFooter>
          <div className="flex gap-3 w-full">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="flex-1"
            >
              Annuler
            </Button>
            <Button type="button" onClick={handleConfirm} className="flex-1">
              Confirmer
              <span
                className="ml-2 text-2xl"
                style={{
                  fontFamily:
                    '"Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif',
                }}
              >
                {tempEmoji}
              </span>
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
