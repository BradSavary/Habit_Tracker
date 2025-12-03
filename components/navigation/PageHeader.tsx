import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { ReactNode } from 'react'

/**
 * PageHeader - Header sticky réutilisable
 * 
 * Server Component (par défaut):
 * - Utilisable dans les pages serveur
 * - Navigation statique avec Link
 * - Pas de JS côté client nécessaire
 */

interface PageHeaderProps {
  title: string | ReactNode
  subtitle?: string | ReactNode
  backHref?: string
  action?: ReactNode
  className?: string
}

export function PageHeader({ title, subtitle, backHref, action, className }: PageHeaderProps) {
  return (
    <header className={`bg-background-200 border-b border-background-500 sticky top-0 z-40 ${className || ''}`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            {backHref && (
              <Link href={backHref}>
                <Button variant="ghost" size="icon">
                  <ChevronLeft className="h-5 w-5" />
                </Button>
              </Link>
            )}
            
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-foreground-800">
                {title}
              </h1>
              {subtitle && (
                typeof subtitle === 'string' ? (
                  <p className="text-sm text-foreground-400">
                    {subtitle}
                  </p>
                ) : subtitle
              )}
            </div>
          </div>

          {action && (
            <div className="ml-4">
              {action}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
