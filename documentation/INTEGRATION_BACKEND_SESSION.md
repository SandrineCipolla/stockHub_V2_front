# Session d'Intégration Backend - StockHub V2 Frontend

**Auteur**: Sandrine Cipolla
**Date**: 2025-12-30
**Branche**: `feat/backend-integration`
**Objectif**: Intégrer le frontend avec le backend StockHub et Azure AD B2C

---

## Modifications Réalisées

### 1. Authentification Azure AD B2C

#### Fichiers créés

- `src/config/authConfig.ts` - Configuration MSAL et Azure AD B2C
- `src/services/api/ConfigManager.ts` - Gestionnaire de configuration API
- `src/services/api/stocksAPI.ts` - Client API pour les stocks
- `src/services/api/utils.ts` - Utilitaires API

#### Configuration MSAL (`src/config/authConfig.ts`)

```typescript
// Configuration pour Azure AD B2C
- Client ID: 0dc4acfb-ecde-4f9b-81eb-9af050fb52d9
- Tenant: stockhubb2c.onmicrosoft.com
- Authority: https://stockhubb2c.b2clogin.com
- Redirect URI: http://localhost:5173/

// Policies configurées
- Sign Up/Sign In: B2C_1_signupsignin
- Forgot Password: B2C_1_reset_password
- Edit Profile: B2C_1_edit_profile

// Scopes API
- Read: https://stockhubb2c.onmicrosoft.com/.../FilesRead
- Write: https://stockhubb2c.onmicrosoft.com/.../FilesWrite
```

#### Initialisation MSAL (`src/main.tsx`)

```typescript
// Initialisation asynchrone de MSAL
- msalInstance.initialize()
- Auto-sélection du premier compte si disponible
- Event listeners pour gérer l'authentification
- Gestion du flow "Forgot Password" (AADB2C90118)
```

#### Capture du Token (`src/App.tsx`)

```typescript
// Dans le composant ProtectedComponent
useEffect(() => {
  // Event listener LOGIN_SUCCESS
  // Acquisition silencieuse du token avec scopes API
  // Stockage dans localStorage.authToken
}, [instance]);
```

---

### 2. Client API StocksAPI

#### Endpoints Backend Configurés

**Base URL**: `http://localhost:3006/api/v2`

```typescript
GET    /api/v2/stocks      - Liste de tous les stocks
GET    /api/v2/stocks/:id  - Détails d'un stock
POST   /api/v2/stocks      - Créer un nouveau stock
PUT    /api/v2/stocks/:id  - Mettre à jour un stock
DELETE /api/v2/stocks/:id  - Supprimer un stock
```

#### Classe StocksAPI (`src/services/api/stocksAPI.ts`)

```typescript
StocksAPI.fetchStocksList(); // GET tous les stocks
StocksAPI.fetchStockById(id); // GET stock par ID
StocksAPI.createStock(data); // POST nouveau stock
StocksAPI.updateStock(data); // PUT mise à jour
StocksAPI.deleteStock(id); // DELETE suppression
```

#### Configuration Headers

Tous les appels API incluent :

```typescript
Authorization: Bearer <authToken>
Content-Type: application/json
credentials: 'include'
```

---

### 3. Hook useStocks Modifié

#### Flux d'Appels

```typescript
// loadStocks()
1. Appelle StocksAPI.fetchStocksList()
2. Stocke les données dans localStorage
3. En cas d'erreur → Fallback sur localStorage

// createStock(data)
1. Validation frontend (nom, quantité, valeur)
2. Appelle StocksAPI.createStock(data)
3. Met à jour localStorage avec le nouveau stock

// updateStock(data)
1. Validation frontend
2. Appelle StocksAPI.updateStock(data)
3. Met à jour localStorage

// deleteStock(id)
1. Vérification de l'existence
2. Appelle StocksAPI.deleteStock(id)
3. Met à jour localStorage
```

---

### 4. Dépendances Installées

