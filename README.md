# StockHub V2 🏭

![CI](https://github.com/SandrineCipolla/stockHub_V2_front/actions/workflows/ci.yml/badge.svg)
![Version](https://img.shields.io/github/package-json/v/SandrineCipolla/stockHub_V2_front)
[![Accessibility](https://img.shields.io/badge/Accessibility-RGAA-blue)](documentation/6-ACCESSIBILITY.md)

Plateforme de gestion de stocks intelligente. Interface web responsive et accessible, avec design system intégré et suggestions IA pour l'analyse des stocks.

**[Démo live](https://brave-field-03611eb03.5.azurestaticapps.net)** · **[Storybook Design System](https://68f5fbe10f495706cb168751-nufqfdjaoc.chromatic.com/)**

**Stack** : React, TypeScript, Vite, TailwindCSS, Framer Motion (versions exactes dans `package.json`). Design system externe : [@stockhub/design-system](https://github.com/SandrineCipolla/stockhub_design_system), Web Components Lit.

---

## Démarrage rapide

```bash
git clone https://github.com/SandrineCipolla/stockHub_V2_front.git
cd stockHub_V2_front
npm install
cp .env.example .env.local   # éditer les variables d'environnement
npm run dev
```

Application disponible sur **http://localhost:5173**.

Build de production : `npm run build`. Prévisualisation : `npm run preview`.

## Structure du projet

```
stockHub_V2_front/
├── public/          # Assets statiques (sitemap, robots.txt, llms.txt)
├── src/
│   ├── components/  # Composants React réutilisables
│   ├── contexts/
│   ├── hooks/        # Hooks personnalisés
│   ├── pages/        # Pages web
│   ├── types/        # Types TypeScript
│   ├── utils/
│   ├── App.tsx
│   └── main.tsx
└── scripts/         # Scripts utilitaires (ex : génération sitemap)
```

## Scripts

```bash
npm run dev              # Serveur de développement
npm run build            # Build de production
npm run test:run         # Tous les tests, une fois
npm run ci:check          # Pipeline complet (qualité + tests + build)
```

Liste complète des scripts (build, tests, audits qualité, CI) : `package.json`.

## Git Hooks (Husky)

Pre-commit (formatage, ESLint, TypeScript) et pre-push (tests, détection de code mort, build) automatisés. Détail : [CONTRIBUTING.md](CONTRIBUTING.md).

Bypass en cas d'urgence uniquement : `git commit --no-verify`, `git push --no-verify`.

## Déploiement

| Environnement | Plateforme                             | Déclenchement               |
| ------------- | -------------------------------------- | --------------------------- |
| Local         | `npm run dev`                          | manuel                      |
| Staging       | Vercel (branche `staging`)             | preview automatique par PR  |
| Production    | Azure Static Web Apps (branche `main`) | automatique sur push `main` |

Déploiement manuel Vercel : `vercel --prod`.

## Design System

Composants Web Components Lit, package séparé [@stockhub/design-system](https://github.com/SandrineCipolla/stockhub_design_system). Liste des composants et exemples d'usage : [Storybook](https://68f5fbe10f495706cb168751-nufqfdjaoc.chromatic.com/), pas dupliquée ici. Guide d'intégration React + Web Components : [documentation/2-WEB-COMPONENTS-GUIDE.md](documentation/2-WEB-COMPONENTS-GUIDE.md).

## Accessibilité

Conformité WCAG 2.1 niveau AA visée : navigation clavier, contrastes validés, ARIA, structure sémantique, support `prefers-reduced-motion`. Rapport d'audit complet : [documentation/6-ACCESSIBILITY.md](documentation/6-ACCESSIBILITY.md).

## Tests et qualité

Trois niveaux : unitaires (Vitest + Testing Library), wrappers Web Components, E2E (Playwright). Métriques à jour (couverture, Lighthouse, bundle size) : badge CI ci-dessus et [documentation/9-DASHBOARD-QUALITY.md](documentation/9-DASHBOARD-QUALITY.md), pas de chiffre figé ici.

Audits disponibles : `npm run audit:full` (Lighthouse, FPS, a11y, datasets, WCAG). Détail des sous-audits : `package.json`.

## Éco-conception

Optimisation des images (formats modernes, lazy loading), purge CSS, tree shaking et code splitting. Objectif EcoIndex : grade B ou supérieur.

## Documentation

- [CONTRIBUTING.md](CONTRIBUTING.md) : process de contribution (branches, commits, PR, issues)
- [CLAUDE.md](CLAUDE.md) : contexte projet pour sessions IA
- [documentation/0-INDEX.md](documentation/0-INDEX.md) : index complet de la documentation
- [docs/adr/INDEX.md](docs/adr/INDEX.md) : Architecture Decision Records
- [CHANGELOG.md](CHANGELOG.md) : journal des changements (généré automatiquement)
- [Wiki du projet](https://github.com/SandrineCipolla/stockHub_V2_front/wiki) : documentation transversale aux 3 repos StockHub

## Équipe

Sandrine Cipolla, développeuse full stack.

## License

Propriétaire, tous droits réservés. Consultation et fork à titre de référence personnelle autorisés, réutilisation ou intégration dans un autre projet non autorisée. Voir [LICENSE](LICENSE).
