# Créer une issue GitHub au format User Story

Crée une issue GitHub en respectant **strictement** le format User Story du projet.

## Instructions

1. Demande-moi les informations manquantes si elles ne sont pas fournies :
   - **Persona** : qui est l'utilisateur ? (ex: utilisateur connecté, admin famille)
   - **Action souhaitée** : que veut-il faire ?
   - **Bénéfice** : pourquoi / quelle valeur ?
   - **Priorité** : `P1` (haute) / `P2` (moyenne) / `P3` (basse) / `P4` (très basse)
   - **Type** : `feature` / `improvement` / `documentation` / `tech-debt`

2. Génère le body avec ce format. Seul ajout autorisé : une section `**Contexte**` facultative après les critères, qui décrit le constat sans solution technique.

```
**En tant que** [persona]
**Je souhaite** [action souhaitée]
**Afin de** [bénéfice attendu]

---

**Critères d'acceptation**

Étant donné que [contexte initial]
Lorsque [action déclenchée]
Alors :
- [ ] Critère 1
- [ ] Critère 2
- [ ] Critère 3
```

3. Exécute la commande suivante :

```bash
gh issue create \
  --title "[phrase courte orientée résultat, sans préfixe]" \
  --label "front,[type],[priorité]" \
  --body "[body généré ci-dessus]"
```

## Règles ABSOLUES

- ❌ Pas de détails d'implémentation (composants, fichiers, code)
- ❌ Pas d'étapes techniques de développement
- ❌ Pas de commandes à exécuter
- ❌ Pas de TODO techniques
- ✅ Maximum 5 critères d'acceptation
- ✅ Le titre doit être compréhensible par un non-développeur, sans préfixe (`[US-XXX]`, `feat:`...)
- ✅ Convention complète : section « Gestion des issues GitHub » de `CONTRIBUTING.md`
- ❌ Aucune signature d'outil ou d'IA dans le body
- ✅ Les critères d'acceptation décrivent un comportement visible, pas du code