```json
"dependencies": {
  "@azure/msal-browser": "^4.27.0",
  "@azure/msal-react": "^3.0.23"
}

"devDependencies": {
  "@vitejs/plugin-basic-ssl": "^2.1.0",
  "vite-plugin-mkcert": "^1.17.9"
}
```

---

### 5. Fichiers Modifiés

- `.gitignore` - Ajout de `localhost.cert`
- `package.json` - Nouvelles dépendances MSAL
- `package-lock.json` - Lock des nouvelles dépendances
- `src/App.tsx` - Ajout du ProtectedComponent avec capture de token
- `src/main.tsx` - Initialisation MSAL
- `src/hooks/useStocks.ts` - Intégration des appels API
- `src/types/error.ts` - Types d'erreurs frontend (probablement)
- `vite.config.ts` - Configuration HTTPS (probablement)

---

## Variables d'Environnement (.env)

```env
# API Backend
VITE_API_SERVER_URL=http://localhost:3006/api
VITE_API_V1=/v1
VITE_API_V2=/v2

# Azure AD B2C
VITE_REDIRECT_URI=http://localhost:5173/
VITE_CLIENT_ID=0dc4acfb-ecde-4f9b-81eb-9af050fb52d9
VITE_TENANT_NAME=stockhubb2c
VITE_AUTHORITY_DOMAIN=stockhubb2c.b2clogin.com
VITE_SIGN_UP_SIGN_IN_POLICY=B2C_1_signupsignin
VITE_FORGOT_PASSWORD_POLICY=B2C_1_reset_password
VITE_EDIT_PROFILE_POLICY=B2C_1_edit_profile

# Scopes
VITE_SCOPE_READ=https://stockhubb2c.onmicrosoft.com/dc30ef57-cdc1-4a3e-aac5-9647506a72ef/FilesRead
VITE_SCOPE_WRITE=https://stockhubb2c.onmicrosoft.com/dc30ef57-cdc1-4a3e-aac5-9647506a72ef/FilesWrite
```

---

## Diagnostic des Problèmes

### Problème 1 : Backend ne répond pas

**Symptômes** :

```
Error in fetchStocksList: TypeError: Failed to fetch
❌ Erreur lors du chargement depuis le backend
```

**Solution** :

```bash
# Vérifier que le backend est lancé sur le port 3006
cd C:\Users\sandr\Dev\Perso\Projets\stockhub\stockhub_back
npm run dev  # ou la commande de démarrage du backend
```

**Vérifier** :

- Le backend écoute bien sur `http://localhost:3006`
- Les routes `/api/v2/stocks` sont bien définies
- Le backend accepte les requêtes CORS depuis `http://localhost:5173`

---

### Problème 2 : Erreur CORS

**Symptômes** :

```
Access to fetch at 'http://localhost:3006/api/v2/stocks' from origin 'http://localhost:5173'
has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present
```

**Solution Backend** :

```javascript
// Dans le backend (Express)
const cors = require('cors');

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
```

---

### Problème 3 : Token non acquis

**Symptômes** :

```
❌ Aucun compte actif pour acquérir le token
🔑 Token récupéré pour l'API: NULL
```

**Diagnostic** :

```javascript
// Dans la console du navigateur (DevTools)
console.log('Active Account:', msalInstance.getActiveAccount());
console.log('All Accounts:', msalInstance.getAllAccounts());
console.log('Auth Token:', localStorage.getItem('authToken'));
```

**Solution** :

1. Vérifier que l'utilisateur est bien authentifié Azure AD B2C
2. Vérifier que les scopes sont corrects dans `authConfig.ts`
3. Forcer un nouveau login : `msalInstance.loginRedirect(loginRequest)`

---

### Problème 4 : Token expiré ou invalide

**Symptômes** :

```
HTTP response with status 401 (Unauthorized)
```

**Solution** :

```typescript
// Le token est peut-être expiré, forcer une réacquisition
const account = msalInstance.getActiveAccount();
const response = await msalInstance.acquireTokenSilent({
  ...loginRequest,
  account: account,
  forceRefresh: true, // Force refresh du token
});
```

