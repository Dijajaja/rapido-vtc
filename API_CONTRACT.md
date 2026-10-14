# 📋 Rapido VTC — Contrat d'Interfaçage API & MongoDB

Ce document définit les spécifications des routes API et des collections MongoDB nécessaires pour relier le **Frontend Admin** et l'**API Backend** de Rapido VTC.

---

## 🗄️ 1. Collections MongoDB (Modèles Mongoose)

Les schémas sont déjà créés dans `src/db/models.ts` :

1. **`drivers`** : Profils chauffeurs, NNI, immatriculation, 8 pièces justificatives, solde portefeuille MRU, statut (`en_attente`, `approuve`, `rejete`, `documents_manquants`).
2. **`rides`** : Trajets à Nouakchott, passager, chauffeur, montant MRU, commission 10% MRU, part chauffeur, statut (`En cours`, `Terminée`, `Annulée`, `En recherche`).
3. **`passengers`** : Clients, téléphone `+222...`, note, total courses, volume dépensé MRU, statut (`actif`, `bloque`).
4. **`commissionsettings`** : Taux de commission (10% par défaut), taux par catégorie, solde minimum chauffeur.
5. **`supporttickets`** : Réclamations passagers et chauffeurs, objets perdus, réponses administrateur.

---

## 🔌 2. Routes API REST Attendues

L'URL de base est configurable dans le frontend via `.env` :
```env
VITE_API_URL=http://localhost:5000/api
```

### 🚗 A. Chauffeurs (`/api/drivers`)
- **`GET /api/drivers`** : Renvoie la liste complète des dossiers chauffeurs.
- **`GET /api/drivers/:id`** : Renvoie le dossier détaillé d'un chauffeur avec ses 8 documents.
- **`PATCH /api/drivers/:id/status`** : Met à jour le statut du chauffeur :
  ```json
  { "status": "approuve", "decisionNote": "Dossier complet et validé" }
  ```
- **`POST /api/drivers/:id/request-docs`** : Notifie le chauffeur qu'un document est manquant ou illisible.

---

### 🗺️ B. Courses & Trajets (`/api/rides`)
- **`GET /api/rides`** : Renvoie toutes les courses récentes avec montants et statuts.
- **`POST /api/rides`** : Création d'une nouvelle course (par le passager).
- **`PATCH /api/rides/:id/status`** : Évolution du statut (`En approche` ➔ `En cours` ➔ `Terminée`).
- **`POST /api/rides/:id/resolve-sos`** : Résolution d'une alerte d'urgence SOS en direct.

---

### 👥 C. Passagers (`/api/passengers`)
- **`GET /api/passengers`** : Renvoie la liste des clients inscrits.
- **`PATCH /api/passengers/:id/status`** : Bloquer ou débloquer un compte client :
  ```json
  { "status": "bloque" }
  ```

---

### ⚙️ D. Paramètres & Commissions (`/api/settings`)
- **`GET /api/settings/commission`** : Récupère la grille de commission (ex: 10%).
- **`PUT /api/settings/commission`** : Met à jour les pourcentages par catégorie.
- **`PUT /api/settings/payment-methods`** : Active ou désactive Cash / Bankily / Masrvi.

---

### 🎧 E. Support & Réclamations (`/api/support`)
- **`GET /api/support/tickets`** : Liste des tickets de support.
- **`POST /api/support/tickets/:id/resolve`** : Réponse de l'administrateur et clôture :
  ```json
  { "response": "L'objet a été restitué par le chauffeur." }
  ```

---

## 🔄 3. Règle Métier : Recouvrement de la Commission Cash (MRU)
Pour les courses payées en espèces (**Cash**) :
1. Le passager remet le montant total (ex: **150 MRU**) au chauffeur à l'arrivée.
2. Le système calcule la commission de 10% (ex: **15 MRU**).
3. Le backend déduit automatiquement les **15 MRU** du solde `walletBalanceMru` du chauffeur dans MongoDB.
4. Si le solde du chauffeur descend en dessous du seuil configuré (ex: **200 MRU**), le chauffeur est invité à recharger son solde avant de recevoir de nouvelles courses.
