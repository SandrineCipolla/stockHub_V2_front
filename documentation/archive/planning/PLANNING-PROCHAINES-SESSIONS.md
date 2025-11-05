# Planning - Prochaines Sessions

**Dernière mise à jour**: 21 Octobre 2025
**Branche actuelle**: `feature/design-system-integration`

---

## 📋 Session Actuelle - Terminée ✅

### Réalisations
- ✅ Testé 10/16 composants du Design System
- ✅ Documenté 23 problèmes avec solutions
- ✅ Intégré avec succès 3 composants fonctionnels
- ✅ Créé 3 fichiers de documentation complète

### Fichiers Créés
- `DESIGN-SYSTEM-FEEDBACK.md` - Feedback détaillé sur chaque composant
- `DESIGN-SYSTEM-LEARNINGS.md` - Apprentissages et solutions techniques
- `AMELIORATIONS-FUTURES.md` - Améliorations à prévoir pour StockHub V2

---

## 🎯 Prochaine Session Recommandée

### Objectif: Corriger les Composants Partiels du Design System

**Repo**: `stockhub_design_system`
**Branche à créer**: `fix/stockhub-v2-feedback`
**Durée estimée**: 2-3h

### Phase 1: Quick Wins - Composants Partiels (Priorité ⭐⭐⭐)

Ces 3 composants sont presque prêts, les corriger rapidement donnera 6 composants fonctionnels au lieu de 3!

#### 1. `sh-logo` (30 min)
**Problèmes**: 2
- [ ] Ajouter support responsive (media queries)
- [ ] Vérifier/ajuster les dégradés violets

**Fichier**: `src/components/atoms/logo/sh-logo.ts`

