# 📚 Guide d'utilisation du Logger - StockHub V2

Ce guide montre comment utiliser le système de logging intelligent pour remplacer les `console.*` classiques.

---

## 🎯 Pourquoi utiliser le logger ?

### ❌ Problème avec `console.log` direct

```typescript
// AVANT - Avec drop_console: true dans Terser
try {
  await saveStock(stock);
} catch (error) {
  console.error('Failed to save stock:', error);
  // ❌ SUPPRIMÉ en production → Vous êtes aveugle face aux bugs
}
```

### ✅ Solution avec le logger

```typescript
// APRÈS - Avec le logger intelligent
import { logger } from '@/utils/logger';

try {
  await saveStock(stock);
} catch (error) {
  logger.error('Failed to save stock:', error);
  // ✅ VISIBLE en production → Débogage possible
}
```

---

## 📖 API du Logger

### `logger.debug(...args)`

**Usage :** Logs de débogage détaillés  
**Visible :** 🟢 DEV uniquement  
**Format DEV :** `🐛 [DEBUG] ...`

```typescript
logger.debug('User clicked button', { userId: 123, timestamp: Date.now() });
```

### `logger.log(...args)`

**Usage :** Informations générales  
**Visible :** 🟢 DEV uniquement  
**Format DEV :** `ℹ️ [INFO] ...`

```typescript
logger.log('Fetching stocks from API...');
logger.log('Stocks loaded:', stocks.length);
```

### `logger.warn(...args)`

**Usage :** Avertissements importants  
**Visible :** 🟢 DEV + 🟡 PRODUCTION  
**Format DEV :** `⚠️ [WARN] ...`

```typescript
logger.warn('Stock level is low', { stockId: 'ABC123', quantity: 5 });
```

### `logger.error(...args)`

**Usage :** Erreurs critiques  
**Visible :** 🟢 DEV + 🔴 PRODUCTION  
**Format DEV :** `❌ [ERROR] ...`

```typescript
logger.error('Failed to save stock:', error);
```

### `logger.perf(message, duration, unit?)`

**Usage :** Mesures de performance  
**Visible :** 🟢 DEV uniquement  
**Format DEV :** `⚡ [PERF] message: duration unit`

```typescript
const start = performance.now();
await fetchData();
const duration = performance.now() - start;
logger.perf('Data fetch completed', Math.round(duration), 'ms');
// Affiche : "⚡ [PERF] Data fetch completed: 245ms"
```

### `logger.group(label)` / `logger.groupEnd()`

**Usage :** Organiser les logs en groupes  
**Visible :** 🟢 DEV uniquement

```typescript
logger.group('Stock Update Process');
logger.log('Step 1: Validation');
logger.log('Step 2: Save to database');
logger.log('Step 3: Update cache');
logger.groupEnd();
```

---

## 💡 Exemples pratiques

### Exemple 1 : Sauvegarde avec gestion d'erreur

```typescript
import { logger } from '@/utils/logger';

async function saveStock(stock: Stock) {
  logger.debug('Saving stock:', stock); // ✅ Seulement en dev

  try {
    const response = await fetch('/api/stocks', {
      method: 'POST',
      body: JSON.stringify(stock),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    logger.log('Stock saved successfully'); // ✅ Seulement en dev
    return await response.json();
  } catch (error) {
    logger.error('Failed to save stock:', error); // ✅ Visible en production
    throw error;
  }
}
```

### Exemple 2 : Mise à jour avec logs groupés

```typescript
import { logger } from '@/utils/logger';

function updateStock(oldStock: Stock, newStock: Stock) {
  logger.group('Stock Update');
  logger.log('Old value:', oldStock);
  logger.log('New value:', newStock);
  logger.log('Changed fields:', getChangedFields(oldStock, newStock));
  logger.groupEnd();

  // ... logique de mise à jour ...
}

function getChangedFields(oldStock: Stock, newStock: Stock): string[] {
  return Object.keys(newStock).filter(
    key => oldStock[key as keyof Stock] !== newStock[key as keyof Stock]
  );
}
```

### Exemple 3 : Mesure de performance automatique

```typescript
import { measurePerf } from '@/utils/logger';

async function fetchStocks() {
  // La fonction measurePerf log automatiquement la durée d'exécution
  return await measurePerf('Fetch all stocks', async () => {
    const response = await fetch('/api/stocks');
    return response.json();
  });

  // En dev, affiche : "⚡ [PERF] Fetch all stocks: 245ms"
  // En prod, n'affiche rien (pas de pollution)
}
```

### Exemple 4 : Warnings conditionnels

```typescript
import { logger } from '@/utils/logger';

function checkStockLevel(stock: Stock) {
  const minThreshold = stock.minThreshold ?? 0;

  if (stock.quantity < minThreshold) {
    logger.warn('Stock level is critically low', {
      id: stock.id,
      name: stock.name,
      quantity: stock.quantity,
      minThreshold: minThreshold,
    });
    // ✅ Ce warning sera visible en production
    // L'utilisateur peut le copier et vous l'envoyer pour diagnostic
  }
}
```

---

## 🔄 Migration depuis console.\*

### Règles de conversion

| Ancien            | Nouveau          | Visibilité     |
| ----------------- | ---------------- | -------------- |
| `console.debug()` | `logger.debug()` | DEV uniquement |
| `console.log()`   | `logger.log()`   | DEV uniquement |
| `console.info()`  | `logger.log()`   | DEV uniquement |
| `console.warn()`  | `logger.warn()`  | DEV + PROD     |
| `console.error()` | `logger.error()` | DEV + PROD     |

### Checklist de migration

- [ ] Remplacer `console.log()` par `logger.log()` pour les infos de debug
- [ ] Remplacer `console.error()` par `logger.error()` pour les erreurs **CRITIQUE**
- [ ] Remplacer `console.warn()` par `logger.warn()` pour les avertissements
- [ ] Utiliser `measurePerf()` pour mesurer les performances
- [ ] Utiliser `logger.group()` pour organiser les logs complexes

---

## 🎁 Avantages

✅ **Débogage en production**

- Les erreurs critiques restent visibles
- Les utilisateurs peuvent copier les erreurs de leur console

✅ **Pas de pollution**

- Les logs de debug sont automatiquement désactivés en production
- Console propre pour l'utilisateur final

✅ **Fonctionnalités avancées**

- Mesure automatique des performances avec `measurePerf()`
- Organisation des logs avec `logger.group()`
- Logs formatés avec emojis en développement

✅ **Configuration simple**

- Pas besoin de `drop_console: true` dans Vite/Terser
- Contrôle fin via `import.meta.env.DEV`

---

## 📝 Configuration Vite

Le fichier `vite.config.ts` est configuré pour **garder** les `console.*` en production :

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false, // ✅ On garde les console.*
        drop_debugger: true, // ❌ On supprime les debugger
      },
    },
  },
});
```

Pourquoi ? Parce que le logger utilise les `console.*` de manière intelligente, en ne loggant que ce qui est nécessaire selon l'environnement.

---

**Créé le :** 21 octobre 2025  
**Auteur :** Sandrine Cipolla  
**Projet :** StockHub V2
