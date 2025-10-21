# StockHub Design System - Guide d'Intégration

**Date** : 21 Octobre 2025
**Version Design System** : 1.2
**Branch** : `feature/design-system-integration`

---

## ✅ Installation Effectuée

Le Design System a été installé depuis GitHub :

```json
{
  "dependencies": {
    "@stockhub/design-system": "github:SandrineCipolla/stockhub_design_system#feature/stockhub-v2-components"
  }
}
```

---

## 📦 Composants Disponibles

### Atoms (5)
- `sh-badge` - Badges de statut
- `sh-icon` - Icônes Lucide
- `sh-input` - Champs de saisie
- `sh-logo` - Logo StockHub
- `sh-text` - Composant texte

### Molecules (6)
- `sh-button` - Boutons avec variants
- `sh-card` - Cartes de base
- `sh-metric-card` - Cartes de métriques
- `sh-quantity-input` - Input quantité avec +/-
- `sh-search-input` - Barre de recherche avec debounce
- `sh-status-badge` - Badge de statut stock

### Organisms (5)
- `sh-header` - En-tête avec logo, notifications, thème
- `sh-footer` - Pied de page avec liens légaux
- `sh-ia-alert-banner` - Bandeau d'alertes IA
- `sh-stock-card` - Carte de stock (dashboard)
- `sh-stock-item-card` - Carte d'item (vue détaillée)

**Total : 16 composants**

---

## 🚀 Utilisation

### Import Global

Les Web Components sont importés globalement dans `src/main.tsx` :

```typescript
import '@stockhub/design-system';
```

### Support TypeScript

Les types sont définis dans `src/types/web-components.d.ts` pour l'autocomplétion.

### Exemple d'Utilisation

```tsx
import { useState } from 'react';

function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div data-theme="dark">
      {/* Header */}
      <sh-header
        userName="Sandrine Cipolla"
        notificationCount={3}
        isLoggedIn
        onsh-logout-click={() => handleLogout()}
      />

      {/* Alert Banner IA */}
      <sh-ia-alert-banner
        count={5}
        severity="critical"
        message="stocks nécessitent votre attention"
        expanded
      />

      {/* Search */}
      <sh-search-input
        placeholder="Rechercher un stock..."
        value={searchQuery}
        debounce={300}
        clearable
        onsh-search-change={(e) => setSearchQuery(e.detail.query)}
      />

      {/* Stock Cards */}
      <sh-stock-card
        name="Acrylique Bleu Cobalt"
        category="Peinture"
        percentage="65"
        quantity="1 tube"
        value="€12"
        status="optimal"
        onsh-details-click={() => navigate('/stock/123')}
      />

      {/* Footer */}
      <sh-footer
        app-name="STOCK HUB"
        year="2025"
      />
    </div>
  );
}
```

---

## 🎨 Thèmes

Tous les composants supportent les thèmes via l'attribut `data-theme` :

```tsx
<div data-theme="dark">
  {/* Les composants héritent du thème */}
  <sh-button variant="primary">Click me</sh-button>
</div>
```

**Thèmes disponibles** : `light`, `dark`

---

## 📝 Événements Custom

Les Web Components émettent des événements custom (pas `onClick` natif) :

```tsx
// ❌ INCORRECT
<sh-button onClick={handleClick}>Click</sh-button>

// ✅ CORRECT
<sh-button onsh-button-click={handleClick}>Click</sh-button>
```

**Pattern des événements** : `onsh-{component}-{action}`

Exemples :
- `onsh-button-click`
- `onsh-search-change`
- `onsh-logout-click`
- `onsh-delete-click`

---

## 🔧 Propriétés Spéciales

### Assignation via JavaScript (pas HTML)

Certaines propriétés complexes (arrays, objects) doivent être assignées via JavaScript :

```tsx
// Badge IA sur StockCard
useEffect(() => {
  customElements.whenDefined('sh-stock-card').then(() => {
    const card = document.getElementById('my-card');
    if (card) {
      card.iaCount = 2; // ✅ Propriété JS
    }
  });
}, []);

// Alertes IA
useEffect(() => {
  customElements.whenDefined('sh-ia-alert-banner').then(() => {
    const banner = document.getElementById('my-banner');
    if (banner) {
      banner.alerts = [ // ✅ Array via JS
        { product: 'Acrylique', message: 'Rupture', severity: 'critical' }
      ];
    }
  });
}, []);
```

---

## 📚 Documentation Complète

Pour plus de détails, voir :
- **Storybook du Design System** : http://localhost:6006/ (quand lancé)
- **Guide d'intégration** : `stockhub_design_system/documentation/integration/STOCKHUB-V2-INTEGRATION.md`
- **Types TypeScript** : `src/types/web-components.d.ts`

---

## 🔄 Mise à Jour

Pour mettre à jour vers la dernière version :

```bash
npm install git+https://github.com/SandrineCipolla/stockhub_design_system.git#feature/stockhub-v2-components --force
```

Ou utiliser un tag spécifique :

```bash
npm install git+https://github.com/SandrineCipolla/stockhub_design_system.git#v2.1.0 --force
```

---

## 🐛 Dépannage

### Le composant ne s'affiche pas

1. Vérifier l'import : `import '@stockhub/design-system';` dans `main.tsx`
2. Vérifier la console : erreur de syntaxe ?
3. Vérifier le nom du composant (kebab-case) : `sh-button` pas `shButton`

### L'événement ne se déclenche pas

1. Utiliser le nom complet : `onsh-button-click` (pas `onClick`)
2. Vérifier la console : `CustomEvent` émis ?

### Style cassé

1. Vérifier `data-theme="dark"` sur le parent
2. Vérifier que les CSS variables sont chargées

---


**Auteure** : Sandrine Cipolla
