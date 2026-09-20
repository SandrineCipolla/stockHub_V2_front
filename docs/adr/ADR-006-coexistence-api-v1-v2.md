# ADR-006 - Coexistence des API V1 et V2 côté consommation frontend

**Date** : automne 2025
**Statut** : Accepté

---

## Contexte

Le backend a migré vers une architecture DDD/CQRS pour sa V2 (voir [ADR-001 du backend](https://github.com/SandrineCipolla/stockhub_back/blob/main/docs/adr/ADR-001-migration-ddd-cqrs.md)). Réécrire tous les endpoints en une fois aurait immobilisé les livraisons frontend et exposé à des régressions sur des fonctionnalités déjà stables.

## Décision

Le frontend consomme les deux versions simultanément pendant la migration : `/api/v1` pour l'écriture et le CRUD complet, `/api/v2` pour la lecture servie par la couche DDD.

## Conséquences

- **Positif** : la migration backend avance endpoint par endpoint sans bloquer le frontend
- **Négatif** : deux conventions de réponse coexistent dans le client API, il faut savoir laquelle s'applique à chaque appel
- **Négatif** : la V2 ne retourne pas tous les champs de la V1. Pour les mises à jour, le frontend fusionne la réponse sur l'état local existant et recalcule les champs manquants côté client (voir [CLAUDE.md](../../CLAUDE.md), section Patterns de mise à jour d'état)
- **Temporaire par nature** : cette décision est à supplanter quand la V2 couvrira l'écriture

## Liens

- Code concerné : `src/services/api/stocksAPI.ts`
- ADR backend liée : [ADR-005 versioning API V2](https://github.com/SandrineCipolla/stockhub_back/blob/main/docs/adr/ADR-005-api-versioning-v2.md)
