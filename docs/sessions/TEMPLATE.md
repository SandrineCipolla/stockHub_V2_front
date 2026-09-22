# Template de session de développement

> Extrait du format réellement utilisé dans `ETAT_DU_PROJET.md`
> (blocs "Session du [DATE]", actifs depuis plusieurs mois, dernière
> occurrence : 22 septembre 2026). Pas un nouveau format : la structure
> déjà en usage, isolée pour être réutilisable.

À insérer en tête de `ETAT_DU_PROJET.md`, sous le bloc d'en-tête
(Date de rédaction / Dernière activité / Branche active / Version).

---

## Session du [DATE] : ce qui a été fait

### Tickets fermés

| #    | Titre         | PR      |
| ---- | ------------- | ------- |
| #XXX | [Titre court] | #XXX ✅ |

### #XXX [Titre court] (PR #XXX)

- [Composant/fichier modifié] : [ce qui a changé]
- [Composant/fichier modifié] : [ce qui a changé]
- [Tests ajoutés/modifiés, si applicable]

<!-- Si c'est un fix, ajouter un paragraphe "Diagnostic" :
**Diagnostic** : [cause identifiée], [pourquoi], [ce que le fix couvre
réellement vs ce qu'il ne couvre pas]. -->

### Tickets créés

| #    | Titre         | Priorité |
| ---- | ------------- | -------- |
| #XXX | [Titre court] | P0-P3    |

---

## Variante : modification hors ticket (fix CI, chore direct sur main)

### [Titre court de la modification]

[Description courte : cause, fichier(s) touché(s), résolution.]

---

## Règles d'usage

- Un bloc "Session du [DATE]" par session de travail, ajouté **en tête**
  des sessions précédentes dans `ETAT_DU_PROJET.md` (ordre antéchronologique).
- Ne documenter que ce qui a été réellement fait, pas de planification
  dans ce bloc (le suivi des tâches à venir se fait sur le GitHub
  Project).
- Un bloc bascule dans `docs/sessions/` dès un mois d'ancienneté ou
  au-delà de 3 sessions actives dans `ETAT_DU_PROJET.md`.
- Un ticket sans PR encore ouverte reste dans "Tickets créés", pas
  dans "Tickets fermés".
