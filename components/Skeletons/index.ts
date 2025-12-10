/**
 * Skeletons - Système de chargement visuel
 * 
 * Architecture à 3 niveaux :
 * - base/ : Composants atomiques (Card, Text, Button, Avatar, Stat)
 * - composed/ : Composants composés métier (HabitCard, StatCard, MoodCalendar, etc.)
 * - pages/ : Pages complètes (Dashboard, Profile, Mood, Progression, HabitDetail)
 * 
 * Usage :
 * ```tsx
 * import { SkeletonDashboard } from '@/components/Skeletons'
 * 
 * export default function DashboardLoading() {
 *   return <SkeletonDashboard />
 * }
 * ```
 */

// Base skeletons
export * from './base'

// Composed skeletons
export * from './composed'

// Page skeletons
export * from './pages'
