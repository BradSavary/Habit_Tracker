"use client" // ✅ Justifié : useForm (React Hook Form) + useState pour gestion formulaire + router.push

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import Link from "next/link"
import { User, Mail, Lock, AlertCircle, CheckCircle2, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { registerUser } from "@/lib/actions/auth"
import { toast } from "sonner"

const registerSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
    .regex(/[a-z]/, "Le mot de passe doit contenir au moins une minuscule")
    .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
})

type RegisterFormData = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [registrationSuccess, setRegistrationSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true)

    try {
      const result = await registerUser(data)

      if (result.success) {
        toast.success(result.message || "Compte créé avec succès !")
        setRegistrationSuccess(true)
        
        // Rediriger vers la page de connexion après 2 secondes
        setTimeout(() => {
          router.push("/login")
        }, 2000)
      } else {
        toast.error(result.error || "Une erreur est survenue")
      }
    } catch (error) {
      console.error("Registration error:", error)
      toast.error("Une erreur est survenue lors de l'inscription")
    } finally {
      setIsLoading(false)
    }
  }

  if (registrationSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-100 px-4">
        <Card className="w-full max-w-md bg-background-300 border-background-500">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-[var(--success-light)] rounded-full flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8 text-[var(--success)]" />
            </div>
            <CardTitle className="text-foreground-900">Compte créé !</CardTitle>
            <CardDescription className="text-foreground-500">
              Votre compte a été créé avec succès
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-foreground-600 text-sm mb-4">
              Vous pouvez maintenant vous connecter avec votre email et mot de passe.
            </p>
            <Button
              onClick={() => router.push("/login")}
              className="w-full bg-[var(--accent-purple)] hover:bg-[var(--accent-purple)]/90 text-background-100"
            >
              Se connecter
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-100 px-4 py-8">
      <Card className="w-full max-w-md bg-background-300 border-background-500">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold text-foreground-900">
            Créer un compte
          </CardTitle>
          <CardDescription className="text-foreground-500">
            Commencez à suivre vos habitudes dès aujourd&apos;hui
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Champ Nom */}
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-foreground-700">
                Nom complet
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground-400" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Jean Dupont"
                  className={`pl-10 bg-background-200 border-background-500 text-foreground-800 placeholder:text-foreground-300 ${
                    errors.name ? "border-[var(--error)]" : ""
                  }`}
                  disabled={isLoading}
                  {...register("name")}
                />
              </div>
              {errors.name && (
                <div className="flex items-center gap-1 text-[var(--error)] text-sm">
                  <AlertCircle className="h-4 w-4" />
                  <span>{errors.name.message}</span>
                </div>
              )}
            </div>

            {/* Champ Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground-700">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="jean.dupont@example.com"
                  className={`pl-10 bg-background-200 border-background-500 text-foreground-800 placeholder:text-foreground-300 ${
                    errors.email ? "border-[var(--error)]" : ""
                  }`}
                  disabled={isLoading}
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <div className="flex items-center gap-1 text-[var(--error)] text-sm">
                  <AlertCircle className="h-4 w-4" />
                  <span>{errors.email.message}</span>
                </div>
              )}
            </div>

            {/* Champ Mot de passe */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-foreground-700">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`pl-10 pr-10 bg-background-200 border-background-500 text-foreground-800 placeholder:text-foreground-300 ${
                    errors.password ? "border-[var(--error)]" : ""
                  }`}
                  disabled={isLoading}
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-400 hover:text-foreground-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <div className="flex items-center gap-1 text-[var(--error)] text-sm">
                  <AlertCircle className="h-4 w-4" />
                  <span>{errors.password.message}</span>
                </div>
              )}
              <p className="text-xs text-foreground-400">
                Minimum 8 caractères avec majuscule, minuscule et chiffre
              </p>
            </div>

            {/* Champ Confirmation mot de passe */}
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground-700">
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground-400" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`pl-10 pr-10 bg-background-200 border-background-500 text-foreground-800 placeholder:text-foreground-300 ${
                    errors.confirmPassword ? "border-[var(--error)]" : ""
                  }`}
                  disabled={isLoading}
                  {...register("confirmPassword")}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-400 hover:text-foreground-600 transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <div className="flex items-center gap-1 text-[var(--error)] text-sm">
                  <AlertCircle className="h-4 w-4" />
                  <span>{errors.confirmPassword.message}</span>
                </div>
              )}
            </div>

            {/* Bouton de soumission */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[var(--accent-purple)] hover:bg-[var(--accent-purple)]/90 text-background-100 font-semibold"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-background-100 border-t-transparent rounded-full animate-spin" />
                  <span>Création en cours...</span>
                </div>
              ) : (
                "Créer mon compte"
              )}
            </Button>
          </form>

          {/* Lien vers connexion */}
          <div className="mt-6 text-center">
            <p className="text-foreground-500 text-sm">
              Vous avez déjà un compte ?{" "}
              <Link
                href="/login"
                className="text-foreground-800 font-semibold hover:text-[var(--accent-purple)] transition-colors"
              >
                Se connecter
              </Link>
            </p>
          </div>

          {/* Lien retour accueil */}
          <div className="mt-4">
            <Link href="/">
              <Button variant="outline" className="w-full border-background-500 text-foreground-700 hover:bg-background-400">
                Retour à l&apos;accueil
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
