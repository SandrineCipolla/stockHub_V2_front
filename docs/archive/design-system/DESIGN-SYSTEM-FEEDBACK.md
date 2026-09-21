# Design System - Retours d'Intégration

**Date de début**: 21 Octobre 2025
**Branche**: `feature/design-system-integration`

---

## 🔴 Problèmes Critiques

### 1. `sh-button` - Icône ne s'affiche pas avec `icon-before`

- **Composant**: `sh-button`
- **Problème**: L'attribut `icon-before="Plus"` ne fonctionne pas en JSX
- **Testé avec**: `iconbefore="Plus"` (minuscules)
- **Status**: ❌ À vérifier
- **Solution possible**: Vérifier le mapping des attributs kebab-case → camelCase dans le composant Lit

### 2. `sh-button` - Couleur incorrecte

- **Composant**: `sh-button`
- **Problème**: La couleur du bouton `variant="primary"` ne correspond pas aux couleurs de StockHub V2
- **Couleur attendue**: Purple/Violet (thème StockHub)
- **Couleur actuelle**: ?
- **Status**: ❌ À corriger
- **Solution**: Vérifier les CSS tokens `--color-primary-*` dans `design-tokens.css`

### 3. `sh-button` - Pas de support responsive text

- **Composant**: `sh-button`
- **Problème**: Impossible de masquer le texte sur mobile et garder seulement l'icône
- **Comportement attendu**: Afficher uniquement l'icône sur petit écran, texte + icône sur grand écran
- **Comportement actuel**: Texte toujours visible
- **Status**: ❌ Feature manquante
- **Solution possible**: Ajouter une propriété `icon-only-mobile` ou `responsive-text`

### 4. `sh-header` - Logo trop petit

- **Composant**: `sh-header`
- **Problème**: Le logo StockHub est plus petit que dans le Header React original
- **Status**: ❌ À corriger
- **Solution**: Augmenter la taille du logo dans les styles du composant

### 5. `sh-header` - Toggle thème ne fonctionne pas globalement

- **Composant**: `sh-header`
- **Problème**: Le bouton de toggle thème ne change que le thème du header, pas de toute l'app
- **Comportement attendu**: Doit déclencher le `toggleTheme()` global de l'application React
- **Comportement actuel**: Change seulement l'apparence du header
- **Status**: ❌ Critique
- **Solution**: Le composant doit émettre un événement que l'app React peut écouter pour changer le thème global

### 6. `sh-header` - Nom utilisateur ne s'affiche pas

- **Composant**: `sh-header`
- **Problème**: Affiche "Utilisateur" au lieu de "Sandrine Cipolla" malgré `user-name="Sandrine Cipolla"`
- **Status**: ❌ À corriger
- **Solution**: Vérifier le mapping de l'attribut `user-name` → `userName` dans le composant

### 7. `sh-header` - Badge de notifications vide

- **Composant**: `sh-header`
- **Problème**: Le badge de compteur de notifications ne s'affiche pas malgré `notification-count={3}`
- **Status**: ❌ À corriger
- **Solution**: Vérifier que le composant affiche bien le compteur quand `notificationCount > 0`

### 8. `sh-metric-card` - Taille trop grande

- **Composant**: `sh-metric-card`
- **Problème**: Le composant est trop grand comparé au MetricCard React original
- **Status**: ❌ À corriger
- **Solution**: Réduire le padding et ajuster les tailles de police pour correspondre au design StockHub

### 9. `sh-metric-card` - Icône non colorée

- **Composant**: `sh-metric-card`
- **Problème**: L'icône n'est plus colorée selon le variant (success/warning/info)
- **Comportement attendu**: L'icône doit avoir la couleur du variant (vert pour success, etc.)
- **Comportement actuel**: Icône grise/neutre
- **Status**: ❌ À corriger
- **Solution**: Appliquer les couleurs du variant à l'icône

### 10. `sh-metric-card` - Animation compteur manquante

- **Composant**: `sh-metric-card`
- **Problème**: Le nombre s'affiche directement sans animation de comptage progressif
- **Comportement attendu**: Le nombre doit s'incrémenter graduellement de 0 jusqu'à la valeur finale (count-up animation)
- **Comportement actuel**: Affichage instantané de la valeur
- **Status**: ❌ Feature manquante
- **Solution**: Ajouter une animation de count-up au chargement du composant

### 11. `sh-metric-card` - Animation d'entrée en cascade manquante

