'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import dynamic from 'next/dynamic'
import { TrendingUp, TrendingDown, Flame, Calendar, Target, Award } from 'lucide-react'
import { motion } from 'framer-motion'

// Import dynamique d'ApexCharts (client-side only)
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

/**
 * StatsContent - Contenu de la page de statistiques
 * 
 * Justification 'use client':
 * - ApexCharts nécessite client-side rendering
 * - Animations Framer Motion et ApexCharts
 * - Interactions avec les graphiques (hover, tooltips, animations)
 */

type StatsContentProps = {
  stats: {
    totalHabits: number
    activeHabits: number
    completionsThisMonth: number
    completionsLastMonth: number
    completionRate: number
    monthComparison: number
    longestStreak: number
    consecutiveDays: number
  }
  weeklyData: Array<{ date: string; completions: number }>
  monthlyTrend: Array<{ date: string; completions: number }>
  frequencyData: Array<{ name: string; value: number; color: string }>
  topHabits: Array<{
    id: string
    name: string
    emoji: string
    color: string
    completions: number
    rate: number
  }>
  bestDay: { name: string; count: number }
}

export function StatsContent({
  stats,
  weeklyData,
  monthlyTrend,
  frequencyData,
  topHabits,
  bestDay,
}: StatsContentProps) {
  return (
    <div className="space-y-6">
      {/* Hero Card - Plus longue streak */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="p-8 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <div className="flex items-center justify-center gap-4">
            <Flame className="h-16 w-16 text-primary" />
            <div className="text-center">
              <p className="text-sm text-foreground-400 mb-1">Plus longue streak</p>
              <p className="text-6xl font-bold text-primary">{stats.longestStreak}</p>
              <p className="text-sm text-foreground-500 mt-1">jours consécutifs 🔥</p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Graphique semaine */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground-800 mb-4">Cette semaine</h3>
          <div className="h-[250px]">
            <Chart
              type="bar"
              height="100%"
              series={[
                {
                  name: 'Complétions',
                  data: weeklyData.map((d) => d.completions),
                },
              ]}
              options={{
                chart: {
                  animations: {
                    enabled: true,
                    speed: 800,
                    animateGradually: {
                      enabled: true,
                      delay: 150,
                    },
                  },
                  toolbar: { show: false },
                  background: 'transparent',
                },
                plotOptions: {
                  bar: {
                    borderRadius: 8,
                    borderRadiusApplication: 'end',
                    columnWidth: '60%',
                  },
                },
                colors: ['oklch(0.58 0.22 25)'], // Primary red
                dataLabels: { enabled: false },
                xaxis: {
                  categories: weeklyData.map((d) => d.date),
                  labels: {
                    style: {
                      colors: 'var(--color-foreground-400)',
                    },
                  },
                },
                yaxis: {
                  labels: {
                    style: {
                      colors: ['var(--color-foreground-400)'],
                    },
                  },
                },
                grid: {
                  borderColor: 'var(--color-border)',
                  strokeDashArray: 3,
                },
                tooltip: {
                  theme: 'dark',
                  y: {
                    formatter: (val: number) => `${val} complétions`,
                  },
                },
              }}
            />
          </div>
        </Card>
      </motion.div>

      {/* Graphique mensuel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
      >
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground-800 mb-4">
            Progression mensuelle
          </h3>
          <div className="h-[250px]">
            <Chart
              type="line"
              height="100%"
              series={[
                {
                  name: 'Complétions',
                  data: monthlyTrend.map((d) => d.completions),
                },
              ]}
              options={{
                chart: {
                  animations: {
                    enabled: true,
                    speed: 800,
                    animateGradually: {
                      enabled: true,
                      delay: 150,
                    },
                  },
                  toolbar: { show: false },
                  background: 'transparent',
                },
                stroke: {
                  curve: 'smooth',
                  width: 3,
                },
                colors: ['oklch(0.58 0.22 25)'], // Primary red
                markers: {
                  size: 0, // Pas de points
                },
                dataLabels: { enabled: false },
                xaxis: {
                  categories: monthlyTrend.map((d) => d.date),
                  tickAmount: 6, // Environ 1 label tous les 5 jours
                  labels: {
                    style: {
                      colors: 'var(--color-foreground-400)',
                    },
                  },
                },
                yaxis: {
                  labels: {
                    style: {
                      colors: ['var(--color-foreground-400)'],
                    },
                  },
                },
                grid: {
                  borderColor: 'var(--color-border)',
                  strokeDashArray: 3,
                },
                tooltip: {
                  theme: 'dark',
                  y: {
                    formatter: (val: number) => `${val} complétions`,
                  },
                },
              }}
            />
          </div>
        </Card>
      </motion.div>

      {/* Top 3 habitudes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.6 }}
      >
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground-800 mb-4">
            🏆 Meilleures habitudes ce mois
          </h3>
          <div className="space-y-3">
            {topHabits.map((habit, index) => (
              <div
                key={habit.id}
                className="flex items-center justify-between p-3 rounded-lg bg-background-200"
              >
                <div className="flex items-center gap-3">
                  <Badge
                    variant="outline"
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                  >
                    {index + 1}
                  </Badge>
                  <span
                    className="text-2xl"
                    style={{
                      fontFamily:
                        '"Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif',
                    }}
                  >
                    {habit.emoji}
                  </span>
                  <div>
                    <p className="font-medium text-foreground-800">{habit.name}</p>
                    <p className="text-sm text-foreground-400">
                      {habit.completions} complétions
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">{habit.rate}%</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Meilleur jour de la semaine */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.7 }}
      >
        <Card className="p-6 bg-gradient-to-r from-success/10 to-success/5 border-success/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground-400 mb-1">Ton jour le plus productif</p>
              <p className="text-3xl font-bold text-success">{bestDay.name}</p>
              <p className="text-sm text-foreground-500 mt-1">
                {bestDay.count} complétions en moyenne
              </p>
            </div>
            <Award className="h-16 w-16 text-success opacity-50" />
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
