# Guide d'Intégration StockHub V2

**Date** : 20 Octobre 2025
**Version Design System** : 2.0.0-rc
**Cible** : StockHub V2 (React + TypeScript)

---

## 🎯 Objectif

Intégrer les Web Components du Design System dans l'application React StockHub V2 pour :
- ✅ Réduire la duplication de code
- ✅ Maintenir une cohérence visuelle
- ✅ Faciliter la maintenance
- ✅ Préparer la future application mobile

---

## 📦 Installation

### Méthode 1 : Installer depuis GitHub ✅ RECOMMANDÉ

Puisque les deux projets sont sur la même machine et le Design System n'est pas publié sur NPM, installez directement depuis GitHub :

```bash
# 1. Naviguer vers StockHub V2
cd C:/Users/sandr/Dev/RNCP7/StockHub_V2/Front_End/stockHub_V2_front

# 2. Installer depuis GitHub (branche master)
npm install git+https://github.com/SandrineCipolla/stockhub_design_system.git

# OU installer une branche spécifique
npm install git+https://github.com/SandrineCipolla/stockhub_design_system.git#v2

# OU installer un tag spécifique
npm install git+https://github.com/SandrineCipolla/stockhub_design_system.git#v2.0.0
```

**Avantages** :
- ✅ Fonctionne en local ET sur GitHub Actions CI/CD
- ✅ Pas besoin de NPM (gratuit)
- ✅ Versionné via Git (tags, branches)
- ✅ Facile à mettre à jour

**Mise à jour** :
```bash
npm update @stockhub/design-system
# OU forcer la réinstallation
npm install git+https://github.com/SandrineCipolla/stockhub_design_system.git --force
```

---

### Méthode 2 : npm link (Développement local uniquement)

**⚠️ Limitation** : Ne fonctionne PAS sur GitHub Actions, uniquement en local.

```bash
# 1. Dans le Design System
cd C:/Users/sandr/Dev/RNCP7/stockhub_design_system
npm link

# 2. Dans StockHub V2
cd C:/Users/sandr/Dev/RNCP7/StockHub_V2/Front_End/stockHub_V2_front
npm link @stockhub/design-system
```

**Avantages** :
- ✅ Modifications instantanées (pas besoin de republier)
- ✅ Idéal pour développement

**Inconvénients** :
- ❌ Ne fonctionne pas sur CI/CD
- ❌ Lien cassé si vous changez de répertoire

---

### Méthode 3 : Publier sur NPM (Si vous voulez le partager)

```bash
# 1. Login sur NPM
npm login

# 2. Publier
cd C:/Users/sandr/Dev/RNCP7/stockhub_design_system
npm publish --access public

# 3. Installer depuis NPM
cd C:/Users/sandr/Dev/RNCP7/StockHub_V2/Front_End/stockHub_V2_front
npm install @stockhub/design-system@latest
```

---

### 2. Importer les composants

Dans `src/main.tsx` ou `src/App.tsx` :

```typescript
// Importer tous les Web Components
import '@stockhub/design-system';

// OU importer sélectivement
import '@stockhub/design-system/dist/components/atoms/badge/sh-badge';
import '@stockhub/design-system/dist/components/molecules/button/sh-button';
// etc.
```

### 3. Configurer TypeScript (optionnel)

Pour avoir l'autocomplétion dans les fichiers TSX, créer `src/types/web-components.d.ts` :

```typescript
declare namespace JSX {
  interface IntrinsicElements {
    'sh-button': any;
    'sh-badge': any;
    'sh-card': any;
    'sh-icon': any;
    'sh-input': any;
    'sh-metric-card': any;
    'sh-status-badge': any;
    'sh-stock-item-card': any;
    'sh-header': any;
  }
}
```

---

## 🔄 Plan de Migration

### Phase 1 : Composants Simples (Session 6)

Remplacer les composants React simples par les Web Components équivalents.

#### 1. Badge

**Avant (React)** :
```tsx
// src/components/common/Badge.tsx
<Badge variant="success">Active</Badge>
```

**Après (Web Component)** :
```tsx
<sh-badge variant="success">Active</sh-badge>
```

