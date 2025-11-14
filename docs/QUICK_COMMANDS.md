# 🚀 Commandes rapides - Habit Tracker

Aide-mémoire des commandes les plus utilisées.

---

## 🏃 Développement

```bash
# Démarrer le serveur de développement
npm run dev

# Build pour production
npm run build

# Démarrer en production
npm run start

# Linter le code
npm run lint
```

---

## 🗃️ Base de données (Prisma)

```bash
# Générer le client Prisma après modification du schema
npm run db:generate

# Créer une nouvelle migration
npm run db:migrate
# ou avec un nom spécifique :
npx prisma migrate dev --name nom_de_la_migration

# Synchroniser le schema sans migration (dev uniquement)
npm run db:push

# Ouvrir Prisma Studio (interface graphique)
npm run db:studio

# Réinitialiser complètement la BDD (⚠️ SUPPRIME TOUT)
npm run db:reset
```

---

## 🎨 shadcn/ui (quand disponible)

```bash
# Ajouter un composant
npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add card

# Ajouter plusieurs composants
npx shadcn@latest add button input card dialog form
```

---

## 📦 Gestion des packages

```bash
# Installer les dépendances
npm install

# Ajouter un package
npm install nom-du-package

# Ajouter un package dev
npm install -D nom-du-package

# Mettre à jour les packages
npm update

# Vérifier les vulnérabilités
npm audit
npm audit fix
```

---

## 🔍 Inspection & Debug

```bash
# Vérifier les types TypeScript
npx tsc --noEmit

# Voir le schema Prisma généré
npx prisma format

# Voir le statut des migrations
npx prisma migrate status

# Introspect la base de données
npx prisma db pull
```

---

## 📚 Documentation & Aide

```bash
# Aide Prisma
npx prisma --help
npx prisma migrate --help

# Aide Next.js
npx next --help

# Documentation locale
# Ouvrir docs/README.md dans l'éditeur
```

---

## 🧹 Nettoyage

```bash
# Supprimer node_modules et réinstaller
rm -rf node_modules
npm install

# Nettoyer le cache Next.js
rm -rf .next

# Nettoyer complètement (Windows PowerShell)
Remove-Item -Recurse -Force node_modules,.next
npm install
```

---

## 🎯 Workflow type

### Démarrer une session de dev
```bash
npm run dev              # Terminal 1
npm run db:studio        # Terminal 2 (optionnel)
```

### Modifier le schema Prisma
```bash
# 1. Éditer prisma/schema.prisma
# 2. Créer la migration
npm run db:migrate

# Ou en dev rapide (sans migration)
npm run db:push
```

### Ajouter un composant shadcn
```bash
npx shadcn@latest add nom-composant
```

---

## 📝 Notes importantes

- **Prisma Studio** : http://localhost:5555
- **App dev** : http://localhost:3000
- **Variables env** : Toujours dans `.env` (jamais commiter)
- **Migrations** : Toujours nommer de façon descriptive

---

## 🆘 Dépannage

### Erreur Prisma Client
```bash
npm run db:generate
```

### Erreur de migration
```bash
# Voir le statut
npx prisma migrate status

# Réinitialiser (⚠️ DANGER)
npm run db:reset
```

### Erreur TypeScript
```bash
# Vérifier les types
npx tsc --noEmit

# Redémarrer le serveur TS (dans VSCode)
Ctrl+Shift+P → TypeScript: Restart TS Server
```

### Cache Next.js corrompu
```bash
Remove-Item -Recurse -Force .next
npm run dev
```

---

## 🔗 Liens rapides

- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com)

---

**Astuce** : Ajouter ce fichier aux favoris de votre éditeur ! 📌
