# Contribuer à StockHub Front

Ce document décrit le process de contribution : branches, commits, pull requests, workflow par ticket, gestion des issues GitHub. Pour l'architecture et les standards de code, voir [CLAUDE.md](CLAUDE.md).

## Conventions Git

### Branches

Format strict :

```
type/issue-number-short-description
```

| Type        | Usage                                       |
| ----------- | ------------------------------------------- |
| `feat/`     | Nouvelle fonctionnalité                     |
| `fix/`      | Correction de bug                           |
| `chore/`    | Tâche technique sans valeur métier          |
| `docs/`     | Documentation uniquement                    |
| `test/`     | Tests uniquement                            |
| `refactor/` | Refactoring sans changement de comportement |

**Exemples corrects** : `feat/118-update-item-command`, `fix/84-msal-cache-security`, `docs/101-openapi-endpoints`
**Jamais** : `feature/...`, `feat-issue-93-...`. Le format `type/number-description` est la seule convention.

### Commits (Conventional Commits)

```
type(scope): message concis (closes #numero)
```

- Message en minuscules, verbe à l'infinitif
- Inclure `(closes #numero)` si le commit clôt une issue
- Pas de mention d'outils ou d'IA dans le message
- Pas de tiret cadratin, y compris dans cette syntaxe : parenthèses pour `closes #numero`

**Exemples** : `feat(items): add item edit modal (closes #110)`, `fix(auth): correct msal cache storage (closes #84)`

### Pull requests et revues de code

- Titre : `type(scope): description (closes #numero)`
- Body : composants modifiés, test plan, `Closes #numero`
- Vérifier que la CI passe avant de merger

#### Règles de rédaction des commentaires de PR (Code & Doc Reviews)

Toute revue de PR doit respecter le [guide-redaction.md](docs/technical/guide-redaction.md) :

1. **Uniquement les points à corriger ou améliorer** : Ne pas lister ce qui est validé ou conforme. Un commentaire de revue sert exclusivement à signaler des éléments à modifier ou améliorer.
2. **Si aucun point à modifier** : Ne pas ajouter de commentaire de revue inutile. Le statut de la PR suffit.
3. **Rédaction concrète et factuelle** :
   - Écrire court pour réduire le temps de relecture.
   - Aucun tiret cadratin (`—`).
   - Aucun point-virgule dans la prose (`;`).
   - Aucun point médian (`·`).
   - Aucun qualificatif subjectif ou formule de remplissage.

### Releases

Automatiques via **Release Please** (semver) sur push `main`. Détail : `documentation/technical/RELEASE-AUTOMATION.md`.

## Workflow par ticket

Suivre cet ordre pour chaque issue, sans exception.

### 1. Avant de commencer

```bash
git checkout main
git pull origin main
git checkout -b type/numero-description   # ex: feat/118-update-item-command
```

### 2. Développement

- Travailler sur la branche dédiée
- Utiliser les Web Components du Design System, ne pas les recréer
- Écrire des tests pour chaque nouvelle fonctionnalité
- Respecter la checklist avant commit (ci-dessous)

### 3. Ouvrir la PR

- Titre : `type(scope): description (closes #numero)`
- Body : composants modifiés, test plan, `Closes #numero`
- Vérifier que le CI passe avant de merger

### 4. Après le merge

Mettre à jour dans cet ordre :

| Action                                                    | Quand                           |
| --------------------------------------------------------- | ------------------------------- |
| **Wiki** (`Frontend-Guide`) : nouvelles pages, composants | Nouvelle fonctionnalité visible |
| **Wiki** (`Architecture-Globale` ou `ADR`)                | Décision architecturale         |
| **Wiki** (`CICD-et-Deploiement`)                          | Changement d'infra ou pipeline  |
| **GitHub Project** (issue → Done)                         | Systématiquement après merge    |

**Comment mettre à jour le wiki** :

```bash
git clone https://github.com/SandrineCipolla/stockHub_V2_front.wiki.git /tmp/wiki
# modifier les fichiers .md
cd /tmp/wiki && git add . && git commit -m "docs: ..." && git push
```

## Gestion des issues GitHub

### Labels obligatoires

Toute issue doit avoir **au minimum** ces deux labels :

| Label | Valeur                                                           |
| ----- | ---------------------------------------------------------------- |
| Scope | `front` (toujours sur ce repo)                                   |
| Type  | `bug`, `feature`, `improvement`, `documentation`, `tech-debt`... |

Sans ces labels, les issues n'apparaissent pas correctement dans le GitHub Project board.

```bash
gh issue create --label "front,bug" ...
gh issue edit <numero> --repo SandrineCipolla/stockHub_V2_front --add-label "front,bug"
```

### Format User Story (obligatoire pour toute nouvelle fonctionnalité)

Les templates sont dans `.github/ISSUE_TEMPLATE/`, à utiliser comme référence.

```
**En tant que** [persona]
**Je souhaite** [action souhaitée]
**Afin de** [bénéfice attendu]

---

**Critères d'acceptation**

Étant donné que [contexte]
Lorsque [action]
Alors :
- [ ] Critère 1
- [ ] Critère 2
```

**Interdit dans le body d'une issue** : détails d'implémentation (composants à modifier, lignes de code), étapes techniques, commandes, TODO techniques. Ça va dans la PR.

**Où mettre les notes techniques ?**

| Information                                 | Où                      |
| ------------------------------------------- | ----------------------- |
| Valeur utilisateur, critères d'acceptation  | Issue GitHub            |
| Idées en cours de dev, questions            | Commentaire sur l'issue |
| Choix d'implémentation, composants modifiés | Description de la PR    |
| Décisions d'architecture importantes        | `docs/adr/`             |

## Checklist avant commit

1. `npm run format` : code formaté
2. `npm run lint` : aucune erreur ESLint
3. `npm run type-check` : aucune erreur TypeScript
4. `npm run clean:deadcode` : pas de code mort
5. `npm run test:run` : tous les tests passent
6. Tests manuels dans le navigateur
7. Vérifier l'accessibilité (navigation clavier)

## Checklist avant push

1. `npm run ci:check` : pipeline complet (qualité, tests, build)
2. GitHub Project mis à jour si applicable

Les hooks pre-commit et pre-push (Husky) automatisent la majorité de ces vérifications.
