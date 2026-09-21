# 🔍 Scripts d'Audit - Guide d'Utilisation

> Documentation des scripts d'audit automatisés pour la qualité, la performance et l'accessibilité

---

## 📋 Vue d'Ensemble

Le projet StockHub V2 inclut plusieurs scripts d'audit automatisés pour vérifier différents aspects de qualité :

- **Performance** : FPS et animations
- **Accessibilité** : Reduced motion, daltonisme
- **Qualité** : Datasets animations

Ces scripts sont situés dans `scripts/` et peuvent être exécutés via npm.

---

## 🚀 Scripts Disponibles

### 1. `npm run audit:fps`

**Objectif** : Tester les performances d'animation et s'assurer que le FPS reste >60

**Fichier** : `scripts/test-performance-fps.mjs`

**Quand l'utiliser** :

- Après avoir ajouté de nouvelles animations
- Avant de merger une PR avec des modifications d'animations
- Lors d'un audit de performance complet
- Si vous suspectez des problèmes de fluidité

**Ce qu'il vérifie** :

- FPS pendant les animations
- Temps de frame
- Dépassements de budget (frame drops)

**Comment l'utiliser** :

```bash
npm run audit:fps
```

**Interprétation des résultats** :

- ✅ **PASS** : Toutes les animations maintiennent >60 FPS
- ❌ **FAIL** : Des frame drops détectés, optimiser les animations

---

### 2. `npm run audit:a11y`

**Objectif** : Vérifier le respect de `prefers-reduced-motion` pour l'accessibilité

**Fichier** : `scripts/test-reduced-motion.mjs`

**Quand l'utiliser** :

- Avant de livrer une nouvelle feature avec animations
- Lors d'un audit accessibilité
- Pour valider la conformité WCAG 2.1
- Avant une mise en production

**Ce qu'il vérifie** :

- Les animations respectent `prefers-reduced-motion`
- Les transitions sont désactivées quand nécessaire
- Les utilisateurs sensibles aux mouvements ont une expérience adaptée

**Comment l'utiliser** :

```bash
npm run audit:a11y
```

**Interprétation des résultats** :

- ✅ **PASS** : Animations respectent reduced-motion
- ❌ **FAIL** : Certaines animations ne respectent pas les préférences utilisateur

**Critère WCAG** : Success Criterion 2.3.3 Animation from Interactions (Level AAA)

---

### 3. `npm run audit:datasets`

**Objectif** : Vérifier que tous les datasets d'animations sont correctement configurés

**Fichier** : `scripts/test-animations-datasets.mjs`

**Quand l'utiliser** :

- Après avoir ajouté de nouveaux composants animés
- Lors d'un refactoring des animations
- Pour détecter des datasets manquants ou mal configurés

**Ce qu'il vérifie** :

- Présence des attributs `data-animation-*`
- Configuration correcte des datasets
- Cohérence entre les composants

**Comment l'utiliser** :

```bash
npm run audit:datasets
```

**Interprétation des résultats** :

- ✅ **PASS** : Tous les datasets sont corrects
- ❌ **FAIL** : Datasets manquants ou mal configurés

---

### 4. `npm run audit:daltonisme`

**Objectif** : Tester l'accessibilité visuelle pour les utilisateurs daltoniens

**Fichier** : `scripts/test-daltonisme.mjs`

**Quand l'utiliser** :

- Après avoir modifié les couleurs ou le thème
- Lors d'un audit accessibilité complet
- Avant une mise en production majeure
- Pour valider les contrastes de couleurs

**Ce qu'il vérifie** :

- Contraste de couleurs suffisant
- Lisibilité pour différents types de daltonisme (protanopie, deutéranopie, tritanopie)
- Alternative aux informations uniquement basées sur la couleur

**Comment l'utiliser** :

```bash
npm run audit:daltonisme
```

**Interprétation des résultats** :

- ✅ **PASS** : Interface accessible aux daltoniens
- ❌ **FAIL** : Problèmes de contraste ou dépendance à la couleur détectés

**Critères WCAG** :

- Success Criterion 1.4.1 Use of Color (Level A)
- Success Criterion 1.4.3 Contrast (Minimum) (Level AA)

---

### 5. `npm run audit:full`

**Objectif** : Exécuter TOUS les audits en une seule commande

**Fichier** : `scripts/audit-complet.mjs`

**Quand l'utiliser** :

- **Avant chaque release**
- Avant de merger une PR majeure
- Lors d'un audit qualité complet
- Pour valider l'état global du projet