- **Composant**: `sh-metric-card`
- **Problème**: Les cards apparaissent toutes en même temps
- **Comportement attendu**: Les cards doivent apparaître l'une après l'autre avec un délai (cascade/stagger animation)
- **Comportement actuel**: Apparition simultanée
- **Status**: ❌ Feature manquante
- **Solution**: Ajouter support pour un délai d'animation via une propriété (ex: `animation-delay`)

### 12. `sh-ia-alert-banner` - Pas de fonctionnalité expand/collapse

- **Composant**: `sh-ia-alert-banner`
- **Problème**: Impossible de déplier le banner pour voir les détails des suggestions
- **Comportement attendu**: Un bouton expand/collapse pour afficher/masquer la liste détaillée des suggestions IA
- **Comportement actuel**: Affichage statique avec juste le compteur
- **Status**: ❌ Feature manquante
- **Solution**: Ajouter une propriété `expandable` et gérer l'état expand/collapse

### 13. `sh-ia-alert-banner` - Emoji robot manquant

- **Composant**: `sh-ia-alert-banner`
- **Problème**: L'emoji 🤖 qui apparaissait dans AISummaryWidget n'est pas présent
- **Comportement attendu**: Afficher 🤖 avant le texte pour indiquer que c'est l'IA
- **Status**: ⚠️ Amélioration souhaitée
- **Solution**: Ajouter l'emoji dans le template du composant

### 14. `sh-ia-alert-banner` - Style du badge différent

- **Composant**: `sh-ia-alert-banner`
- **Problème**: Le badge "17 critiques" a un style différent de l'original (badges dans AISummaryWidget)
- **Status**: ⚠️ À vérifier
- **Solution**: Vérifier que les badges respectent le design de StockHub V2

### 15. `sh-ia-alert-banner` - Largeur potentiellement différente

- **Composant**: `sh-ia-alert-banner`
- **Problème**: Le composant semble plus large que AISummaryWidget
- **Status**: ⚠️ À vérifier
- **Solution**: Ajuster la largeur pour correspondre au design original

### 16. `sh-stock-card` - Bordure trop opaque

- **Composant**: `sh-stock-card`
- **Problème**: La bordure de la card est plus visible/opaque que dans StockCard React
- **Comportement attendu**: Bordure discrète, plus transparente
- **Status**: ❌ À corriger
- **Solution**: Réduire l'opacité de la bordure pour correspondre au design StockHub V2

### 17. `sh-stock-card` - Quantité et valeur mal alignées

- **Composant**: `sh-stock-card`
- **Problème**: Les métriques quantité et valeur ne sont pas assez centrées
- **Comportement attendu**: Texte bien centré dans leur section respective
- **Status**: ❌ À corriger
- **Solution**: Ajuster l'alignement CSS (text-center) des métriques

### 18. `sh-stock-card` - "Mise à jour il y a..." mal affiché

- **Composant**: `sh-stock-card`
- **Problème**: L'information "Mis à jour il y a X" n'est pas visible ou mal affichée
- **Comportement attendu**: Afficher clairement "Mis à jour il y a [temps]" sous le nom du stock
- **Status**: ❌ À corriger
- **Solution**: Vérifier que l'attribut `last-update` est correctement affiché dans le template

### 19. `sh-stock-card` - Bouton "Enregistrer session" mal stylisé

- **Composant**: `sh-stock-card`
- **Problème**: Le bouton "Enregistrer session" n'est pas centré et est trop visible
- **Comportement attendu**: Bouton centré, plus discret (ghost variant avec couleur douce)
- **Status**: ❌ À corriger
- **Solution**: Ajuster le style du bouton pour qu'il soit plus discret et centré

### 20. `sh-stock-card` - Bouton "Enregistrer session" ne fonctionne pas

- **Composant**: `sh-stock-card`
- **Problème**: Le bouton "Enregistrer session" ne déclenche pas l'action
- **Comportement attendu**: Décrémenter la quantité et afficher un feedback
- **Status**: ❌ À corriger
- **Solution**: Vérifier que l'événement `onsh-session-click` est bien émis et géré

### 21. `sh-stock-card` - Boutons d'action (Détails/Modifier/Supprimer) mal stylisés

- **Composant**: `sh-stock-card`
- **Problème**: Les boutons d'action n'ont pas le même style que dans StockCard React (moins discrets)
- **Comportement attendu**: Boutons ghost, icônes bien dimensionnées, couleurs cohérentes avec le thème
- **Status**: ❌ À corriger
- **Solution**: Ajuster les styles des boutons d'action pour correspondre au design StockHub V2

