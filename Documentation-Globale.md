# 📚 Documentation Globale - Habit Tracker

> **Documentation pédagogique complète du projet Habit Tracker**  
> Présentée comme support de cours pour expliquer l'architecture, les choix techniques et la logique métier

---

## 📖 Table des matières

1. [Vue d'ensemble du projet](#vue-densemble-du-projet)
2. [Architecture technique](#architecture-technique)
3. [Stack technologique](#stack-technologique)
4. [Base de données et Prisma](#base-de-données-et-prisma)
5. [Système d'authentification](#système-dauthentification)
6. [Logique métier principale](#logique-métier-principale)
7. [Design System](#design-system)
8. [Structure des fichiers](#structure-des-fichiers)
9. [Fonctionnalités majeures](#fonctionnalités-majeures)
10. [Concepts Next.js avancés](#concepts-nextjs-avancés)

---

## 🎯 Vue d'ensemble du projet

### Qu'est-ce que Habit Tracker ?

**Habit Tracker** est une application web moderne de suivi d'habitudes avec gamification. Elle permet aux utilisateurs de :
- 📋 Créer et suivre des habitudes personnalisées (quotidiennes, hebdomadaires, mensuelles)
- 🎮 Gagner de l'XP et monter de niveau en complétant leurs objectifs
- 😊 Suivre leur humeur quotidienne
- 📊 Visualiser leurs statistiques et leur progression
- 🏆 Débloquer des emojis en atteignant de nouveaux niveaux

### Objectifs pédagogiques

Ce projet illustre les **meilleures pratiques modernes** de développement web :
- ✅ Architecture Next.js 15 avec App Router
- ✅ Server Components vs Client Components
- ✅ Authentification sécurisée avec NextAuth.js v5
- ✅ ORM Prisma avec PostgreSQL
- ✅ Design System centralisé avec Tailwind CSS v4
- ✅ Validation côté serveur avec Zod
- ✅ TypeScript strict pour la sécurité des types
- ✅ Server Actions pour les mutations de données

---

## 🏗️ Architecture technique

### Vue d'ensemble de l'architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENT (Browser)                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  React 19    │  │ Client       │  │ UI Components│      │
│  │  Components  │  │ Components   │  │ (shadcn/ui)  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└───────────────────────────┬─────────────────────────────────┘
                            │ HTTP/HTTPS
┌───────────────────────────▼─────────────────────────────────┐
│              NEXT.JS 15 SERVER (App Router)                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Server      │  │ Server       │  │  API Routes  │      │
│  │  Components  │  │ Actions      │  │  (Auth)      │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Middleware  │  │ NextAuth.js  │  │  Validation  │      │
│  │  (Auth)      │  │  v5          │  │  (Zod)       │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└───────────────────────────┬─────────────────────────────────┘
                            │ Prisma Client
┌───────────────────────────▼─────────────────────────────────┐
│                 DATABASE (PostgreSQL - Neon)                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Users   │  │  Habits  │  │  Moods   │  │  Auth    │   │
│  │  (XP)    │  │  (Goals) │  │ (Daily)  │  │ (Session)│   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Principes architecturaux

#### 1. **Server-First Philosophy**
- Par défaut, tous les composants sont des **Server Components**
- Rendu côté serveur pour de meilleures performances SEO et temps de chargement
- Seuls les composants interactifs nécessitent `'use client'`

#### 2. **Data Fetching Strategy**
```typescript
// ❌ ÉVITER : Fetch côté client (ancien Next.js)
useEffect(() => {
  fetch('/api/habits')
    .then(res => res.json())
    .then(setHabits)
}, [])

// ✅ PRÉFÉRER : Server Components avec async/await
export default async function DashboardPage() {
  const session = await auth()
  const habits = await getHabits(session.user.id)
  
  return <DashboardContent habits={habits} />
}
```

#### 3. **Server Actions for Mutations**
```typescript
'use server' // Déclaration Server Action

export async function createHabit(data: FormData) {
  // Validation côté serveur
  const validated = habitSchema.parse(data)
  
  // Accès direct à la BDD (pas d'API route)
  return await prisma.habit.create({ data: validated })
}
```

#### 4. **Protection des routes**
```typescript
// Middleware pour protéger les routes privées
export { auth as middleware } from "@/lib/auth"

export const config = {
  matcher: ["/dashboard/:path*", "/habits/:path*", "/profile/:path*"]
}
```

---

## 🛠️ Stack technologique

### Frontend

| Technologie | Version | Rôle |
|-------------|---------|------|
| **Next.js** | 15.5.6 | Framework React full-stack |
| **React** | 19.1.0 | Bibliothèque UI |
| **TypeScript** | 5.x | Type-safety et IntelliSense |
| **Tailwind CSS** | v4 | Styling utility-first |
| **shadcn/ui** | Latest | Composants UI (Radix UI) |
| **Framer Motion** | 12.23.24 | Animations |
| **Lucide React** | 0.546.0 | Icônes |

### Backend

| Technologie | Version | Rôle |
|-------------|---------|------|
| **NextAuth.js** | 5.0.0-beta.30 | Authentification |
| **Prisma** | 6.19.0 | ORM TypeScript-first |
| **PostgreSQL** | 16.x | Base de données relationnelle |
| **Neon** | - | Hébergement PostgreSQL serverless |
| **Zod** | 3.x | Validation de schémas |
| **bcryptjs** | 3.0.3 | Hashing des mots de passe |

### Tools & DevEx

| Outil | Rôle |
|-------|------|
| **Turbopack** | Bundler ultra-rapide (remplace Webpack) |
| **ESLint** | Linting JavaScript/TypeScript |
| **date-fns** | Manipulation des dates |
| **Recharts** | Graphiques pour les statistiques |

---

## 🗄️ Base de données et Prisma

### Pourquoi Prisma ?

Prisma est un **ORM (Object-Relational Mapping)** moderne qui offre :
- ✅ **Type-safety** : Génération automatique des types TypeScript
- ✅ **Migrations** : Gestion des changements de schéma
- ✅ **Prisma Studio** : Interface graphique pour explorer les données
- ✅ **Query Builder** : API intuitive pour les requêtes

### Schéma de la base de données

#### 📐 Diagramme des relations

```
┌─────────────────┐
│      User       │
│─────────────────│
│ id (PK)         │◄──────┐
│ email (unique)  │       │
│ password        │       │
│ level           │       │
│ xp              │       │
│ unlockedEmojis  │       │
└─────────────────┘       │
        │                 │
        │ 1:N             │
        ▼                 │
┌─────────────────┐       │
│     Habit       │       │
│─────────────────│       │
│ id (PK)         │       │
│ name            │       │
│ emoji           │       │
│ frequency       │       │
│ userId (FK)     │───────┘
└─────────────────┘
        │
        │ 1:N
        ▼
┌─────────────────┐
│ HabitCompletion │
│─────────────────│
│ id (PK)         │
│ habitId (FK)    │
│ completedAt     │
│ note            │
└─────────────────┘

┌─────────────────┐
│   MoodEntry     │
│─────────────────│
│ id (PK)         │       ┌──────────────┐
│ mood            │       │  HabitXpGrant│
│ note            │       │──────────────│
│ userId (FK)     │       │ habitId (FK) │
└─────────────────┘       │ userId (FK)  │
                          │ date         │
                          └──────────────┘
```

### Modèles détaillés

#### 1. **User** - Le modèle central

```prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  password      String?
  
  // Système de progression
  level         Int       @default(1)
  xp            Int       @default(0)
  unlockedEmojis Json    @default("[]")
  
  // Relations
  habits        Habit[]
  moodEntries   MoodEntry[]
  accounts      Account[]
  sessions      Session[]
}
```

**Points clés :**
- `cuid()` : Identifiant unique cryptographiquement sécurisé
- `level` et `xp` : Système de gamification intégré au modèle
- `unlockedEmojis` : JSON array pour stocker les récompenses
- Relations `1:N` avec Habits et MoodEntries

#### 2. **Habit** - Le cœur de l'application

```prisma
model Habit {
  id          String   @id @default(cuid())
  name        String
  emoji       String?
  category    String?
  color       String?
  
  // Fréquences flexibles
  frequency   String   @default("daily")
  weekDays    Json?    // [0,1,2,3,4,5,6] pour weekly
  weeklyGoal  Int?     // Alternative : X fois par semaine
  monthlyGoal Int?     // X fois par mois
  monthDays   Json?    // [4,12,25] jours spécifiques
  
  endDate     DateTime?
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  completions HabitCompletion[]
}
```

**Logique de fréquence :**
```typescript
// Exemple 1 : Habitude quotidienne
{ frequency: 'daily' }

// Exemple 2 : Lundi, Mercredi, Vendredi
{ 
  frequency: 'weekly',
  weekDays: [1, 3, 5]  // 0=Dimanche, 1=Lundi, etc.
}

// Exemple 3 : 3 fois par semaine (flexible)
{ 
  frequency: 'weekly',
  weeklyGoal: 3  // N'importe quels 3 jours
}

// Exemple 4 : Les 1er, 15 et dernier jour du mois
{ 
  frequency: 'monthly',
  monthDays: [1, 15, -1]  // -1 = dernier jour
}
```

#### 3. **HabitCompletion** - Historique des complétions

```prisma
model HabitCompletion {
  id          String   @id @default(cuid())
  habitId     String
  habit       Habit    @relation(fields: [habitId], references: [id])
  completedAt DateTime @default(now())
  note        String?
}
```

**Pourquoi ce modèle ?**
- Permet de tracer **quand** chaque habitude a été complétée
- Essentiel pour les statistiques (streaks, taux de complétion)
- La `note` permet d'ajouter un contexte ("J'ai couru 5km")

#### 4. **HabitXpGrant** - Prévention des duplications d'XP

```prisma
model HabitXpGrant {
  id       String   @id @default(cuid())
  habitId  String
  userId   String
  date     DateTime // Date normalisée à minuit
  
  @@unique([habitId, userId, date])
}
```

**Problème résolu :**
```typescript
// ❌ SANS HabitXpGrant : risque de double XP
user.completeHabit("Sport")  // +15 XP
user.completeHabit("Sport")  // +15 XP (bug!)

// ✅ AVEC HabitXpGrant : protection
await prisma.habitXpGrant.create({
  data: { habitId, userId, date: startOfDay(new Date()) }
})
// Si déjà créé aujourd'hui → erreur unique constraint
```

#### 5. **MoodEntry** - Suivi émotionnel

```prisma
model MoodEntry {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  mood      Int      // 1-5 : Très mal, Mal, Neutre, Bien, Très bien
  note      String?
  createdAt DateTime @default(now())
  
  @@index([userId, createdAt])
}
```

**Utilisation :**
```typescript
// Statistiques de corrélation mood/habitudes
const avgMoodOnWorkoutDays = await calculateMoodCorrelation('Sport')
```

---

## 🔐 Système d'authentification

### NextAuth.js v5 - Architecture

NextAuth.js v5 introduit plusieurs changements majeurs par rapport à v4 :

#### Configuration (`lib/auth.ts`)

```typescript
export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        // 1. Validation avec Zod
        const { email, password } = credentialsSchema.parse(credentials)
        
        // 2. Récupération de l'utilisateur
        const user = await prisma.user.findUnique({ where: { email } })
        
        // 3. Vérification du mot de passe (bcrypt)
        const isValid = await compare(password, user.password)
        
        // 4. Retourner l'utilisateur ou null
        return isValid ? user : null
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Ajouter des données custom au JWT
      if (user) {
        token.id = user.id
        token.level = user.level
        token.xp = user.xp
      }
      return token
    },
    async session({ session, token }) {
      // Exposer les données custom dans la session
      session.user.id = token.id
      session.user.level = token.level
      session.user.xp = token.xp
      return session
    }
  }
})
```

#### Différences clés NextAuth v4 vs v5

| Aspect | v4 | v5 (ce projet) |
|--------|----|----|
| **Export** | `export default NextAuth(config)` | `export const { handlers, auth } = NextAuth(config)` |
| **API Routes** | `/pages/api/auth/[...nextauth].ts` | `/app/api/auth/[...nextauth]/route.ts` |
| **Session** | `useSession()` hook | `auth()` Server Component |
| **Protection** | `getServerSession()` | `middleware` + `auth()` |

#### Protection des routes avec Middleware

```typescript
// middleware.ts (racine du projet)
export { auth as middleware } from "@/lib/auth"

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/habits/:path*",
    "/profile/:path*",
    "/mood/:path*",
    "/stats/:path*"
  ]
}
```

**Comment ça marche ?**
1. Chaque requête vers `/dashboard` passe par le middleware
2. Le middleware vérifie la session JWT
3. Si pas de session → redirection vers `/login`
4. Si session valide → requête continue

#### Sécurité des mots de passe

```typescript
// Inscription (lib/actions/auth.ts)
import { hash } from 'bcryptjs'

export async function register(data: RegisterInput) {
  // Hash avec 12 rounds (équilibre sécurité/performance)
  const hashedPassword = await hash(data.password, 12)
  
  await prisma.user.create({
    data: {
      email: data.email,
      password: hashedPassword,
      // Vérification d'email automatique en dev
      emailVerified: new Date()
    }
  })
}
```

**Pourquoi bcrypt ?**
- Algorithme lent par design (résiste aux attaques brute-force)
- Salage automatique (chaque hash est unique)
- Industry standard depuis 20+ ans

---

## 🎮 Logique métier principale

### 1. Système de progression (XP & Niveaux)

#### Formule mathématique

Le système utilise une **progression exponentielle** pour maintenir l'engagement :

```typescript
// lib/progression.ts

export const MAX_LEVEL = 50
export const BASE_XP = 100

/**
 * Formule : BASE_XP * (1.15 ^ (level - 1))
 * 
 * Exemples :
 * Level 1→2 : 100 XP
 * Level 5→6 : 175 XP
 * Level 10→11 : 371 XP
 * Level 20→21 : 1,638 XP
 * Level 49→50 : 63,211 XP
 */
export function getXpForNextLevel(currentLevel: number): number {
  return Math.floor(BASE_XP * Math.pow(1.15, currentLevel - 1))
}
```

#### Calcul du niveau actuel

```typescript
export function calculateLevel(xp: number): number {
  let currentLevel = 1
  let xpRequired = 0
  
  while (currentLevel < MAX_LEVEL) {
    xpRequired += getXpForNextLevel(currentLevel)
    
    if (xp < xpRequired) {
      return currentLevel
    }
    
    currentLevel++
  }
  
  return MAX_LEVEL
}
```

#### Progression visuelle

```typescript
export function getProgressToNextLevel(xp: number): number {
  const currentLevel = calculateLevel(xp)
  const xpForCurrentLevel = getTotalXpForLevel(currentLevel)
  const xpForNextLevel = getTotalXpForLevel(currentLevel + 1)
  
  const currentLevelXp = xp - xpForCurrentLevel
  const requiredXp = xpForNextLevel - xpForCurrentLevel
  
  return Math.floor((currentLevelXp / requiredXp) * 100)
}

// Exemple : 250 XP = Level 2 (50% vers Level 3)
// Dans l'UI : <ProgressBar value={50} />
```

#### Attribution de l'XP selon la fréquence

```typescript
export function getXpForHabit(frequency: string): number {
  switch (frequency) {
    case 'daily':   return 10  // Plus facile = moins d'XP
    case 'weekly':  return 15  // Équilibre
    case 'monthly': return 20  // Plus difficile = plus d'XP
    default:        return 10
  }
}
```

**Pourquoi cette répartition ?**
- Habitudes quotidiennes : plus de chances de complétion → moins d'XP/action
- Habitudes mensuelles : plus rares et difficiles → plus d'XP/action
- Équilibre : un utilisateur actif quotidien gagne autant qu'un utilisateur mensuel assidu

### 2. Système d'emojis débloquables

#### Catégorisation des emojis

```typescript
// lib/emojis-system.ts

export const EMOJI_CATEGORIES = {
  starter: {
    label: "Débutant",
    unlockLevel: 1,
    emojis: ["🌱", "🎯", "📝", "💡"]
  },
  bronze: {
    label: "Bronze",
    unlockLevel: 5,
    emojis: ["🏃", "📚", "🎨", "🍎", "💪"]
  },
  silver: {
    label: "Argent",
    unlockLevel: 10,
    emojis: ["🧘", "🎵", "🌟", "🏆", "🚀"]
  },
  gold: {
    label: "Or",
    unlockLevel: 20,
    emojis: ["👑", "💎", "🔥", "⚡", "🌈"]
  },
  platinum: {
    label: "Platine",
    unlockLevel: 35,
    emojis: ["🦄", "🌌", "🎭", "🏅", "🎪"]
  },
  legendary: {
    label: "Légendaire",
    unlockLevel: 50,
    emojis: ["🔮", "🌠", "🎇", "✨", "🌺"]
  }
}
```

#### Logique de déblocage

```typescript
export function getUnlockedEmojis(level: number): string[] {
  return Object.values(EMOJI_CATEGORIES)
    .filter(category => level >= category.unlockLevel)
    .flatMap(category => category.emojis)
}

// Exemple : Level 12 débloque starter + bronze + silver
const emojis = getUnlockedEmojis(12)
// => ["🌱", "🎯", "📝", "💡", "🏃", "📚", "🎨", "🍎", "💪", "🧘", "🎵", "🌟", "🏆", "🚀"]
```

### 3. Calcul des statistiques

#### Taux de complétion mensuel

```typescript
// lib/stats-utils.ts

export async function getUserStats(userId: string) {
  const now = new Date()
  const startOfMonth = startOfMonth(now)
  const endOfMonth = endOfMonth(now)
  
  const habits = await prisma.habit.findMany({
    where: { userId },
    include: {
      completions: {
        where: {
          completedAt: { gte: startOfMonth, lte: endOfMonth }
        }
      }
    }
  })
  
  // Nombre de complétions attendues = habitudes actives * jours écoulés
  const activeHabits = habits.filter(h => !h.endDate || new Date(h.endDate) >= now)
  const daysElapsed = now.getDate()
  const expectedCompletions = activeHabits.length * daysElapsed
  
  // Complétions réelles
  const actualCompletions = habits.flatMap(h => h.completions).length
  
  // Taux = (réel / attendu) * 100
  const completionRate = expectedCompletions > 0
    ? Math.round((actualCompletions / expectedCompletions) * 100)
    : 0
  
  return { completionRate, actualCompletions, expectedCompletions }
}
```

#### Streak (série de complétions)

```typescript
export function calculateStreak(completions: HabitCompletion[]): number {
  if (completions.length === 0) return 0
  
  // Trier par date décroissante
  const sorted = completions
    .map(c => startOfDay(c.completedAt))
    .sort((a, b) => b.getTime() - a.getTime())
  
  let streak = 0
  let currentDate = startOfDay(new Date())
  
  // Vérifier que la dernière complétion est aujourd'hui ou hier
  const lastCompletion = sorted[0]
  const daysDiff = differenceInDays(currentDate, lastCompletion)
  
  if (daysDiff > 1) return 0 // Streak cassée
  
  // Compter les jours consécutifs
  for (const completionDate of sorted) {
    if (isSameDay(completionDate, currentDate)) {
      streak++
      currentDate = subDays(currentDate, 1)
    } else {
      break
    }
  }
  
  return streak
}
```

#### Top 3 des habitudes

```typescript
export async function getTopHabits(userId: string, limit = 3) {
  const habits = await prisma.habit.findMany({
    where: { userId },
    include: { completions: true }
  })
  
  // Calculer le taux de complétion pour chaque habitude
  const habitsWithRate = habits.map(habit => {
    const daysSinceCreation = differenceInDays(new Date(), habit.createdAt)
    const expectedCompletions = Math.max(1, daysSinceCreation)
    const rate = (habit.completions.length / expectedCompletions) * 100
    
    return { ...habit, completionRate: Math.min(100, Math.round(rate)) }
  })
  
  // Trier par taux décroissant et retourner le top 3
  return habitsWithRate
    .sort((a, b) => b.completionRate - a.completionRate)
    .slice(0, limit)
}
```

---

## 🎨 Design System

### Philosophie

Le design system de Habit Tracker repose sur **Tailwind CSS v4** avec une approche **design tokens centralisés**.

#### Avantages de cette approche

✅ **Consistance** : Toutes les couleurs, espacements et typographies sont définis une seule fois  
✅ **Maintenabilité** : Changer une couleur se fait en un seul endroit  
✅ **Dark mode automatique** : Les tokens s'adaptent au thème  
✅ **Type-safety** : Helpers TypeScript pour éviter les erreurs  

### Tokens de couleur

#### Structure hiérarchique

```css
/* app/globals.css */

@theme {
  /* Background - 5 niveaux de profondeur */
  --background-100: #0F0F14;  /* Fond principal */
  --background-200: #18181C;  /* Cartes */
  --background-300: #222227;  /* Hover */
  --background-400: #2D2D33;  /* Actif */
  --background-500: #3A3A42;  /* Bordures */
  
  /* Foreground - 9 niveaux de contraste */
  --foreground-100: #606066;  /* Disabled */
  --foreground-200: #707076;  /* Subtil */
  --foreground-300: #808086;  /* Secondaire */
  --foreground-400: #9090A0;  /* Hint */
  --foreground-500: #A0A0B4;  /* Placeholder */
  --foreground-600: #B5B5C8;  /* Corps */
  --foreground-700: #D0D0DC;  /* Emphase */
  --foreground-800: #E8E8F0;  /* Titres */
  --foreground-900: #FFFFFF;  /* Maximum contraste */
  
  /* Accents - 6 couleurs thématiques */
  --accent-purple: #8B5CF6;   /* Santé/Bien-être */
  --accent-blue: #3B82F6;     /* Productivité */
  --accent-green: #10B981;    /* Sport/Nature */
  --accent-orange: #F59E0B;   /* Créativité */
  --accent-pink: #EC4899;     /* Social */
  --accent-teal: #14B8A6;     /* Apprentissage */
  
  /* Status - 4 états */
  --color-success: #10B981;   /* Succès */
  --color-warning: #F59E0B;   /* Avertissement */
  --color-error: #EF4444;     /* Erreur */
  --color-info: #3B82F6;      /* Information */
}
```

#### Utilisation dans les composants

```tsx
// ✅ Bon : Utilisation des tokens
<div className="bg-background-200 text-foreground-800 border-background-500">
  <h1 className="text-foreground-900">Titre</h1>
  <p className="text-foreground-600">Corps de texte</p>
</div>

// ❌ Mauvais : Couleurs hardcodées
<div className="bg-gray-800 text-white border-gray-700">
  <h1 className="text-gray-100">Titre</h1>
  <p className="text-gray-400">Corps de texte</p>
</div>
```

### Helpers TypeScript

```typescript
// lib/design-tokens.ts

export const HABIT_COLORS = {
  purple: {
    name: 'Santé/Bien-être',
    value: 'var(--accent-purple)',
    class: 'bg-[var(--accent-purple)]',
  },
  // ... autres couleurs
} as const

export type HabitColorKey = keyof typeof HABIT_COLORS

// Utilisation
import { HABIT_COLORS, type HabitColorKey } from '@/lib/design-tokens'

function HabitCard({ color }: { color: HabitColorKey }) {
  const colorConfig = HABIT_COLORS[color]
  
  return (
    <div className={colorConfig.class}>
      {colorConfig.name}
    </div>
  )
}
```

### Composants UI (shadcn/ui)

Le projet utilise **shadcn/ui**, une collection de composants **copiés dans le projet** (pas une dépendance npm).

#### Avantages de shadcn/ui

✅ **Propriété du code** : Les composants sont dans votre codebase  
✅ **Personnalisables** : Modifiez-les comme vous voulez  
✅ **Accessibilité** : Basés sur Radix UI (WAI-ARIA compliant)  
✅ **Tailwind natif** : Styling cohérent avec le reste du projet  

#### Composants utilisés

```
components/ui/
├── button.tsx        # Boutons avec variants (default, ghost, outline)
├── card.tsx          # Containers pour les HabitCards
├── input.tsx         # Champs de formulaire
├── select.tsx        # Dropdowns pour frequency/category
├── drawer.tsx        # Emoji picker drawer (mobile-first)
├── tabs.tsx          # Onglets (Dashboard: today/week/overall)
├── progress.tsx      # Barre de progression XP
├── badge.tsx         # Badges de statut (daily, weekly, monthly)
├── calendar.tsx      # Sélecteur de date (endDate)
└── skeleton.tsx      # Loading states
```

---

## 📁 Structure des fichiers

### Organisation Next.js App Router

```
app/
├── layout.tsx                    # Layout racine (ThemeProvider, fonts)
├── page.tsx                      # Landing page publique
├── globals.css                   # Design tokens & base styles
├── api/
│   └── auth/[...nextauth]/       # NextAuth.js handlers
│       └── route.ts
├── (auth)/                       # Route group pour auth
│   ├── login/page.tsx
│   └── register/page.tsx
├── dashboard/                    # Routes protégées
│   ├── page.tsx                  # Vue d'ensemble des habitudes
│   └── loading.tsx               # Skeleton loading state
├── habits/
│   ├── create/page.tsx           # Formulaire création
│   └── [id]/
│       ├── page.tsx              # Détails habitude
│       └── edit/page.tsx         # Formulaire édition
├── mood/
│   └── page.tsx                  # Suivi humeur quotidienne
├── stats/
│   └── page.tsx                  # Analytics & graphiques
└── profile/
    ├── page.tsx                  # Profil utilisateur
    └── progression/page.tsx      # Niveau & XP
```

### Logique métier (`lib/`)

```
lib/
├── auth.ts                # Configuration NextAuth.js
├── prisma.ts              # Client Prisma singleton
├── design-tokens.ts       # Helpers couleurs/emojis
├── progression.ts         # Calculs XP/niveau
├── habits-utils.ts        # Helpers fréquences habitudes
├── stats-utils.ts         # Calculs statistiques avancées
├── emojis-system.ts       # Système d'emojis débloquables
└── actions/               # Server Actions
    ├── auth.ts            # register, login
    ├── habits.ts          # CRUD habitudes
    └── mood.ts            # CRUD humeurs
```

### Composants (`components/`)

```
components/
├── ui/                    # shadcn/ui components
├── navigation/
│   ├── BottomNav.tsx      # Navigation mobile
│   └── PageHeader.tsx     # Header réutilisable
├── dashboard/
│   └── DashboardContent.tsx
├── habits/
│   ├── HabitCard.tsx
│   ├── CreateHabitForm.tsx
│   ├── EditHabitForm.tsx
│   ├── EmojiPickerDrawer.tsx
│   └── HabitDetailContent.tsx
├── mood/
│   └── MoodContent.tsx
├── stats/
│   └── StatsContent.tsx   # Recharts graphiques
├── profile/
│   ├── ProfileContent.tsx
│   └── ProgressionContent.tsx
└── Skeletons/             # Loading states
    ├── base/
    ├── composed/
    └── pages/
```

---

## ⚙️ Fonctionnalités majeures

### 1. Création d'habitude avec fréquences flexibles

#### Interface utilisateur

```tsx
// components/habits/CreateHabitForm.tsx

<Select onValueChange={(value) => setValue('frequency', value)}>
  <SelectItem value="daily">Quotidienne</SelectItem>
  <SelectItem value="weekly">Hebdomadaire</SelectItem>
  <SelectItem value="monthly">Mensuelle</SelectItem>
</Select>

{frequency === 'weekly' && (
  <div>
    <label>Jours de la semaine</label>
    {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day, i) => (
      <Checkbox
        checked={weekDays?.includes(i)}
        onCheckedChange={() => toggleWeekDay(i)}
      />
    ))}
  </div>
)}
```

#### Validation côté serveur

```typescript
// lib/actions/habits.ts

const createHabitSchema = z.object({
  name: z.string().min(3, "Le nom doit contenir au moins 3 caractères"),
  frequency: z.enum(['daily', 'weekly', 'monthly']),
  weekDays: z.array(z.number().min(0).max(6)).optional(),
  weeklyGoal: z.number().min(1).max(7).optional(),
  monthlyGoal: z.number().min(1).max(31).optional(),
}).refine(data => {
  // Validation conditionnelle : si weekly, doit avoir weekDays OU weeklyGoal
  if (data.frequency === 'weekly') {
    return (data.weekDays && data.weekDays.length > 0) || data.weeklyGoal
  }
  return true
}, {
  message: "Veuillez spécifier les jours ou un objectif hebdomadaire"
})

export async function createHabit(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) throw new Error('Unauthorized')
  
  const validated = createHabitSchema.parse({
    name: formData.get('name'),
    frequency: formData.get('frequency'),
    // ... autres champs
  })
  
  return await prisma.habit.create({
    data: { ...validated, userId: session.user.id }
  })
}
```

### 2. Complétion d'habitude avec gain d'XP

#### Flow complet

```typescript
// lib/actions/habits.ts

export async function completeHabit(habitId: string) {
  const session = await auth()
  const userId = session.user.id
  
  // 1. Récupérer l'habitude
  const habit = await prisma.habit.findUnique({ where: { id: habitId } })
  
  // 2. Créer la complétion
  await prisma.habitCompletion.create({
    data: { habitId, completedAt: new Date() }
  })
  
  // 3. Vérifier si XP déjà attribué aujourd'hui
  const today = startOfDay(new Date())
  const existingGrant = await prisma.habitXpGrant.findUnique({
    where: {
      habitId_userId_date: { habitId, userId, date: today }
    }
  })
  
  if (!existingGrant) {
    // 4. Attribuer l'XP
    const xpGain = getXpForHabit(habit.frequency)
    
    await prisma.$transaction([
      // Créer le grant
      prisma.habitXpGrant.create({
        data: { habitId, userId, date: today }
      }),
      // Mettre à jour l'utilisateur
      prisma.user.update({
        where: { id: userId },
        data: {
          xp: { increment: xpGain },
          // Recalculer le niveau
          level: calculateLevel(user.xp + xpGain)
        }
      })
    ])
    
    return { success: true, xpGained: xpGain }
  }
  
  return { success: true, xpGained: 0 }
}
```

#### UI optimiste

```tsx
// components/habits/HabitCard.tsx

'use client'

const [isCompleting, setIsCompleting] = useState(false)

async function handleComplete() {
  setIsCompleting(true)
  
  try {
    const result = await completeHabit(habit.id)
    
    // Toast de succès
    toast.success(
      result.xpGained > 0
        ? `+${result.xpGained} XP gagné !`
        : "Déjà complétée aujourd'hui"
    )
    
    // Revalidate via Server Action
    revalidatePath('/dashboard')
  } catch (error) {
    toast.error("Erreur lors de la complétion")
  } finally {
    setIsCompleting(false)
  }
}
```

### 3. Dashboard avec filtres temporels

#### Tabs pour vues différentes

```tsx
// components/dashboard/DashboardContent.tsx

<Tabs defaultValue="today">
  <TabsList>
    <TabsTrigger value="today">Aujourd'hui</TabsTrigger>
    <TabsTrigger value="week">Cette semaine</TabsTrigger>
    <TabsTrigger value="overall">Vue globale</TabsTrigger>
  </TabsList>
  
  <TabsContent value="today">
    {filterHabitsForToday(habits).map(habit => (
      <HabitCard key={habit.id} habit={habit} />
    ))}
  </TabsContent>
  
  <TabsContent value="week">
    {filterHabitsForWeek(habits).map(habit => (
      <HabitCard key={habit.id} habit={habit} showWeekProgress />
    ))}
  </TabsContent>
</Tabs>
```

#### Logique de filtrage

```typescript
// lib/habits-utils.ts

export function shouldShowHabitToday(habit: Habit): boolean {
  const today = new Date()
  const dayOfWeek = today.getDay() // 0-6
  
  // Vérifier si l'habitude est terminée
  if (habit.endDate && new Date(habit.endDate) < today) {
    return false
  }
  
  switch (habit.frequency) {
    case 'daily':
      return true
    
    case 'weekly':
      if (habit.weekDays && Array.isArray(habit.weekDays)) {
        return habit.weekDays.includes(dayOfWeek)
      }
      // Si weeklyGoal, toujours afficher
      return !!habit.weeklyGoal
    
    case 'monthly':
      const dayOfMonth = today.getDate()
      if (habit.monthDays && Array.isArray(habit.monthDays)) {
        return habit.monthDays.includes(dayOfMonth)
      }
      return !!habit.monthlyGoal
    
    default:
      return false
  }
}
```

### 4. Statistiques avec Recharts

#### Graphique des complétions hebdomadaires

```tsx
// components/stats/StatsContent.tsx

import { BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts'

function WeeklyChart({ weeklyData }) {
  return (
    <BarChart data={weeklyData} width={600} height={300}>
      <XAxis dataKey="day" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="completions" fill="var(--accent-blue)" />
    </BarChart>
  )
}

// Données préparées côté serveur
const weeklyData = [
  { day: 'Lun', completions: 5 },
  { day: 'Mar', completions: 7 },
  { day: 'Mer', completions: 4 },
  // ...
]
```

---

## 🚀 Concepts Next.js avancés

### 1. Server Components vs Client Components

#### Règle de décision

```tsx
// ✅ Server Component (par défaut)
// - Fetch de données
// - Accès direct à la BDD
// - Pas d'interactivité
export default async function ProfilePage() {
  const user = await prisma.user.findUnique({ ... })
  return <ProfileContent user={user} />
}

// ✅ Client Component (explicite)
// - Événements (onClick, onChange)
// - Hooks (useState, useEffect)
// - Animations
'use client'
export function HabitCard({ habit }) {
  const [isCompleting, setIsCompleting] = useState(false)
  
  return (
    <button onClick={() => handleComplete()}>
      Compléter
    </button>
  )
}
```

#### Pattern Composition

```tsx
// ✅ MEILLEUR PATTERN : Server Component wrapper + Client Component leaf

// app/dashboard/page.tsx (Server Component)
export default async function DashboardPage() {
  const habits = await getHabits() // Accès BDD
  
  return (
    <div>
      <PageHeader title="Dashboard" /> {/* Server Component */}
      <DashboardContent habits={habits} /> {/* Client Component */}
    </div>
  )
}

// components/dashboard/DashboardContent.tsx (Client Component)
'use client'
export function DashboardContent({ habits }) {
  const [filter, setFilter] = useState('today')
  
  return (
    <div>
      <FilterButtons onFilterChange={setFilter} />
      {habits.filter(h => matchesFilter(h, filter)).map(...)}
    </div>
  )
}
```

### 2. Server Actions

#### Définition et utilisation

```typescript
// lib/actions/habits.ts

'use server' // Directive indiquant que ce fichier contient des Server Actions

export async function deleteHabit(habitId: string) {
  // 1. Vérifier l'authentification
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' }
  }
  
  // 2. Vérifier la propriété
  const habit = await prisma.habit.findUnique({
    where: { id: habitId },
    select: { userId: true }
  })
  
  if (habit?.userId !== session.user.id) {
    return { success: false, error: 'Forbidden' }
  }
  
  // 3. Suppression
  await prisma.habit.delete({ where: { id: habitId } })
  
  // 4. Revalidation du cache
  revalidatePath('/dashboard')
  
  return { success: true }
}
```

#### Appel depuis un Client Component

```tsx
'use client'

import { deleteHabit } from '@/lib/actions/habits'

export function DeleteButton({ habitId }) {
  async function handleDelete() {
    const result = await deleteHabit(habitId)
    
    if (result.success) {
      toast.success('Habitude supprimée')
    } else {
      toast.error(result.error)
    }
  }
  
  return <Button onClick={handleDelete}>Supprimer</Button>
}
```

### 3. Loading States & Streaming

#### loading.tsx

```tsx
// app/dashboard/loading.tsx

import { DashboardSkeleton } from '@/components/Skeletons/pages/DashboardSkeleton'

export default function Loading() {
  return <DashboardSkeleton />
}
```

**Comment ça marche ?**
- Next.js détecte automatiquement `loading.tsx`
- Pendant le fetch des données, affiche le skeleton
- Streaming SSR : le HTML est envoyé progressivement

#### Suspense pour granularité

```tsx
// app/stats/page.tsx

import { Suspense } from 'react'

export default async function StatsPage() {
  return (
    <div>
      <PageHeader title="Statistiques" />
      
      {/* KPIs chargés immédiatement */}
      <Suspense fallback={<KpiSkeleton />}>
        <KpiCards userId={userId} />
      </Suspense>
      
      {/* Graphiques chargés après (plus lourds) */}
      <Suspense fallback={<ChartSkeleton />}>
        <Charts userId={userId} />
      </Suspense>
    </div>
  )
}
```

### 4. Middleware & Protection

```typescript
// middleware.ts

import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isAuthRoute = req.nextUrl.pathname.startsWith('/login') || 
                      req.nextUrl.pathname.startsWith('/register')
  const isProtectedRoute = req.nextUrl.pathname.startsWith('/dashboard') ||
                           req.nextUrl.pathname.startsWith('/habits')
  
  // Redirection si non authentifié sur route protégée
  if (isProtectedRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login', req.url))
  }
  
  // Redirection si authentifié sur page auth
  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }
  
  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}
```

### 5. Revalidation & Caching

#### revalidatePath

```typescript
'use server'

export async function updateHabit(habitId: string, data: HabitInput) {
  await prisma.habit.update({ where: { id: habitId }, data })
  
  // Invalider le cache de ces routes
  revalidatePath('/dashboard')
  revalidatePath(`/habits/${habitId}`)
}
```

#### revalidateTag (plus granulaire)

```typescript
// Tagging lors du fetch
const habits = await prisma.habit.findMany({
  where: { userId },
  // Next.js 15 : tags pour revalidation ciblée
  next: { tags: [`habits-${userId}`] }
})

// Revalidation ciblée
revalidateTag(`habits-${userId}`)
```

---

## 📝 Commandes utiles

### Développement

```bash
# Démarrer le serveur de développement (Turbopack)
npm run dev

# Build de production
npm run build

# Démarrer en production
npm start

# Linter
npm run lint
```

### Base de données

```bash
# Générer le client Prisma (après modif schema)
npm run db:generate

# Créer une migration
npm run db:migrate

# Pousser le schema sans migration (dev uniquement)
npm run db:push

# Ouvrir Prisma Studio (GUI)
npm run db:studio

# Reset la BDD + seed
npm run db:reset

# Seed uniquement
npm run db:seed
```

---

## 🎓 Points clés pour une présentation

### 1. Architecture moderne Next.js 15
- **App Router** : File-based routing avec layouts imbriqués
- **Server Components** : Rendu serveur par défaut → meilleure perf
- **Server Actions** : Mutations de données sans API routes
- **Streaming SSR** : Chargement progressif pour UX fluide

### 2. Type-safety end-to-end
- **TypeScript** : Typage strict sur toute la codebase
- **Prisma** : Génération automatique des types depuis le schema
- **Zod** : Validation runtime qui garantit la cohérence types/runtime

### 3. Sécurité
- **NextAuth.js v5** : Solution d'auth industry-standard
- **bcrypt** : Hashing sécurisé des mots de passe (12 rounds)
- **Middleware** : Protection des routes côté serveur
- **Validation serveur** : Jamais de confiance au client

### 4. Performance
- **Turbopack** : Build 700x plus rapide que Webpack
- **Server Components** : Zero JS envoyé au client pour les composants statiques
- **Prisma** : Requêtes optimisées avec connection pooling (Neon)
- **Suspense & loading.tsx** : Streaming pour perceived performance

### 5. Developer Experience
- **Design tokens** : Un seul endroit pour changer tout le design
- **shadcn/ui** : Composants accessibles et personnalisables
- **TypeScript + IntelliSense** : Autocomplétion et erreurs à la compilation
- **Prisma Studio** : GUI pour explorer/modifier la BDD facilement

---

## 🔮 Évolutions possibles

### Fonctionnalités
- 🔔 Notifications push (habitudes non complétées)
- 🤝 Système d'amis et challenges
- 📅 Intégration calendrier (Google Calendar)
- 🏆 Achievements system (badges)
- 📱 Progressive Web App (installable)
- 🌍 Internationalisation (i18n)

### Techniques
- ⚡ Edge Runtime pour les Server Actions
- 📊 Analytics (Vercel Analytics, Posthog)
- 🧪 Tests (Jest, Playwright, Vitest)
- 🚀 CI/CD (GitHub Actions, deploy preview)
- 📦 Monorepo (mobile app avec React Native)
- 🔍 Search avec Algolia

---

## 📚 Ressources complémentaires

### Documentation officielle
- [Next.js 15 Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [NextAuth.js v5](https://authjs.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/docs)

### Concepts avancés
- [React Server Components](https://react.dev/reference/rsc/server-components)
- [Progressive Enhancement](https://developer.mozilla.org/en-US/docs/Glossary/Progressive_Enhancement)
- [WCAG Accessibility](https://www.w3.org/WAI/WCAG21/quickref/)

---

**Fin de la documentation** ✅

Ce document couvre l'intégralité de l'architecture, de la logique métier et des choix techniques du projet Habit Tracker. Il peut servir de support pédagogique pour expliquer chaque aspect du code lors d'une présentation en classe.
