# Cas d'utilisation de StockHub

Acteurs et cas d'utilisation de l'application, établis à partir du code : routes et contrôle des droits du backend (`src/api/routes/StockRoutesV2.ts`, `src/domain/authorization/`), pages et appels API du frontend (`src/App.tsx`, `src/services/api/`). Le diagramme UML correspondant est [cas-utilisation.drawio](cas-utilisation.drawio), à ouvrir dans draw.io (règle des diagrammes : [ADR-014](../adr/ADR-014-diagrammes-generes-ou-mermaid.md)).

## Acteurs

| Acteur               | Qui                                                                  |
| -------------------- | -------------------------------------------------------------------- |
| Visiteur             | Personne non connectée                                               |
| Utilisateur connecté | Personne authentifiée par Azure AD B2C                               |
| Lecteur              | Utilisateur connecté qui a le rôle `VIEWER` sur un stock             |
| Contributeur         | Utilisateur connecté qui a le rôle `VIEWER_CONTRIBUTOR` sur un stock |
| Éditeur              | Utilisateur connecté qui a le rôle `EDITOR` sur un stock             |
| Propriétaire         | Utilisateur connecté qui a créé le stock (rôle `OWNER`)              |
| Azure AD B2C         | Fournisseur d'identité, système externe                              |
| Service IA           | OpenRouter et Mistral, système externe qui produit les suggestions   |

Les rôles s'appliquent **par stock** : une même personne peut être propriétaire d'un stock et lectrice d'un autre. Chaque rôle hérite des cas du rôle précédent : Lecteur, puis Contributeur, puis Éditeur, puis Propriétaire (`StockRole.canRead`, `canContribute`, `canWrite`).

## Cas d'utilisation

| #    | Cas                                                             | Acteur principal            | Source dans le code                                                      |
| ---- | --------------------------------------------------------------- | --------------------------- | ------------------------------------------------------------------------ |
| UC1  | Consulter la page d'accueil                                     | Visiteur                    | route `/`, `LandingPage.tsx`                                             |
| UC2  | Consulter la politique de confidentialité                       | Visiteur                    | route `/privacy`, `Privacy.tsx`                                          |
| UC3  | Se connecter                                                    | Visiteur, avec Azure AD B2C | MSAL, `src/config/authConfig.ts`                                         |
| UC4  | Se déconnecter                                                  | Utilisateur connecté        | en-tête, `sh-logout-click`                                               |
| UC5  | Consulter ses stocks, possédés et partagés                      | Utilisateur connecté        | `GET /stocks`, route `/dashboard`                                        |
| UC6  | Rechercher et filtrer les stocks                                | Utilisateur connecté        | `Dashboard.tsx`                                                          |
| UC7  | Exporter la liste des stocks en CSV                             | Utilisateur connecté        | `useDataExport`, `Dashboard.tsx`                                         |
| UC8  | Consulter les statistiques                                      | Utilisateur connecté        | route `/analytics`                                                       |
| UC9  | Créer un stock, et en devenir propriétaire                      | Utilisateur connecté        | `POST /stocks`                                                           |
| UC10 | Voir le nombre de contributions en attente                      | Utilisateur connecté        | `GET` nombre de contributions en attente, `usePendingContributionsCount` |
| UC11 | Consulter un stock et ses articles                              | Lecteur                     | `GET` détail, articles, article (`authorizeStockRead`)                   |
| UC12 | Consulter l'historique et la prédiction de rupture d'un article | Lecteur                     | `GET` historique et prédiction (`authorizeStockRead`)                    |
| UC13 | Consulter les suggestions IA du stock                           | Lecteur, avec le Service IA | `GET` suggestions (`authorizeStockRead`)                                 |
| UC14 | Consulter les collaborateurs du stock                           | Lecteur                     | `GET` collaborateurs (`authorizeStockRead`)                              |
| UC15 | Consulter les contributions du stock                            | Lecteur                     | `GET` contributions (`authorizeStockRead`)                               |
| UC16 | Proposer une nouvelle quantité pour un article                  | Contributeur                | `POST` contribution (`authorizeStockContribute`)                         |
| UC17 | Modifier le stock                                               | Éditeur                     | `PATCH /stocks/:stockId` (`authorizeStockWrite`)                         |
| UC18 | Supprimer le stock                                              | Éditeur                     | `DELETE /stocks/:stockId` (`authorizeStockWrite`)                        |
| UC19 | Ajouter, modifier ou supprimer un article                       | Éditeur                     | `POST`, `PATCH`, `DELETE` article (`authorizeStockWrite`)                |
| UC20 | Mettre à jour la quantité d'un article                          | Éditeur                     | `PATCH` article, enregistré dans l'historique                            |
| UC21 | Valider ou refuser une contribution                             | Éditeur                     | `PATCH` contribution (`authorizeStockWrite`)                             |
| UC22 | Gérer les lecteurs et les contributeurs                         | Éditeur                     | `POST`, `PATCH`, `DELETE` collaborateur, `canActOnRole`                  |
| UC23 | Gérer les éditeurs                                              | Propriétaire                | `canActOnRole` : seul `OWNER` agit sur `EDITOR`                          |

## Écart connu

- **UC18 : un éditeur peut supprimer le stock**, alors que le stock appartient à quelqu'un d'autre. La route n'exige que le droit d'écriture, commun à `OWNER` et `EDITOR`. La suppression doit être réservée au propriétaire : correction suivie dans [stockhub_back#313](https://github.com/SandrineCipolla/stockhub_back/issues/313). Une fois corrigé, UC18 passe au Propriétaire.

## Évolution prévue

- **Quitter un stock partagé** : un collaborateur (lecteur, contributeur ou éditeur) ne peut pas se retirer lui-même d'un stock aujourd'hui, seul le propriétaire ou un éditeur peut le retirer. Fonctionnalité prévue dans #351, à ajouter comme cas du Lecteur une fois livrée.

## Hors périmètre

- **Familles** : la notion existe dans la base (tables `Family` et `FamilyMember`) et le domaine du backend, mais aucune fonctionnalité ne l'expose. Ce n'est pas un acteur de l'application actuelle, seulement une évolution possible.
