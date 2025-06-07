
# 🗂️ Squelette du projet IDE interne Front — Comparaison Monaco & CodeMirror

## 📁 Arborescence recommandée

```
root/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── MonacoEditor.vue
│   │   │   └── CodeMirrorEditor.vue
│   │   │   └── PreviewIframe.vue
│   │   ├── App.vue
│   │   └── main.ts
│   ├── vite.config.ts
│   ├── package.json
│   └── tsconfig.json
│
├── backend/
│   ├── src/
│   │   ├── app.module.ts
│   │   ├── main.ts
│   │   ├── websocket/
│   │   │   └── gateway.ts
│   │   └── transpiler/
│   │       └── transpiler.service.ts
│   ├── package.json
│   └── tsconfig.json
│
├── README.md
└── .gitignore
```

## 📝 README.md (proposition initiale)

```markdown
# IDE interne Front (projet CER) — Comparaison Monaco & CodeMirror

## Objectifs
- Comparer Monaco Editor et CodeMirror pour l'éditeur de code interne.
- Développement d’un IDE performant et extensible.
- Basé sur Vue 3 + Vite, Socket.io et NestJS.
- Collaboration temps réel et transpiler métier intégré.

## Démarrage rapide

### Pré-requis
- Node.js >= 18
- Yarn ou npm

### Installation

#### Frontend
```bash
cd frontend
yarn install
yarn dev
```

#### Backend
```bash
cd backend
yarn install
yarn start:dev
```

## Structure du projet
- **frontend/** : Application Vue 3 + Vite avec MonacoEditor.vue et CodeMirrorEditor.vue.
- **backend/** : Serveur NestJS.
- **MonacoEditor.vue** : Éditeur Monaco Editor.
- **CodeMirrorEditor.vue** : Éditeur CodeMirror.
- **PreviewIframe.vue** : Affichage dynamique du rendu.
- **transpiler.service.ts** : Transpilation DSL -> JS/TS.
- **gateway.ts** : Gestion du WebSocket.

## Sécurité
- Authentification basique avec JWT.
- WebSocket sécurisé avec token d’accès.

## Collaboration
- Socket.io pour l’édition collaborative.
- Synchronisation temps réel des modifications.

## Comparaison Editors
- Tester les deux éditeurs sur les mêmes fonctionnalités (syntax highlighting, performance, intégration).
- Mesurer temps de chargement, ergonomie et fonctionnalités avancées (snippets, linting, collaboration).

## Contributions
- Développement interne.
- Suivi technique via issues et Merge Requests.

## License
Privé (usage interne uniquement).
```

## 📌 Notes complémentaires

- Utiliser une route Vue dédiée pour chaque éditeur (ex. : `/monaco` et `/codemirror`) pour simplifier les tests.
- Ajouter un toggle dans l’interface pour basculer entre les deux éditeurs facilement.
- Mettre en place des métriques simples (temps de chargement, logs de performance).
- Prévoir des tests unitaires (Vitest pour le frontend, Jest pour le backend).