**Action** :
- [ ] Supprimer `src/components/common/Badge.tsx`
- [ ] Remplacer toutes les occurrences de `<Badge>` par `<sh-badge>`
- [ ] Vérifier les props (variant, size, pill)

---

#### 2. Button

**Avant (React)** :
```tsx
// src/components/common/Button.tsx
<Button variant="primary" loading={isLoading} onClick={handleClick}>
  Save
</Button>
```

**Après (Web Component)** :
```tsx
<sh-button
  variant="primary"
  loading={isLoading}
  onClick={(e) => handleClick()}
  iconBefore="Save"
>
  Save
</sh-button>
```

**⚠️ Différences importantes** :
- Attribut `iconBefore` / `iconAfter` au lieu d'un composant React `<Icon>`
- Les icônes utilisent **Lucide** avec noms en PascalCase : `"Save"`, `"Edit"`, `"Trash2"`

**Action** :
- [ ] Supprimer `src/components/common/Button.tsx`
- [ ] Remplacer toutes les occurrences de `<Button>` par `<sh-button>`
- [ ] Migrer les icônes vers Lucide (voir tableau de mapping ci-dessous)

---

#### 3. Input

**Avant (React)** :
```tsx
// src/components/common/Input.tsx
<Input
  type="text"
  placeholder="Enter name"
  value={name}
  onChange={(e) => setName(e.target.value)}
  error={errors.name}
/>
```

**Après (Web Component)** :
```tsx
<sh-input
  type="text"
  placeholder="Enter name"
  value={name}
  error={!!errors.name}
  errorMessage={errors.name}
  onsh-input-change={(e: CustomEvent) => setName(e.detail.value)}
/>
```

**⚠️ Différences importantes** :
- Événement custom `sh-input-change` au lieu de `onChange`
- `e.detail.value` au lieu de `e.target.value`

**Action** :
- [ ] Supprimer `src/components/common/Input.tsx`
- [ ] Remplacer toutes les occurrences de `<Input>` par `<sh-input>`
- [ ] Adapter les event handlers

---

### Phase 2 : Composants Métier (Session 6)

#### 4. StatusBadge

**Avant (React)** :
```tsx
// src/components/inventory/StatusBadge.tsx
<StatusBadge status="in-stock" />
<StatusBadge status="low-stock" />
<StatusBadge status="out-of-stock" />
```

**Après (Web Component)** :
```tsx
<sh-status-badge status="optimal" />
<sh-status-badge status="low" />
<sh-status-badge status="critical" />
<sh-status-badge status="out-of-stock" />
<sh-status-badge status="overstocked" />
```

**⚠️ Changement de noms de statuts** :

| Ancien (React) | Nouveau (Web Component) | Icône | Animation |
|----------------|-------------------------|-------|-----------|
| `in-stock` | `optimal` | CheckCircle | ❌ |
| `low-stock` | `low` | AlertCircle | ❌ |
| `critical` (nouveau) | `critical` | AlertTriangle | ✅ Pulse |
| `out-of-stock` | `out-of-stock` | XCircle | ✅ Pulse |
| `restock-needed` | `critical` ou `low` | AlertTriangle / AlertCircle | ✅ / ❌ |
| *(nouveau)* | `overstocked` | TrendingUp | ❌ |

**Action** :
- [ ] Supprimer `src/components/inventory/StatusBadge.tsx`
- [ ] Remplacer toutes les occurrences avec mapping des statuts
- [ ] Profiter de l'animation pulse automatique pour `critical` et `out-of-stock`

---

#### 5. MetricCard (Dashboard)

**Avant (React)** :
```tsx
// src/components/dashboard/MetricCard.tsx
<MetricCard
  icon={<Package />}
  label="Total Produits"
  value={totalProducts}
  trend={trend}
  variant="success"
/>
```

**Après (Web Component)** :
```tsx
<sh-metric-card
  icon="Package"
  label="Total Produits"
  value={totalProducts}
  trend={trend > 0 ? "increase" : "decrease"}
  trend-value={`${trend > 0 ? '+' : ''}${trend}%`}
  variant="success"
  clickable
  onsh-metric-click={(e: CustomEvent) => handleMetricClick(e.detail)}
/>
```

