# CER IDE — Environnement de Développement Interne

Bienvenue sur le projet **CER IDE**, un environnement de développement collaboratif, extensible et moderne, conçu pour le projet CER.

## 🚀 Objectif du projet

- Offrir un IDE web performant, extensible et collaboratif.
- Basé sur Vue 3 + Vite (frontend), Monaco Editor, Socket.io et NestJS (backend).
- Intégration d'un transpiler métier (DSL -> JS/TS).
- Collaboration temps réel, prévisualisation live, et architecture modulaire.

## 📂 Structure du projet

```
root/
│
├── frontend/   # Application Vue 3 + Vite (MonacoEditor, PreviewIframe, etc.)
├── backend/    # Serveur NestJS (WebSocket, transpiler, API REST)
├── documentation/ # Cahier des charges, choix technos, architecture, etc.
├── transpiler/ # (À venir) Transpiler DSL -> JS/TS
├── websocket/  # (À venir) Modules WebSocket additionnels
└── README.md   # Ce fichier
```

## 📖 Documentation principale

Retrouvez toute la documentation détaillée dans le dossier [`documentation/`](./documentation) :

- [CER-CDC-IDE -06062025.pdf](./documentation/CER-CDC-IDE%20-06062025.pdf) — Cahier des charges complet (PDF)
- [CER-CDC-IDE-ChoixTechnos-2025-06-06.md](./documentation/CER-CDC-IDE-ChoixTechnos-2025-06-06.md) — Choix technologiques (Monaco, Vue 3, Socket.io, NestJS...)
- [CER-CDC-IDE-DiagrammeArchitecture-2025-06-06.md](./documentation/CER-CDC-IDE-DiagrammeArchitecture-2025-06-06.md) — Architecture technique (diagramme, explications)
- [CER-CDC-IDE-MiseEnPlacePOC-2025-06-06.md](./documentation/CER-CDC-IDE-MiseEnPlacePOC-2025-06-06.md) — Mise en place du POC, objectifs, structure
- [CER-CDC-IDE-SqueletteProjet-ComparaisonEditors-2025-06-06.md](./documentation/CER-CDC-IDE-SqueletteProjet-ComparaisonEditors-2025-06-06.md) — Squelette projet, comparaison Monaco/CodeMirror

## ⚡ Démarrage rapide

### Prérequis
- Node.js >= 18
- npm ou yarn

### Installation & Lancement

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

#### Backend
```bash
cd backend
npm install
npm run start:dev
```

## 🛠️ Fonctionnalités principales
- Éditeur de code (Monaco Editor) avec coloration syntaxique, autocomplétion Tailwind, gestion collaborative des curseurs
- Preview live du code HTML/CSS/JS
- Snippets drag & drop
- WebSocket (Socket.io) pour la collaboration temps réel
- Transpiler DSL (structure de base)
- Architecture modulaire, extensible

## 📚 Pour aller plus loin
- Voir la documentation technique et les choix d'architecture dans [`documentation/`](./documentation)
- Diagrammes, comparatifs, roadmap, etc.

## 🤝 Contribuer
- Forkez le repo, créez une branche, proposez vos améliorations via Pull Request
- Merci de lire la documentation avant toute contribution majeure

## 📄 Licence
Usage interne CER uniquement. 