### 22. `sh-logo` - Pas responsive

- **Composant**: `sh-logo`
- **Problème**: Le logo ne s'adapte pas à la taille de l'écran, trop gros en mobile
- **Comportement attendu**: Le logo doit être plus petit sur mobile (32px) et plus grand sur desktop (40px)
- **Comportement actuel**: Taille fixe quelque soit la taille de l'écran
- **Status**: ❌ À corriger
- **Solution**: Ajouter des media queries ou rendre les tailles (sm/md/lg) responsive

### 23. `sh-logo` - Dégradés manquants ou différents

- **Composant**: `sh-logo`
- **Problème**: Les dégradés violets ne semblent pas identiques à l'original
- **Comportement attendu**: Carré avec dégradé `from-purple-500 to-purple-600`, texte avec dégradé violet identique
- **Status**: ⚠️ À vérifier
- **Solution**: Vérifier que les CSS custom properties pour les dégradés correspondent au design StockHub V2

---

## ⚠️ Améliorations Souhaitées

### 4. `sh-button` - Gestion de la taille

- **Composant**: `sh-button`
- **Problème**: Les tailles `sm/md/lg` ne correspondent pas forcément aux tailles du design existant
- **Status**: ⏳ À tester davantage
- **Note**: Besoin de comparer avec les boutons actuels

---

## ✅ Points Positifs

1. ✅ L'intégration des Web Components fonctionne
2. ✅ Le chargement des CSS tokens fonctionne
3. ✅ Les événements custom (`onsh-button-click`) fonctionnent
4. ✅ Le bouton s'affiche correctement (structure HTML/CSS)

---

## 📝 Actions à Prendre

### Dans le Design System (`stockhub_design_system`)

- [ ] Corriger les couleurs primary pour correspondre au thème violet de StockHub
- [ ] Ajouter support responsive text pour les boutons
- [ ] Vérifier le mapping des attributs `iconBefore` / `icon-before`
- [ ] Tester tous les variants de couleur avec le thème dark de StockHub

### Dans StockHub V2

- [ ] Pour l'instant, garder les boutons React natifs pour les cas complexes (responsive text)
- [ ] Identifier les composants simples qui peuvent utiliser le DS sans problème
- [ ] Créer des wrappers React si nécessaire pour faciliter l'utilisation

---

## 🧪 Composants Testés

| Composant            | Status             | Notes                                                                                                                                    |
| -------------------- | ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `sh-button`          | ⚠️ Partiel         | Fonctionne mais problèmes de couleur, icône et responsive                                                                                |
| `sh-footer`          | ✅ OK              | Fonctionne parfaitement! Styles cohérents, thème dark OK                                                                                 |
| `sh-status-badge`    | ✅ OK              | Intégré dans StockCard, affichage correct des statuts avec bonnes couleurs                                                               |
| `sh-header`          | ❌ Non fonctionnel | Trop de problèmes: logo petit, thème non global, nom utilisateur, notifications                                                          |
| `sh-search-input`    | ✅ OK              | Fonctionne bien! Debounce OK, clear OK, événement `e.detail.value` fonctionne                                                            |
| `sh-metric-card`     | ❌ Non fonctionnel | Trop grand, icône non colorée, animations manquantes (count-up + cascade)                                                                |
| `sh-ia-alert-banner` | ⚠️ Partiel         | S'affiche mais manque expand/collapse, emoji robot, styles légèrement différents                                                         |
| `sh-badge`           | ⏭️ Non testé       | Composant atom de base, pas d'utilisation évidente dans StockHub V2 pour le moment                                                       |
| `sh-stock-card`      | ❌ Non fonctionnel | Nombreux problèmes: bordure opaque, alignement, "mise à jour" mal affiché, boutons mal stylisés, "Enregistrer session" ne fonctionne pas |
| `sh-logo`            | ⚠️ Partiel         | S'affiche mais pas responsive (trop gros en mobile), dégradés potentiellement différents                                                 |

---

## 🔜 Composants à Tester

- [ ] `sh-header`
- [ ] `sh-footer`
- [ ] `sh-search-input`
- [ ] `sh-badge`
- [ ] `sh-status-badge`
- [ ] `sh-metric-card`
- [ ] `sh-stock-card`
- [ ] `sh-ia-alert-banner`

---

**Auteure**: Sandrine Cipolla
