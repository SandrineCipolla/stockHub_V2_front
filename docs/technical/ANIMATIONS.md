# 🎬 Documentation des Animations - StockHub V2

## 📋 Vue d'ensemble

StockHub V2 utilise **Framer Motion** pour des micro-animations fluides et performantes. Toutes les animations respectent les principes d'accessibilité WCAG et la préférence `prefers-reduced-motion`.

---

## 🎯 Principes de design

### Performance

- **Objectif FPS** : >55 FPS en moyenne
- **Total Blocking Time** : 0ms
- **Lighthouse Performance** : 99/100

### Accessibilité

- Support complet de `prefers-reduced-motion`
- Durées réduites à 0.01s en mode accessibility
- Tests automatisés d'accessibilité

### Scalabilité

- Performance maintenue jusqu'à 500+ stocks
- Dégradation < 1% (excellent)
- Layout animations optimisées

---

## 🎨 Composants Animés

### 1. StockCard

Composant de carte de stock avec animations entrance, hover et exit.

#### Animations

**Entrance** (apparition en cascade)

```typescript
// Constantes (src/constants/animations.ts)
INITIAL_Y_OFFSET: 50,      // Offset vertical initial
INITIAL_SCALE: 0.95,        // Scale initial
ENTRANCE_DURATION: 0.6,     // Durée d'apparition
CASCADE_DELAY: 0.12,        // Délai entre chaque carte
EASING: [0.25, 0.46, 0.45, 0.94] // easeOutQuad
```

**Comportement** :

- Apparition depuis le bas (translateY: 50px → 0)
- Scale-in subtil (0.95 → 1.0)
- Délai échelonné basé sur l'index (`index * 0.12s`)
- Easing natural (easeOutQuad)

**Hover**

```typescript
HOVER_SCALE: 1.02,          // Légère élévation
HOVER_Y_OFFSET: -4,         // Décalage vers le haut
HOVER_DURATION: 0.2,        // Transition rapide
```

**Comportement** :

- Scale de 1.02x (élévation subtile)
- Décalage -4px vers le haut
- Background coloré selon statut (10% opacité)
- Bordure intensifiée

**Exit** (disparition)

```typescript
EXIT_Y_OFFSET: -16,         // Offset vers le haut
EXIT_DURATION: 0.3,         // Durée de sortie
EXIT_SCALE: 0.95,           // Scale final
```

**Comportement** :

- Disparition vers le haut (translateY: 0 → -16px)
- Scale-out (1.0 → 0.95)
- Fade-out (opacity: 1 → 0)

#### Implémentation

**Fichier** : `src/components/dashboard/StockCard.tsx:43`

```tsx
<motion.article
  initial={{
    opacity: 0,
    y: INITIAL_Y_OFFSET,
    scale: INITIAL_SCALE,
  }}
  animate={{
    opacity: 1,
    y: 0,
    scale: 1,
  }}
  exit={{
    opacity: 0,
    y: EXIT_Y_OFFSET,
    scale: EXIT_SCALE,
  }}
  transition={{
    duration: shouldReduceMotion ? REDUCED_MOTION_DURATION : ENTRANCE_DURATION,
    delay: shouldReduceMotion ? 0 : index * CASCADE_DELAY,
    ease: EASING,
  }}
  whileHover={{ scale: HOVER_SCALE, y: HOVER_Y_OFFSET }}
>
  {/* Contenu de la carte */}
</motion.article>
```

#### Tests

**Fichiers** :

- `src/components/dashboard/__tests__/StockCard.test.tsx`
- `scripts/test-performance-fps.mjs` (Hover test)
- `scripts/test-reduced-motion.mjs`

**Coverage** : 99.19% (34 tests)

---

### 2. StockGrid

Conteneur de grille avec layout animations pour filtrage/tri fluide.

#### Animations

**Layout** (réorganisation automatique)

```typescript
layout={true}  // Active les transitions de position automatiques
```

**Comportement** :

- Transitions automatiques lors de changements de layout
- Réorganisation fluide lors du filtrage
- Réorganisation fluide lors du tri
- Effet cascade préservé pour l'apparition initiale

#### Implémentation

**Fichier** : `src/components/dashboard/StockGrid.tsx:23`

```tsx
<motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <AnimatePresence mode="popLayout">
    {stocks.map((stock, index) => (
      <StockCard
        key={stock.id}
        stock={stock}
        index={index} // Pour le délai en cascade
        onDelete={onDelete}
      />
    ))}
  </AnimatePresence>
</motion.div>
```

**AnimatePresence** :

