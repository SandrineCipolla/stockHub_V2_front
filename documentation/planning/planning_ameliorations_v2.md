# 📅 Planning Améliorations Frontend V2 - StockHub

## 🎯 Objectif

Implémenter les améliorations demandées par l'encadrante sur le Frontend V2 (note actuelle : 85/100) pour atteindre l'excellence avant la connexion backend.

### 📊 Retours encadrante à traiter

**Points forts validés** ✅
- Design system mature
- Performance excellente (Lighthouse 99/100)
- Accessibilité conforme (96/100)
- Architecture React 19 + TypeScript solide

**Améliorations prioritaires** ⚠️
- [ ] Tests unitaires (sécurisation code)
- [ ] Créativité visuelle (différenciation cartes stocks)
- [ ] Micro-animations dashboard
- [ ] IA plus concrète/visible

---

## ⏰ Disponibilité

- **Semaine** : 2 soirées × 2h = 4h/semaine
- **Weekend** : 2 soirées × 2h = 4h/weekend
- **Total planning** : 12h sur 2 semaines

---

## 🗓️ PLANNING DÉTAILLÉ

### 📅 **SEMAINE 1 - Tests Unitaires (4h)**

#### **Soirée 1 - Mardi (2h) : Setup Tests + Composants UI**
- [x] **Installation dépendances** (30min)
  ```bash
  npm install -D vitest @vitest/ui @testing-library/react @testing-library/user-event jsdom
  ```
- [x] **Configuration Vitest** (30min)
- [x] Créer `vitest.config.ts`
- [x] Mettre à jour `package.json` (scripts tests)
- [x] **Tests composants UI** (60min)
- [x] Tests Button (variantes, disabled, onClick)
- [x] Tests Card (props, hover, accessibility)
- [x] Tests Badge (statuts, couleurs)

#### **Soirée 2 - Jeudi (2h) : Tests Principaux + Coverage**
- [x] **Tests Dashboard** (60min)
  - [x] Tests métriques affichage
  - [x] Tests composants responsives
  - [x] Tests navigation
- [x] **Atteindre >80% coverage** (60min)
  - [x] Tests hooks personnalisés (si existants)
  - [x] Tests utils/helpers
  - [x] Vérifier coverage `npm run test:coverage`

**✅ Validation Semaine 1** :
- [x] Tous les tests passent (`npm run test`)
- [x] Coverage ≥ 80%
- [ ] CI/CD fonctionne (si configuré) => je crois que sur vercel y a une ci/cd?

---

### 🎨 **WEEKEND 1 - Créativité & Animations (4h)**

#### **Samedi soir (2h) : Créativité Visuelle**
- [ ] **Système de statuts enrichi** (60min)
  - [ ] Définir les statuts stocks (optimal, low, critical, out_of_stock, overstocked)
  - [ ] Créer palette couleurs par statut
  - [ ] Intégrer icônes Lucide React spécifiques
- [ ] **Différenciation cartes stocks** (60min)
  - [ ] Appliquer couleurs par statut
  - [ ] Ajouter bordures colorées
  - [ ] Tester responsive design

#### **Dimanche soir (2h) : Micro-animations**
- [ ] **Installation Framer Motion** (30min)
  ```bash
  npm install framer-motion
  ```
- [ ] **Animations cartes stocks** (60min)
  - [ ] Animation entrance (opacity + translateY)
  - [ ] Animation hover (scale + shadow)
  - [ ] Stagger animation pour listes
- [ ] **Animations dashboard** (30min)
  - [ ] Compteurs animés pour métriques
  - [ ] Transitions fluides

**✅ Validation Weekend 1** :
- [ ] Interface plus créative et différenciée
- [ ] Animations fluides sans impact performance
- [ ] Lighthouse Performance ≥ 98/100 maintenu

---

### 🤖 **SEMAINE 2 - IA & Connexion (4h)**

#### **Soirée 1 - Mardi (2h) : IA Visible**
- [ ] **Composant SmartSuggestions** (60min)
  - [ ] Interface suggestions IA (mockées)
  - [ ] Design avec icône AI + animations
  - [ ] Intégration dans dashboard
