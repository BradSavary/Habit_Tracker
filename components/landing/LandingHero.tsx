"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function LandingHero() {
  return (
    <section className="container mx-auto px-4 py-20 md:py-32">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Badge className="mb-4 bg-background-300 text-foreground-700 hover:bg-background-400">
            Construisez de meilleures habitudes 🎯
          </Badge>
        </motion.div>
        
        <motion.h1 
          className="text-4xl md:text-6xl font-bold text-foreground-900 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Transformez votre vie, <br />
          <span className="text-foreground-700">une habitude à la fois</span>
        </motion.h1>
        
        <motion.p 
          className="text-lg md:text-xl text-foreground-500 mb-8 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Habibit Tracker vous aide à créer, suivre et maintenir vos habitudes quotidiennes. 
          Simple, motivant et efficace.
        </motion.p>
        
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Link href="/register">
            <Button size="lg" className="bg-foreground-800 text-background-100 hover:bg-foreground-700 text-lg px-8">
              Commencer gratuitement
            </Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline" className="border-background-500 text-foreground-700 hover:bg-background-300 text-lg px-8">
              J&apos;ai déjà un compte
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