- Mode `popLayout` : retire l'élément du layout avant animation exit
- Transitions fluides lors de l'ajout/suppression de cartes

#### Tests

**Fichiers** :

- `src/components/dashboard/__tests__/StockGrid.test.tsx`
- `scripts/test-performance-fps.mjs` (Filtrage test)

**Coverage** : 100% (31 tests)

---

### 3. MetricCard

Composant de métrique avec compteur animé (CountUp).

#### Animations

**Compteur animé**

```typescript
COUNTER_DURATION: 1.2,      // Durée de l'animation du compteur
EASING_FACTOR: -10,         // Facteur easeOutExpo
```

**Comportement** :

- Comptage depuis 0 jusqu'à la valeur finale
- Easing `easeOutExpo` (ralentissement progressif)
- Parsing intelligent des préfixes/suffixes (+, -, %, €, $)
- Respecte `prefers-reduced-motion`

#### Implémentation

**Fichier** : `src/components/dashboard/MetricCard.tsx:46`

```tsx
<CountUp
  start={0}
  end={parsedValue.numericValue}
  duration={enableAnimation && !shouldReduceMotion ? COUNTER_DURATION : 0}
  prefix={parsedValue.prefix}
  suffix={parsedValue.suffix}
  separator=" "
  decimals={parsedValue.decimals}
  easingFn={(t, b, c, d) => {
    return c * Math.pow(2, EASING_FACTOR * t) + b;
  }}
/>
```

**Prop `enableAnimation`** :

- Permet de désactiver l'animation dans les tests
- Valeur par défaut : `true`

#### Parsing des valeurs

**Fonction** : `src/utils/valueParser.ts`

Supporte :

- Nombres simples : `42`
- Préfixes : `+10`, `-5`
- Suffixes : `85%`, `1250€`, `$99`
- Décimales : `12.5K`

#### Tests

**Fichiers** :

- `src/components/dashboard/__tests__/MetricCard.test.tsx`
- `scripts/test-performance-fps.mjs` (CountUp test)
- `scripts/test-reduced-motion.mjs`

**Coverage** : 100% (15-20 tests)

---

## 🔧 Hook d'accessibilité

### useReducedMotion

Hook React qui détecte la préférence `prefers-reduced-motion` de l'utilisateur.

#### Implémentation

**Fichier** : `src/hooks/useReducedMotion.ts`

```typescript
export function useReducedMotion(): boolean {
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setShouldReduceMotion(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent | MediaQueryList) => {
      setShouldReduceMotion(event.matches);
    };

    // Support anciens navigateurs
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);

  return shouldReduceMotion;
}
```

#### Utilisation

```tsx
import { useReducedMotion } from '@/hooks/useReducedMotion';

function MyComponent() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      animate={{ opacity: 1 }}
      transition={{
        duration: shouldReduceMotion ? 0.01 : 0.6,
      }}
    />
  );
}
```

---

## 📊 Tests de Performance

### Tests automatisés

**Script FPS** : `scripts/test-performance-fps.mjs`

- Mesure FPS pendant 5 scénarios
- Seuil : >55 FPS en moyenne
- **Résultat** : 60.81 FPS ✅

**Script datasets** : `scripts/test-animations-datasets.mjs`

- Teste 4 tailles de datasets (5, 50, 200, 500 stocks)
- Seuil : >55 FPS en moyenne
- **Résultat** : 60.93 FPS, dégradation 0.8% ✅

**Script reduced motion** : `scripts/test-reduced-motion.mjs`

- Vérifie le respect de `prefers-reduced-motion`
- **Résultat** : Tous les tests passent ✅

**Script daltonisme** : `scripts/test-daltonisme.mjs`

- Teste contraste WCAG (5 statuts × 2 thèmes)
- Simule 4 types de daltonisme (Protanopie, Deutéranopie, Tritanopie, Achromatopsie)
- Vérifie différentiabilité des couleurs (Delta E)
- **Résultats** :
  - Contraste : 8/10 tests passent ✅
  - Deutéranopie : 10/10 paires ⭐
  - Protanopie : 9/10 paires ✅
  - Tritanopie : 9/10 paires ✅
  - Achromatopsie : 4/10 paires (compensé par icônes) ✅
- **Conclusion** : Application pleinement utilisable en vision monochrome grâce aux indicateurs non-couleur (icônes, labels, bordures, ARIA) ✅

### Résultats Lighthouse

**Audit du 20/10/2025**

- **Performance** : 99/100 ✅
- **Accessibility** : 96/100 ✅
- **FCP** : 1.5s
- **LCP** : 1.5s
- **TBT** : 0ms ⭐
- **CLS** : 0.055
- **Speed Index** : 1.5s

