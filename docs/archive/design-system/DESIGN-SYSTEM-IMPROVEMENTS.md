# Améliorations à apporter au Design System

## 🔧 Points identifiés lors de l'intégration (03 Novembre 2024)

### 1. **sh-button : Padding insuffisant**

**Problème** : Les boutons manquent d'espace autour du texte/icône, ce qui les rend visuellement compacts.

**État actuel (size="md")** :

```css
padding: 8px 12px; /* vertical: 8px, horizontal: 12px */
```

**Suggestion** :

```css
padding: 10px 16px; /* +2px vertical, +4px horizontal */
```

**Fichier concerné** : `stockhub_design_system/src/components/molecules/button/sh-button.ts`

- Lignes 116-119 (classe `.md`)

**Impact** : Meilleure présence visuelle des boutons sans avoir à utiliser `size="lg"`

---

### 2. **sh-button : Centrage des icônes en mode mobile**

**Problème** : En mode mobile (avec `hide-text-mobile`), les icônes ne sont pas parfaitement centrées dans les boutons.

**État actuel** :

- Le texte est masqué mais l'icône peut sembler décentrée selon les cas

**Suggestion** :

```css
/* Dans sh-button.ts, section responsive */
:host([hide-text-mobile]) button {
  justify-content: center;
  min-width: var(--component-button-height-md); /* Assure un bouton carré */
}

@media (min-width: 640px) {
  :host([hide-text-mobile]) button {
    justify-content: flex-start; /* Retour à l'alignement normal */
    min-width: auto;
  }
}
```

**Fichier concerné** : `stockhub_design_system/src/components/molecules/button/sh-button.ts`

- Lignes 266-275 (section responsive)

**Impact** : Boutons icon-only plus esthétiques en mobile

---

### 3. **sh-button : Considérer variant="primary" pour les cards ?**

**Observation** : Actuellement, les boutons dans `sh-stock-card` utilisent `variant="ghost"` (transparent/discret).

**Question UX** : Devrait-on avoir un bouton d'action principale en violet (`variant="primary"`) dans les cards ?

**Exemple** : Le bouton "Détails" pourrait être `variant="primary"` pour être plus visible.

**Fichier concerné** : `stockhub_design_system/src/components/organisms/stock-card/sh-stock-card.ts`

- Lignes 411-422 (bouton "Détails")

**Impact** : À décider selon les priorités UX. Pour l'instant, on garde `ghost` pour ne pas surcharger visuellement.

---

## 📋 Prochaines étapes

1. [ ] Tester les modifications de padding dans le DS
2. [ ] Vérifier le centrage des icônes sur différents devices
3. [ ] Décider si on veut un bouton primary dans les cards
4. [ ] Mettre à jour le DS et republier le package
5. [ ] Réinstaller dans StockHub V2

---

---

### 4. **sh-stock-card : Badge IA toujours rouge**

**Problème** : Le badge IA (icône Sparkles avec compteur) a une couleur rouge fixe, peu importe la priorité de la suggestion.

**État actuel** (ligne 192) :

```css
.ia-badge {
  background: var(--color-danger-600); /* Rouge fixe */
  color: white;
}
```

**Suggestion** : Adapter la couleur selon la priorité de la suggestion la plus haute :

```css
/* Badge par défaut (info/low) */
.ia-badge {
  background: var(--color-primary-600); /* Bleu/violet */
  color: white;
}

/* Medium/Warning */
:host([ia-severity='warning']) .ia-badge {
  background: var(--color-warning-600); /* Orange */
}

/* Critical/High */
:host([ia-severity='critical']) .ia-badge {
  background: var(--color-danger-600); /* Rouge */
}
```

**Implémentation requise** :

1. Ajouter une prop `iaSeverity` à sh-stock-card
2. La calculer côté front selon la priorité max des suggestions du stock
3. Utiliser `:host([ia-severity])` pour le CSS conditionnel

**Fichier concerné** : `stockhub_design_system/src/components/organisms/stock-card/sh-stock-card.ts`

- Ligne 192 (CSS du badge)
- Ajouter la prop `@property() iaSeverity: 'info' | 'warning' | 'critical' = 'info'`

**Impact** : Distinction visuelle immédiate de l'urgence des suggestions IA

---

### 5. **sh-ia-alert-banner : Doublon d'icônes dans la liste**

**Problème** : Dans la liste des alertes détaillées, chaque ligne affiche deux icônes :

- Une puce "•" via `::before`
- Une icône `AlertTriangle` de Lucide

**Visuel actuel** :

```
• StockName 🔺 Message
```

**Suggestion** : Retirer l'icône `AlertTriangle` et garder uniquement la puce

**Fichier concerné** : `stockhub_design_system/src/components/organisms/ia-alert-banner/sh-ia-alert-banner.ts`

- Lignes 373 (icône AlertTriangle à supprimer)

**Code à retirer** :

```typescript
<sh-icon name="AlertTriangle" size="xs" class="warning-icon"></sh-icon>
```

**Impact** : Liste plus épurée et cohérente

---

### 6. **sh-metric-card : Espacement mobile insuffisant**

**Problème** : En mode mobile, il n'y a pas d'espace entre les metric cards dans une grille.

**Observation** : Le problème vient probablement de l'intégration côté front (utilisation de `gap-6` dans la grille) mais à vérifier si le composant sh-metric-card a des marges/padding appropriés.

**Fichier concerné** :

- Vérifier `stockhub_design_system/src/components/organisms/metric-card/sh-metric-card.ts`
- Peut-être ajuster dans le front : `Dashboard.tsx` ligne 217 (classe `gap-6`)

**Suggestion** :

- Vérifier que sh-metric-card n'a pas de margin negative
- Possiblement augmenter le gap en mobile : `gap-4 md:gap-6` au lieu de `gap-6`

**Impact** : Meilleure lisibilité en mobile

---

### 7. **Responsive design général**

**Points à vérifier en mode mobile** :

- [ ] Espacement entre metric cards
- [ ] Centrage des icônes dans les boutons (hide-text-mobile)
- [ ] Largeur des stock cards
- [ ] Bannière IA (collapse/expand)
- [ ] Footer

**Action** : Faire un audit complet mobile une fois toutes les migrations terminées

---

**Date** : 03 Novembre 2024
**Détecté lors de** : Migration des composants vers Design System dans StockHub V2
