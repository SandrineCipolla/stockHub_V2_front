# Diagrammes

Règle de source des diagrammes (généré depuis le code, Mermaid, draw.io) : [ADR-014](../adr/ADR-014-diagrammes-generes-ou-mermaid.md). Ce dossier accueille aussi les diagrammes transverses aux trois dépôts.

## Frontend

| Diagramme                                   | Emplacement                                                                                                   | Source                              |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| Architecture globale                        | [V2/ARCHITECTURE.md, « Schéma d'architecture globale »](../V2/ARCHITECTURE.md#-schéma-darchitecture-globale)  | Mermaid, manuel                     |
| Composition des composants                  | [V2/ARCHITECTURE.md, « Principe de composition »](../V2/ARCHITECTURE.md#principe-de-composition)              | Mermaid, manuel                     |
| Hiérarchie des design tokens                | [V2/ARCHITECTURE.md, « Token System Hiérarchique »](../V2/ARCHITECTURE.md#token-system-hiérarchique)          | Mermaid, manuel                     |
| Flux de données et état                     | [V2/ARCHITECTURE.md, « Architecture de gestion d'état »](../V2/ARCHITECTURE.md#architecture-de-gestion-détat) | Mermaid, manuel                     |
| Pipeline de développement                   | [V2/ARCHITECTURE.md, « Pipeline de développement »](../V2/ARCHITECTURE.md#pipeline-de-développement)          | Mermaid, manuel                     |
| Pyramide de tests                           | [V2/ARCHITECTURE.md, « Stratégie de test pyramidale »](../V2/ARCHITECTURE.md#stratégie-de-test-pyramidale)    | Mermaid, manuel                     |
| Chargement des données du dashboard qualité | [9-DASHBOARD-QUALITY.md, « Chargement des Données »](../9-DASHBOARD-QUALITY.md#chargement-des-données)        | Mermaid, manuel                     |
| Déploiement                                 | [technical/DEPLOYMENT-ARCHITECTURE.md](../technical/DEPLOYMENT-ARCHITECTURE.md)                               | Texte ASCII, à convertir en Mermaid |

## Transverses

| Diagramme                          | Emplacement                                                                                                  | Source          |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------ | --------------- |
| Architecture des trois dépôts (C4) | [Wiki, Architecture-Globale](https://github.com/SandrineCipolla/stockHub_V2_front/wiki/Architecture-Globale) | Mermaid, manuel |
| Cas d'utilisation                  | À produire (#337)                                                                                            | draw.io         |
| Séquences des flux clés            | À produire (#338)                                                                                            | Mermaid, manuel |
| Schéma général de la sécurité      | À produire (#339)                                                                                            | Mermaid, manuel |

## Autres dépôts

- Backend : ERD dans [docs/technical/database-schema.md](https://github.com/SandrineCipolla/stockhub_back/blob/main/docs/technical/database-schema.md) (Mermaid manuel, génération prévue dans stockhub_back#305), flux CQRS dans [docs/technical/ddd-cqrs-guide.md](https://github.com/SandrineCipolla/stockhub_back/blob/main/docs/technical/ddd-cqrs-guide.md)
- Design System : aucun diagramme à ce jour