**⚠️ Différences importantes** :
- `icon` est une string Lucide (PascalCase) au lieu d'un composant React
- `trend` est `"increase"` | `"decrease"` au lieu d'un number
- `trend-value` séparé pour afficher "+12%" ou "-5%"
- Événement `sh-metric-click` si `clickable={true}`

**Action** :
- [ ] Supprimer `src/components/dashboard/MetricCard.tsx`
- [ ] Remplacer toutes les occurrences
- [ ] Adapter la logique de tendance (number → increase/decrease)

---

#### 6. StockCard / StockItemCard (Inventaire)

**Avant (React)** :
```tsx
// src/components/inventory/StockCard.tsx
<StockCard
  product={product}
  onView={() => viewProduct(product.id)}
  onEdit={() => editProduct(product.id)}
  onDelete={() => deleteProduct(product.id)}
/>
```

**Après (Web Component)** :
```tsx
<sh-stock-item-card
  name={product.name}
  sku={product.sku}
  quantity={product.quantity}
  value={formatCurrency(product.value)}
  location={product.location}
  status={mapStatusToWebComponent(product.status)}
  loading={isLoading}
  data-theme={theme}
  onsh-view-click={(e: CustomEvent) => viewProduct(e.detail.sku)}
  onsh-edit-click={(e: CustomEvent) => editProduct(e.detail.sku)}
  onsh-delete-click={(e: CustomEvent) => deleteProduct(e.detail.sku)}
/>
```

**⚠️ Différences importantes** :
- Props individuelles (name, sku, quantity, value, location, status) au lieu d'un objet `product`
- Événements custom : `sh-view-click`, `sh-edit-click`, `sh-delete-click`
- Mapping des statuts (voir tableau StatusBadge)
- Badge de statut intégré (ne pas ajouter `<sh-status-badge>` manuellement)

**Helper de mapping** :
```typescript
function mapStatusToWebComponent(status: string): 'optimal' | 'low' | 'critical' | 'out-of-stock' | 'overstocked' {
  const statusMap: Record<string, any> = {
    'in-stock': 'optimal',
    'low-stock': 'low',
    'critical': 'critical',
    'out-of-stock': 'out-of-stock',
    'restock-needed': 'critical',
    'overstocked': 'overstocked',
  };
  return statusMap[status] || 'optimal';
}
```

**Action** :
- [ ] Supprimer `src/components/inventory/StockCard.tsx`
- [ ] Remplacer toutes les occurrences
- [ ] Créer helper `mapStatusToWebComponent()`
- [ ] Adapter les event handlers

---

#### 7. Header

**Avant (React)** :
```tsx
// src/components/layout/Header.tsx
<Header
  user={user}
  notificationCount={notifications.length}
  onLogout={handleLogout}
  onThemeToggle={handleThemeToggle}
/>
```

**Après (Web Component)** :
```tsx
<sh-header
  userName={user.name}
  notificationCount={notifications.length}
  isLoggedIn={!!user}
  data-theme={theme}
  onsh-logout-click={handleLogout}
  onsh-theme-toggle={handleThemeToggle}
  onsh-notification-click={handleNotifications}
/>
```

**Action** :
- [ ] Supprimer `src/components/layout/Header.tsx`
- [ ] Remplacer par `<sh-header>`
- [ ] Adapter les event handlers

---

### Phase 3 : Composants Génériques (Session 7)

#### 8. Card

**Avant (React)** :
```tsx
<Card hover clickable onClick={handleClick}>
  <CardHeader>Title</CardHeader>
  <CardBody>Content...</CardBody>
  <CardFooter>Footer</CardFooter>
</Card>
```

**Après (Web Component)** :
```tsx
<sh-card
  hover
  clickable
  padding="md"
  onsh-card-click={handleClick}
>
  <h3 slot="header">Title</h3>
  <p>Content...</p>
  <div slot="footer">Footer</div>
</sh-card>
```

**⚠️ Différences importantes** :
- Slots nommés : `slot="header"` et `slot="footer"` au lieu de composants séparés
- Événement `sh-card-click` au lieu de `onClick`

