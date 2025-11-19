'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Smile, BarChart3, User } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * BottomNav - Navigation mobile en bas de l'écran
 * 
 * Justification 'use client':
 * - Utilise usePathname() pour détecter la route active
 * - Nécessite des interactions client pour la navigation
 * - Gère l'état visuel actif/inactif des onglets
 */

interface NavItem {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}

const navItems: NavItem[] = [
  {
    href: '/dashboard',
    label: 'Home',
    icon: Home,
  },
  {
    href: '/mood',
    label: 'Mood',
    icon: Smile,
  },
  {
    href: '/stats',
    label: 'Stats',
    icon: BarChart3,
  },
  {
    href: '/profile',
    label: 'Profile',
    icon: User,
  },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background-300 border-t border-background-500 md:hidden">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors',
                isActive
                  ? 'text-[var(--accent-purple)]'
                  : 'text-foreground-400 hover:text-foreground-600'
              )}
            >
              <Icon className="h-6 w-6" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
