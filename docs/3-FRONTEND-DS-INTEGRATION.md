# 🔗 Frontend ↔ Design System - Guide d'Intégration

> **Guide d'harmonisation entre le Frontend React et le Design System externe**
> Ce document explique comment les deux repositories fonctionnent ensemble.

**Date de création** : 18 Novembre 2025
**Auteure** : Sandrine Cipolla
**Projet** : StockHub V2 - RNCP 7

---

## 🎯 Architecture Globale

### Deux Repositories, Un Écosystème

```
┌─────────────────────────────────────────────────────────────────┐
│                     StockHub V2 Ecosystem                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────┐          ┌──────────────────────┐     │
│  │   Design System      │          │      Frontend        │     │
│  │   (Repository 1)     │──────────│    (Repository 2)    │     │
│  │                      │  import  │                      │     │
│  │  - Lit Element       │  ──────> │  - React             │     │
│  │  - Web Components    │  npm   │  - TypeScript strict │     │
│  │  - Storybook         │          │  - Wrappers React    │     │
│  │  - Design Tokens     │          │  - Pages/Features    │     │
│  └──────────────────────┘          └──────────────────────┘     │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📂 Responsabilités par Repository

### 🎨 Design System (`stockhub_design_system`)

**URL** : https://github.com/SandrineCipolla/stockhub_design_system
**Storybook** : https://68f5fbe10f495706cb168751-nufqfdjaoc.chromatic.com/
**Package** : `@stockhub/design-system` (version définie dans [`package.json`](../package.json))

#### Ce qui appartient au Design System

✅ **Web Components (18 composants)**

- Atoms : sh-badge, sh-icon, sh-input, sh-logo, sh-text
- Molecules : sh-button, sh-card, sh-metric-card, sh-quantity-input, sh-search-input, sh-stat-card, sh-status-badge
- Organisms : sh-header, sh-footer, sh-page-header, sh-ia-alert-banner, sh-stock-card, sh-stock-item-card, sh-stock-prediction-card

✅ **Design Tokens**

- Couleurs, espacements, typographie
- CSS custom properties
- Thèmes (dark/light)

✅ **Documentation Storybook**

- Stories interactives
- Playground composants
- Props documentation

✅ **Tests Lit Element**

- Tests unitaires web components
- Tests accessibilité (ARIA, keyboard)

#### Structure Design System

```
stockhub_design_system/
├── src/
│   └── components/           # Web Components (Lit)
│       ├── atoms/
│       ├── molecules/
│       └── organisms/
├── stories/                  # Storybook stories
├── test/                     # Tests Lit Element
├── CHANGELOG.md             # Historique versions
└── README.md                # Documentation principale
```

---

### ⚛️ Frontend React (`stockHub_V2_front`)

**URL** : https://github.com/SandrineCipolla/stockHub_V2_front
**Démo** : https://brave-field-03611eb03.5.azurestaticapps.net/
**Version** : v1.1.0

#### Ce qui appartient au Frontend

✅ **Wrappers React (7 wrappers)**

- ButtonWrapper, CardWrapper, MetricCardWrapper
- StockCardWrapper, AIAlertBannerWrapper
- HeaderWrapper, SearchInputWrapper

✅ **Pages & Features**

- Dashboard, Analytics, Stocks (CRUD)
- Navigation, Routing (React Router)
- Logique métier

✅ **Tests Frontend**

- Tests unitaires React
- Tests des wrappers de Web Components
- Tests d'intégration

✅ **Documentation Technique**

- Guide web components (`2-WEB-COMPONENTS-GUIDE.md`)
- Architecture (`V2/ARCHITECTURE.md`)
- Sessions développement (`7-SESSIONS.md`)

#### Structure Frontend

```
stockHub_V2_front/
├── src/
│   ├── components/
│   │   └── common/           # Wrappers React
│   │       ├── ButtonWrapper.tsx
│   │       ├── CardWrapper.tsx
│   │       └── ... (5 autres)
│   ├── pages/                # Pages React
│   │   ├── Dashboard.tsx
│   │   └── Analytics.tsx
│   └── types/                # Types TypeScript
│       ├── web-components.d.ts
│       └── web-component-events.ts
├── docs/            # Documentation Frontend
│   ├── 0-INDEX.md
│   ├── 7-SESSIONS.md
│   └── 2-WEB-COMPONENTS-GUIDE.md
└── README.md
```

---

## 🔄 Workflow d'Intégration

### 1. Quand créer un nouveau composant ?

#### 📋 Checklist de décision

**Créer dans le Design System si** :

- ✅ Composant UI réutilisable (bouton, carte, input)
- ✅ Pas de logique métier (juste présentation)
- ✅ Utilisable dans plusieurs contexts (web, mobile futur)
- ✅ Indépendant de React/Vue/Angular

**Créer dans le Frontend si** :

- ✅ Composant spécifique à une feature business
- ✅ Nécessite state management React
- ✅ Utilise hooks React (useState, useEffect, etc.)
- ✅ Composant de page (Dashboard, Analytics)

#### Exemple de décision

| Composant       | Où ?          | Pourquoi ?                       |
| --------------- | ------------- | -------------------------------- |
| `sh-button`     | Design System | UI pur, réutilisable partout     |
| `Dashboard.tsx` | Frontend      | Page spécifique, logique métier  |
| `sh-stock-card` | Design System | Présentation stock, réutilisable |
| `StockForm.tsx` | Frontend      | Formulaire avec validation React |

---

### 2. Processus d'ajout d'un composant DS

#### Étape 1 : Créer dans le Design System

```bash
# Dans stockhub_design_system/
git checkout -b feat/new-component
# Créer src/components/molecules/sh-new-component.ts
# Créer stories/sh-new-component.stories.ts
# Créer tests
npm run test
npm run build
git commit -m "feat: add sh-new-component"
```

#### Étape 2 : Publier nouvelle version

```bash
# Bump version (package.json)
npm version patch  # ou minor/major
git tag v<nouvelle-version>
git push && git push --tags
```

#### Étape 3 : Mettre à jour le Frontend

```bash
# Dans stockHub_V2_front/
npm install @stockhub/design-system@latest
# OU spécifier version
npm install github:SandrineCipolla/stockhub_design_system#v<nouvelle-version>
```

#### Étape 4 : Créer wrapper React (si nécessaire)

```typescript
// src/components/common/NewComponentWrapper.tsx
import React from 'react';
import '@stockhub/design-system';

