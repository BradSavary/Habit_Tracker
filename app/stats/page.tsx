import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { BottomNav } from '@/components/navigation/BottomNav'
import { StatsContent } from '@/components/stats/StatsContent'
import { PageHeader } from '@/components/navigation/PageHeader'
import {
  getUserStats,
  getWeeklyCompletions,
  getMonthlyTrend,
  getHabitsByFrequency,
  getTopHabits,
  getBestDayOfWeek,
} from '@/lib/stats-utils'

/**
 * Stats Page - Analytics avancées et statistiques détaillées
 * 
 * Features:
 * - KPI cards (taux de complétion, streaks, comparaisons)
 * - Graphiques hebdomadaires et mensuels (Recharts)
 * - Top 3 des meilleures habitudes
 * - Répartition par fréquence
 * - Meilleur jour de la semaine
 */

export default async function StatsPage() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect('/login')
  }

  const userId = session.user.id

  // Récupérer toutes les données en parallèle pour optimiser
  const [stats, weeklyData, monthlyTrend, frequencyData, topHabits, bestDay] =
    await Promise.all([
      getUserStats(userId),
      getWeeklyCompletions(userId),
      getMonthlyTrend(userId),
      getHabitsByFrequency(userId),
      getTopHabits(userId),
      getBestDayOfWeek(userId),
    ])

  return (
    <div className="min-h-screen bg-background-100 pb-20">
      <PageHeader
        title="Statistiques"
        subtitle="Analyse de tes performances et progression"
      />

      {/* Content */}
      <main className="container mx-auto px-4 py-6">
        <StatsContent
          stats={stats}
          weeklyData={weeklyData}
          monthlyTrend={monthlyTrend}
          frequencyData={frequencyData}
          topHabits={topHabits}
          bestDay={bestDay}
        />
      </main>

      <BottomNav />
    </div>
  )
}
