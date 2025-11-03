# 📊 Métriques de Performance - StockHub V2

Ce dossier contient les rapports de performance et d'audit de l'application StockHub V2.

## 📁 Organisation

```
documentation/metrics/
├── README.md                                    # Ce fichier
└── lighthouse-report-YYYY-MM-DD.json           # Rapports Lighthouse datés
```

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

| Date | Performance | Accessibility | Bundle (gzip) | Notes |
|------|-------------|---------------|---------------|-------|
| 10/10/2025 | 100/100 ⭐ | 96/100 ✅ | 70 KB | Post StockCard enrichie - Différenciation visuelle |

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
