# ✅ Configuration Complète - Habit Tracker

Ce document récapitule toute la configuration du projet.

---

## 📦 Packages installés

### Framework & Core
```json
"next": "15.5.6"
"react": "19.1.0"
"react-dom": "19.1.0"
"typescript": "^5"
```

### Base de données & ORM
```json
"@prisma/client": "^6.19.0"
"prisma": "^6.19.0" (dev)
"dotenv": "^17.2.3"
```

### UI & Styling
```json
"tailwindcss": "^4"
"@tailwindcss/postcss": "^4"
"next-themes": "^0.4.6"
"lucide-react": "^0.546.0"
```

### Composants Radix UI (via shadcn/ui)
```json
"@radix-ui/react-avatar": "^1.1.10"
"@radix-ui/react-dialog": "^1.1.15"
"@radix-ui/react-label": "^2.1.7"
"@radix-ui/react-progress": "^1.1.7"
"@radix-ui/react-slot": "^1.2.3"
"@radix-ui/react-switch": "^1.2.6"
"@radix-ui/react-tabs": "^1.1.13"
```

### Formulaires & Validation
```json
"react-hook-form": "^7.65.0"
"@hookform/resolvers": "^5.2.2"
"zod": "^4.1.12"
```

### Utilities
```json
"clsx": "^2.1.1"
"tailwind-merge": "^3.3.1"
"class-variance-authority": "^0.7.1"
"date-fns": "^4.1.0"
"react-day-picker": "^9.11.1"
"sonner": "^2.0.7"
```

---

## 🗂️ Structure du projet

```
habit_tracker/
├── .env                          # Variables d'environnement (GIT IGNORED)
├── .github/
│   └── .copilot-instructions.md  # Instructions Copilot complètes
├── app/
│   ├── globals.css               # Styles globaux + tokens sémantiques
│   ├── layout.tsx                # Layout racine
│   └── page.tsx                  # Page d'accueil
├── components/
│   └── Skeletons/
│       ├── base/                 # Skeletons atomiques
│       ├── composed/             # Skeletons composés
│       └── pages/                # Skeletons pages
├── docs/
│   ├── README.md                 # Index documentation
│   ├── ARCHITECTURE_SUMMARY.md   # Résumé architecture
│   └── CLIENT_SERVER_GUIDE.md    # Guide Client/Server
├── lib/
│   ├── prisma.ts                 # Client Prisma singleton
│   └── prisma-examples.ts        # Exemples d'utilisation Prisma
├── prisma/
│   ├── schema.prisma             # Schéma base de données
│   ├── README.md                 # Documentation Prisma
│   └── migrations/               # Historique migrations
├── components.json               # Config shadcn/ui
├── package.json                  # Dépendances et scripts
├── prisma.config.ts              # Configuration Prisma
└── tsconfig.json                 # Configuration TypeScript
```

---

## 🎨 Tokens sémantiques configurés

### Background (5 niveaux)
```css
--background-100  /* Main background (blanc/noir profond) */
--background-200  /* Subtle background */
--background-300  /* Cards, sections */
--background-400  /* Hover states */
--background-500  /* Borders, dividers */
```

### Foreground (9 niveaux)
```css
--foreground-100  /* Disabled text */
--foreground-200  /* Placeholder text */
--foreground-300  /* Secondary text */
--foreground-400  /* Tertiary text */
--foreground-500  /* Body text */
--foreground-600  /* Headings */
--foreground-700  /* Emphasis */
--foreground-800  /* Primary text */
--foreground-900  /* High contrast */
```

### Utilisation
```tsx
className="bg-background-300 text-foreground-800"
```

---

## 🗃️ Schéma base de données (Prisma)

### Modèles

#### User
```prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  image         String?
  password      String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  habits        Habit[]
}
```

#### Habit
```prisma
model Habit {
  id          String   @id @default(cuid())
  name        String
  description String?
  color       String?
  icon        String?
  frequency   String   @default("daily")
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  completions HabitCompletion[]
}
```

#### HabitCompletion
```prisma
model HabitCompletion {
  id          String   @id @default(cuid())
  habitId     String
  habit       Habit    @relation(fields: [habitId], references: [id], onDelete: Cascade)
  completedAt DateTime @default(now())
  notes       String?

  @@unique([habitId, completedAt])
}
```

---

## 🛠️ Scripts npm disponibles

```bash
# Développement
npm run dev              # Démarrer le serveur dev (Turbopack)
npm run build            # Build production
npm run start            # Démarrer en production
npm run lint             # Linter ESLint

# Base de données (Prisma)
npm run db:generate      # Générer le client Prisma
npm run db:migrate       # Créer et appliquer une migration
npm run db:push          # Sync rapide du schema (dev only)
npm run db:studio        # Interface graphique Prisma Studio
npm run db:reset         # Reset complet de la BDD (⚠️ DANGER)
```

---

## 🔐 Variables d'environnement (.env)

```env
# Base de données (Neon PostgreSQL)
DATABASE_URL="postgresql://..."
DATABASE_URL_UNPOOLED="postgresql://..."

# À ajouter plus tard
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="..."
```

---

## 📋 Guidelines essentielles

### Architecture Next.js
- ✅ **Par défaut = Server Component**
- ✅ **'use client' = justification obligatoire**
- ✅ **Fetch dans Server Components uniquement**
- ✅ **Composition : Server parent → Client enfant isolé**

### Design System
- ✅ **Tokens sémantiques obligatoires** (jamais de classes directes)
- ✅ **shadcn/ui en priorité absolue**
- ✅ **Mobile-first systématique** (320px+)

### Base de données
- ✅ **Prisma client singleton** (`import prisma from '@/lib/prisma'`)
- ✅ **Migrations avec Prisma Migrate**
- ✅ **Validation avec Zod**

### Qualité code
- ✅ **TypeScript strict**
- ✅ **Pas de `any`**
- ✅ **Code documenté**
- ✅ **Conventions Next.js respectées**

---

## 🚀 Prochaines étapes

1. ✅ Configuration Next.js + Prisma
2. ✅ Tokens sémantiques
3. ✅ Architecture Client/Server documentée
4. 🔲 Installation composants shadcn/ui (quand disponible)
5. 🔲 Implémentation NextAuth.js
6. 🔲 Création API routes
7. 🔲 Développement Dashboard
8. 🔲 Système de streaks

---

## 📚 Documentation

- [Architecture Summary](./ARCHITECTURE_SUMMARY.md)
- [Client/Server Guide](./CLIENT_SERVER_GUIDE.md)
- [Prisma README](../prisma/README.md)
- [Copilot Instructions](../.github/.copilot-instructions.md)

---

## ✅ Checklist de vérification

- [x] Next.js 15.5.6 installé avec Turbopack
- [x] TypeScript configuré en mode strict
- [x] Tailwind CSS v4 configuré
- [x] Prisma 6.19.0 installé et configuré
- [x] Base de données PostgreSQL (Neon) connectée
- [x] Migration initiale créée et appliquée
- [x] Client Prisma singleton créé
- [x] Tokens sémantiques définis (light + dark)
- [x] Architecture Client/Server documentée
- [x] Scripts npm configurés
- [x] Documentation complète créée
- [ ] Composants shadcn/ui installés (en attente)
- [ ] NextAuth.js configuré
- [ ] API routes créées
- [ ] Dashboard implémenté

---

**Date de configuration** : 14 novembre 2024
**Version Next.js** : 15.5.6
**Version Prisma** : 6.19.0
**Status** : ✅ Configuration de base complète
