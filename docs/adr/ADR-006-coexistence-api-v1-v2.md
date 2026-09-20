---
author: Sandrine Cipolla
status: ACCEPTÉ
related: ./ADR-012-fetch-natif-plutot-quaxios.md
---

# ADR-006 - Coexistence des API V1 et V2 côté consommation frontend

**Date** : automne 2025

---

## Contexte

Le backend a fait évoluer son architecture vers DDD et CQRS pour sa V2, sans réécrire tous les endpoints d'un coup, afin d'éviter les régressions sur des fonctionnalités stables. Le frontend doit donc consommer deux versions d'API pendant la transition.

## Décision

Consommer les deux versions simultanément : `/api/v1` pour l'écriture et le CRUD complet, `/api/v2` pour la lecture servie par la couche DDD.

Ce qui a emporté la décision : attendre une V2 complète avant de livrer côté frontend aurait bloqué toutes les fonctionnalités. La coexistence aligne l'avancement du frontend sur celui, réel, du backend.

## Conséquences

- **Positif** : les livraisons frontend ne dépendent plus de la complétion de la migration backend
- **Négatif** : deux conventions de réponse coexistent dans le client API, avec un risque de confusion sur la version à appeler
- **Négatif** : la V2 ne retourne pas tous les champs de la V1. Pour les mises à jour, le frontend fusionne la réponse sur l'état local et recalcule les champs manquants, voir la section des patterns de mise à jour d'état dans [CLAUDE.md](../../CLAUDE.md)
- **Temporaire par nature** : cette décision est faite pour être supplantée

## Critères de vérification

Rouvrir cette décision, et documenter sa clôture, une fois la migration V2 terminée côté backend et la V1 dépréciée côté client.

## Liens

- Code concerné : `src/services/api/stocksAPI.ts`
- ADR liée (backend) : [ADR-005 versioning API V2](https://github.com/SandrineCipolla/stockhub_back/blob/main/docs/adr/ADR-005-api-versioning-v2.md)
- ADR liée (backend) : [ADR-001 migration DDD et CQRS](https://github.com/SandrineCipolla/stockhub_back/blob/main/docs/adr/ADR-001-migration-ddd-cqrs.md)

---

Les ADR sont immuables. Si cette décision change, créer une nouvelle ADR qui supplante celle-ci plutôt que de modifier celle-ci.