**Ce qu'il fait** :
Exécute séquentiellement :

1. `audit:fps`
2. `audit:a11y`
3. `audit:datasets`
4. `audit:daltonisme`

**Comment l'utiliser** :

```bash
npm run audit:full
```

**Interprétation des résultats** :

- ✅ **ALL PASS** : Le projet respecte tous les critères de qualité
- ⚠️ **PARTIAL PASS** : Certains audits ont échoué, à corriger
- ❌ **FAIL** : Blocage, corrections nécessaires avant release

---

## 📅 Quand Exécuter les Audits

### Workflow Recommandé

**Développement Local** :

```bash
# Après modifications d'animations
npm run audit:fps

# Après modifications de couleurs/thème
npm run audit:daltonisme
```

**Avant Commit** :

```bash
# Audit ciblé selon les changements
npm run audit:a11y  # Si modif animations
npm run audit:datasets  # Si nouveaux composants
```

**Avant PR** :

```bash
# Audit complet
npm run audit:full
```

**Avant Release** :

```bash
# Audit complet + tests + build
npm run audit:full
npm run test:run
npm run build
```

---

## 🔧 Intégration CI/CD

### Recommandations

**Option 1 : Audit sur chaque PR** (recommandé)

```yaml
# .github/workflows/quality.yml
name: Quality Audit
on: [pull_request]
jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Install dependencies
        run: npm ci
      - name: Run full audit
        run: npm run audit:full
```

**Option 2 : Audit pré-release uniquement**

- Exécuter `audit:full` uniquement sur les tags/releases
- Plus rapide mais moins de sécurité

**Option 3 : Audit sélectif par type de changement**

- Détecter les fichiers modifiés
- Exécuter uniquement les audits pertinents

**Décision actuelle** : Non intégré en CI/CD (à évaluer selon besoins)

---

## 🎓 Pour le RNCP

Ces scripts démontrent :

- **C4.1** : Tests automatisés et assurance qualité
- **C4.2** : Respect des normes d'accessibilité (WCAG)
- **C3.2** : Conformité aux procédures et standards

**Documentation liée** :

- [TESTS-PERFORMANCE.md](TESTS-PERFORMANCE.md) - Métriques de performance
- [ANIMATIONS.md](ANIMATIONS.md) - Système d'animations

---

## 🐛 Résolution de Problèmes

### Les scripts échouent avec "Module not found"

```bash
# Vérifier que les scripts existent
ls scripts/*.mjs

# Réinstaller les dépendances
npm ci
```

### Les audits sont trop lents

- Les audits lancent Puppeteer (navigateur headless)
- Temps normal : 10-30 secondes par script
- Pour accélérer : utiliser les audits ciblés au lieu de `audit:full`

### Faux positifs dans les résultats

- Vérifier la version de Node.js (>= 18)
- Vérifier la version de Puppeteer dans package.json
- Consulter les logs détaillés dans le script

---

## 📊 Maintenance des Scripts

### Mise à jour des Scripts

**Qui peut modifier** : Lead dev ou responsable qualité

**Quand modifier** :

- Ajout de nouveaux critères d'audit
- Mise à jour des seuils de performance
- Correction de bugs dans les scripts

**Comment modifier** :

1. Modifier le fichier `.mjs` concerné dans `scripts/`
2. Tester le script : `npm run audit:xxx`
3. Documenter les changements dans ce fichier
4. Commit avec message : `chore: update audit script xxx`

### Suppression d'un Script

**Avant de supprimer** :

1. Vérifier qu'aucun processus CI/CD ne l'utilise
2. Vérifier les références dans la documentation
3. Créer une issue pour tracker la décision
4. Supprimer le script ET sa ligne dans package.json

---

## 📝 Historique

**Dernière mise à jour** : 08 Novembre 2024
**Version** : 1.0
**Status** : Actif - Scripts maintenus

**Changements à venir** : Évaluer l'intégration CI/CD (priorité basse)

---

## 🔗 Voir Aussi

- [TESTS-PERFORMANCE.md](TESTS-PERFORMANCE.md) - Tests et métriques
- [ANIMATIONS.md](ANIMATIONS.md) - Système d'animations
- [TROUBLESHOOTING-WEB-COMPONENTS.md](TROUBLESHOOTING-WEB-COMPONENTS.md) - Debug
- [0-INDEX.md](../0-INDEX.md) - Index de la documentation
