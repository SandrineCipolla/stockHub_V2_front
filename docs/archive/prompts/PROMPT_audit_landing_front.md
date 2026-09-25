# Audit Landing Page — `stockHub_V2_front`

## Contexte

Je prépare une **landing page publique** pour StockHub V2 : une page accessible à l'URL `/` sans authentification, qui présente l'application avant le login Azure B2C. Elle doit utiliser le design system existant et refléter les vraies fonctionnalités implémentées.

**Ce qu'on sait déjà (audit `stockhub_back` effectué) :**

- Le seed existe et est fonctionnel — 3 stocks, 9 items, 1 collaborateur, sous-stocks intentionnels
- Les catégories réelles sont : `alimentation`, `hygiene`, `artistique` (enum `StockCategory`)
- Un compte démo dédié sera configuré via `SEED_OWNER_EMAIL`
- Pas d'ItemHistory pour l'instant — le module IA viendra plus tard (issue #123)

Avant toute implémentation, j'ai besoin d'un audit complet de l'existant côté front.

## Ce que tu dois faire

**Ne pas écrire de code pour l'instant.** L'objectif de cette session est uniquement d'inventorier et de rendre compte.

### 1. Audit du routing actuel

- Lire le fichier de routing principal (`App.tsx`, `router.tsx`, ou équivalent)
- Quelle est la route `/` actuellement ? Redirige-t-elle directement vers Azure B2C ?
- Où est configuré le guard d'authentification MSAL ?
- Comment distinguer les routes publiques des routes protégées dans l'architecture actuelle ?

### 2. Audit des fonctionnalités réelles

- Lister toutes les pages existantes (`src/pages/`) avec leur rôle
- Lister les fonctionnalités **effectivement implémentées et connectées au back** (pas les TODO, pas les mocks)
- Pour chaque fonctionnalité, formuler un bénéfice utilisateur en une phrase (ex : pas "gestion CRUD des stocks" mais "organisez vos produits par pièce")
- Ces fonctionnalités seront les cartes de la section Features de la landing page — **ne garder que ce qui existe vraiment**

### 3. Audit du design system disponible

- Quels composants du design system Lit (`stockhub_design_system`) sont déjà importés et utilisés dans le front ?
- Quelles CSS variables sont disponibles (lire `src/tokens/design-tokens.css` ou équivalent) ?
- Y a-t-il des composants React existants réutilisables pour la landing (boutons, cartes, badges…) ?
- Quel est le thème par défaut : dark ou light ?

### 4. Audit des assets et contenus existants

- Y a-t-il un logo SVG ou fichier de marque quelque part ?
- Y a-t-il des screenshots ou illustrations de l'app déjà disponibles ?
- Quelle est la baseline / tagline du projet si elle existe (README, meta tags…) ?

### 5. Audit des tests et accessibilité

- Comment sont organisés les tests de composants pages existants ?
- Y a-t-il un pattern de test établi pour les pages (fichier `*.test.tsx` colocalisé, dossier `__tests__`…) ?
- Quelle configuration Lighthouse CI est en place ?

## Livrable attendu

Un rapport structuré avec :

- Le routing actuel et ce qu'il faudra modifier pour rendre `/` public
- La liste des **vraies fonctionnalités** à présenter sur la landing (formulées en bénéfice utilisateur)
- Les composants et tokens réutilisables disponibles
- Les fichiers à créer et les fichiers à modifier
- Les points d'attention (accessibilité, tests, cohérence design system)

**Ne pas implémenter avant validation du rapport.**
