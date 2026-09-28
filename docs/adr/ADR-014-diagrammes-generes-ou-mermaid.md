---
author: Sandrine Cipolla
status: ACCEPTÉ
related:
---

# ADR-014 - Diagrammes générés depuis le code quand il en est la source, Mermaid sinon, draw.io pour ce que Mermaid ne dessine pas

**Date** : 2026-09-28

---

## Contexte

Le référentiel RNCP demande une architecture schématisée dans un langage standard (UML, BPMN) et répondant aux cas d'utilisation (Ce2.1.1 à Ce2.1.3), ainsi qu'une documentation technique qui montre la structure des bases de données et le schéma général de la sécurité (Ce3.6.1).

Les diagrammes existants sont écrits à la main et éparpillés : graphes Mermaid dans `docs/V2/ARCHITECTURE.md` et `docs/9-DASHBOARD-QUALITY.md` du frontend, ERD et flowchart dans `docs/technical/` du backend, C4 dans la page `Architecture-Globale` du wiki, schéma de déploiement en texte ASCII dans `docs/technical/DEPLOYMENT-ARCHITECTURE.md`. L'ERD du backend a décroché du schéma Prisma sans que personne ne le voie : une table et deux champs manquaient, une cardinalité était fausse (stockhub_back#304).

Plusieurs diagrammes restent à produire : cas d'utilisation, séquences, schéma de sécurité, diagramme de classes du domaine, dépendances entre couches, modèle conceptuel des données.

## Décision

La source d'un diagramme dépend de ce qu'il représente :

| Cas                             | Source                                                                                                        | Exemples                                                                                            |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| Le code est la source de vérité | **Généré depuis le code**, ou vérifié en CI contre le code quand la génération coûte plus qu'elle ne rapporte | ERD depuis `prisma/schema.prisma`, dépendances entre couches depuis les imports, classes du domaine |
| Pas de source dans le code      | **Mermaid écrit à la main**, dans un bloc de code du fichier Markdown                                         | Architecture, séquences, schéma de sécurité, déploiement                                            |
| Type que Mermaid ne dessine pas | **draw.io**, fichier `.drawio.svg` versionné                                                                  | Cas d'utilisation UML, modèle conceptuel Merise                                                     |

Raisons :

- **Un diagramme dérivé du code ne peut pas décrocher.** C'est la seule garantie contre l'écart constaté sur l'ERD.
- **Mermaid est du texte** : GitHub le dessine sans outil, il se relit en diff dans une PR et se corrige comme le reste de la documentation.
- **Mermaid n'a ni diagramme de cas d'utilisation UML ni notation Merise.** Un fichier `.drawio.svg` s'affiche comme une image sur GitHub et reste modifiable dans draw.io, que le référentiel cite en exemple d'outil (C2.1).

L'outil de génération de chaque diagramme est choisi dans son issue, en mesurant son coût d'installation et de CI : stockhub_back#305 pour l'ERD, stockhub_back#306 pour les classes, stockhub_back#307 pour les dépendances.

Chaque dépôt range ses diagrammes dans un dossier `diagrams/` de sa documentation (`docs/diagrams/` pour le frontend et le backend, `documentation/diagrams/` pour le Design System), avec un `INDEX.md` qui liste chaque diagramme, sa source (générée ou manuelle) et, s'il est généré, la commande qui le produit. Les diagrammes transverses aux trois dépôts (architecture, sécurité, cas d'utilisation, séquences de bout en bout) vivent dans le dossier du frontend, qui porte déjà le wiki et les issues transverses.

## Alternatives

| Alternative                      | Pourquoi rejetée                                                                                                                                |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Tout en Mermaid, écrit à la main | Garde le risque de décrochage constaté sur l'ERD pour les diagrammes qui ont une source dans le code. Pas de cas d'utilisation UML ni de Merise |
| Tout en draw.io                  | Fichiers illisibles en diff, aucun lien avec le code, chaque évolution demande l'outil graphique                                                |
| PlantUML                         | GitHub ne l'affiche pas nativement. Le rendu demande Java ou un serveur, en local comme en CI                                                   |
| Images exportées (PNG)           | Non modifiables, non relisibles en diff, décrochent dès la première évolution                                                                   |

## Conséquences

- **Positif** : les diagrammes issus du code restent justes sans y penser, ou la CI signale l'écart
- **Positif** : tous les diagrammes s'affichent sur GitHub, sans outil à installer pour les lire
- **Positif** : un seul endroit par dépôt pour trouver un diagramme
- **Négatif** : deux formats à connaître (Mermaid et draw.io), plus les outils de génération
- **Négatif** : les diagrammes Mermaid et draw.io restent maintenus à la main. Seule la relecture en PR les protège
- **Négatif** : les générateurs ajoutent des dépendances et du temps de CI, à mesurer dans chaque issue

## Critères de vérification

- Chaque diagramme du projet figure dans un `diagrams/INDEX.md`, avec sa source
- Un diagramme marqué « généré » se reproduit à l'identique avec la commande de l'index, ou la CI échoue
- Aucun diagramme n'est une image PNG ou JPG sans fichier source
- Rouvrir la décision si un outil de génération devient plus coûteux à maintenir que le diagramme manuel qu'il remplace

## Liens

- Issue : #336, sous-issues #337, #338, #339, stockhub_back#305, stockhub_back#306, stockhub_back#307, stockhub_back#308
- Correction de l'ERD qui a motivé la décision : stockhub_back#304

---

Les ADR sont immuables. Si cette décision change, créer une nouvelle ADR qui supplante celle-ci plutôt que de modifier celle-ci.