- [ ] **Composant StockPrediction** (60min)
  - [ ] Prédictions rupture de stock (mockées)
  - [ ] Barre de progression + alertes
  - [ ] Actions recommandées

#### **Soirée 2 - Jeudi (2h) : Connexion Backend V1**
- [ ] **Services API** (30min)
  - [ ] Créer `src/services/api/client.ts`
  - [ ] Créer `src/services/api/stockService.ts`
  - [ ] Configuration React Query
- [ ] **Connexion & Tests** (90min)
  - [ ] Installer `@tanstack/react-query`
  - [ ] Créer hooks useStocks, useStock
  - [ ] Connecter au backend (port 3006)
  - [ ] Tester authentification Azure AD
  - [ ] Vérifier affichage données réelles

**✅ Validation Finale** :
- [ ] Application V2 complète et fonctionnelle
- [ ] Connexion backend opérationnelle
- [ ] Toutes les améliorations encadrante implémentées
- [ ] Performance maintenue (Lighthouse ≥ 98)

---

## 📋 CHECKLIST PAR LIVRABLE

### 🧪 **Livrable 1 : Tests Unitaires**
- [x] Vitest configuré et fonctionnel
- [x] Tests Button, Card, Badge passent
- [x] Tests Dashboard passent
- [x] Coverage ≥ 80%
- [x] Script `npm run test` fonctionne
- [x] Script `npm run test:coverage` fonctionne

### 🎨 **Livrable 2 : Créativité Visuelle**
- [ ] 5 statuts stocks définis avec couleurs
- [ ] Icônes spécifiques par statut
- [ ] Cartes visuellement différenciées
- [ ] Design cohérent avec design system
- [ ] Responsive design maintenu

### ✨ **Livrable 3 : Micro-animations**
- [ ] Framer Motion installé
- [ ] Animations entrance sur cartes
- [ ] Animations hover fluides
- [ ] Compteurs animés dashboard
- [ ] Performance non dégradée
- [ ] `prefers-reduced-motion` respecté

### 🤖 **Livrable 4 : IA Visible**
- [ ] Composant SmartSuggestions créé
- [ ] Composant StockPrediction créé
- [ ] Interface IA intuitive
- [ ] Données mockées réalistes
- [ ] Intégration dashboard harmonieuse

### 🔌 **Livrable 5 : Connexion Backend**
- [ ] Client API créé avec auth Azure AD
- [ ] Service Stock opérationnel
- [ ] React Query configuré
- [ ] Hooks useStocks fonctionnels
- [ ] Données backend affichées
- [ ] Authentification testée

---

## 🚀 COMMANDES UTILES

### Installation
```bash
# Tests
npm install -D vitest @vitest/ui @testing-library/react @testing-library/user-event jsdom

# Animations
npm install framer-motion

# State management
npm install @tanstack/react-query
```

### Scripts de développement
```bash
# Tests
npm run test              # Lancer tests
npm run test:ui          # Interface UI tests
npm run test:coverage    # Coverage report

# Dev
npm run dev              # Serveur développement
npm run build            # Build production
npm run preview          # Preview build
```

### Validation qualité
```bash
# Performance
npm run build
npx lighthouse http://localhost:5173 --view

# Code quality
npm run lint
npm run type-check
```

---

## 📊 MÉTRIQUES DE RÉUSSITE

### Objectifs quantitatifs
- [ ] **Tests** : Coverage ≥ 80%
- [ ] **Performance** : Lighthouse ≥ 98/100
- [ ] **Accessibilité** : Lighthouse ≥ 96/100
- [ ] **SEO** : Lighthouse ≥ 90/100
- [ ] **Bundle size** : < 600kb (gzipped)

### Objectifs qualitatifs
- [ ] **Feedback encadrante** : Réponse à tous les points d'amélioration
- [ ] **Expérience utilisateur** : Interface plus vivante et engageante
- [ ] **Code quality** : Tests robustes, code maintenable
- [ ] **Fonctionnalité** : Application complète connectée au backend

