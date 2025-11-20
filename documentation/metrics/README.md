# 📊 StockHub V2 — Tableau de Bord Qualité

Ce dossier contient l’ensemble du système d’audit, d’export et de visualisation des métriques de qualité du projet **StockHub V2**, déployé automatiquement sur GitHub Pages.

Ce tableau de bord permet de démontrer la qualité du développement dans le cadre du **Titre RNCP Niveau 7 – Expert en Ingénierie Logicielle**.

---

# 🎯 Objectifs du dashboard

Ce tableau de bord regroupe en un seul endroit :

- ✔ les performances de l’application (Lighthouse 99/100, FPS, scalabilité)
- ✔ la qualité du code (coverage Jest/Vite)
- ✔ l’accessibilité (daltonisme, WCAG, prefers-reduced-motion)
- ✔ les bonnes pratiques Web (SEO, Best Practices)
- ✔ l’automatisation CI/CD (GitHub Actions + GitHub Pages)

Le tout est **automatiquement généré** via des scripts Node.

---

## 📁 Organisation/Structure du dossier

```
documentation/metrics/
│
├── index.html                              # Dashboard final
│
├── README.md                               # Documentation (ce fichier)
│
├── data/                                   # Données JSON (Lighthouse, WCAG, Daltonisme)
│ ├── lighthouse-report.json
│ ├── risk-levels.json
│ └── daltonisme.json
│
├── reports/                                # Rapports générés (HTML simples)
│ ├── fps-report.html
│ ├── a11y-report.html
│ └── datasets-report.html
│
└── scripts/                                # Scripts Node d'automatisation
├── export-fps-report.mjs
├── export-a11y-report.mjs
├── export-datasets-report.mjs
└── build-metrics-dashboard.mjs
```

# 🔧 Scripts d’audit

## 🚀 1. Test FPS

```bash
npm run audit:fps
```

Teste la fluidité des animations

Génère :  
`reports/fps-report.html`

---

## ♿ 2. Accessibilité – Reduced Motion

```bash
npm run audit:a11y
```

Vérifie que l’application respecte les préférences “réduire les animations”.

Génère :  
`reports/a11y-report.html`

---

## 📊 3. Scalabilité – Datasets

```bash
npm run audit:datasets
```

Teste le comportement de l’UI avec différents volumes de données.

Génère :  
`reports/datasets-report.html`

---

# 🏗 4. Génération du dashboard final

Le script maître assemble **tous les rapports + JSON** :
`node documentation/metrics/scripts/build-metrics-dashboard.mjs`
Il génère :
`documentation/metrics/index.html`

---

# 🚀 Déploiement GitHub Pages

Le workflow :
`.github/workflows/deploy-metrics.yml`

Effectue automatiquement :

- installation Node
- génération des rapports
- génération du dashboard
- déploiement sur Pages dans `/metrics`

URL publique :  
➡️ https://sandrinecipolla.github.io/stockHub_V2_front/metrics/

---

# 🎓 Pertinence RNCP

Ce tableau de bord prouve :

- ✔ maîtrise des tests automatisés (coverage 60%+)
- ✔ maîtrise Lighthouse & audits automatiques
- ✔ maîtrise de l’accessibilité WCAG
- ✔ maîtrise du développement orienté qualité
- ✔ maîtrise des pipelines CI/CD automatisés
- ✔ capacité à produire un reporting professionnel
- ✔ capacité à intégrer plusieurs outils (Node, Vite, Chart.js, GitHub Actions)

Il constitue une **preuve formelle de qualité logicielle**, conforme aux attentes RNCP.

---

# 📬 Documentation complète du projet

Pour consulter toute la documentation du projet StockHub V2 (architecture, modules, DDD, design system, AI Agent, CI/CD) :

➡️ Voir le fichier principal : `/README.md`

---

## 🔍 Rapports Lighthouse

Les rapports Lighthouse sont générés après chaque build de production pour suivre l'évolution des métriques clés :

### Comment générer un nouveau rapport

```bash
# 1. Build de production
npm run build

# 2. Prévisualisation
npm run preview

# 3. Lancer Lighthouse (dans un nouveau terminal)
npx lighthouse http://localhost:4173 --output=json --output-path=documentation/metrics/lighthouse-report-$(date +%Y-%m-%d).json
```

### Métriques suivies

- **Performance** : Temps de chargement, FCP, LCP, TBT, CLS
- **Accessibility** : Conformité WCAG AA, ARIA, contraste, navigation clavier
- **Best Practices** : HTTPS, console errors, bibliothèques obsolètes
- **SEO** : Meta tags, robots.txt, viewport, semantic HTML
- **Bundle size** : Taille des fichiers JavaScript et CSS (gzipped)

## 📈 Historique des audits

| Date       | Performance | Accessibility | Bundle (gzip) | Notes                                              |
| ---------- | ----------- | ------------- | ------------- | -------------------------------------------------- |
| 10/10/2025 | 100/100 ⭐  | 96/100 ✅     | 70 KB         | Post StockCard enrichie - Différenciation visuelle |

## 🎯 Objectifs

- **Performance** : ≥ 98/100
- **Accessibility** : ≥ 96/100 (WCAG AA)
- **Best Practices** : ≥ 90/100
- **SEO** : ≥ 90/100
- **Bundle size** : < 600 KB (gzipped)

## 📝 Notes

- Les rapports sont datés au format `YYYY-MM-DD` pour suivre l'évolution
- Chaque rapport JSON est versionné avec Git pour traçabilité
- Un résumé des audits est disponible dans `documentation/planning/planning_ameliorations_v2.md`
