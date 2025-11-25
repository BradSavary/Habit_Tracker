"use server"

import { z } from "zod"
import { hash } from "bcryptjs"
import prisma from "@/lib/prisma"
import { signIn, signOut } from "@/lib/auth"

// Schémas de validation
const registerSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
    .regex(/[a-z]/, "Le mot de passe doit contenir au moins une minuscule")
    .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre"),
})

const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(1, "Le mot de passe est requis"),
})

// Types de retour
type ActionResult = {
  success: boolean
  message?: string
  error?: string
}

/**
 * Server Action pour l'inscription d'un nouvel utilisateur
 */
export async function registerUser(
  data: z.infer<typeof registerSchema>
): Promise<ActionResult> {
  try {
    // Valider les données
    const validatedData = registerSchema.parse(data)

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    })

    if (existingUser) {
      return {
        success: false,
        error: "Un compte avec cet email existe déjà",
      }
    }

    // Hasher le mot de passe
    const hashedPassword = await hash(validatedData.password, 12)

    // Créer l'utilisateur avec email automatiquement vérifié
    await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
        emailVerified: new Date(), // ✅ Email vérifié automatiquement
      },
    })

    return {
      success: true,
      message: "Compte créé avec succès ! Vous pouvez maintenant vous connecter.",
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues[0].message,
      }
    }

    console.error("Registration error:", error)
    return {
      success: false,
      error: "Une erreur est survenue lors de l'inscription",
    }
  }
}

/**
 * Server Action pour la connexion d'un utilisateur
 */
export async function loginUser(
  data: z.infer<typeof loginSchema>
): Promise<ActionResult> {
  try {
    // Valider les données
    const validatedData = loginSchema.parse(data)

    // Vérifier que l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
    })

    if (!user) {
      return {
        success: false,
        error: "Email ou mot de passe incorrect",
      }
    }

    // Vérifier que l'email est vérifié
    if (!user.emailVerified) {
      return {
        success: false,
        error: "Veuillez vérifier votre email avant de vous connecter. Consultez votre boîte mail.",
      }
    }

    // Tenter la connexion avec NextAuth
    try {
      await signIn("credentials", {
        email: validatedData.email,
        password: validatedData.password,
        redirect: false,
      })

      return {
        success: true,
        message: "Connexion réussie !",
      }
    } catch {
      // Si NextAuth rejette la connexion, c'est que le mot de passe est incorrect
      return {
        success: false,
        error: "Email ou mot de passe incorrect",
      }
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues[0].message,
      }
    }

    console.error("Login error:", error)
    return {
      success: false,
      error: "Une erreur est survenue lors de la connexion",
    }
  }
}

/**
 * Server Action pour la déconnexion
 */
export async function logoutUser(): Promise<void> {
  await signOut({ redirectTo: "/login" })
}
