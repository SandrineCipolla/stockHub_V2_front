# État de la connexion Front V2 ↔ Back

Date : 2026-03-10

---

## Résumé

- Fichier API centralisé : ✅ — `src/services/api/ConfigManager.ts` + `stocksAPI.ts` + `utils.ts`
- Token Bearer attaché : ✅ — `acquireTokenSilent` → fallback `acquireTokenRedirect`, header `Authorization: Bearer` sur tous les verbes HTTP
- Variables d'env configurées : ✅ — `VITE_API_SERVER_URL`, `VITE_SCOPE_READ/WRITE`, Azure B2C complet dans `.env`
- CORS côté back : ✅ — `credentials: true`, `ALLOWED_ORIGINS=http://localhost:5173`
- `credentials: 'include'` côté front : ✅ — cohérent avec le back
- Proxy Vite configuré : ❌ — appels directs vers `localhost:3006` (CORS géré côté back — OK)

---

## Pages connectées au back

| Page            | Hook        | Endpoints connectés                                                      |
| --------------- | ----------- | ------------------------------------------------------------------------ |
| `Dashboard.tsx` | `useStocks` | `GET /stocks`, `POST /stocks`, `PATCH /stocks/:id`, `DELETE /stocks/:id` |
| `Analytics.tsx` | `useStocks` | `GET /stocks` (lecture seule)                                            |

---

## Pages encore mockées / non implémentées

| Fonctionnalité                    | État               | Détail                                                                                                        |
| --------------------------------- | ------------------ | ------------------------------------------------------------------------------------------------------------- |
| Détail d'un stock (`/stocks/:id`) | ❌ Pas de page     | `StocksAPI.fetchStockById` existe mais aucune page ne l'utilise                                               |
| Items d'un stock                  | ❌ Pas d'API items | Aucun `itemsAPI.ts` — endpoints `/stocks/:id/items` non câblés                                                |
| Suppression multiple              | ⚠️ Mocké           | `deleteMultipleStocks` dans `useStocks.ts` l. 201 : `await new Promise(...setTimeout...)` sans appel API réel |

---

## Problème principal identifié

**La connexion stocks est fonctionnelle** (GET/POST/PATCH/DELETE /stocks). Le 401 initial était dû au token manquant — résolu par `ConfigManager.ts`.

**Il ne reste plus de blocage** sur les appels stocks. Le problème actuel est une **absence de fonctionnalité** : les items ne sont pas câblés côté front.

```typescript
// stocksAPI.ts — NOTE existante dans le code :
// NOTE: quantity et value sont mis à 0 car le backend ne les fournit pas encore.
// Les valeurs devraient être calculées à partir des items dans une future version.
quantity: 0, // TODO: Calculer depuis items quand disponibles
value: 0,    // TODO: Calculer depuis items quand disponibles
```

```typescript
// useStocks.ts l. 201 — deleteMultipleStocks non câblé :
await new Promise(resolve => setTimeout(resolve, 800)); // Simulé, pas d'appel API
setStocks(prev => prev.filter(stock => !stockIds.includes(stock.id)));
```

---

## Actions à faire pour compléter la connexion

1. 🔴 **Créer `src/services/api/itemsAPI.ts`** — connecter les 4 endpoints items :
   - `GET /api/v2/stocks/:stockId/items`
   - `POST /api/v2/stocks/:stockId/items`
   - `PATCH /api/v2/stocks/:stockId/items/:itemId`
   - `DELETE /api/v2/stocks/:stockId/items/:itemId`

2. 🔴 **Créer `src/hooks/useItems.ts`** — hook de gestion des items (sur le modèle de `useStocks`)

3. 🟡 **Créer une page détail stock** — afficher les items d'un stock avec gestion CRUD

4. 🟡 **Câbler `deleteMultipleStocks`** — remplacer le `setTimeout` par des appels `StocksAPI.deleteStock` en parallèle (`Promise.all`)

5. 🟡 **Calculer `quantity` et `status`** depuis les items retournés par le back au lieu des valeurs par défaut (`0`, `'optimal'`)

6. 🟢 **Ajouter `.env.example`** côté front (le back en a un, le front n'en a pas — seul `.env.staging.example` est versionné)
