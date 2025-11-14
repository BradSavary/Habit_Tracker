# Guide de décision : Client vs Server Components

## 🎯 Règle d'or : **Par défaut = Server Component**

Ne pas ajouter `'use client'` sans raison justifiable logiquement.

---

## 📊 Arbre de décision

```
Ai-je besoin de... ?
│
├─ Hooks React (useState, useEffect, useContext, etc.)
│  └─ ✅ OUI → Client Component
│
├─ Event handlers (onClick, onChange, onSubmit)
│  └─ ✅ OUI → Client Component
│
├─ APIs navigateur (localStorage, window, document)
│  └─ ✅ OUI → Client Component
│
├─ Animations/interactions temps réel
│  └─ ✅ OUI → Client Component
│
├─ Récupération données BDD (Prisma)
│  └─ ❌ NON → Server Component
│
├─ Variables d'environnement serveur
│  └─ ❌ NON → Server Component
│
├─ Contenu purement statique
│  └─ ❌ NON → Server Component
│
└─ Opérations lourdes côté serveur
   └─ ❌ NON → Server Component
```

---

## 🖥️ Server Components (par défaut)

### Caractéristiques
- ✅ Pas de JavaScript envoyé au client
- ✅ Accès direct à la BDD
- ✅ Meilleure performance (SSR)
- ✅ SEO optimisé
- ✅ Secrets serveur accessibles

### Exemples d'usage

#### ✅ Récupération de données
```typescript
// Server Component - Pas de 'use client'
export default async function HabitsPage() {
  const habits = await prisma.habit.findMany()
  return <div>{habits.map(h => <HabitCard key={h.id} habit={h} />)}</div>
}
```

#### ✅ Layout statique
```typescript
// Server Component
export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background-100">
      <header>...</header>
      <main>{children}</main>
    </div>
  )
}
```

#### ✅ Composant d'affichage
```typescript
// Server Component
export function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-background-300 rounded-lg p-4">
      <h3 className="text-foreground-600">{title}</h3>
      <p className="text-foreground-800 text-2xl">{value}</p>
    </div>
  )
}
```

---

## 💻 Client Components ('use client')

### Caractéristiques
- ⚠️ JavaScript envoyé au client
- ⚠️ Pas d'accès direct BDD
- ⚠️ Hydratation nécessaire
- ✅ Interactivité complète
- ✅ Hooks React disponibles

### Exemples d'usage

#### ✅ Formulaire avec validation
```typescript
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'

export function CreateHabitForm() {
  const form = useForm()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    // API call
    setIsSubmitting(false)
  }
  
  return <form onSubmit={form.handleSubmit(onSubmit)}>...</form>
}
```

#### ✅ Toggle interactif
```typescript
'use client'

import { useState } from 'react'

export function HabitToggle({ habitId }: { habitId: string }) {
  const [completed, setCompleted] = useState(false)
  
  const handleToggle = async () => {
    const res = await fetch(`/api/habits/${habitId}/complete`, { method: 'POST' })
    if (res.ok) setCompleted(!completed)
  }
  
  return (
    <button 
      onClick={handleToggle}
      className={completed ? 'bg-green-500' : 'bg-background-400'}
    >
      {completed ? '✓' : '○'}
    </button>
  )
}
```

#### ✅ Composant avec localStorage
```typescript
'use client'

import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  
  useEffect(() => {
    const saved = localStorage.getItem('theme')
    if (saved) setTheme(saved as 'light' | 'dark')
  }, [])
  
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
  }
  
  return <button onClick={toggleTheme}>Toggle Theme</button>
}
```

---

## 🔀 Pattern de composition (RECOMMANDÉ)

### Principe : Server parent → Client enfant isolé

```typescript
// ✅ EXCELLENT - Composition optimale
// app/habits/page.tsx - Server Component
export default async function HabitsPage() {
  const habits = await prisma.habit.findMany() // ✅ Fetch serveur
  
  return (
    <div>
      <h1>Mes Habitudes</h1> {/* ✅ Server */}
      <HabitsList> {/* ✅ Server */}
        {habits.map(habit => (
          <HabitCard key={habit.id} habit={habit}> {/* ✅ Server */}
            <HabitToggleButton habitId={habit.id} /> {/* ✅ Client isolé */}
          </HabitCard>
        ))}
      </HabitsList>
    </div>
  )
}
```

### Avantages
- ✅ Minimal JavaScript client
- ✅ Meilleure performance
- ✅ SEO optimal
- ✅ Données fraîches du serveur

---

## ❌ Anti-patterns à éviter

### ❌ Tout mettre en Client Component
```typescript
// ❌ MAUVAIS - Pas de hooks utilisés, pas besoin de client
'use client'

export default function Dashboard() {
  return <div>Welcome to Dashboard</div>
}

// ✅ BON - Server Component
export default function Dashboard() {
  return <div>Welcome to Dashboard</div>
}
```

### ❌ Fetch dans Client Component
```typescript
// ❌ MAUVAIS - Fetch dans Client
'use client'

import { useEffect, useState } from 'react'

export function HabitsList() {
  const [habits, setHabits] = useState([])
  
  useEffect(() => {
    fetch('/api/habits')
      .then(res => res.json())
      .then(setHabits)
  }, [])
  
  return <div>{habits.map(...)}</div>
}

// ✅ BON - Fetch dans Server Component
export default async function HabitsList() {
  const habits = await prisma.habit.findMany()
  return <div>{habits.map(...)}</div>
}
```

### ❌ Client Component parent inutile
```typescript
// ❌ MAUVAIS - Tout en client
'use client'

export default function HabitsPage() {
  return (
    <div>
      <StaticHeader />
      <StaticContent />
      <InteractiveButton /> {/* Seul ce composant a besoin d'être client */}
    </div>
  )
}

// ✅ BON - Server parent, client isolé
export default function HabitsPage() {
  return (
    <div>
      <StaticHeader />
      <StaticContent />
      <InteractiveButton /> {/* 'use client' uniquement ici */}
    </div>
  )
}
```

---

## 📋 Checklist avant 'use client'

Avant d'ajouter `'use client'`, se poser ces questions :

- [ ] Ai-je **vraiment** besoin de hooks React ?
- [ ] Ai-je **vraiment** besoin d'event handlers ?
- [ ] Ai-je **vraiment** besoin d'APIs navigateur ?
- [ ] Est-ce que je fais du fetching de données ? ❌ → Server
- [ ] Puis-je isoler l'interactivité dans un sous-composant ? ✅ → Faire ça
- [ ] Est-ce un composant purement d'affichage ? ✅ → Server

---

## 🎯 Résumé

| Besoin | Type | Justification |
|--------|------|---------------|
| Fetch BDD (Prisma) | Server | Accès direct, pas de round-trip |
| Affichage statique | Server | Pas de JS client nécessaire |
| onClick/onChange | Client | Event handlers nécessaires |
| useState/useEffect | Client | Hooks React |
| localStorage/window | Client | APIs navigateur |
| Formulaires | Client | Validation interactive |
| shadcn Dialog/Form | Client | Interactivité intégrée |

---

## 💡 Conseil final

> **"Si tu hésites, commence par Server. Tu passeras en Client seulement si nécessaire."**

Le but : **Minimiser le JavaScript client pour maximiser la performance.**