export const NewComponentWrapper: React.FC<Props> = ({ ...props }) => {
  return React.createElement('sh-new-component', props);
};
```

#### Étape 5 : Tester

```bash
npm run test        # Tests unitaires
npm run build       # Build production
npm run dev         # Test visuel
```

---

### 3. Communication entre repositories

#### Design System → Frontend

**Quand mettre à jour le Frontend ?**

- ✅ Nouvelle feature ajoutée au DS
- ✅ Bug fix dans un composant
- ✅ Breaking change (API modifiée)

**Comment documenter ?**

- Design System : `CHANGELOG.md` dans DS
- Frontend : Session doc dans `docs/SESSION-*.md`

#### Frontend → Design System

**Quand contribuer au DS ?**

- ✅ Besoin d'un nouveau composant réutilisable
- ✅ Bug trouvé dans un web component
- ✅ Amélioration proposée (accessibilité, etc.)

**Processus** :

1. Créer issue dans `stockhub_design_system`
2. Développer dans DS
3. Créer PR
4. Merger + Publier version
5. Mettre à jour Frontend

---

## 📚 Documentation Cross-Repository

### Documentation dans le Design System

**Fichiers principaux** :

- `README.md` - Vue d'ensemble, installation, usage
- `CHANGELOG.md` - Historique versions
- `CONTRIBUTING.md` - Guide contribution
- Storybook - Documentation interactive

**Focus** : Comment utiliser les composants (props, events, exemples)

---

### Documentation dans le Frontend

**Fichiers principaux** :

- `docs/0-INDEX.md` - Index avec liens DS
- `docs/2-WEB-COMPONENTS-GUIDE.md` - Intégration React
- `docs/V2/DESIGN-SYSTEM-WRAPPERS.md` - Architecture wrappers
- `docs/4-TROUBLESHOOTING.md` - Debug

**Focus** : Comment intégrer les web components dans React

---

### Référencement Croisé

#### Dans le Design System → Frontend

```markdown
<!-- README.md du DS -->

## Utilisation dans React

