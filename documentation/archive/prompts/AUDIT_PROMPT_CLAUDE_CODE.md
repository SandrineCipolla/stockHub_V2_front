# Prompt Claude Code — Audit StockHub V2 Front

> **Mode d'emploi** : Copie-colle ce contenu directement dans ton terminal Claude Code
> (`claude` dans le dossier `stockHub_V2_front`). Demande-lui de traiter un audit à la fois.

---

## CONTEXTE

Je suis en certification RNCP Niveau 7 (Expert en Architecture et Développement Logiciel).
Mon front StockHub V2 utilise :

- Un Design System externe : `@stockhub/design-system` v1.3.1 avec **18 Web Components Lit**
  (sh-button, sh-card, sh-header, sh-footer, sh-badge, sh-input, sh-metric-card, sh-stat-card,
  sh-search-input, sh-quantity-input, sh-status-badge, sh-page-header, sh-ia-alert-banner,
  sh-stock-card, sh-stock-prediction-card, sh-icon, sh-logo, sh-text)
- Des composants React dans src/components/

Mon encadrant me signale un **mélange incohérent** entre WC Lit et composants React natifs.

Je veux un audit SANS modifier le code pour l'instant — diagnostic d'abord.

---

## AUDIT 1 — Mélange WC Lit / React ⚡ PRIORITÉ 1

1. Liste tous les fichiers .tsx/.ts dans src/components/ (avec chemin relatif)
2. Pour chaque fichier, détermine sa catégorie :
   - **WRAPPER** : composant React qui wrapp un WC Lit du DS
   - **REACT PUR** : composant React dont la fonction est couverte par un WC Lit → duplication
   - **REACT LÉGITIME** : composant React qui gère de la logique métier/state → pas un problème
   - **HYBRIDE** : mélange UI DS + logique React dans le même fichier
3. Produis un tableau markdown :

| Fichier | Catégorie | WC Lit équivalent | Impact |
| ------- | --------- | ----------------- | ------ |
| ...     | ...       | ...               | ...    |

---

## AUDIT 2 — CE2.3.1 : Veille technologique et choix de stack

Inspecte package.json et la documentation existante (README, docs/) :

1. Y a-t-il un fichier documentant le choix de stack avec alternatives considérées ?
2. Y a-t-il une mention de veille technologique avec sources identifiées ?
3. Les tendances suivantes sont-elles mentionnées quelque part : signals, server components, edge rendering, islands architecture, progressive enhancement ?

Résultat : ✅ présent / ⚠️ partiel / ❌ manquant — avec emplacement exact si trouvé.

---

## AUDIT 3 — CE2.3.2 : Intégration design → code

1. Y a-t-il un fichier de design tokens documenté (tokens.json, variables CSS) ?
2. Les composants utilisent-ils les tokens du DS plutôt que des valeurs hardcodées ?
   → Scan grep : cherche des couleurs hex (#...) ou px hardcodés dans src/components/
3. Y a-t-il une documentation maquette → code (comparaisons Figma/rendu) ?

Résultat : ✅ / ⚠️ / ❌ pour chaque point.

---

## AUDIT 4 — CE2.3.3 : Standards et techniques modernes

1. **HTML sémantique** : grep dans src/ pour compter `<div` vs `<article`, `<nav`, `<main`,
   `<section`, `<dialog`, `<details`. Ratio div / éléments sémantiques ?
2. **CSS moderne** : y a-t-il du `@layer`, container queries, `has()`, logical properties
   dans index.css ou les fichiers CSS ?
3. **TypeScript strict** : vérifie tsconfig.json — `strict: true` ? `noUncheckedIndexedAccess` ?
4. **Performance** : y a-t-il du lazy loading (`React.lazy`, `Suspense`) dans App.tsx ou les routes ?
5. **SEO** : y a-t-il des balises meta, Open Graph, sitemap.xml dans public/ ?

Résultat : ✅ / ⚠️ / ❌ pour chaque point.

---

## AUDIT 5 — CE2.3.4 : Frameworks et bibliothèques

1. Analyse package.json : liste toutes les dépendances (prod + dev) avec leur rôle
2. Y a-t-il des dépendances redondantes ou injustifiables ?
3. Architecture : y a-t-il une séparation claire hooks/ types/ utils/ pages/ components/ ?
4. Gestion d'état : comment est géré le state (useState, Context, Zustand, autre) ?
5. Data fetching : React Query, fetch natif, axios ? Où est-ce centralisé ?

Résultat : tableau des dépendances + points d'attention.

---

## AUDIT 6 — CE2.3.5 : Accessibilité

1. Y a-t-il un rapport d'audit accessibilité dans documentation/ ?
2. Dans les composants React : présence d'attributs aria-*, role, alt, htmlFor ?
3. Grep : composants sans aria-label ni role sur des éléments interactifs non-sémantiques
4. Headings : quelle est la hiérarchie h1→h2→h3 dans les pages principales ?

Résultat : ✅ / ⚠️ / ❌.

---

## AUDIT 7 — CE2.2.3 à CE2.2.6 : Qualité, sécurité, versionning

1. **Linting** : `npm run lint` → résumé erreurs/warnings
2. **Tests** : `npm run test:coverage` → coverage global + fichiers sous 80%
3. **Git** : `git log --oneline -20` → commits lisibles et conventionnels ?
4. **Sécurité** : grep dans src/ pour patterns suspects (console.log avec données,
   clés API hardcodées, localStorage avec données sensibles)
5. **CI/CD** : liste les fichiers dans .github/workflows/ et décris chaque pipeline
6. **RGPD** : y a-t-il une gestion du consentement cookies visible ?

Résultat : ✅ / ⚠️ / ❌ + commandes lancées.

---

## FORMAT DE SORTIE ATTENDU

Pour chaque audit :

- Titre + critère RNCP associé
- Résultats concrets (chemins de fichiers, extraits, métriques)
- Score global : ✅ Conforme / ⚠️ Partiel / ❌ Non conforme
- Actions recommandées classées :
  - 🔴 Bloquant (impact jury / note)
  - 🟡 Important (bonne pratique RNCP 7)
  - 🟢 Bonus (nice to have)

**⛔ NE PAS MODIFIER LE CODE** — diagnostic uniquement.
Commence par AUDIT 1, attends ma validation avant de passer aux suivants.
