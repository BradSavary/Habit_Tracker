'use client'

import { CheckCircle2, TrendingUp, Target, Zap, Calendar, Award } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from 'framer-motion'

export function LandingFeatures() {
  return (
    <section className="bg-background-200 py-20">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground-900 mb-4">
            Pourquoi HabitTracker ?
          </h2>
          <p className="text-foreground-500 text-lg max-w-2xl mx-auto">
            Des fonctionnalités pensées pour vous aider à rester motivé et à atteindre vos objectifs
          </p>
        </motion.div>

        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
        >
          <motion.div variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}>
            <Card className="bg-background-300 border-background-500 hover:bg-background-400 transition-colors">
              <CardHeader>
                <CheckCircle2 className="h-10 w-10 text-foreground-700 mb-2" />
                <CardTitle className="text-foreground-800">Suivi quotidien simple</CardTitle>
                <CardDescription className="text-foreground-400">
                  Validez vos habitudes en un clic. Interface intuitive et rapide.
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>

          <motion.div variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}>
            <Card className="bg-background-300 border-background-500 hover:bg-background-400 transition-colors">
              <CardHeader>
                <TrendingUp className="h-10 w-10 text-foreground-700 mb-2" />
                <CardTitle className="text-foreground-800">Streaks motivants</CardTitle>
                <CardDescription className="text-foreground-400">
                  Suivez vos séries de jours consécutifs et restez motivé.
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>

          <motion.div variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}>
            <Card className="bg-background-300 border-background-500 hover:bg-background-400 transition-colors">
              <CardHeader>
                <Calendar className="h-10 w-10 text-foreground-700 mb-2" />
                <CardTitle className="text-foreground-800">Vue calendrier</CardTitle>
                <CardDescription className="text-foreground-400">
                  Visualisez votre progression sur un calendrier interactif.
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>

          <motion.div variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}>
            <Card className="bg-background-300 border-background-500 hover:bg-background-400 transition-colors">
              <CardHeader>
                <Target className="h-10 w-10 text-foreground-700 mb-2" />
                <CardTitle className="text-foreground-800">Fréquences personnalisées</CardTitle>
                <CardDescription className="text-foreground-400">
                  Quotidien, hebdomadaire ou mensuel - adaptez à vos besoins.
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>

          <motion.div variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}>
            <Card className="bg-background-300 border-background-500 hover:bg-background-400 transition-colors">
              <CardHeader>
                <Award className="h-10 w-10 text-foreground-700 mb-2" />
                <CardTitle className="text-foreground-800">Statistiques détaillées</CardTitle>
                <CardDescription className="text-foreground-400">
                  Analysez votre progression avec des stats claires et motivantes.
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>

          <motion.div variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}>
            <Card className="bg-background-300 border-background-500 hover:bg-background-400 transition-colors">
              <CardHeader>
                <Zap className="h-10 w-10 text-foreground-700 mb-2" />
                <CardTitle className="text-foreground-800">Interface rapide</CardTitle>
                <CardDescription className="text-foreground-400">
                  Optimisée pour mobile. Accessible partout, tout le temps.
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
