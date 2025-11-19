'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'
import * as React from 'react'

/**
 * ThemeProvider - Wrapper pour next-themes
 * 
 * Justification 'use client':
 * - next-themes est une bibliothèque client-only
 * - Gère le thème dans localStorage
 * - Context API pour accès global au thème
 */

type ThemeProviderProps = React.ComponentProps<typeof NextThemesProvider>

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
