
# 📊 Diagramme d’Architecture Technique

## 🔗 Architecture technique

```
                        ┌──────────────────────────────┐
                        │         Utilisateur          │
                        │    (navigateur web)          │
                        └────────────┬─────────────────┘
                                     │
                                     ▼
                     ┌─────────────────────────────┐
                     │  Frontend (Vue 3 + Vite)     │
                     │                             │
                     │ - Monaco Editor             │
                     │ - Modules/Composants        │
                     │ - Preview Live (iframe)     │
                     │ - UI McMaster               │
                     └────────────┬────────────────┘
                                     │
                     WebSocket (Socket.io)
                                     │
                                     ▼
                    ┌─────────────────────────────┐
                    │       Backend (NestJS)      │
                    │                             │
                    │ - API Rest (auth, écrans)   │
                    │ - WebSocket Gateway         │
                    │ - Transpiler DSL -> JS/TS   │
                    │ - Sécurité/authentification │
                    └────────────┬────────────────┘
                                     │
                                     ▼
                      ┌─────────────────────────────┐
                      │    Base de données (si besoin) │
                      │  (stockage projet, logs)     │
                      └─────────────────────────────┘
```

## ✍️ Détails clés

✅ **Frontend** :
- Application Vue 3 + Vite pour des performances optimales et une ergonomie fluide.
- Monaco Editor embarqué pour l’édition multi-langage.
- Preview live sous forme d’iframe.
- UX inspirée de McMaster.

✅ **WebSocket** :
- Socket.io pour la synchronisation en temps réel.
- Sécurisation via token d’authentification (JWT basique).

✅ **Backend** :
- NestJS (Node.js) structuré en modules.
- WebSocket Gateway pour la communication temps réel.
- Transpiler DSL -> JS/TS intégré au backend.
- API REST pour la gestion des projets et des écrans.

✅ **Sécurité** :
- Authentification basique (JWT).
- Gestion des sessions WebSocket sécurisée.

✅ **Base de données** :
- À évaluer (selon les besoins du projet). Initialement, un simple stockage local JSON ou un backend en mémoire peut suffire pour le POC.
