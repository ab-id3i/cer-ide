# CER IDE

Un IDE moderne pour la Création d'Environnement de Référence (CER), offrant une interface intuitive pour la création et la gestion de vos environnements.

## Fonctionnalités

- Éditeur de code avec coloration syntaxique
- Snippets prédéfinis pour les actions et le HTML
- Interface moderne et responsive
- Support du mode sombre/clair
- Gestion des fichiers et dossiers
- Terminal intégré
- Prévisualisation en temps réel

## Documentation

Retrouvez l'ensemble de la documentation du projet dans le dossier `documentation/` :

- [Catalogue de snippets](documentation/snippets_catalogue.md)
- [Comparaison des éditeurs (Squelette Projet)](documentation/CER-CDC-IDE-SqueletteProjet-ComparaisonEditors-2025-06-06.md)
- [Mise en place du POC](documentation/CER-CDC-IDE-MiseEnPlacePOC-2025-06-06.md)
- [Diagramme d'architecture](documentation/CER-CDC-IDE-DiagrammeArchitecture-2025-06-06.md)
- [Choix des technologies](documentation/CER-CDC-IDE-ChoixTechnos-2025-06-06.md)
- [CDC complet (PDF)](documentation/CER-CDC-IDE%20-06062025.pdf)

## Prérequis

- Node.js 18 ou supérieur
- npm 9 ou supérieur

## Installation

1. Clonez le repository :
```bash
git clone [URL_DU_REPO]
cd cer-ide
```

2. Installez les dépendances :
```bash
# Installation de toutes les dépendances (racine, frontend et backend)
npm run install:all
```

## Démarrage

### Développement

Pour lancer l'application en mode développement, vous avez plusieurs options :

1. Lancer le frontend et le backend séparément :
```bash
# Dans un terminal
npm run front

# Dans un autre terminal
npm run back
```

2. Lancer le frontend et le backend en même temps :
```bash
npm run dev
```

### Production

Pour construire et démarrer l'application en mode production :

```bash
# Build du frontend et du backend
npm run front:build
npm run back:build

# Démarrage du backend en production
npm run back:start
```

## Structure du Projet

```
cer-ide/
├── frontend/           # Application Vue.js
│   ├── src/
│   │   ├── components/ # Composants Vue
│   │   ├── types/      # Types TypeScript
│   │   └── data/       # Données statiques
│   └── package.json
├── backend/           # Serveur Node.js
│   ├── src/
│   │   └── routes/    # Routes API
│   └── package.json
└── package.json       # Configuration racine
```

## Commandes Disponibles

### Frontend
- `npm run front` : Lance le frontend en mode développement
- `npm run front:build` : Build le frontend
- `npm run front:preview` : Prévisualise le build du frontend

### Backend
- `npm run back` : Lance le backend en mode développement
- `npm run back:build` : Build le backend
- `npm run back:start` : Démarre le backend en mode production

### Utilitaires
- `npm run install:all` : Installe toutes les dépendances
- `npm run dev` : Lance le frontend et le backend en parallèle



## Contribution

1. Fork le projet
2. Créez votre branche de fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails. 