**Action** :
- [ ] Supprimer `src/components/common/Card.tsx`
- [ ] Remplacer par `<sh-card>` avec slots

---

#### 9. Icon (Lucide Migration)

**Avant (React avec lucide-react)** :
```tsx
import { Package, Edit, Trash2 } from 'lucide-react';

<Package size={24} color="blue" />
<Edit size={16} />
<Trash2 size={20} />
```

**Après (Web Component avec Lucide vanilla)** :
```tsx
<sh-icon name="Package" size="lg" color="primary" />
<sh-icon name="Edit" size="sm" />
<sh-icon name="Trash2" size="md" />
```

**Mapping des tailles** :

| lucide-react (px) | sh-icon (size) |
|-------------------|----------------|
| 12 | xs |
| 16 | sm |
| 20 | md |
| 24 | lg |
| 32 | xl |

**Mapping des couleurs** :

| lucide-react (color) | sh-icon (color) |
|----------------------|-----------------|
| (custom hex) | inherit (style parent) |
| blue, primary | primary |
| green | success |
| yellow, orange | warning |
| red | danger |
| gray | muted |

**Action** :
- [ ] Supprimer les imports de `lucide-react`
- [ ] Remplacer par `<sh-icon name="..." size="..." />`
- [ ] Adapter les tailles et couleurs (voir tableaux)

---

## 🎨 Thème (Light/Dark)

Le Design System supporte les thèmes light/dark via `data-theme`.

### Setup Global

Dans `src/App.tsx` :

```tsx
import { useTheme } from './hooks/useTheme'; // Votre hook custom

function App() {
  const { theme } = useTheme();

  return (
    <div data-theme={theme}>
      {/* Tous les Web Components héritent du thème */}
      <sh-header data-theme={theme} />

      <main>
        <sh-metric-card data-theme={theme} />
        <sh-stock-item-card data-theme={theme} />
      </main>
    </div>
  );
}
```

**Note** : Si `data-theme` est défini sur un parent, les Web Components l'héritent automatiquement via `:host([data-theme="dark"])` en CSS.

---

## 📋 Checklist Intégration

### Préparation
- [ ] Installer `@stockhub/design-system@latest`
- [ ] Créer `src/types/web-components.d.ts` pour TypeScript
- [ ] Importer les composants dans `main.tsx` ou `App.tsx`
- [ ] Créer helper `mapStatusToWebComponent()`

### Phase 1 : Composants Simples
- [ ] Migrer `Badge` → `sh-badge`
- [ ] Migrer `Button` → `sh-button` (+ migration icônes)
- [ ] Migrer `Input` → `sh-input` (+ event handlers)
- [ ] Supprimer les fichiers React des composants migrés
- [ ] Tester les pages avec composants migrés

### Phase 2 : Composants Métier
- [ ] Migrer `StatusBadge` → `sh-status-badge` (+ mapping statuts)
- [ ] Migrer `MetricCard` → `sh-metric-card`
- [ ] Migrer `StockCard` → `sh-stock-item-card`
- [ ] Migrer `Header` → `sh-header`
- [ ] Tester le dashboard et l'inventaire
- [ ] Vérifier les interactions (View/Edit/Delete)

### Phase 3 : Composants Génériques
- [ ] Migrer `Card` → `sh-card` (+ slots)
- [ ] Migrer toutes les icônes `lucide-react` → `sh-icon`
- [ ] Supprimer la dépendance `lucide-react` du package.json
- [ ] Tester toutes les pages

### Tests & Validation
- [ ] Tests E2E (Playwright/Cypress)
- [ ] Tests visuels (Chromatic ou Percy)
- [ ] Lighthouse score ≥ 98
- [ ] Accessibilité (RGAA / WCAG)
- [ ] Responsive mobile (320px - 1920px)

### Documentation
- [ ] Mettre à jour la doc technique interne
- [ ] Créer guide pour nouveaux développeurs
- [ ] Documenter les helpers de mapping

---

## 🔧 Helpers Utiles

### mapStatusToWebComponent()