---

## 📝 NOTES ET OBSERVATIONS

### Séance 1 - Tests Setup (Date : 28/09/2025)
```
⏱️ Temps réel : 2h30 (incluant bonus Input)

✅ Réalisé :
- Setup Vitest + React Testing Library + configuration complète
- Tests Button.tsx : 21 tests, coverage 95.45%
- Tests Card.tsx : 14 tests, coverage 94.28%
- Tests Badge.tsx : 18 tests, coverage 90%
- Tests Input.tsx : 33 tests, coverage 98.46% (BONUS)
- Structure BDD avec 2 niveaux describe (when/should)
- 86 tests unitaires fonctionnels, 100% de succès
- Coverage components/common : 95.4% ⭐

❌ Difficultés :
- Mock du contexte useTheme pour les composants
- Sélection des éléments DOM (parentElement vs closest)
- Classes CSS non appliquées (espaces dans template literals)
- Export nommé vs export default des composants

💡 Apprentissages :
- vi.mock() pour mocker les hooks React
- closest() pour sélectionner le bon élément DOM
- .trim() nécessaire sur les template literals multi-lignes
- toHaveClass() teste les classes individuellement
- Importance de tester le comportement plutôt que l'implémentation

✅ Validation Séance 1 :
- [x] 86 tests passent (objectif : 50+)
- [x] Coverage 95.4% sur common (objectif : 80%+)
- [x] 100% Functions couvertes

🔄 À reporter : Rien - Séance 1 SURVALIDÉE ✅⭐
```
### Séance 2 -  Tests Dashboard (Date : 29/09/2025)
```
⏱️ Temps réel : 2h15min (estimé 2h)

✅ Réalisé :
- Tests MetricCard.tsx : 15-20 tests, coverage 100%
- Tests StockCard.tsx : 34 tests, coverage 99.19%
- Tests StockGrid.tsx : 31 tests, coverage 100%
- Structure BDD avec 3 niveaux (Component > Category > when > should)
- Section "StockHub business use cases" pour tests métier
- 80-85 tests dashboard fonctionnels
- Coverage components/dashboard : 99.56% ⭐

❌ Difficultés :
- Mock de StockCard dans StockGrid (résolu : test d'intégration sans mock)
- Sélection DOM sans data-testid (résolu : querySelector sur 'article')
- Pattern de tests : confusion entre mock et intégration réelle
- Tests d'intégration vs tests unitaires (choix architecture)

💡 Apprentissages :
- Tests d'intégration préférables pour composants wrapper simples
- StockGrid teste le vrai StockCard → plus robuste, détecte bugs réels
- Structure 3 niveaux : Component > Feature > Context > Test
- Section business cases = documentation vivante des user flows
- querySelectorAll('article') pour compter éléments sans testid
- forEach sur NodeList pour assertions sur collections

✅ Validation Séance 2 :
- [x] 80+ tests passent (objectif : 55)
- [x] Coverage 99.56% dashboard (objectif : 80%+)
- [x] Pattern BDD business cases établi

🔄 À reporter : Rien - Séance 2 SURVALIDÉE ✅⭐
```
### Séance 3 - Tests Hooks (Date : 29/09/2025)
```
⏱️ Temps réel : 2h45min (estimé 2h30)

✅ Réalisé :
- Tests useTheme.tsx : 30 tests, coverage 100%
- Tests useStocks.tsx : 35 tests, coverage 86.59%
- Tests useFrontendState.tsx : 24 tests, coverage 76.19%
- Mock localStorage avec objet closure
- Mock DOM (createElement, appendChild) pour tests CSV export
- Tests CRUD complets avec validation métier
- 89 tests hooks fonctionnels
- Coverage hooks : 82.17% ⭐

❌ Difficultés :
- Typage TypeScript implicite (résolu : type explicite `any` sur variables async)
- Mock DOM pour export CSV (appendChild/removeChild)
- Erreur "Target container is not a DOM element" (résolu : vi.spyOn au lieu de remplacement direct)
- Variables déclarées mais non utilisées (originalAppendChild)

💡 Apprentissages :
- renderHook avec wrapper pour Context Provider
- Mock localStorage : objet closure pour simuler storage
- Mock DOM complexe : vi.spyOn() > remplacement direct
- vi.restoreAllMocks() dans afterEach pour cleanup
- Type explicite nécessaire sur variables async let/const
- Tests hooks = tester logique métier sans UI

✅ Validation Séance 3 :
- [x] 89 tests passent (objectif : 55)
- [x] Coverage 82.17% hooks (objectif : 70%+)
- [x] useTheme 100% coverage
- [x] useStocks 86.59% (logique métier critique couverte)

🔄 À reporter : 
- Lignes non couvertes useStocks (109, 230-234) : error handlers edge cases
- Lignes non couvertes useFrontendState : fonctions commentées
→ Non critique, logique principale 100% testée
```
### Séance 4 - Tests Components Layout (Date : 30/09/2025)
```
⏱️ Temps réel : 1h30min (estimé 1h30)

✅ Réalisé :
- Tests Header.tsx : 47 tests, coverage 100%
- Tests Footer.tsx : déjà existants, coverage 97.87%
- Tests NavSection.tsx : déjà existants, coverage 98.11%
- Mock useTheme hook avec vi.mock et vi.mocked
- Tests accessibilité complète (ARIA, keyboard navigation)
- Tests responsive (classes Tailwind conditionnelles)
- Tests thèmes dark/light avec rerender
- Tests edge cases (nombres grands, noms longs)
- Coverage composants layout : 98.91%

❌ Difficultés rencontrées :
- TestingLibraryElementError : plusieurs éléments avec /Notifications/i
  → Résolu : getByRole('button', { name: /Notifications \(3 non lues\)/i })
- Type Error : props onNotificationClick/onLogout inexistantes
  → Résolu : adapté tests au composant réel (console.log uniquement)
- aria-hidden test échoue sur parentElement
  → Résolu : Lucide ajoute aria-hidden directement sur SVG
- getByRole('navigation') ne trouve pas l'élément
  → Résolu : utiliser getByLabelText('Actions utilisateur')

💡 Apprentissages :
- getByRole avec { name } pour désambiguïser éléments multiples
- Lucide-react ajoute aria-hidden="true" automatiquement sur SVG
- getByLabelText > getByRole pour éléments avec peu de contenu
- vi.spyOn(console, 'log') pour tester comportement temporaire
- Tests doivent refléter l'interface réelle, pas l'idéale
- Tester les deux thèmes nécessite mock + rerender
- Classes Tailwind responsive testées avec regex (/gap-1.*sm:gap-4/)

✅ Validation Séance 4 :
- [x] 47 tests Header passent
- [x] Coverage Header 100% (Statements, Branch, Functions, Lines)
- [x] Coverage layout global 98.91%
- [x] Accessibilité : ARIA, focus, keyboard navigation
- [x] Responsive : toutes tailles d'écran testées
- [x] Thèmes : dark et light couverts

🔄 À reporter :
- Footer.tsx ligne 37 non couverte (lien externe edge case)
- NavSection.tsx ligne 33 non couverte (breadcrumb conditionnel)
- Ajouter props callbacks (onNotificationClick, onLogout) pour tests plus robustes
- Remplacer console.log spy par vraies fonctionnalités
```

