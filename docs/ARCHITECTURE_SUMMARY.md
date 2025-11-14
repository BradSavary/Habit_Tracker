# Architecture Next.js - Résumé exécutif

## 🎯 Principe fondamental

> **Chaque choix entre Client et Server Component doit être justifié et justifiable logiquement.**

---

## 📐 Règle par défaut

```typescript
// ✅ Par défaut : Server Component (pas de 'use client')
export default async function MyComponent() {
  const data = await fetchData()
  return <div>{data}</div>
}
```

---

## 🚦 Quand utiliser quoi ?

### Server Components (défaut)
| Cas d'usage | Exemple |
|-------------|---------|
| Fetch BDD | `await prisma.habit.findMany()` |
| Affichage statique | `<h1>Titre</h1>` |
| Layout | `<div>{children}</div>` |
| SEO | Meta tags, structured data |

### Client Components ('use client')
| Cas d'usage | Exemple |
|-------------|---------|
| Hooks React | `useState`, `useEffect`, `useContext` |
| Event handlers | `onClick`, `onChange`, `onSubmit` |
| APIs navigateur | `localStorage`, `window`, `document` |
| Animations | Framer Motion, transitions CSS |
| Forms interactifs | React Hook Form, validations |

---

## 🏗️ Pattern recommandé

```typescript
// app/habits/page.tsx - SERVER
export default async function HabitsPage() {
  const habits = await getHabits() // ✅ Fetch serveur
  
  return (
    <div>
      <HabitsHeader />              {/* ✅ Server */}
      {habits.map(habit => (
        <HabitCard key={habit.id}>   {/* ✅ Server */}
          <HabitToggle id={habit.id} /> {/* ✅ Client isolé */}
        </HabitCard>
      ))}
    </div>
  )
}

// components/HabitToggle.tsx - CLIENT
'use client'
export function HabitToggle({ id }: { id: string }) {
  const [done, setDone] = useState(false)
  return <button onClick={() => setDone(!done)}>Toggle</button>
}
```

---

## ❌ Erreurs fréquentes

| Erreur | Solution |
|--------|----------|
| Tout mettre en `'use client'` | Isoler uniquement les parties interactives |
| Fetch dans Client Component | Déplacer le fetch dans Server Component |
| Pas de justification | Documenter pourquoi 'use client' est nécessaire |

---

## 📚 Ressources

- [Guide complet](./CLIENT_SERVER_GUIDE.md)
- [Copilot Instructions](../.github/.copilot-instructions.md)
- [Next.js Docs](https://nextjs.org/docs/app/building-your-application/rendering)

---

## ✅ Checklist rapide

Avant d'ajouter `'use client'` :

1. [ ] Ai-je besoin de hooks React ?
2. [ ] Ai-je besoin d'event handlers ?
3. [ ] Ai-je besoin d'APIs navigateur ?
4. [ ] Le composant est-il purement statique ? → Server
5. [ ] Puis-je isoler l'interactivité ? → Faire ça

**Si toutes les réponses sont "non" → Server Component** ✅