```typescript
// src/utils/status-mapper.ts
export function mapStatusToWebComponent(
  status: string
): 'optimal' | 'low' | 'critical' | 'out-of-stock' | 'overstocked' {
  const statusMap: Record<string, any> = {
    'in-stock': 'optimal',
    'low-stock': 'low',
    'critical': 'critical',
    'out-of-stock': 'out-of-stock',
    'restock-needed': 'critical',
    'overstocked': 'overstocked',
  };
  return statusMap[status] || 'optimal';
}
```

### formatCurrency()

```typescript
// src/utils/currency.ts
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(value);
}
```

### Event Handler Wrapper

```typescript
// src/utils/event-handlers.ts
export function handleCustomEvent<T = any>(
  handler: (detail: T) => void
) {
  return (e: CustomEvent<T>) => handler(e.detail);
}

// Usage
<sh-stock-item-card
  onsh-view-click={handleCustomEvent((detail) => viewProduct(detail.sku))}
/>
```

---

## 🚨 Points d'Attention

### 1. Événements Custom

Les Web Components émettent des **événements custom** (pas `onClick` natif) :

```tsx
// ❌ INCORRECT
<sh-button onClick={handleClick}>Click</sh-button>

// ✅ CORRECT
<sh-button onsh-button-click={handleClick}>Click</sh-button>
```

### 2. Attributs vs Props

Les Web Components utilisent des **attributs HTML** (kebab-case) :

```tsx
// ❌ INCORRECT
<sh-metric-card trendValue="+12%" />

// ✅ CORRECT
<sh-metric-card trend-value="+12%" />
```

**Mais** React permet aussi la notation camelCase (sera converti automatiquement).

### 3. Slots

Les slots remplacent les `children` React :

```tsx
// ❌ INCORRECT
<sh-card>
  <CardHeader>Title</CardHeader>
</sh-card>

// ✅ CORRECT
<sh-card>
  <h3 slot="header">Title</h3>
</sh-card>
```

### 4. Boolean Attributes

Les attributs boolean doivent être passés comme props React :

```tsx
// ✅ CORRECT
<sh-button loading disabled>Save</sh-button>
<sh-button loading={isLoading}>Save</sh-button>
```

### 5. Migration Progressive

**Ne pas tout migrer d'un coup** ! Migrer par phase :
1. Composants simples (Badge, Button, Input)
2. Composants métier (StatusBadge, MetricCard, StockCard)
3. Composants génériques (Card, Icon)

Tester après chaque phase.

---

## 📊 Métriques de Succès

### Performance
- ✅ Lighthouse score ≥ 98
- ✅ Temps de chargement < 2s
- ✅ FCP (First Contentful Paint) < 1s

### Qualité
- ✅ Aucune régression visuelle (Chromatic)
- ✅ Tous les tests E2E passent
- ✅ Accessibilité WCAG AA

### Maintenance
- ✅ Réduction du code dupliqué (≥ 50%)
- ✅ Cohérence visuelle à 100%
- ✅ Documentation complète

---

## 🆘 Support

### Problèmes Courants

**1. Web Component ne s'affiche pas**
- Vérifier l'import : `import '@stockhub/design-system';`
- Vérifier la console : erreur de nom de composant ?
- Vérifier les attributs : kebab-case ou camelCase

**2. Événement ne se déclenche pas**
- Utiliser le nom complet : `onsh-button-click` (pas `onClick`)
- Vérifier la console : `CustomEvent` émis ?

**3. Style cassé**
- Vérifier `data-theme` sur le parent
- Vérifier que les CSS variables globales sont chargées

### Ressources

- **Design System Storybook** : https://68f5fbe10f495706cb168751-nufqfdjaoc.chromatic.com/
- **Lucide Icons** : https://lucide.dev/icons/
- **Web Components MDN** : https://developer.mozilla.org/en-US/docs/Web/Web_Components

---

### Phase 3 : Composants Organisms StockHub V2 (Session 7) 🆕

#### 7. StockCard (Dashboard)

**Nouveau composant organism** pour afficher les cartes de stock dans le dashboard principal.

