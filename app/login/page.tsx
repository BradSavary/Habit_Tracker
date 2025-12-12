"use client" // ✅ Justifié : useForm (React Hook Form) + useState pour gestion formulaire + onClick handlers

import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import Link from "next/link"
import { motion } from "framer-motion"
import { Mail, Lock, CheckCircle2, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { loginUser } from "@/lib/actions/auth"
import { toast } from "sonner"

const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(1, "Le mot de passe est requis"),
})

type LoginFormData = z.infer<typeof loginSchema>

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)

  // Récupérer les paramètres de l'URL
  const verified = searchParams.get("verified")

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)

    try {
      const result = await loginUser(data)

      if (result.success) {
        toast.success(result.message || "Connexion réussie !")
        router.push("/dashboard")
        router.refresh()
      } else {
        toast.error(result.error || "Une erreur est survenue")
      }
    } catch {
      toast.error("Une erreur est survenue lors de la connexion")
    } finally {
      setIsLoading(false)
    }
  }



  return (
    <div className="min-h-screen bg-background-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Bouton retour */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-4"
        >
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Retour
            </Button>
          </Link>
        </motion.div>

        {/* Logo / Titre */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <h1 className="text-4xl font-bold text-foreground-800 mb-2">
            Habibit Tracker
          </h1>
          <p className="text-foreground-400">
            Connectez-vous pour suivre vos habitudes
          </p>
        </motion.div>

        {/* Messages de feedback */}
        {verified && (
          <motion.div 
            className="mb-6 p-4 bg-[var(--success-light)] border border-[var(--success)] rounded-lg flex items-start gap-3"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <CheckCircle2 className="h-5 w-5 text-[var(--success)] mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-foreground-700">
                Compte créé avec succès !
              </p>
              <p className="text-sm text-foreground-500 mt-1">
                Vous pouvez maintenant vous connecter à votre compte.
              </p>
            </div>
          </motion.div>
        )}

        {/* Formulaire de connexion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
        <Card className="bg-background-300 border-background-500 shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-foreground-800">
              Connexion
            </CardTitle>
            <CardDescription className="text-foreground-400">
              Entrez vos identifiants pour accéder à votre compte
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Email */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-foreground-700"
                >
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground-300" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="vous@exemple.com"
                    className="pl-10 bg-background-200 border-background-500 text-foreground-700 placeholder:text-foreground-200"
                    {...register("email")}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-[var(--error)]">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Mot de passe */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-foreground-700"
                  >
                    Mot de passe
                  </label>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground-300" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10 bg-background-200 border-background-500 text-foreground-700 placeholder:text-foreground-200"
                    {...register("password")}
                  />
                </div>
                {errors.password && (
                  <p className="text-sm text-[var(--error)]">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Bouton de connexion */}
              <Button
                type="submit"
                className="w-full bg-[var(--accent-purple)] hover:bg-[var(--accent-purple)]/90 text-background-100 font-semibold"
                disabled={isLoading}
              >
                {isLoading ? "Connexion en cours..." : "Se connecter"}
              </Button>

            </form>
          </CardContent>
        </Card>
        </motion.div>

        {/* Lien inscription */}
        <motion.p 
          className="mt-6 text-center text-sm text-foreground-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          Pas encore de compte ?{" "}
          <Link
            href="/register"
            className="font-semibold text-[var(--accent-purple)] hover:underline"
          >
            Créer un compte
          </Link>
        </motion.p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background-100 flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-[var(--accent-purple)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-foreground-600">Chargement...</p>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
