---
author: Sandrine Cipolla
status: ACCEPTÉ
related: ./ADR-006-coexistence-api-v1-v2.md
---

# ADR-012 - fetch natif plutôt qu'un client HTTP dédié (Axios / ky)

**Date** : 2026-09-09

---

## Contexte

Le frontend appelle l'API StockHub depuis plusieurs points du code (`ItemMobileCard.tsx`, `useNotificationCount.ts`, `usePendingContributionsCount.ts`, `StockDetailPage.tsx`, et les tests associés) via `fetch()` natif. Aucune dépendance HTTP (`axios`, `ky`, `ofetch`...) n'est installée, et aucun wrapper client centralisé n'existe. Ce choix n'a jamais été écrit nulle part (ni ADR, ni wiki), alors que le projet compte déjà 12 ADR front documentant des décisions de poids comparable ou moindre (voir INDEX).

Ce n'est pas un détail de conception isolé : ça touche l'ensemble des appels API du frontend (interface partagée, cf. schéma de décision du cours "Comment faire des choix" : un choix qui touche plusieurs composants mérite d'être documenté).

## Contraintes et critères

**Contraintes :**

- Cible navigateurs modernes uniquement (aucun support IE11/legacy exigé pour StockHub), condition nécessaire pour que `fetch` natif soit utilisable sans polyfill.
- Projet solo (~1 jour/semaine) : chaque dépendance ajoutée doit être auditée et maintenue par une seule personne.

**Critères (cf. cours "Les critères d'un choix technique") :**

- Dépendances : chaque librairie ajoute du code à auditer et une API susceptible d'évoluer
- Testabilité : facilité de mock dans Vitest
- Maintenabilité : lisibilité du code d'appel API à travers le projet
- Complexité : nombre de couches/concepts à apprendre pour un nouveau contributeur

## Hypothèses et preuves

| Affirmation                                                                                                                | Type      | Vérification                                                                                                                                              |
| -------------------------------------------------------------------------------------------------------------------------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Les appels API actuels n'ont besoin d'aucune fonctionnalité avancée (intercepteurs, retry automatique, annulation groupée) | Preuve    | Inspection du code : 5 fichiers, tous des `fetch()` simples avec `try/catch` local, aucun usage d'`AbortController` partagé ni de logique de retry        |
| Le besoin d'un refresh token automatique n'apparaîtra pas à court terme                                                    | Hypothèse | Non vérifié (dépend de la façon dont Azure AD B2C MSAL gère déjà le renouvellement de token côté frontend, à confirmer dans `src/config/authConfig.ts`)   |
| `fetch` natif ne nécessite aucun polyfill sur les navigateurs ciblés                                                       | Preuve    | `fetch` supporté nativement sur toutes les versions de navigateurs modernes visées par le projet (aucune contrainte de compatibilité ancienne identifiée) |

## Décision

Continuer avec **`fetch` natif** pour tous les appels HTTP du frontend. Ne pas introduire Axios ni un wrapper dédié (ky, ofetch) tant que le besoin réel ne s'en fait pas sentir.

Ce qui a emporté la décision :

- Le critère « dépendances » du cours s'applique directement : `fetch` natif suffit pour des appels HTTP JSON simples dans un navigateur moderne. Ajouter Axios introduirait une dépendance sans capacité nécessaire aujourd'hui.
- Cohérent avec le choix backend REST simple (cf. [ADR-016 backend](https://github.com/SandrineCipolla/stockhub_back/blob/main/docs/adr/ADR-016-rest-api-style.md)) : un seul client, pas de besoin de négociation de contenu ou de features avancées.
- Zéro dépendance supplémentaire à auditer et à maintenir, ce qui est pertinent pour un projet solo.

## Alternatives

### Alternative 1: Axios

- **Avantages :** intercepteurs (utile pour un futur refresh token centralisé), gestion legacy, API plus riche
- **Inconvénients :** dépendance supplémentaire (~15KB gzippé) pour des besoins non encore observés. L'application cible des navigateurs modernes où `fetch` couvre déjà le besoin
- **Pourquoi rejetée :** aucune capacité manquante aujourd'hui ne justifie le coût de dépendance. Ce choix reste réévaluable si le besoin d'intercepteur apparaît (voir Réexamen)

### Alternative 2: Wrapper léger (ky / ofetch)

- **Avantages :** retry et timeout par défaut, API plus ergonomique que `fetch` brut, plus léger qu'Axios
- **Inconvénients :** dépendance supplémentaire pour un besoin (retry automatique) non identifié dans le code actuel
- **Pourquoi rejetée :** même raisonnement qu'Axios, en plus léger. Il n'y a pas encore de preuve que `fetch` brut pose un problème concret

## Comparaison pondérée

| Critère                                    | Poids | fetch natif, note | résultat | Axios, note | résultat | ky, note | résultat |
| ------------------------------------------ | ----- | ----------------- | -------- | ----------- | -------- | -------- | -------- |
| Dépendances (moins = mieux)                | 3     | 5                 | 15       | 2           | 6        | 3        | 9        |
| Fonctionnalités couvertes vs besoin actuel | 2     | 4                 | 8        | 5           | 10       | 4        | 8        |
| Testabilité (mock simple)                  | 2     | 4                 | 8        | 4           | 8        | 4        | 8        |
| Verbosité gestion JSON/erreurs             | 1     | 2                 | 2        | 4           | 4        | 4        | 4        |
| **Total**                                  |       |                   | **33**   |             | **28**   |          | **29**   |

Grille construite sur les besoins actuels uniquement. Un besoin futur réel (ex. intercepteur d'auth) changerait la pondération du critère "fonctionnalités couvertes" et pourrait inverser le résultat.

## Scénario de qualité associé

| Champ             | Valeur                                                                                                                                                                                              |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Source            | développeuse ajoutant un nouvel appel API                                                                                                                                                           |
| Stimulus          | l'appel réseau échoue (timeout, 401, 500)                                                                                                                                                           |
| Environnement     | connexion lente ou session expirée                                                                                                                                                                  |
| Partie du système | hook ou composant appelant `fetch`                                                                                                                                                                  |
| Réponse attendue  | erreur interceptée et affichée proprement, pas de crash                                                                                                                                             |
| Mesure            | **hypothèse à vérifier** : aujourd'hui chaque call site gère son erreur individuellement (pas de gestion centralisée), non encore mesuré si cela produit des comportements incohérents entre écrans |

## Conséquences

### Positives

- Zéro dépendance HTTP supplémentaire à auditer, mettre à jour ou surveiller côté sécurité
- Bundle plus léger (cohérent avec les 113 KB gzippé mesurés en ADR-008)

### Négatives

- Gestion du JSON et des erreurs plus verbeuse : chaque call site réimplémente son propre `try/catch` et parsing (5 implémentations actuellement, sans garantie de cohérence entre elles)
- Pas d'intercepteur centralisé : si un besoin de refresh token automatique apparaît, il faudra soit l'ajouter à la main dans chaque call site, soit migrer vers un wrapper à ce moment-là

## Critères de vérification

Rouvrir cette décision si l'une de ces conditions est observée :

- Le nombre de call sites `fetch()` dépasse ~15-20 fichiers, rendant la duplication de gestion d'erreur coûteuse à maintenir
- Un besoin de refresh token automatique ou de retry systématique apparaît (ex. gestion silencieuse d'expiration de session Azure B2C)
- Un bug en production est attribuable à une gestion d'erreur incohérente entre deux call sites `fetch()` différents

## Liens

- Code concerné : `src/components/items/ItemMobileCard.tsx`, `src/hooks/useNotificationCount.ts`, `src/hooks/usePendingContributionsCount.ts`, `src/pages/StockDetailPage.tsx`
- ADR lié (backend) : [ADR-016 (Style d'API REST)](https://github.com/SandrineCipolla/stockhub_back/blob/main/docs/adr/ADR-016-rest-api-style.md)
- Cours de référence : section "Dépendances" de la fiche _Les critères d'un choix technique_

---

Les ADR sont immuables. Si cette décision change, créer une nouvelle ADR qui supplante celle-ci plutôt que de modifier celle-ci.