**Utilisation** :
```tsx
<sh-stock-card
  name="Acrylique Bleu Cobalt"
  category="Peinture"
  last-update="Mis à jour il y a 3i"
  percentage="65"
  quantity="1 tube"
  value="€12"
  status="optimal"
  data-theme="dark"
  onsh-session-click={(e: CustomEvent) => handleSessionSave(e.detail)}
  onsh-details-click={(e: CustomEvent) => handleViewDetails(e.detail)}
  onsh-edit-click={(e: CustomEvent) => handleEdit(e.detail)}
  onsh-delete-click={(e: CustomEvent) => handleDelete(e.detail)}
/>
```

**Props** :
- `name` : Nom du stock
- `category` : Catégorie du produit
- `last-update` : Texte de dernière mise à jour
- `percentage` : Pourcentage de stock (string ou number)
- `quantity` : Sous-texte de quantité (ex: "1 tube")
- `value` : Valeur totale
- `status` : `'optimal' | 'low' | 'critical' | 'out-of-stock' | 'overstocked'`
- `ia-count` : Nombre d'alertes IA (number) - affiche badge IA si > 0

**Badge IA avec JavaScript** :
```tsx
useEffect(() => {
  customElements.whenDefined('sh-stock-card').then(() => {
    const card = document.getElementById('my-stock-card');
    if (card) {
      card.iaCount = 2; // Doit être assigné via propriété JS, pas attribut HTML
    }
  });
}, []);
```

**Événements** :
- `sh-session-click` : Click sur "Enregistrer session"
- `sh-details-click` : Click sur "Détails"
- `sh-edit-click` : Click sur éditer
- `sh-delete-click` : Click sur supprimer

**Distinction avec StockItemCard** :
- `sh-stock-card` = **Carte de stock global** (dashboard principal)
- `sh-stock-item-card` = **Carte d'item individuel** (vue détaillée d'un stock)

---

### Organisation Atomic Design mise à jour

**Organisms** (composants métier complexes) :
- `sh-header` : Navigation principale
- `sh-stock-card` : Carte de stock dashboard 🆕
- `sh-stock-item-card` : Carte d'item inventaire