### Commandes

```bash
# Lancer tous les tests de performance
npm run build && npm run preview

# Dans un autre terminal
node scripts/test-performance-fps.mjs
node scripts/test-animations-datasets.mjs
node scripts/test-reduced-motion.mjs
node scripts/test-daltonisme.mjs

# Lighthouse audit
npx lighthouse http://localhost:4173 \\
  --output json \\
  --output-path ./docs/metrics/lighthouse-report-2025-10-20.json \\
  --only-categories=performance,accessibility
```

---

## 🎨 Guide de style

### Durées recommandées

- **Très rapide** (hover, focus) : 0.2s
- **Rapide** (exit, transitions) : 0.3s
- **Normale** (entrance, layout) : 0.6s
- **Lente** (compteurs, loaders) : 1.2s

### Easings recommandés

- **easeOutQuad** : `[0.25, 0.46, 0.45, 0.94]` (défaut, naturel)
- **easeOutExpo** : `-10` (ralentissement progressif, compteurs)
- **easeInOutCubic** : `[0.65, 0.05, 0.36, 1]` (transitions complexes)

### Délais en cascade

```typescript
// Bon (fluide)
delay: index * 0.12;

// Trop rapide (saccadé)
delay: index * 0.05;

// Trop lent (ennuyeux)
delay: index * 0.3;
```

---

## ✅ Checklist d'implémentation

Lorsque vous ajoutez une nouvelle animation :

- [ ] Utiliser les constantes `src/constants/animations.ts`
- [ ] Respecter `useReducedMotion` hook
- [ ] Tester avec `prefers-reduced-motion: reduce`
- [ ] Vérifier les FPS (>55 FPS)
- [ ] Ajouter des tests unitaires
- [ ] Documenter dans ce fichier
- [ ] Vérifier l'accessibilité (Lighthouse)
- [ ] Tester avec plusieurs tailles de datasets

---

## 🚀 Bonnes pratiques

### Performance

1. **Privilégier transform et opacity**

   ```tsx
   // ✅ Bon (GPU-accelerated)
   animate={{ scale: 1.02, y: -4, opacity: 1 }}

   // ❌ Mauvais (reflow/repaint)
   animate={{ width: 100, marginTop: 20 }}
   ```

2. **Utiliser will-change avec parcimonie**

   ```tsx
   // ✅ Bon (uniquement pendant hover)
   whileHover={{ willChange: 'transform' }}

   // ❌ Mauvais (toujours actif)
   style={{ willChange: 'transform' }}
   ```

3. **Layout animations pour repositionnement**

   ```tsx
   // ✅ Bon (smooth repositioning)
   <motion.div layout>

   // ❌ Mauvais (pas de transition)
   <div>
   ```

### Accessibilité

1. **Toujours respecter reduced motion**

   ```tsx
   const shouldReduceMotion = useReducedMotion();

   transition={{
     duration: shouldReduceMotion ? 0.01 : 0.6
   }}
   ```

2. **Fournir des alternatives visuelles (stratégie multi-indicateurs)**
   - 🎨 Couleurs (bordures colorées selon statut)
   - 🔣 Icônes de statut (✓, ⚠, !, ✕, ↑)
   - 📝 Labels textuels (toujours présents)
   - 🎭 Attributs ARIA (role="status", aria-label)
   - ✅ **Résultat** : Application utilisable même en vision monochrome

3. **Tester manuellement**
   - Activer `prefers-reduced-motion` dans les DevTools
   - Vérifier que l'UI reste utilisable

---

## 📚 Ressources

- [Framer Motion Documentation](https://www.framer.com/motion/)
- [WCAG 2.1 - Animation from Interactions](https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions.html)
- [Web Animations Performance](https://developer.mozilla.org/en-US/docs/Web/Performance/Animation_performance_and_frame_rate)
- [React CountUp](https://github.com/glennreyes/react-countup)

---

## 📝 Historique des modifications

### Version 1.0 (20/10/2025)

- ✅ Implémentation Framer Motion
- ✅ Animations StockCard (entrance, hover, exit)
- ✅ Animations StockGrid (layout)
- ✅ Compteurs animés MetricCard (CountUp)
- ✅ Hook useReducedMotion
- ✅ Tests performance automatisés (FPS, datasets, reduced motion)
- ✅ Tests accessibilité daltonisme (4 types + contraste WCAG)
- ✅ Documentation complète

---

**Développé par** : Sandrine Cipolla
**Projet** : StockHub V2 - RNCP 7
**Date** : Octobre 2025
