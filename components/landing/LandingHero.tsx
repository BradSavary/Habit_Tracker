import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function LandingHero() {
  return (
    <section className="container mx-auto px-4 py-20 md:py-32">
      <div className="max-w-4xl mx-auto text-center">
        <Badge className="mb-4 bg-background-300 text-foreground-700 hover:bg-background-400">
          Construisez de meilleures habitudes 🎯
        </Badge>
        <h1 className="text-4xl md:text-6xl font-bold text-foreground-900 mb-6">
          Transformez votre vie, <br />
          <span className="text-foreground-700">une habitude à la fois</span>
        </h1>
        <p className="text-lg md:text-xl text-foreground-500 mb-8 max-w-2xl mx-auto">
          HabitTracker vous aide à créer, suivre et maintenir vos habitudes quotidiennes. 
          Simple, motivant et efficace.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
        </div>
      </div>
    </section>
  );
}
