# Template — Session de développement

> Extrait du format réellement utilisé dans `ETAT-DU-PROJET.md`
> (blocs "Session du [DATE]", actifs depuis plusieurs mois, dernière
> occurrence : 18 juin 2026). Pas un nouveau format — la structure
> déjà en usage, isolée pour être réutilisable.

À insérer en tête de `ETAT-DU-PROJET.md`, sous le bloc d'en-tête
(Date de rédaction / Dernière activité / Branche active / Version).

---

## Session du [DATE] — Ce qui a été fait

### Tickets fermés

| #    | Titre         | PR      |
| ---- | ------------- | ------- |
| #XXX | [Titre court] | #XXX ✅ |

### #XXX — [Titre court] (PR #XXX)

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

## Variante — modification hors ticket (fix CI, chore direct sur main)

### [Titre court de la modification]

[Description courte : cause, fichier(s) touché(s), résolution.]

---

## Règles d'usage

- Un bloc "Session du [DATE]" par session de travail, ajouté **en tête**
  des sessions précédentes dans `ETAT-DU-PROJET.md` (ordre antéchronologique).
- Ne documenter que ce qui a été réellement fait — pas de planification
  dans ce bloc (la section "Pour la prochaine session" du fichier sert
  à ça).
- Un ticket sans PR encore ouverte reste dans "Tickets créés", pas
  dans "Tickets fermés".