### Séance 5 - Tests Page Dashboard (Date : 30/09/2025)
```
⏱️ Temps réel : Estimé 2h (à compléter)

✅ Réalisé :
- Tests Dashboard.tsx : 33 tests créés
- Coverage : 95.72% (Statements, Lines)
- Coverage Branch : 57.14%
- Coverage Functions : 57.14%
- Mock complets useStocks et useDataExport
- Mock layout components (Header, Footer, NavSection)
- Tests d'intégration complète
- Factory functions pour mocks réutilisables
- Tests de tous les flux utilisateur principaux

❌ Difficultés rencontrées :
- Mock de hooks complexes avec nombreuses propriétés
  → Résolu : Factory functions createMockUseStocks() et createMockUseDataExport()
- Mock des composants layout pour isolation
  → Résolu : vi.mock() avec data-testid pour vérification
- Tests conditionnels (boutons peuvent ne pas exister)
  → Résolu : queryByRole + vérification if (button) avant interaction
- Types TypeScript pour mocks avec as const sur status
  → Résolu : Typage explicite des valeurs littérales

💡 Apprentissages :
- Factory functions = pattern propre pour mocks complexes réutilisables
- Mock de composants enfants pour tester intégration sans dépendances
- waitFor() essentiel pour tests async et state updates
- queryBy* au lieu de getBy* quand élément peut ne pas exister
- createMockUseStocks({ overrides }) pattern pour customiser mocks
- Tests d'intégration = tester orchestration, pas implémentation détaillée
- data-testid utile pour composants mockés sans logique
- Typage 'as const' nécessaire pour valeurs littérales TypeScript

✅ Validation Séance 5 :
- [x] 33 tests Dashboard passent
- [x] Coverage 95.72% Statements/Lines (excellent)
- [x] Tous les flux utilisateur testés
- [x] États loading/error/empty couverts
- [x] Intégration layout + hooks testée
- [ ] Coverage Branch 57.14% (branches conditionnelles partielles)
- [ ] Coverage Functions 57.14% (callbacks optionnels)

🔄 Lignes non couvertes (4.28%) :
- Lignes 67-68 : Condition export edge case ou error handling
- Lignes 106-107 : Branche filtrage avancée spécifique
- Lignes 129-130 : Condition recherche edge case
- Ligne 325 : console.log (non critique)
- Lignes 341-346 : État complexe ou callback conditionnel
```