Voir le guide complet d'intégration React :
https://github.com/SandrineCipolla/stockHub_V2_front/blob/main/docs/2-WEB-COMPONENTS-GUIDE.md
```

#### Dans le Frontend → Design System

```markdown
<!-- 0-INDEX.md du Frontend -->

## Design System (Externe)

Repository : https://github.com/SandrineCipolla/stockhub_design_system
Storybook : https://68f5fbe10f495706cb168751-nufqfdjaoc.chromatic.com/
```

---

## 🧪 Tests Cross-Repository

### Tests dans le Design System

**Responsabilité** : Tester le comportement du web component

```typescript
// test/sh-button.test.ts
it('should emit sh-click event', async () => {
  const el = await fixture<ShButton>(html`<sh-button></sh-button>`);
  const clickSpy = sinon.spy();
  el.addEventListener('sh-click', clickSpy);

  el.click();
  expect(clickSpy).to.have.been.calledOnce;
});
```

**Couverture** : Props, events, slots, accessibilité

---

### Tests dans le Frontend

**Responsabilité** : Tester l'intégration React + logique métier

```typescript
// __tests__/ButtonWrapper.test.tsx
it('should call onClick when sh-click fires', () => {
  const handleClick = vi.fn();
  const { container } = render(<ButtonWrapper onClick={handleClick} />);

  const button = container.querySelector('sh-button');
  const event = new CustomEvent('sh-click');
  button?.dispatchEvent(event);

  expect(handleClick).toHaveBeenCalled();
});
```

**Couverture** : Wrappers, intégration, pages, features

---

## 🎓 RNCP - Justifications

### Pourquoi cette séparation ?

**C2.5 - Décisions architecturales justifiées**

1. **Réutilisabilité** ✅
   - Design System utilisable dans React, Vue, Angular
   - Futur: App mobile React Native peut utiliser les mêmes composants

2. **Maintenabilité** ✅
   - Séparation des responsabilités claire
   - Tests séparés, builds indépendants
   - Versioning sémantique (semver)

3. **Scalabilité** ✅
   - Équipes séparées possibles (UI team vs Feature team)
   - Releases indépendantes
   - Storybook = documentation vivante

4. **Standards Web** ✅
   - Web Components = standard W3C
   - Framework-agnostic
   - Performance (Shadow DOM)

---

## 🔗 Liens Utiles

### Design System

- **Repository** : https://github.com/SandrineCipolla/stockhub_design_system
- **Storybook** : https://68f5fbe10f495706cb168751-nufqfdjaoc.chromatic.com/
- **Package NPM** : `@stockhub/design-system` (voir `package.json`)

### Frontend

- **Repository** : https://github.com/SandrineCipolla/stockHub_V2_front
- **Démo Live** : https://brave-field-03611eb03.5.azurestaticapps.net/
- **Documentation** : `/docs/0-INDEX.md`

### Documentation Technique

**Design System** :

- Storybook (documentation interactive)
- README.md (installation, usage)
- CHANGELOG.md (versions)

**Frontend** :

- [2-WEB-COMPONENTS-GUIDE.md](2-WEB-COMPONENTS-GUIDE.md) - Guide d'utilisation
- [DESIGN-SYSTEM-WRAPPERS.md](V2/DESIGN-SYSTEM-WRAPPERS.md) - Architecture wrappers
- [4-TROUBLESHOOTING.md](4-TROUBLESHOOTING.md) - Debug

---

## 📝 Checklist Contribution

### Avant de créer un nouveau composant

- [ ] Le composant est-il réutilisable ? → Design System
- [ ] Le composant contient-il de la logique métier ? → Frontend
- [ ] L'API du composant est-elle claire ?
- [ ] L'accessibilité est-elle prise en compte ?

### Lors de l'ajout d'un composant DS

- [ ] Créer le web component (Lit Element)
- [ ] Créer la story Storybook
- [ ] Écrire les tests unitaires
- [ ] Mettre à jour CHANGELOG.md
- [ ] Publier nouvelle version (semver)
- [ ] Mettre à jour Frontend
- [ ] Créer wrapper React (si besoin)
- [ ] Tester l'intégration
- [ ] Documenter dans session Frontend

---

**Dernière mise à jour** : 18 Novembre 2025
**Version Design System** : `@stockhub/design-system` (voir `package.json`)
**Version Frontend** : v1.1.0
**Statut** : ✅ Actif et maintenu
