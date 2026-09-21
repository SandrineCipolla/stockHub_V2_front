# Issue: Tests E2E Complets Frontend + Backend

## 🎯 Objectif

Créer des tests E2E qui valident le **workflow complet utilisateur** en testant l'interface React + l'API Backend + la base de données ensemble.

---

## 📊 Contexte

**Suite à l'intégration backend (2026-01-07)** :

- Le frontend V2 est maintenant connecté à l'API backend via Azure AD B2C
- Les tests E2E actuels du backend testent uniquement l'API (sans interface utilisateur)
- Il n'existe pas encore de tests validant le workflow complet UI → API → DB

**Différence avec Issue #28** :

- Issue #28 : Tests E2E des interactions Shadow DOM (web components uniquement)
- Cette issue : Tests E2E complets frontend React + backend API + authentification

---

## 🎯 Workflows à Tester

### Workflow 1: Création de Stock Complet

```
1. Utilisateur se connecte via Azure AD B2C (interface login)
2. Dashboard s'affiche avec liste des stocks
3. Clic sur bouton "Ajouter un Stock"
4. Formulaire s'affiche
5. Remplir les champs (nom, description, catégorie)
6. Soumettre le formulaire
7. Frontend appelle POST /api/v2/stocks
8. Backend crée le stock en base de données
9. Frontend reçoit réponse et affiche notification
10. Stock apparaît dans la liste du dashboard
```

### Workflow 2: Gestion d'Items

```
1. Utilisateur clique sur un stock existant
2. Page détails du stock s'affiche
3. Clic sur "Ajouter un item"
4. Formulaire item s'affiche
5. Remplir les champs (label, quantité, stock min)
6. Soumettre
7. Frontend appelle POST /api/v2/stocks/:id/items
8. Backend crée l'item en base de données
9. Item apparaît dans la liste
10. Vérifier que le statut du stock est mis à jour (optimal/low/critical)
```

### Workflow 3: Mise à Jour Quantité

```
1. Utilisateur affiche un stock avec items
2. Clic sur bouton "+/-" pour modifier quantité
3. Input numérique s'affiche
4. Modification de la quantité
5. Frontend appelle PATCH /api/v2/stocks/:id/items/:itemId
6. Backend met à jour la quantité
7. UI se rafraîchit avec nouvelle quantité
8. Statut du stock mis à jour si nécessaire
```

### Workflow 4: Suppression avec Cascade

```
1. Utilisateur affiche liste des stocks
2. Clic sur bouton "Supprimer" d'un stock
3. Modal de confirmation s'affiche
4. Confirmer la suppression
5. Frontend appelle DELETE /api/v2/stocks/:id
6. Backend supprime le stock + ses items (cascade)
7. Stock disparaît de la liste
8. Notification de succès
```

---

## 🛠️ Stack Technique

### Configuration Playwright

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e-full',

  // Démarrer frontend ET backend avant les tests
  webServer: [
    {
      command: 'npm run dev',
      port: 5173,
      reuseExistingServer: !process.env.CI,
      timeout: 120 * 1000,
    },
    {
      command: 'cd ../../../Perso/Projets/stockhub/stockhub_back && npm run start:dev',
      port: 3006,
      reuseExistingServer: !process.env.CI,
      timeout: 120 * 1000,
    },
  ],

  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
```

### Variables d'Environnement

```env
# .env.e2e
VITE_API_SERVER_URL=http://localhost:3006/api
VITE_CLIENT_ID=<Azure AD B2C Client ID>
VITE_TENANT_NAME=stockhubb2c

# Test user credentials
E2E_TEST_EMAIL=test-e2e@stockhub.com
E2E_TEST_PASSWORD=TestPassword123!
```

---

## 📝 Exemples de Tests

### Test 1: Workflow Complet Création Stock

```typescript
// tests/e2e-full/stock-creation.e2e.test.ts
import { test, expect } from '@playwright/test';

