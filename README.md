# Rapido VTC — interface d'administration

Branche **frontend** : interface React 19 / TypeScript, Vite et Tailwind CSS 4 pour le back-office Rapido à Nouakchott.

## Périmètre

- Connexion administrateur et écran de vérification 2FA, français/arabe.
- Tableau de bord, courses, annuaire chauffeurs, validation des documents, suivi de flotte et notifications.
- **Aucun serveur Express ni connexion MongoDB dans cette branche.** Le backend est développé séparément par l'équipe.
- Plusieurs données affichées restent des exemples locaux. Les modules Passagers, Paiements, Tarifs, Support et Paramètres ne sont pas encore implémentés.

## Installation et lancement

Prérequis : Node.js compatible avec Vite 8 (version utilisée pour la validation : Node 24.11) et npm.

```powershell
git clone --branch frontend https://github.com/ballboubou1/VTC-Rapido.git
cd VTC-Rapido
npm ci
npm run dev
```

Ouvrir l'adresse affichée par Vite. `npm run lint` vérifie le typage; `npm run build` produit `dist/`; `npm run preview` prévisualise ce build, sans backend.

## Raccordement au backend de l'équipe

Les appels existants utilisent des chemins relatifs `/api/...`. En développement, copier `.env.example` vers `.env.local`, puis renseigner l'origine réelle du backend :

```dotenv
API_PROXY_TARGET=http://localhost:5000
```

L'adresse ci-dessus est un exemple, pas un backend installé. Redémarrer Vite après modification. Le proxy transmet `/api` au backend sans réécrire le chemin. Si l'API de l'équipe utilise d'autres chemins ou formats, il faudra adapter les appels et types après réception de son contrat.

La connexion attend actuellement :

| Route | Réponse attendue (principaux champs) |
| --- | --- |
| `POST /api/auth/login` | `tempToken`, `phoneMasked`, `expiresAt`, `resendAvailableAt` |
| `POST /api/auth/verify-2fa` | `token`, `user` (`name`, `email`, `role`, `phone`) |
| `POST /api/auth/resend-2fa` | `expiresAt`, `resendAvailableAt` |
| `GET /api/auth/me` | `authenticated`, `user` |
| `POST /api/auth/logout` | Révocation de la session |

Le client actuel utilise encore un Bearer token. Ce contrat n'est **pas** validé contre le backend de l'équipe; une adaptation sera nécessaire si celui-ci utilise des cookies ou un autre format. La connexion ne peut pas aboutir sans ces services et aucun contournement d'authentification n'a été ajouté.

Les autres appels concernent les notifications, les décisions chauffeurs, les documents et les alertes SOS. Certains succès métier sont encore optimistes dans l'interface : il faudra fiabiliser ces flux lors de l'intégration backend. Les valeurs KPI et positions de flotte sont des exemples, pas du temps réel certifié.

En production, héberger `dist/` et configurer un reverse proxy `/api` vers le backend; le proxy Vite ne fonctionne qu'en développement. Ne jamais mettre de secrets backend ou d'URI MongoDB dans des variables `VITE_*` ni dans le code client.

## Travail d'équipe

- Travailler sur `frontend` ou une branche dérivée `frontend/...`.
- Ne pas pousser directement sur `main` ni réécrire l'historique distant.
- Intégrer par Pull Request vers la branche de référence, une fois celle-ci établie avec l'équipe.
- La séparation des branches ne garantit pas l'absence de conflits : convenir de l'organisation des dossiers avant de fusionner frontend et backend.
- `server.ts`, `.env.local`, clés privées, `node_modules/` et `dist/` ne doivent pas être commités.