**Molecules** (groupes d'atomes) :
- `sh-button`, `sh-status-badge`, `sh-metric-card`, `sh-card` (base)

**Atoms** (composants de base) :
- `sh-icon`, `sh-input`, `sh-badge`, `sh-text`

---

### Phase 4 : Composants Complets StockHub V2 (Session 8) ✅

Tous les composants manquants ont été créés !

#### 8. Search Input (Molecule)

**Nouveau composant** : Champ de recherche avec icône et bouton clear.

**Utilisation** :
```tsx
<sh-search-input
  placeholder="Rechercher un stock..."
  value={searchQuery}
  debounce={300}
  clearable
  data-theme="dark"
  onsh-search={(e: CustomEvent) => handleSearch(e.detail.query)}
  onsh-search-change={(e: CustomEvent) => handleSearchChange(e.detail.query)}
  onsh-search-clear={() => handleClear()}
/>
```

**Props** :
- `placeholder` : Texte placeholder
- `value` : Valeur du champ
- `debounce` : Délai de debounce en ms (0 = désactivé)
- `clearable` : Afficher le bouton X pour clear
- `disabled` : Désactiver le champ

**Événements** :
- `sh-search` : Émis à la soumission (Enter)
- `sh-search-change` : Émis lors de la saisie (avec debounce si configuré)
- `sh-search-clear` : Émis lors du clic sur le bouton clear

---

#### 9. Footer (Organism)

**Nouveau composant** : Footer avec copyright et liens légaux.

**Utilisation** :
```tsx
<sh-footer
  app-name="STOCK HUB"
  year="2025"
  data-theme="dark"
  onsh-footer-link-click={(e: CustomEvent) => handleLinkClick(e.detail.link)}
/>
```

**Props** :
- `app-name` : Nom de l'application (défaut: "STOCK HUB")
- `year` : Année du copyright (défaut: année courante)

**Événements** :
- `sh-footer-link-click` : Émis lors du clic sur un lien
  - `e.detail.link` : `'mentions-legales' | 'politique-confidentialite' | 'cgu' | 'cookies'`

**Liens intégrés** :
- Mentions Légales
- Politique de Confidentialité
- CGU
- Politique de Cookies

---

#### 10. IA Alert Banner (Organism)

**Nouveau composant** : Bandeau d'alertes IA avec liste collapsible.

**Utilisation** :
```tsx
<sh-ia-alert-banner
  count={5}
  severity="critical"
  message="stocks nécessitent votre attention"
  expanded={true}
  data-theme="dark"
  onsh-ia-alert-item-click={(e: CustomEvent) => handleAlertClick(e.detail)}
/>
```

**Props** :
- `count` : Nombre d'alertes
- `severity` : `'critical' | 'warning' | 'info'`
- `message` : Message principal
- `expanded` : État ouvert/fermé (boolean)
- `alerts` : Array d'objets `IaAlert[]` (doit être assigné via JS)

**Interface IaAlert** :
```typescript
interface IaAlert {
  product: string;
  message: string;
  severity: 'critical' | 'warning' | 'info';
}
```

**Assignation des alertes (JavaScript)** :
```tsx
useEffect(() => {
  customElements.whenDefined('sh-ia-alert-banner').then(() => {
    const banner = document.getElementById('my-banner');
    if (banner) {
      banner.alerts = [
        { product: 'Acrylique Jaune', message: 'Risque de rupture', severity: 'critical' },
        { product: 'Feutrine Rouge', message: 'Stock bas', severity: 'warning' }
      ];
    }
  });
}, []);
```

**Événements** :
- `sh-ia-alert-item-click` : Clic sur un item d'alerte
  - `e.detail` : L'objet `IaAlert` complet

**Badges de sévérité** :
- `critical` : Badge rouge "X Critiques"
- `warning` : Badge orange "X Attention"
- `info` : Badge bleu "X Info"

---

#### 11. Header (Organism) - Déjà existant ✅

Le composant Header était déjà créé et correspond au design StockHub V2.

**Utilisation complète** :
```tsx
<sh-header
  userName="Sandrine Cipolla"
  notificationCount={3}
  isLoggedIn={true}
  data-theme="dark"
  onsh-notification-click={(e: CustomEvent) => handleNotifications(e.detail)}
  onsh-theme-toggle={(e: CustomEvent) => handleThemeToggle(e.detail)}
  onsh-logout-click={(e: CustomEvent) => handleLogout(e.detail)}
/>
```

**Fonctionnalités** :
- Logo StockHub intégré
- Badge de notifications avec compteur
- Toggle thème (Sun/Moon)
- Bouton Logout avec icône User
- Sticky positioning avec glassmorphism
- Responsive (nom user caché sur mobile)

---

### Organisation Atomic Design complète

**Organisms** (composants métier complexes) :
- `sh-header` : Navigation principale avec logo, notifications, thème ✅
- `sh-footer` : Footer avec copyright et liens légaux ✅
- `sh-ia-alert-banner` : Bandeau d'alertes IA collapsible ✅
- `sh-stock-card` : Carte de stock dashboard ✅
- `sh-stock-item-card` : Carte d'item inventaire ✅

**Molecules** (groupes d'atomes) :
- `sh-button`, `sh-status-badge`, `sh-metric-card`, `sh-card`
- `sh-search-input` : Champ de recherche avec debounce ✅

**Atoms** (composants de base) :
- `sh-icon`, `sh-input`, `sh-badge`, `sh-logo`, `sh-text`

---

### Composants TypeScript declarations

Mettre à jour `src/types/web-components.d.ts` :

```typescript
declare namespace JSX {
  interface IntrinsicElements {
    // Atoms
    'sh-badge': any;
    'sh-icon': any;
    'sh-input': any;
    'sh-logo': any;
    'sh-text': any;

    // Molecules
    'sh-button': any;
    'sh-card': any;
    'sh-metric-card': any;
    'sh-quantity-input': any;
    'sh-search-input': any;
    'sh-status-badge': any;

    // Organisms
    'sh-footer': any;
    'sh-header': any;
    'sh-ia-alert-banner': any;
    'sh-stock-card': any;
    'sh-stock-item-card': any;
  }
}
```

---

**Maintenu par** : Sandrine Cipolla
**Dernière mise à jour** : 21 Octobre 2025
**Version** : 1.2