---

### Problème 5 : Erreur d'autorité Azure AD B2C

**Symptômes** :

```
AADB2C90118: The user has forgotten their password
Invalid authority error
```

**Solution** :
Vérifier dans `authConfig.ts` que les URLs d'authority sont correctes :

```typescript
https://stockhubb2c.b2clogin.com/stockhubb2c.onmicrosoft.com/B2C_1_signupsignin
```

---

## Commandes de Debugging

### Console Frontend (Chrome DevTools)

```javascript
// Vérifier l'état MSAL
window.msalInstance = msalInstance; // Exposer MSAL globalement
msalInstance.getActiveAccount();
msalInstance.getAllAccounts();

// Vérifier le token
localStorage.getItem('authToken');

// Test manuel d'un appel API
const token = localStorage.getItem('authToken');
fetch('http://localhost:3006/api/v2/stocks', {
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
})
  .then(res => res.json())
  .then(data => console.log('Stocks:', data))
  .catch(err => console.error('Error:', err));
```

### Console Backend

```bash
# Vérifier les logs du backend
# Regarder si les requêtes arrivent
# Vérifier l'authentification JWT
```

---

## Checklist de Démarrage

- [ ] Backend lancé sur `http://localhost:3006`
- [ ] Frontend lancé sur `http://localhost:5173`
- [ ] Variables `.env` correctement configurées
- [ ] Authentification Azure AD B2C fonctionnelle
- [ ] Token stocké dans localStorage après login
- [ ] Pas d'erreur CORS dans la console
- [ ] Les appels API retournent des données

---

## Tests Manuels

### Test 1 : Authentification

1. Ouvrir `http://localhost:5173`
2. Vérifier dans DevTools Console :
   ```
   ✅ MSAL initialisé avec succès
   ✅ Login réussi, acquisition du Access Token...
   ✅ Access Token acquis: OUI
   ✅ Access Token stocké dans localStorage
   ```

### Test 2 : Chargement des Stocks

1. Ouvrir `http://localhost:5173`
2. Vérifier dans DevTools Console :
   ```
   🔄 Chargement des stocks depuis le backend...
   Fetching stocks list from: http://localhost:3006/api/v2/stocks
   ✅ Stocks chargés depuis le backend: [...]
   ```

### Test 3 : Création de Stock

1. Créer un nouveau stock via l'UI
2. Vérifier dans DevTools Console :
   ```
   🔄 Création du stock sur le backend...
   ✅ Stock créé sur le backend: {...}
   ✅ Stock créé avec succès
   ```

---

## Logs Attendus (Succès)

```
🔄 Initialisation de MSAL...
✅ MSAL initialisé avec succès
✅ Login réussi, acquisition du Access Token...
🔄 Acquisition du Access Token pour l'API avec scopes: [...]
✅ Access Token acquis: OUI
🔑 Token type: Bearer
📋 Scopes: [...]
✅ Access Token stocké dans localStorage
🔄 Chargement des stocks depuis le backend...
Fetching stocks list from: http://localhost:3006/api/v2/stocks
🔑 Token récupéré pour l'API: eyJ0eXAiOiJKV1QiLCJhbGci...
✅ Stocks chargés depuis le backend: [...]
```

---

## Limitations Actuelles de l'API Backend

### Propriétés Stock Non Implémentées

**Date de découverte**: 2026-01-07
**Impact**: Moyen - Limitation fonctionnelle mais contournable

Le backend actuel ne gère que les propriétés de base au niveau Stock:

- ✅ `label` (string) - Nom du stock
- ✅ `description` (string) - Description
- ✅ `category` (string) - Catégorie
- ✅ `items` (array) - Liste des items (via GET uniquement)

**Propriétés NON supportées** (présentes dans `CreateStockData` frontend mais ignorées):

