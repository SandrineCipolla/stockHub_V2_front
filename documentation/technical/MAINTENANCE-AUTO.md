# 🧹 Guide de Maintenance Automatique du Code

## Scripts de nettoyage disponibles

### 🔍 Détection du code mort

```bash
npm run clean:deadcode
```

Utilise **Knip** pour détecter :

- Fichiers inutilisés
- Dépendances non utilisées
- Exports et types non référencés
- Code mort

### 🔧 Correction automatique

```bash
npm run clean:fix
```

Corrige automatiquement certains problèmes détectés par Knip.

### ✅ Vérification complète avant commit

```bash
npm run clean:check
```

Exécute dans l'ordre :

1. `npm run type-check` - Vérification TypeScript
2. `npm run lint` - Vérification ESLint
3. `npm run clean:deadcode` - Détection code mort

### 🚀 Pre-commit hook

```bash
npm run pre-commit
```

Même chose que `clean:check` - à utiliser avant chaque commit.

## 🚨 Détection stricte des types dangereux

### 🔍 Détection des 'as const'

```bash
npm run detect:as-const
```

Script personnalisé qui détecte tous les usages de `as const` dans le projet :

- Analyse tous les fichiers `.ts` et `.tsx`
- Ignore les dossiers `node_modules`, `dist`, `coverage`, tests
- Affiche la ligne et la position exacte de chaque usage
- **Échoue si des usages sont trouvés** (exit code 1)

### 🔍 Vérification stricte complète

```bash
npm run check:strict
```

Combine la détection `as const` + ESLint strict :

1. `npm run detect:as-const` - Détection 'as const'
2. `npm run lint` - Détection autres casts dangereux

### 🚨 Configuration ESLint stricte activée

```javascript
// eslint.config.js
'@typescript-eslint/no-explicit-any': 'error', // Interdit 'any'
'@typescript-eslint/consistent-type-assertions': [
  'error',
  { assertionStyle: 'never' } // Interdit TOUS les casts 'as'
],
'@typescript-eslint/ban-ts-comment': 'error', // Interdit @ts-ignore
```

**Ce qui est détecté automatiquement :**

- ❌ `as const`, `as any`, `as string`, etc. → **Erreur**
- ❌ `any` explicite → **Erreur**
- ❌ `@ts-ignore`, `@ts-nocheck` → **Erreur**
- ❌ Casts sur objets littéraux → **Erreur**

**Ce qui reste autorisé :**

- ✅ `variable!` (non-null assertions) → **OK**
- ✅ Tests et fixtures → **Exclus de la vérification**

## Configuration Knip

Le fichier `knip.json` configure Knip pour :

- ✅ Ignorer le dossier `src/test/**` (fixtures de test)
- ✅ Ignorer `stockhub_design_system` (en cours d'implémentation)
- ✅ Ignorer `documentation/**` et `audits/**`
- ✅ Détecter le code vraiment inutilisé

## Alternatives recommandées aux 'as const'

### ❌ Éviter

```typescript
const THEMES = ['light', 'dark'] as const;
const EASING = [0.25, 0.46, 0.45, 0.94] as const;
const CONFIG = { debug: true } as const;
```

### ✅ Utiliser à la place

```typescript
// Option 1: satisfies (TypeScript 4.9+)
const THEMES = ['light', 'dark'] satisfies readonly string[];
const EASING = [0.25, 0.46, 0.45, 0.94] satisfies readonly number[];

// Option 2: Object.freeze
const THEMES = Object.freeze(['light', 'dark']);
const CONFIG = Object.freeze({ debug: true });

// Option 3: Types explicites
type Theme = 'light' | 'dark';
const THEMES: readonly Theme[] = ['light', 'dark'];

// Option 4: Fonctions de validation (type guards)
const isTheme = (theme: string): theme is Theme => {
  return THEMES.some(validTheme => validTheme === theme);
};
```

## Types/Exports actuellement "inutilisés" (mais gardés)

### Types utilitaires (préparés pour l'évolution)

- `AsyncState`, `ValidationError` - Types API futures
- `RequiredKeys`, `Optional`, `WithId` - Types utilitaires
- `EventHandler`, `ValueChangeHandler` - Handlers futures

### Constantes UI (préparées pour le design system)

- `BUTTON_SIZES`, `BADGE_VARIANTS` - Variantes UI
- `isTheme`, `isButtonVariant` - Validateurs types

### Utilitaires stock (possiblement futures)

- `STOCK_STATUS` - Objet groupé des statuts
- `getStatusConfig`, `sortByStatusPriority` - Utilitaires tri

## Maintenance recommandée

### 📅 Quotidien (avant commit)

```bash
npm run pre-commit
# ou pour une vérification stricte complète
npm run check:strict
```

### 📅 Hebdomadaire (nettoyage approfondi)

```bash
npm run clean:deadcode
npm run detect:as-const
# Examiner les résultats et décider quoi supprimer/corriger
```

### 📅 Mensuel (audit complet)

```bash
npm run audit:full
npm run clean:deadcode
npm run detect:as-const
npm audit
```

## Automatisation future

### Hooks Git (optionnel)

Pour automatiser avant chaque commit :

1. Installer husky : `npm install --save-dev husky`
2. Configurer pre-commit hook avec `npm run check:strict`
3. Le script sera exécuté automatiquement

### CI/CD

Ajouter dans le pipeline :

```yaml
- name: Check code cleanliness and type safety
  run: npm run check:strict
```

## 🔧 Outils installés

### Knip v5.66.2

- **Fonction** : Détection du code mort
- **Config** : `knip.json`
- **Usage** : `npm run clean:deadcode`

### ESLint v9.38.0 + typescript-eslint v8.46.2

- **Fonction** : Détection des casts TypeScript dangereux
- **Config** : `eslint.config.js` (stricte)
- **Usage** : `npm run lint`

### Script personnalisé detect-as-const.mjs

- **Fonction** : Détection spécifique des `as const`
- **Localisation** : `scripts/detect-as-const.mjs`
- **Usage** : `npm run detect:as-const`

---

_Guide mis à jour le 22/01/2025_  
_Knip v5.66.2 | ESLint v9.38.0 | Script as const personnalisé_
