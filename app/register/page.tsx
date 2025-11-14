import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background-100">
      <div className="w-full max-w-md px-4">
        <div className="bg-background-300 border border-background-500 rounded-lg p-8">
          <h1 className="text-3xl font-bold text-foreground-900 mb-2 text-center">
            Inscription
          </h1>
          <p className="text-foreground-500 text-center mb-8">
            Créez votre compte HabitTracker gratuitement
          </p>
          
          <div className="space-y-4">
            <p className="text-foreground-600 text-center">
              Page d&apos;inscription en construction
            </p>
            <p className="text-foreground-400 text-sm text-center">
              L&apos;authentification NextAuth.js sera implémentée prochainement
            </p>
          </div>

          <div className="mt-8 text-center">
            <p className="text-foreground-500 text-sm">
              Vous avez déjà un compte ?{" "}
              <Link href="/login" className="text-foreground-800 font-semibold hover:underline">
                Se connecter
              </Link>
            </p>
          </div>

          <div className="mt-4">
            <Link href="/">
              <Button variant="outline" className="w-full">
                Retour à l&apos;accueil
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
