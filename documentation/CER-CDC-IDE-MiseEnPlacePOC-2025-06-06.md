
# 🚀 Mise en place du POC

## Objectifs du POC (Fin juin 2025)

🎯 Valider les choix technologiques et la faisabilité de l’architecture :
1. **Éditeur de code** : intégrer Monaco Editor avec coloration syntaxique (HTML, CSS, JS).
2. **Preview** : iframe qui affiche le code exécuté à chaud.
3. **Transpiler** : pipeline léger pour transformer le DSL en JS/TS (même minimal, ex. un simple `console.log`).
4. **WebSocket** : Socket.io avec un mini-serveur NestJS (Gateway).
5. **Authentification basique** : JWT ou simple token hardcodé.

## 📦 Contenu du POC

✅ **Frontend** :
- Vite + Vue 3 avec composant MonacoEditor intégré.
- Simple composant Preview avec iframe dynamique.
- Page d’accueil avec un bouton « Connexion » et un token de test.

✅ **Backend** :
- NestJS avec module WebSocket et endpoint d’authentification basique.
- Transpiler minimal en Node.js (fonction de transformation + logs).

✅ **Documentation** :
- README avec instructions de démarrage et architecture du POC.

## 📂 Proposition de structure du projet

```
root/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── MonacoEditor.vue
│   │   │   └── PreviewIframe.vue
│   │   └── App.vue
│   │   └── main.ts
│   └── vite.config.ts
│
├── backend/
│   ├── src/
│   │   ├── app.module.ts
│   │   ├── main.ts
│   │   ├── websocket/
│   │   │   └── gateway.ts
│   │   └── transpiler/
│   │       └── transpiler.service.ts
│   └── package.json
│
├── README.md
└── .gitignore
```

## 📆 Prochaines étapes

✅ Créer les répertoires et initialiser les projets frontend et backend (avec Nest CLI et Vite).  
✅ Écrire la documentation d’installation et de démarrage (README.md).  
✅ Commencer l’intégration de MonacoEditor et la Preview.  
✅ Configurer Socket.io côté backend et frontend.  
✅ Intégrer un transpiler léger avec logs (console.log).  
