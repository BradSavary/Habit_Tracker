import Link from "next/link";
import { Button } from "@/components/ui/button";

export function LandingCTA() {
  return (
    <section className="bg-background-300 py-20">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground-900 mb-4">
          Prêt à transformer vos habitudes ?
        </h2>
        <p className="text-foreground-500 text-lg mb-8 max-w-2xl mx-auto">
          Rejoignez des milliers d&apos;utilisateurs qui ont déjà transformé leur vie grâce à HabitTracker.
        </p>
        <Link href="/register">
          <Button size="lg" className="bg-foreground-800 text-background-100 hover:bg-foreground-700 text-lg px-8">
            Commencer maintenant - C&apos;est gratuit
          </Button>
        </Link>
      </div>
    </section>
  );
}

export function LandingFooter() {
  return (
    <footer className="border-t border-background-500 bg-background-200 py-8">
      <div className="container mx-auto px-4 text-center text-foreground-400">
        <p>&copy; 2025 HabitTracker. Tous droits réservés.</p>
      </div>
    </footer>
  );
}
