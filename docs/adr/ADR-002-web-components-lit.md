---
author: Sandrine Cipolla
status: ACCEPTÉ
related: ./ADR-001-separation-design-system.md
---

# ADR-002 - Web Components (Lit) plutôt que composants React purs

**Date** : 2025-10

---

## Contexte

Le Design System extrait en repository indépendant ([ADR-001](./ADR-001-separation-design-system.md)) devait rester utilisable par le frontend React, mais aussi par un éventuel client non React, une application mobile par exemple.

Critères retenus pour trancher : portabilité entre frameworks, poids ajouté au bundle, et durabilité du choix, un standard vieillissant mieux qu'une dépendance à un framework.

## Décision

Construire les composants avec **Lit Element**, c'est-à-dire des Web Components natifs, plutôt que des composants React.

Ce qui a emporté la décision : un Web Component s'utilise dans n'importe quel contexte HTML, React, Vue, Angular ou page statique. C'est un standard W3C et non une abstraction propriétaire, son runtime pèse environ 5 KB, et le Shadow DOM isole le style. Les icônes restent accessibles via `lucide` en vanilla, l'équivalent du `lucide-react` utilisé côté application.

## Alternatives

| Alternative                   | Pourquoi rejetée                                                                |
| ----------------------------- | ------------------------------------------------------------------------------- |
| Composants React purs         | Enferme le design system dans React, ce qui contredit le critère de portabilité |
| Composants compilés (Stencil) | Couche de build supplémentaire pour un résultat comparable à Lit                |

## Conséquences

- **Positif** : le design system reste utilisable hors React
- **Positif** : isolation stricte du style par le Shadow DOM, aucune collision CSS avec le reste de l'application
- **Négatif** : les `ref` et les événements demandent des wrappers React, et 234 tests de wrappers ont dû être écrits pour compenser l'absence d'intégration native
- **Négatif** : le typage JSX des balises custom demande des déclarations explicites, voir `src/types/web-component-events.ts`

## Critères de vérification

Rouvrir cette décision si le coût d'entretien des wrappers dépasse le bénéfice de portabilité, par exemple si aucun client non React n'a émergé après plusieurs années alors que chaque nouveau composant continue de demander son wrapper.

## Liens

- Repository : [stockhub_design_system](https://github.com/SandrineCipolla/stockhub_design_system)
- Guide d'intégration : [Guide Web Components](../../docs/2-WEB-COMPONENTS-GUIDE.md)
- ADR liée : [ADR-001](./ADR-001-separation-design-system.md)

---

Les ADR sont immuables. Si cette décision change, créer une nouvelle ADR qui supplante celle-ci plutôt que de modifier celle-ci.