test.describe('Stock Creation - Complete User Workflow', () => {
  test('should create a stock via UI and verify in database', async ({ page }) => {
    // 1. Login via Azure AD B2C
    await page.goto('http://localhost:5173');

    // Attendre redirection vers Azure AD B2C
    await expect(page).toHaveURL(/login.microsoftonline.com/);

    // Remplir formulaire Azure AD B2C
    await page.fill('input[type="email"]', process.env.E2E_TEST_EMAIL);
    await page.click('button[type="submit"]');
    await page.fill('input[type="password"]', process.env.E2E_TEST_PASSWORD);
    await page.click('button[type="submit"]');

    // 2. Vérifier redirection vers dashboard
    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page.locator('h1')).toContainText('Dashboard');

    // 3. Cliquer sur bouton "Ajouter un Stock" (web component)
    const addButton = page.locator('sh-button:has-text("Ajouter un Stock")');
    await addButton.click();

    // 4. Remplir le formulaire
    await page.fill('[data-testid="stock-label-input"]', 'E2E Test Stock');
    await page.fill('[data-testid="stock-description-input"]', 'Created via E2E test');
    await page.selectOption('[data-testid="stock-category-select"]', 'alimentation');

    // 5. Soumettre le formulaire
    await page.click('[data-testid="submit-stock-button"]');

    // 6. Attendre la création (appel API POST /stocks)
    await page.waitForResponse(
      response =>
        response.url().includes('/api/v2/stocks') && response.request().method() === 'POST'
    );

    // 7. Vérifier notification de succès
    await expect(page.locator('[role="alert"]')).toContainText('Stock créé avec succès');

    // 8. Vérifier que le stock apparaît dans la liste
    const stockList = page.locator('[data-testid="stock-list"]');
    await expect(stockList).toContainText('E2E Test Stock');

    // 9. Vérifier détails du stock
    const stockCard = page.locator('sh-stock-card:has-text("E2E Test Stock")');
    await expect(stockCard).toBeVisible();
    await expect(stockCard).toContainText('alimentation');
  });
});
```

### Test 2: Workflow Ajout Item avec Vérification Statut

```typescript
// tests/e2e-full/item-management.e2e.test.ts
test('should add item and update stock status', async ({ page }) => {
  // Setup: créer un stock au préalable
  await createStockViaAPI({ label: 'Test Stock', category: 'alimentation' });

  await page.goto('http://localhost:5173/dashboard');

  // 1. Cliquer sur le stock
  await page.click('sh-stock-card:has-text("Test Stock")');

  // 2. Page détails s'affiche
  await expect(page).toHaveURL(/.*\/stocks\/\d+/);

  // 3. Ajouter un item avec quantité faible (status: low)
  await page.click('[data-testid="add-item-button"]');
  await page.fill('[data-testid="item-label"]', 'Bananes');
  await page.fill('[data-testid="item-quantity"]', '5');
  await page.fill('[data-testid="item-minimum-stock"]', '20');
  await page.click('[data-testid="submit-item"]');

  // 4. Attendre appel API
  await page.waitForResponse(
    response => response.url().includes('/items') && response.request().method() === 'POST'
  );

  // 5. Vérifier que l'item apparaît
  await expect(page.locator('.item-list')).toContainText('Bananes');

  // 6. Vérifier que le statut du stock est "low"
  const statusBadge = page.locator('[data-testid="stock-status-badge"]');
  await expect(statusBadge).toContainText('low');
  await expect(statusBadge).toHaveClass(/status-low/);
});
```

### Test 3: Workflow Suppression avec Confirmation

```typescript
// tests/e2e-full/stock-deletion.e2e.test.ts
test('should delete stock with confirmation modal', async ({ page }) => {
  // Setup
  await createStockViaAPI({ label: 'Stock to Delete', category: 'hygiene' });

  await page.goto('http://localhost:5173/dashboard');

  // 1. Cliquer sur bouton supprimer
  const stockCard = page.locator('sh-stock-card:has-text("Stock to Delete")');
  const deleteButton = stockCard.locator('button[aria-label*="Supprimer"]');
  await deleteButton.click();

  // 2. Modal de confirmation s'affiche
  const modal = page.locator('[role="dialog"]');
  await expect(modal).toBeVisible();
  await expect(modal).toContainText('Êtes-vous sûr de vouloir supprimer');

  // 3. Confirmer la suppression
  await page.click('[data-testid="confirm-delete-button"]');

  // 4. Attendre appel API DELETE
  await page.waitForResponse(
    response => response.url().includes('/stocks/') && response.request().method() === 'DELETE'
  );

  // 5. Vérifier que le stock a disparu
  await expect(page.locator('sh-stock-card')).not.toContainText('Stock to Delete');

  // 6. Notification de succès
  await expect(page.locator('[role="alert"]')).toContainText('Stock supprimé');
});
```

---

## 📋 Structure Projet

```
tests/e2e-full/
├── fixtures/
│   ├── auth.ts                 # Helper authentification Azure AD B2C
│   ├── stocks.ts               # Helper création stocks via API
│   └── cleanup.ts              # Nettoyage après tests
├── workflows/
│   ├── stock-creation.e2e.test.ts
│   ├── item-management.e2e.test.ts
│   ├── stock-update.e2e.test.ts
│   └── stock-deletion.e2e.test.ts
├── authentication/
│   └── azure-b2c-login.e2e.test.ts
└── integration/
    └── backend-sync.e2e.test.ts

