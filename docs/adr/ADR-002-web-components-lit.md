# ADR-002: Web Components (Lit) plutôt que composants React purs

**Date:** 2025-10
**Statut:** Accepté
**Décideurs:** Sandrine Cipolla

---

## Contexte

Le Design System devait être utilisable par le frontend React mais potentiellement par d'autres surfaces (mobile, autres frameworks).

## Contraintes et critères

**Contraintes :**

- Doit rester utilisable si un futur client non-React apparaît (ex: app mobile).

**Critères :**

- Portabilité entre frameworks
- Poids du bundle
- Durabilité du choix technique (standard vs dépendant d'un framework)

## Décision

Construire les composants avec **Lit Element** (Web Components natifs) plutôt que des composants React.

## Raisons

- Framework-agnostique : fonctionne en React, Vue, Angular, HTML natif
- Standard web W3C — durabilité
- Lit est très léger (~5KB), isolation via Shadow DOM
- Compatible avec `lucide-react` du frontend via `lucide` vanilla

## Conséquences

### Positives

- Design System réutilisable indépendamment du framework frontend
- Isolation stricte du style (Shadow DOM) : pas de collision CSS avec le reste de l'app

### Négatives

- Les Web Components nécessitent des wrappers React (avec `ref`, `addEventListener`) pour les événements et le binding TypeScript
- 234 tests de wrappers spécifiques ont dû être écrits pour compenser l'absence d'intégration React native

## Réexamen

Rouvrir si le coût de maintenance des wrappers React dépasse le bénéfice de portabilité (ex: aucun client non-React n'a émergé après plusieurs années et le wrapping continue de coûter du temps à chaque nouveau composant).

## Liens

- Repo: [stockhub_design_system](https://github.com/SandrineCipolla/stockhub_design_system)
- ADR lié: [ADR-001 (Séparation du Design System)](./ADR-001-separation-design-system.md)

---

**Note:** Les ADRs sont immuables. Si cette décision change, créer une nouvelle ADR qui supplante celle-ci.
