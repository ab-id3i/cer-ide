
# 📄 Document de Choix Technologiques — Étape 1

## 🔖 Contexte et Objectifs

L’objectif est de sélectionner les technologies clés de l’IDE interne Front pour le projet CER, en alignement avec le cahier des charges (CDC-IDE-06062025) :
- Performance et rapidité (chargement <2s).
- Navigation fluide (UX McMaster).
- Collaboration temps réel.
- Extensibilité et maintenabilité (architecture modulaire).

## 📝 Besoins identifiés

| Besoin | Détail |
|--------|-------|
| Éditeur de code | Moderne, performant, extensible. Supporte HTML, CSS, JS/TS + DSL interne. |
| Framework front | Rapide, modulaire, facile à maintenir. |
| WebSocket | Communication temps réel fiable et sécurisée. |
| Backend | Gestion des websockets, transpilation et APIs éventuelles. |
| Monitoring | Suivi des performances et débogage. |

## 🔍 Options étudiées

### 1️⃣ Éditeur de code

| Option | Avantages | Inconvénients |
|--------|-----------|---------------|
| **Monaco Editor** | Moderne, performant, support multi-langages natif (VSCode), extensible, complet. | Taille initiale importante (optimisable via lazy loading). |
| **CodeMirror** | Léger, facile à intégrer, support de plugins. | Moins complet que Monaco pour la collaboration et le support multi-langages, moins d’outils pour l’autocomplétion. |

👉 **Analyse** : Monaco Editor répond mieux aux besoins pour un IDE complet et collaboratif.

### 2️⃣ Framework front

| Option | Avantages | Inconvénients |
|--------|-----------|---------------|
| **Vue 3 + Vite** | Temps de chargement rapide, support des composants modulaires, bonne ergonomie, compatible avec TypeScript. | Nécessite une structuration rigoureuse pour la modularité. |
| **React + Vite** | Populaire, écosystème riche. | Légèrement plus verbeux pour l’implémentation de la modularité. |
| **Svelte** | Très rapide, léger. | Moins mature pour des projets complexes collaboratifs. |

👉 **Analyse** : Vue 3 + Vite apparaît comme le meilleur choix pour un projet interne modulaire et performant.

### 3️⃣ WebSocket

| Option | Avantages | Inconvénients |
|--------|-----------|---------------|
| **Socket.io** | Facilité d’utilisation, gestion des déconnexions, fallback HTTP. | Légère surcouche technique. |
| **WebSocket natif** | Plus léger. | Gestion des reconnexions plus complexe. |

👉 **Analyse** : Socket.io est préférable pour une intégration rapide et une gestion facilitée de la collaboration temps réel.

### 4️⃣ Backend

| Option | Avantages | Inconvénients |
|--------|-----------|---------------|
| **Node.js + Express** | Simple, rapide à mettre en place, compatible Socket.io. | Moins structuré, plus de rigueur organisationnelle requise. |
| **NestJS** | Architecture modulaire intégrée, excellent support TypeScript. | Courbe d’apprentissage légèrement plus élevée. |

👉 **Analyse** : NestJS est recommandé pour la modularité et la maintenabilité.

### 5️⃣ Monitoring

| Option | Avantages | Inconvénients |
|--------|-----------|---------------|
| **Lighthouse** | Standard Google, intégration facile avec Vite/Vue. | Nécessite CI/CD pour automatisation. |
| **Web Vitals** | Intégré aux navigateurs. | Plus limité pour supervision globale. |
| **Sentry** | Gestion des erreurs en temps réel. | Coût ou installation interne. |

👉 **Analyse** : Lighthouse + Web Vitals pour performances ; Sentry optionnel pour les erreurs.

## ✅ Recommandations finales

| Besoin | Technologie recommandée |
|--------|--------------------------|
| Éditeur de code | **Monaco Editor** |
| Framework front | **Vue 3 + Vite** |
| WebSocket | **Socket.io** |
| Backend | **NestJS** |
| Monitoring | **Lighthouse + Web Vitals (+Sentry optionnel)** |

## 📆 Prochaines étapes

1. Démarrer le POC léger avec ces choix validés.
2. Documenter l’architecture technique.
3. Créer le dépôt Git avec README et CI/CD.
4. Développer l’éditeur et la preview.
