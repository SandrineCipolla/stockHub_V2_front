# ADR-002 - Web Components (Lit) plutôt que composants React purs

**Date** : octobre 2025
**Statut** : Accepté

---

## Contexte

Le Design System extrait en repo indépendant ([ADR-001](./ADR-001-separation-design-system.md)) devait être consommable par le frontend React, mais aussi potentiellement par d'autres surfaces : application mobile, autre framework, page statique.

## Décision

Construire les composants avec **Lit Element**, c'est-à-dire des Web Components natifs, plutôt que des composants React.

Motifs du choix :

- Framework-agnostique : un Web Component s'utilise dans n'importe quel contexte HTML
- Standard web W3C, pas une abstraction propriétaire à un framework
- Runtime très léger (environ 5 KB)

## Alternatives

| Alternative                   | Raison du rejet                                                              |
| ----------------------------- | ---------------------------------------------------------------------------- |
| Composants React purs         | Enferme le design system dans React, contraire à l'objectif de réutilisation |
| Composants compilés (Stencil) | Couche de build supplémentaire pour un bénéfice comparable à Lit             |

## Conséquences

- **Positif** : le design system reste utilisable hors React
- **Négatif** : des wrappers React sont nécessaires pour les `ref` et la propagation d'événements, ce qui ajoute une couche à tester (234 tests dédiés à ces wrappers)
- **Négatif** : le typage JSX des balises custom demande des déclarations explicites (voir `src/types/web-component-events.ts`)

## Liens

- Décision liée : [ADR-001](./ADR-001-separation-design-system.md)
- Guide d'intégration : `documentation/2-WEB-COMPONENTS-GUIDE.md`
