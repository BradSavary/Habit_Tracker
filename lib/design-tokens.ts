/**
 * Design Tokens - Habit Tracker
 * 
 * Constantes et helpers pour utiliser les tokens de design
 * dans les composants TypeScript/React
 */

// ========================================
// ACCENT COLORS - Habit Categories
// ========================================

export const HABIT_COLORS = {
  purple: {
    name: 'Santé/Bien-être',
    value: 'var(--accent-purple)',
    light: 'var(--accent-purple-light)',
    class: 'bg-[var(--accent-purple)]',
    lightClass: 'bg-[var(--accent-purple-light)]',
  },
  blue: {
    name: 'Productivité',
    value: 'var(--accent-blue)',
    light: 'var(--accent-blue-light)',
    class: 'bg-[var(--accent-blue)]',
    lightClass: 'bg-[var(--accent-blue-light)]',
  },
  green: {
    name: 'Sport/Nature',
    value: 'var(--accent-green)',
    light: 'var(--accent-green-light)',
    class: 'bg-[var(--accent-green)]',
    lightClass: 'bg-[var(--accent-green-light)]',
  },
  orange: {
    name: 'Créativité',
    value: 'var(--accent-orange)',
    light: 'var(--accent-orange-light)',
    class: 'bg-[var(--accent-orange)]',
    lightClass: 'bg-[var(--accent-orange-light)]',
  },
  pink: {
    name: 'Social/Relationnel',
    value: 'var(--accent-pink)',
    light: 'var(--accent-pink-light)',
    class: 'bg-[var(--accent-pink)]',
    lightClass: 'bg-[var(--accent-pink-light)]',
  },
  teal: {
    name: 'Apprentissage',
    value: 'var(--accent-teal)',
    light: 'var(--accent-teal-light)',
    class: 'bg-[var(--accent-teal)]',
    lightClass: 'bg-[var(--accent-teal-light)]',
  },
} as const;

export type HabitColorKey = keyof typeof HABIT_COLORS;

// Array des clés pour mapping
export const HABIT_COLOR_KEYS = Object.keys(HABIT_COLORS) as HabitColorKey[];

// ========================================
// STATUS COLORS - Feedback & States
// ========================================

export const STATUS_COLORS = {
  success: {
    name: 'Succès',
    value: 'var(--success)',
    light: 'var(--success-light)',
    class: 'bg-[var(--success)]',
    lightClass: 'bg-[var(--success-light)]',
    textClass: 'text-[var(--success)]',
    borderClass: 'border-[var(--success)]',
  },
  warning: {
    name: 'Attention',
    value: 'var(--warning)',
    light: 'var(--warning-light)',
    class: 'bg-[var(--warning)]',
    lightClass: 'bg-[var(--warning-light)]',
    textClass: 'text-[var(--warning)]',
    borderClass: 'border-[var(--warning)]',
  },
  error: {
    name: 'Erreur',
    value: 'var(--error)',
    light: 'var(--error-light)',
    class: 'bg-[var(--error)]',
    lightClass: 'bg-[var(--error-light)]',
    textClass: 'text-[var(--error)]',
    borderClass: 'border-[var(--error)]',
  },
  info: {
    name: 'Information',
    value: 'var(--info)',
    light: 'var(--info-light)',
    class: 'bg-[var(--info)]',
    lightClass: 'bg-[var(--info-light)]',
    textClass: 'text-[var(--info)]',
    borderClass: 'border-[var(--info)]',
  },
} as const;

export type StatusColorKey = keyof typeof STATUS_COLORS;

// ========================================
// CHART COLORS - Analytics
// ========================================

export const CHART_COLORS = [
  'var(--chart-1)', // Purple
  'var(--chart-2)', // Blue
  'var(--chart-3)', // Green
  'var(--chart-4)', // Orange
  'var(--chart-5)', // Pink
] as const;

// ========================================
// HELPERS
// ========================================

/**
 * Récupère les classes CSS pour une couleur d'habitude
 * @param color - Clé de couleur (purple, blue, etc.)
 * @param variant - 'solid' pour couleur pleine, 'light' pour background léger
 * @returns Classes Tailwind CSS
 * 
 * @example
 * ```tsx
 * <Badge className={getHabitColorClass('purple', 'solid')}>
 *   Santé
 * </Badge>
 * ```
 */
export function getHabitColorClass(
  color: HabitColorKey,
  variant: 'solid' | 'light' = 'solid'
): string {
  const colorConfig = HABIT_COLORS[color];
  return variant === 'solid' ? colorConfig.class : colorConfig.lightClass;
}

/**
 * Récupère la valeur CSS variable d'une couleur d'habitude
 * @param color - Clé de couleur
 * @param variant - 'solid' ou 'light'
 * @returns Variable CSS (var(--accent-*))
 * 
 * @example
 * ```tsx
 * <div style={{ backgroundColor: getHabitColorValue('purple', 'light') }}>
 *   Contenu
 * </div>
 * ```
 */
export function getHabitColorValue(
  color: HabitColorKey,
  variant: 'solid' | 'light' = 'solid'
): string {
  const colorConfig = HABIT_COLORS[color];
  return variant === 'solid' ? colorConfig.value : colorConfig.light;
}

/**
 * Récupère le nom de la catégorie associée à une couleur
 * @param color - Clé de couleur
 * @returns Nom de la catégorie
 * 
 * @example
 * ```tsx
 * console.log(getHabitColorName('purple')) // "Santé/Bien-être"
 * ```
 */
export function getHabitColorName(color: HabitColorKey): string {
  return HABIT_COLORS[color].name;
}

/**
 * Récupère les classes CSS pour un status de feedback
 * @param status - Type de status (success, warning, error, info)
 * @param variant - Type de classe à récupérer
 * @returns Classes Tailwind CSS
 * 
 * @example
 * ```tsx
 * <div className={getStatusColorClass('success', 'light')}>
 *   Succès !
 * </div>
 * ```
 */
export function getStatusColorClass(
  status: StatusColorKey,
  variant: 'solid' | 'light' | 'text' | 'border' = 'solid'
): string {
  const statusConfig = STATUS_COLORS[status];
  
  switch (variant) {
    case 'solid':
      return statusConfig.class;
    case 'light':
      return statusConfig.lightClass;
    case 'text':
      return statusConfig.textClass;
    case 'border':
      return statusConfig.borderClass;
    default:
      return statusConfig.class;
  }
}

/**
 * Vérifie si une chaîne est une clé de couleur d'habitude valide
 * @param color - Chaîne à vérifier
 * @returns true si c'est une clé valide
 */
export function isValidHabitColor(color: string): color is HabitColorKey {
  return HABIT_COLOR_KEYS.includes(color as HabitColorKey);
}

// ========================================
// TYPE EXPORTS
// ========================================

export type HabitColor = typeof HABIT_COLORS[HabitColorKey];
export type StatusColor = typeof STATUS_COLORS[StatusColorKey];
export type ChartColor = typeof CHART_COLORS[number];
