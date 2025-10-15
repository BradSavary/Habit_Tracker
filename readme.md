# 🧠 Habit Tracker App

## 📋 Présentation du projet
**Habit Tracker** est une application web développée avec **Next.js** permettant à l’utilisateur de **créer, suivre et analyser ses habitudes** au quotidien.  
L’objectif est d’offrir une expérience simple, motivante et personnalisable pour aider à construire de bonnes routines.

---


---

## 🏆 User Stories

Voici la liste complète des fonctionnalités prévues, classées par priorité pour guider le développement :

1. **Authentification & gestion utilisateur**
   - Accès sécurisé aux données, inscription, connexion, déconnexion, gestion de session, protection des routes

2. **Création / suppression / validation d’habitudes**
   - Ajout, modification, suppression, validation quotidienne, gestion des fréquences et jours spécifiques

3. **Dashboard (calendrier + liste du jour)**
   - Vue centrale, affichage des habitudes du jour, calendrier interactif, actions rapides

4. **Streaks & statistiques simples**
   - Suivi des séries de jours réussis, indicateur visuel, statistiques globales simples

5. **Notifications & rappels**
   - Rappels configurables, notifications sur app et email, personnalisation des heures

6. **Graphiques avancés & exports**
   - Visualisation mensuelle/annuelle, export CSV/JSON, export visuel du calendrier

7. **Personnalisation (icônes, couleurs, catégories)**
   - Choix d’icône, emoji, couleur, catégorisation des habitudes, thèmes sombres/clairs

8. **Backoffice**
   - Gestion administratives globales de l'app


---

## ⚙️ Fonctionnalités principales

### 🧱 Version 1 – MVP (Base Fonctionnelle)
Fonctionnalités essentielles pour une première version utilisable.

1. **Authentification utilisateur**
   - Inscription / connexion / déconnexion
   - Gestion de session (NextAuth)
   - Protection des routes (habitudes visibles uniquement pour l’utilisateur connecté)

2. **Création et gestion d’habitudes**
   - Ajouter une habitude : nom, description, fréquence (quotidienne / hebdomadaire / mensuelle), jours spécifiques, heure de rappel
   - Modifier / supprimer une habitude

3. **Validation quotidienne**
   - Cocher ou valider une habitude pour un jour donné
   - Suivi automatique du streak (chaîne de jours réussis) et pourcentage d'accomplissement

4. **Affichage des streaks**
   - Indicateur visuel du nombre de jours consécutifs réussis
   - Réinitialisation automatique après un échec

5. **Dashboard principal**
   - Vue calendrier : jours où les habitudes sont accomplies ou non (style google agenda avec tache)
   -  Vue Liste: des habitudes du jour avec actions rapides
   - Statistiques globales simples (taux d’accomplissement, jours actifs)

---

### 🧱 Version 2 – Personnalisation & Visualisation
Ajout de fonctionnalités pour enrichir l’expérience utilisateur et la personnalisation.

1. **Personnalisation des habitudes**
   - Choix d’icône / emoji / couleur pour chaque habitude
   - Catégorisation (santé, sport, travail, alimentation, etc.)

2. **Mode sombre / clair**
   - Thème personnalisable pour le confort visuel

3. **Page Habitude (/habits/[id])**
   - Détails de l’habitude : description, stats, historique
   - Graphique individuel de progression
   - Taux de complétion, meilleurs streaks, jours manqués

4. **Export / sauvegarde**
   - Export des données au format CSV / JSON
   - Export visuel du calendrier (PNG ou PDF)

5. **Backoffice**
   - Gestion des utilisateurs


---

### 🧱 Version 3 – Notifications & Statistiques avancées
Fonctionnalités pour améliorer l’engagement et l’analyse de la progression.

1. **Notifications intelligentes**
   - Rappels configurables (par habitude)
   - Notifications sur app et email
   - Personnalisation des heures de rappel

2. **Graphiques et statistiques avancées**
   - Visualisation mensuelle / annuelle
   - Pourcentage de réussite par habitude
   - Moyenne de complétion globale

---

### 🧱 Version 5 – Bonus & Intégrations
Fonctionnalités additionnelles pour enrichir l’application.

**Intégrations externes**
   - Intégration au calendrier Google

---

## 🧭 Architecture temporaire des pages (Next.js)

| Page | Description |
|------|--------------|
| `/` | Page d’accueil / connexion rapide |
| `/login` | Connexion utilisateur |
| `/register` | Inscription utilisateur |
| `/dashboard` | Vue principale : stats, liste d’habitudes |
| `/habits/[id]` | Détail d’une habitude (description, suivi, stats) |
| `/account` | Profil/réglage (profil, notifications, thèmes, export) |

---

## 🔄 Importance des features

| Priorité | Fonctionnalité | Objectif |
|-----------|----------------|-----------|
| 🥇 | Authentification & gestion utilisateur | Accès sécurisé aux données |
| 🥈 | Création / suppression / validation d’habitudes | Base du fonctionnement |
| 🥉 | Dashboard (calendrier + liste du jour) | Vue centrale de l’app |
| 4️⃣ | Streaks & statistiques simples | Motivation visuelle |
| 5️⃣ | Notifications & rappels | Engagement utilisateur |
| 6️⃣ | Graphiques avancés & exports | Analyse de la progression |
| 7️⃣ | Personnalisation (icônes, couleurs) | Esthétique & confort |
| 8️⃣ | Sauvegarde cloud / multi-appareil | Expérience fluide multi-support |
| 9️⃣ | Objectifs, badges & gamification | Fidélisation long terme |

---



## 🎨 Inspiration visuelle

### Streaks app
Application mobile axée sur la simplicité et la motivation par les séries d’habitudes.

![Streaks app 1](https://cdn.macstories.net/001/2017-07-26-08-49-17.jpeg)
![Streaks app 2](https://crunchybagel.com/content/images/2019/09/pomodoro.png)

---

### Habitify app
Application orientée productivité et suivi détaillé des habitudes.

![Habitify app 1](https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLMiuOugMcwfRwkOHLmrZh5P5P4zvlHaJYAsU64mh_F9f0w0yfqfZdmpdmUflB5hIRJ5M&usqp=CAU)
![Habitify app 2](https://cdn.prod.website-files.com/5d3aa39f8474c472841a7dfc/6480a277275ec417eb65c134_Frame%20678.jpg)
![Habitify app 3](https://www.betaphase.cafe/wp-content/uploads/2023/01/habitify-habit-tracker-app-e1673500577321-1024x680.jpg)

---