playwright.config.ts
.env.e2e
```

---

## 🎯 Helpers Utiles

### Helper Authentification

```typescript
// tests/e2e-full/fixtures/auth.ts
import { Page } from '@playwright/test';

export async function loginViaAzureB2C(page: Page) {
  await page.goto('http://localhost:5173');

  // Attendre redirection Azure AD B2C
  await page.waitForURL(/login.microsoftonline.com/);

  // Remplir formulaire
  await page.fill('input[type="email"]', process.env.E2E_TEST_EMAIL!);
  await page.click('button[type="submit"]');
  await page.fill('input[type="password"]', process.env.E2E_TEST_PASSWORD!);
  await page.click('button[type="submit"]');

  // Attendre retour vers app
  await page.waitForURL(/.*dashboard/);
}
```

### Helper Création Stock via API

```typescript
// tests/e2e-full/fixtures/stocks.ts
export async function createStockViaAPI(data: { label: string; category: string }) {
  const token = await getAuthToken();

  const response = await fetch('http://localhost:3006/api/v2/stocks', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      label: data.label,
      description: 'E2E test stock',
      category: data.category,
    }),
  });

  return response.json();
}
```

### Helper Cleanup

```typescript
// tests/e2e-full/fixtures/cleanup.ts
export async function cleanupTestStocks() {
  const token = await getAuthToken();

  // Get all stocks
  const response = await fetch('http://localhost:3006/api/v2/stocks', {
    headers: { Authorization: `Bearer ${token}` },
  });

  const stocks = await response.json();

  // Delete all E2E test stocks
  for (const stock of stocks) {
    if (stock.label.includes('E2E')) {
      await fetch(`http://localhost:3006/api/v2/stocks/${stock.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
    }
  }
}
```

---

## 🎯 Différences avec Tests Existants

| Type de Test                          | Scope                       | Mock                       | Outils                   | Vitesse        |
| ------------------------------------- | --------------------------- | -------------------------- | ------------------------ | -------------- |
| **Tests Unitaires** (existants)       | Composants React isolés     | ✅ API mockée              | Vitest + Testing Library | ⚡ Très rapide |
| **Tests E2E Shadow DOM** (Issue #28)  | Interactions web components | ✅ API mockée              | Playwright               | ⚡ Rapide      |
| **Tests API E2E Backend** (existants) | API complète sans UI        | ❌ Authentification réelle | Playwright               | 🐢 Moyen       |
| **Tests E2E Complets** (cette issue)  | UI + API + DB ensemble      | ❌ Aucun mock              | Playwright               | 🐌 Lent        |

---

## 🎯 Critères d'Acceptation

### Must Have

- [ ] Playwright configuré pour démarrer frontend ET backend
- [ ] Helper authentification Azure AD B2C
- [ ] Test workflow création stock complet (UI → API → DB)
- [ ] Test workflow ajout item avec vérification statut
- [ ] Test workflow suppression avec confirmation
- [ ] Cleanup automatique après tests
- [ ] Documentation complète

### Nice to Have

- [ ] Test workflow mise à jour quantité
- [ ] Test workflow gestion erreurs API
- [ ] Test workflow refresh automatique après modification
- [ ] Tests accessibilité (axe-core)
- [ ] Tests performance (Core Web Vitals)

---

## 📊 Métriques Cibles

- **Couverture** : Tous les workflows critiques utilisateur
- **Temps exécution** : <10min pour suite complète
- **Stabilité** : <5% flakiness
- **CI** : Tests passent avant merge

---

## 🔗 Références

**Issues liées** :

- Issue #28 : Tests E2E Shadow DOM (web components)
- Issue #63 : Bug refresh automatique (à valider avec tests E2E)
- Backend PR #40 : Review feedback sur tests E2E API

**Documentation** :

- Backend: `stockhub_back/tests/e2e/` (tests API E2E existants)
- Frontend: `docs/sessions/INTEGRATION_BACKEND_SESSION.md`
- Session recap: `docs/sessions/SESSION_RECAP_2026-01-07.md`

**Playwright** :

- Docs: https://playwright.dev/docs/intro
- Shadow DOM: https://playwright.dev/docs/locators#pierce-shadow-dom
- Multi-server: https://playwright.dev/docs/test-webserver

---

**Priorité** : P2 (validation qualité post-intégration backend)
**Estimation** : 12h (setup 4h + tests 6h + documentation 2h)
**Type** : Enhancement, Tests, Integration
**Labels** : `test`, `e2e`, `front`, `back`, `integration`, `P2`