- ❌ `quantity` (number) - Quantité totale du stock
- ❌ `value` (number) - Valeur totale du stock
- ❌ `unit` (string) - Unité de mesure
- ❌ `supplier` (string) - Fournisseur
- ❌ `minThreshold` (number) - Seuil minimum
- ❌ `maxThreshold` (number) - Seuil maximum
- ❌ `sku` (string) - Référence SKU

### Architecture Actuelle

```
Stock (conteneur)
├── label: "Frigo Bureau"
├── description: "..."
├── category: "alimentation"
└── items[] (éléments stockés)
    ├── Item 1: Yaourt (quantity: 10, value: 5€)
    ├── Item 2: Lait (quantity: 2, value: 3€)
    └── Item 3: Fromage (quantity: 5, value: 8€)
```

**Calculs dérivés** (à implémenter si nécessaire):

- Quantité totale Stock = Somme des quantités des items (mais sans signification car unités différentes)
- Valeur totale Stock = Somme des (quantity × prix unitaire) de chaque item

### Workaround Implémenté (2026-01-07)

**Fichier**: `src/services/api/stocksAPI.ts`

```typescript
// Dans createStock()
const stockData = {
  label: stock.label,
  description: stock.description || '',
  category: stock.category || 'alimentation',
  // quantity, value, etc. sont ignorés
};
```

### Pour Ajouter des Items à un Stock

Utiliser l'endpoint séparé:

```typescript
POST /api/v2/stocks/:stockId/items
{
  "label": "Yaourt nature",
  "quantity": 10,
  "description": "Yaourt 0% matière grasse",
  "minimumStock": 5
}
```

### Actions Futures Possibles

1. **Option A**: Accepter que Stock = conteneur simple
   - Les propriétés quantity/value n'ont pas de sens au niveau Stock
   - Elles sont gérées au niveau Item
   - Simplifier le type `CreateStockData` frontend

2. **Option B**: Ajouter quantity/value calculés côté backend
   - Modifier l'entité Stock backend pour inclure des propriétés calculées
   - GET /stocks retourne la somme des items
   - Modification du schéma Prisma nécessaire

3. **Option C**: Ajouter quantity/value stockés (pas calculés)
   - Pour certains cas d'usage (inventaire global sans détail)
   - Modification du schéma Prisma + migrations
   - Risque de désynchronisation avec les items

**Recommandation**: Option A (simplifier frontend)

### Issues à Créer

- [ ] Documenter l'architecture Stock/Items dans le backend
- [ ] Décider si quantity/value globaux sont nécessaires
- [ ] Simplifier le type `CreateStockData` frontend si Option A choisie
- [ ] Ajouter des propriétés calculées si Option B choisie

---

## Prochaines Étapes

### Si l'intégration fonctionne :

1. [ ] Retirer les données mock de `src/data/stockData.ts`
2. [ ] Ajouter un loader pendant les appels API
3. [ ] Gérer les erreurs 401/403 (redirection vers login)
4. [ ] Ajouter un refresh automatique du token
5. [ ] Tests unitaires pour `StocksAPI`
6. [ ] Tests d'intégration E2E
7. [ ] Documentation technique complète
8. [ ] Merger la branche dans `main`

### Si l'intégration ne fonctionne pas :

1. [ ] Identifier l'erreur spécifique (voir section Diagnostic)
2. [ ] Vérifier que le backend est lancé
3. [ ] Vérifier la configuration CORS
4. [ ] Vérifier l'authentification Azure AD B2C
5. [ ] Tester les endpoints API avec Postman
6. [ ] Comparer avec la documentation backend

---

## Ressources

- **Backend Docs**: `C:\Users\sandr\Dev\Perso\Projets\stockhub\stockhub_back\docs\technical\frontend-v2-integration.md`
- **Azure AD B2C**: https://learn.microsoft.com/en-us/azure/active-directory-b2c/
- **MSAL React**: https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-react
- **MSAL Browser**: https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-browser

---

## Contacts & Support

**Auteur**: Sandrine Cipolla
**Date**: 2025-12-30
**Issue**: #57 - Frontend V2 Backend Integration
