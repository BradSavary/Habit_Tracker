# Prisma - Guide d'utilisation

## 📋 Configuration

Prisma est configuré avec PostgreSQL (Neon) comme base de données.

### Variables d'environnement (.env)
```
DATABASE_URL="postgresql://..." # URL avec connection pooling
DATABASE_URL_UNPOOLED="postgresql://..." # URL directe sans pooling
```

## 🛠️ Commandes Prisma essentielles

### Génération du client
```bash
npx prisma generate
```
Génère le client Prisma TypeScript après modification du schema.

### Migrations
```bash
# Créer et appliquer une nouvelle migration
npx prisma migrate dev --name nom_de_la_migration

# Appliquer les migrations en production
npx prisma migrate deploy

# Réinitialiser la base de données (⚠️ DANGER - Supprime toutes les données)
npx prisma migrate reset --force
```

### Visualisation
```bash
# Ouvrir Prisma Studio (interface graphique)
npx prisma studio
```

### Synchronisation
```bash
# Synchroniser le schema sans créer de migration
npx prisma db push

# Générer le schema depuis la base de données existante
npx prisma db pull
```

## 📂 Structure Prisma

```
prisma/
├── schema.prisma       # Schéma des modèles de données
└── migrations/         # Historique des migrations
    └── YYYYMMDD_name/
        └── migration.sql

lib/
└── prisma.ts          # Client Prisma singleton

prisma.config.ts       # Configuration Prisma
```

## 🗃️ Modèles actuels

### User
- Modèle pour l'authentification des utilisateurs
- Champs de progression : `level`, `xp`, `unlockedEmojis`
- Relations : habits, moodEntries, accounts, sessions

### Habit
- Modèle pour les habitudes
- Champs : name, description, emoji, color, category, frequency
- Configuration avancée : weekDays, weeklyGoal, monthlyGoal, monthDays, endDate
- Relations : Appartient à un utilisateur, a plusieurs completions

### HabitCompletion
- Modèle pour suivre les validations d'habitudes
- Champs : habitId, completedAt, notes, createdAt
- Relations : Appartient à une habitude

### HabitXpGrant
- Modèle pour tracker les XP accordés (ne se supprime jamais)
- Empêche de donner de l'XP plusieurs fois par jour
- Champs : habitId, userId, xpGranted, grantedDate

### MoodEntry
- Modèle pour le suivi de l'humeur quotidienne
- Champs : emoji, date, notes
- Relations : Appartient à un utilisateur

### Account, Session, VerificationToken
- Modèles NextAuth.js pour l'authentification
- Gérés automatiquement par le PrismaAdapter

## 💡 Utilisation dans le code

### Importer le client Prisma
```typescript
import prisma from '@/lib/prisma'
```

### Exemples de requêtes

#### Créer un utilisateur
```typescript
const user = await prisma.user.create({
  data: {
    email: 'user@example.com',
    name: 'John Doe',
  },
})
```

#### Créer une habitude
```typescript
const habit = await prisma.habit.create({
  data: {
    name: 'Méditation',
    description: '10 minutes de méditation quotidienne',
    frequency: 'daily',
    userId: user.id,
  },
})
```

#### Récupérer les habitudes d'un utilisateur
```typescript
const habits = await prisma.habit.findMany({
  where: {
    userId: user.id,
  },
  include: {
    completions: true,
  },
})
```

#### Valider une habitude
```typescript
const completion = await prisma.habitCompletion.create({
  data: {
    habitId: habit.id,
    completedAt: new Date(),
  },
})
```

#### Calculer un streak
```typescript
const completions = await prisma.habitCompletion.findMany({
  where: {
    habitId: habit.id,
  },
  orderBy: {
    completedAt: 'desc',
  },
})
```

## 🔒 Bonnes pratiques

1. **Client singleton** : Toujours utiliser le client depuis `/lib/prisma.ts`
2. **Transactions** : Utiliser `prisma.$transaction()` pour les opérations multiples
3. **Type safety** : Profiter du typage automatique TypeScript
4. **Relations** : Utiliser `include` ou `select` pour charger les relations
5. **Validation** : Valider les données avec Zod avant les requêtes Prisma

## 📚 Ressources

- [Documentation Prisma](https://www.prisma.io/docs)
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [Prisma Client API](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference)