**Code à ajouter**:
```typescript
// Media queries pour responsive
static styles = css`
  :host([size="md"]) .logo-icon {
    width: 32px;
    height: 32px;
    font-size: 0.875rem;
  }

  @media (min-width: 640px) {
    :host([size="md"]) .logo-icon {
      width: 40px;
      height: 40px;
      font-size: 1rem;
    }
  }

  // Dégradés identiques à StockHub V2
  .logo-icon {
    background: linear-gradient(to bottom right, #8b5cf6, #7c3aed);
  }

  .logo-text {
    background: linear-gradient(to right, #8b5cf6, #7c3aed);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;
```

#### 2. `sh-button` (45 min)
**Problèmes**: 3
- [ ] Fix mapping attribut `icon-before`
- [ ] Ajuster couleur primary → violet StockHub (#8b5cf6)
- [ ] Ajouter support `hide-text-mobile`

**Fichier**: `src/components/molecules/button/sh-button.ts`

**Code à ajouter**:
```typescript
// 1. Fix icon-before
@property({ type: String, attribute: 'icon-before' })
iconBefore?: string;

// 2. Update design tokens
// Dans src/tokens/design-tokens.css
--color-primary-500: #8b5cf6;
--color-primary-600: #7c3aed;

// 3. Support hide-text-mobile
@property({ type: Boolean, attribute: 'hide-text-mobile' })
hideTextMobile = false;

// CSS
.button-text {
  display: inline;
}

@media (max-width: 768px) {
  :host([hide-text-mobile]) .button-text {
    display: none;
  }
}
```

#### 3. `sh-ia-alert-banner` (45 min)
**Problèmes**: 3
- [ ] Ajouter fonctionnalité expand/collapse
- [ ] Ajouter emoji 🤖
- [ ] Harmoniser styles des badges

**Fichier**: `src/components/organisms/ia-alert-banner/sh-ia-alert-banner.ts`

**Code à ajouter**:
```typescript
@property({ type: Boolean })
expandable = true;

@state()
private isExpanded = false;

handleToggle() {
  if (this.expandable) {
    this.isExpanded = !this.isExpanded;
    this.dispatchEvent(new CustomEvent('sh-banner-toggle', {
      detail: { expanded: this.isExpanded }
    }));
  }
}

render() {
  return html`
    <div class="banner">
      <div class="header" @click="${this.handleToggle}">
        🤖 ${this.count} stock${this.count > 1 ? 's' : ''} ${this.message}
        ${this.expandable ? html`
          <button class="toggle">
            ${this.isExpanded ? '▼' : '▶'}
          </button>
        ` : ''}
      </div>
      ${this.isExpanded ? html`
        <div class="content">
          <!-- Contenu détaillé des alertes -->
        </div>
      ` : ''}
    </div>
  `;
}
```

---

### Phase 2: Composants Non Fonctionnels (Priorité ⭐⭐)

**Durée estimée**: 3-4h (session suivante)

#### 4. `sh-header` (1h30)
**Problèmes**: 4
- [ ] Augmenter taille logo
- [ ] Émettre événement global pour toggle thème
- [ ] Fix mapping `user-name`
- [ ] Fix mapping `notification-count`

#### 5. `sh-metric-card` (1h)
**Problèmes**: 4
- [ ] Réduire padding/tailles
- [ ] Colorer icônes selon variant
- [ ] Ajouter animation count-up
- [ ] Support index pour cascade

#### 6. `sh-stock-card` (1h30)
**Problèmes**: 6
- [ ] Réduire opacité bordure
- [ ] Centrer métriques
- [ ] Afficher `last-update`
- [ ] Styliser bouton session (discret, centré)
- [ ] Émettre événement `sh-session-click`
- [ ] Ajuster styles boutons d'action

---

### Phase 3: Tests Restants (Priorité ⭐)

**Durée estimée**: 1-2h (session future)

Tester les 6 composants restants:
- [ ] `sh-icon`
- [ ] `sh-input`
- [ ] `sh-text`
- [ ] `sh-card`
- [ ] `sh-quantity-input`
- [ ] `sh-stock-item-card`

---

## 📅 Planning Suggéré

### Session 1 (Prochaine) - 2h
**Focus**: Phase 1 - Quick Wins
- Corriger `sh-logo` (30 min)
- Corriger `sh-button` (45 min)
- Corriger `sh-ia-alert-banner` (45 min)

**Résultat attendu**: 6 composants fonctionnels ✅

### Session 2 - 3h
**Focus**: Phase 2 - Composants Non Fonctionnels
- Corriger `sh-header` (1h30)
- Corriger `sh-metric-card` (1h)
- Début `sh-stock-card` (30 min)

**Résultat attendu**: 8 composants fonctionnels ✅

### Session 3 - 2h
**Focus**: Finalisation
- Finir `sh-stock-card` (1h)
- Tester composants restants (1h)

**Résultat attendu**: 16/16 composants testés et documentés ✅

---

## 🎯 Objectif Final

**Design System Production-Ready**:
- ✅ 16/16 composants fonctionnels
- ✅ Tous les composants alignés avec StockHub V2
- ✅ Support responsive complet
- ✅ Animations implémentées
- ✅ Événements custom fonctionnels

**StockHub V2 avec Design System**:
- ✅ Remplacement progressif de tous les composants React
- ✅ Cohérence visuelle parfaite
- ✅ Maintenabilité améliorée
- ✅ Design System réutilisable pour futurs projets

---

## 📝 Notes

### Avant de Commencer la Prochaine Session

1. **Pusher la branche actuelle** (`feature/design-system-integration`)
2. **Basculer sur le repo Design System**
3. **Créer la branche** `fix/stockhub-v2-feedback`
4. **Avoir sous les yeux**:
   - `DESIGN-SYSTEM-FEEDBACK.md`
   - `DESIGN-SYSTEM-LEARNINGS.md`
   - Screenshots de StockHub V2 pour référence visuelle

### Pendant les Corrections

- ✅ Tester chaque correction dans Storybook
- ✅ Vérifier le responsive (mobile/tablet/desktop)
- ✅ Tester les thèmes (light/dark)
- ✅ Valider les événements custom
- ✅ Comparer visuellement avec StockHub V2

### Après les Corrections

1. Commit dans le Design System
2. Push et créer PR
3. Mettre à jour la version dans StockHub V2
4. Re-tester les composants dans StockHub V2
5. Mettre à jour `DESIGN-SYSTEM-FEEDBACK.md`

---

## 🔗 Fichiers de Référence

- `DESIGN-SYSTEM-FEEDBACK.md` - Liste complète des 23 problèmes
- `DESIGN-SYSTEM-LEARNINGS.md` - Solutions détaillées avec code
- `DESIGN-SYSTEM-INTEGRATION.md` - Guide d'intégration
- `AMELIORATIONS-FUTURES.md` - Améliorations StockHub V2

---

**Auteure**: Sandrine Cipolla
**Dernière mise à jour**: 21 Octobre 2025