### Séance 2 - Tests Coverage (Date : ___/___/___)
```
⏱️ Temps réel : ___h___min
✅ Réalisé :
❌ Difficultés :
💡 Apprentissages :
🔄 À reporter :
```

### Séance 3 - Créativité (Date : ___/___/___)
```
⏱️ Temps réel : ___h___min
✅ Réalisé :
❌ Difficultés :
💡 Apprentissages :
🔄 À reporter :
```

### Séance 4 - Animations (Date : ___/___/___)
```
⏱️ Temps réel : ___h___min
✅ Réalisé :
❌ Difficultés :
💡 Apprentissages :
🔄 À reporter :
```

### Séance 5 - IA (Date : ___/___/___)
```
⏱️ Temps réel : ___h___min
✅ Réalisé :
❌ Difficultés :
💡 Apprentissages :
🔄 À reporter :
```

### Séance 6 - Backend (Date : ___/___/___)
```
⏱️ Temps réel : ___h___min
✅ Réalisé :
❌ Difficultés :
💡 Apprentissages :
🔄 À reporter :
```

---

## 🎉 VALIDATION FINALE

### Checklist finale avant livraison
- [ ] Tous les tests passent ✅
- [ ] Coverage ≥ 80% ✅
- [ ] Animations fluides ✅
- [ ] IA visible et fonctionnelle ✅
- [ ] Connexion backend opérationnelle ✅
- [ ] Performance maintenue ✅
- [ ] Documentation mise à jour ✅
- [ ] Commit et push final ✅

### Résultat attendu
- [ ] **Note encadrante** : 85/100 → 95/100+ 
- [ ] **Application complète** : V2 + Backend connecté
- [ ] **Compétences RNCP** : Tests, animations, intégration API
- [ ] **Portfolio** : Projet de qualité professionnelle

---

**Date de début** : 30/09/2025  
**Date de fin prévue** : 11/10/2025  
**Statut** : ⬜ En cours ⬜ Terminé ⬜ Reporté

**Développé par** : Sandrine Cipolla  
**Encadrant(e)** : [Nom encadrante]  
**Projet** : StockHub V2 - Certification RNCP 7