'use client'

import { motion } from 'framer-motion'

export function LandingHowItWorks() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-foreground-900 mb-12 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            Comment ça marche ?
          </motion.h2>
          <motion.div 
            className="space-y-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.2
                }
              }
            }}
          >
            <motion.div 
              className="flex gap-6 items-start"
              variants={{ hidden: { opacity: 0, x: -50 }, visible: { opacity: 1, x: 0 } }}
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-background-300 flex items-center justify-center">
                <span className="text-2xl font-bold text-foreground-800">1</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground-800 mb-2">
                  Créez vos habitudes
                </h3>
                <p className="text-foreground-500">
                  Définissez les habitudes que vous souhaitez développer. Donnez-leur un nom, 
                  choisissez une fréquence (quotidienne, hebdomadaire, mensuelle) et personnalisez-les 
                  avec des icônes et des couleurs.
                </p>
              </div>
            </motion.div>

            <motion.div 
              className="flex gap-6 items-start"
              variants={{ hidden: { opacity: 0, x: -50 }, visible: { opacity: 1, x: 0 } }}
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-background-300 flex items-center justify-center">
                <span className="text-2xl font-bold text-foreground-800">2</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground-800 mb-2">
                  Suivez votre progression
                </h3>
                <p className="text-foreground-500">
                  Chaque jour, marquez vos habitudes comme complétées. Visualisez vos streaks 
                  (séries de jours consécutifs) et votre progression sur un calendrier intuitif.
                </p>
              </div>
            </motion.div>

            <motion.div 
              className="flex gap-6 items-start"
              variants={{ hidden: { opacity: 0, x: -50 }, visible: { opacity: 1, x: 0 } }}
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-background-300 flex items-center justify-center">
                <span className="text-2xl font-bold text-foreground-800">3</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground-800 mb-2">
                  Restez motivé
                </h3>
                <p className="text-foreground-500">
                  Consultez vos statistiques, célébrez vos réussites et maintenez votre motivation 
                  grâce aux indicateurs visuels et aux feedbacks positifs.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
