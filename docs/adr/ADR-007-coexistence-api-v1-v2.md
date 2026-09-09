# ADR-007: Coexistence API V1 et V2 côté consommation frontend

**Date:** 2025 (automne)
**Statut:** Accepté
**Décideurs:** Sandrine Cipolla

---

## Contexte

Le backend a fait évoluer son architecture vers DDD/CQRS en V2 (voir ADR-001 backend) sans réécrire tous les endpoints, pour éviter des régressions. Le frontend doit donc consommer deux versions d'API en parallèle pendant la transition.

## Décision

Le frontend consomme `/api/v1/stocks` (opérations d'écriture, CRUD complet) et `/api/v2/stocks` (lecture, architecture DDD) simultanément, sans bloquer sur une migration complète côté backend avant de livrer des fonctionnalités.

## Raisons

- Réécrire tout le frontend pour une V2 pas encore complète côté backend aurait bloqué toute livraison de fonctionnalité
- La coexistence permet une migration progressive, alignée sur l'avancement réel du backend

## Conséquences

### Positives

- Pas de blocage des livraisons frontend en attendant la complétion de la migration backend

### Négatives

- Deux conventions d'API à gérer côté frontend pendant la transition (risque de confusion sur quelle version appeler)

## Réexamen

Rouvrir (et documenter la clôture) une fois la migration V2 backend complète et V1 dépréciée côté client.

## Liens

- ADR lié (backend): [ADR-005 (API versioning V2)](https://github.com/SandrineCipolla/stockhub_back/blob/main/docs/adr/ADR-005-api-versioning-v2.md)

---

**Note:** Les ADRs sont immuables. Si cette décision change, créer une nouvelle ADR qui supplante celle-ci.
