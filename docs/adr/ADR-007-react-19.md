# ADR-007 - Choix du framework frontend : React 19

**Date** : avril 2025
**Statut** : Accepté

---

## Contexte

Choix du framework principal de l'application, au démarrage du projet. Deux contraintes réelles pesaient sur la décision, au-delà des qualités techniques :

- **Employabilité** : le projet est support d'une certification RNCP visant l'insertion professionnelle, le framework retenu doit être celui que le marché demande
- **Stratégie cross-platform** : une application mobile est envisagée en V3, le choix ne doit pas fermer cette porte

## Décision

React 19, avec TypeScript en mode strict et Vite comme build tool (voir [ADR-008](./ADR-008-vite-build-tool.md)).

Motifs du choix :

- Employabilité : 44,7 % d'utilisation professionnelle déclarée (Stack Overflow Developer Survey 2025)
- Cross-platform : React Native partage les mêmes paradigmes, une V3 mobile réutiliserait la logique et les compétences

## Alternatives

| Alternative | Raison du rejet                                                                                                                                    |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| Next.js     | Le rendu serveur n'apporte rien à une SPA entièrement authentifiée derrière Azure AD B2C, tout en imposant son modèle de routing et de déploiement |
| Vue, Svelte | Qualités techniques réelles, mais demande professionnelle inférieure sur le marché visé                                                            |

## Conséquences

- **Positif** : écosystème large, recrutement de compétences facile, continuité vers React Native
- **Négatif** : React 19 était récent au moment du choix, certaines librairies tierces n'étaient pas encore compatibles

## Liens

- Décision liée : [ADR-008](./ADR-008-vite-build-tool.md)
