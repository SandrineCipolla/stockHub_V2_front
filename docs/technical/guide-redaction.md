# Guide de rédaction

Règles d'écriture pour la documentation du projet (ADR, README, CONTRIBUTING, sessions, etc.). Un seul endroit pour ces règles : tout document ou skill qui rédige de la documentation y renvoie plutôt que de les recopier.

## Principes

Rester court pour réduire le temps de relecture. Écrire simplement, préférer la formulation la plus ordinaire. Dire ce qui est, pas ce qui n'est pas. Énoncer chaque idée une seule fois. Supprimer tout mot dont le retrait ne change rien. Préférer le concret à ce qui impressionne : nommer le fichier, le nombre, le mécanisme. La structure suit le contenu. Le texte doit être compréhensible par une personne qui découvre le sujet. Ajouter un commentaire uniquement s'il apporte ce que le code ne peut pas montrer.

## Ne pas répéter entre documents

Une information vit à un seul endroit. Un autre document qui en a besoin y renvoie par un lien qui fonctionne (vers le fichier, la section, ou le code concerné), il ne la recopie pas. Si l'information change, elle ne doit être corrigée qu'à un seul endroit.

Cas particulier des ADR : le code qui existe encore dans le dépôt n'est pas recopié dans une ADR, il est référencé par son chemin. Un extrait n'est conservé que s'il est pédagogique ou hypothétique, c'est-à-dire s'il ne correspond à aucun fichier réel.

Quand deux documents couvrent le même sujet, vérifier le contenu réel avant de choisir quoi garder, pas seulement le titre :

- Contenu strictement identique : garder l'ADR quand une ADR existe pour ce sujet, elle est la source de la décision. Sinon garder le document le plus complet et faire pointer l'autre vers lui.
- Contenu différent mais même sujet : chacun garde ce qui lui est propre. Une ADR justifie une décision avec ses alternatives, un guide documente la pratique courante. Vérifier qu'aucun exemple de code ou paragraphe entier n'est recopié entre les deux.
- Contenu périmé ou devenu secondaire : évaluer l'archivage plutôt que la suppression sans y avoir pensé.

Si un fichier référencé est déplacé ou renommé, mettre à jour le lien dans tous les documents qui y renvoient.

## Règles fixes

Aucun tiret cadratin. Aucun point-virgule dans la prose. Aucun point médian Unicode comme séparateur. Les flèches (`->` ou `→`) sont acceptables comme raccourcis délibérés, pas comme décoration.

## Formulations à repenser

Chaque entrée illustre une catégorie à reconnaître. Ne garder un terme signalé que s'il est réellement nécessaire, s'il désigne exactement le cas décrit et si aucune formulation simple ne convient.

- Le jargon employé pour son effet, sauf lorsque le contexte exige réellement le terme : « load-bearing », « smoking gun », « smoke test », « footgun », « blast radius », « drift seam », « cutover », « gate off », « the knob », « hangs off N knobs », « fails closed/open », « typed forward », « persistence contract », « when it lands », « when it bites », « under the hood », « deep dive ». Le pire exemple : « an honest footgun, load-bearing when it lands ».
- Les expressions improvisées avec des traits d'union (« genuine-need », « caught-in-the-wild », « mixed-units », « de-jargoned », « seven-value »). C'est le signe le plus fréquent : vérifier chaque qualificatif composé avec des traits d'union et exprimer l'idée en mots simples. Conserver les termes consacrés et les identifiants exacts du code.
- La négation suivie d'une révélation (« ce n'est pas X, c'est Y »), les ajouts négatifs en fin de phrase (« , pas X. », « , pas de X non plus. » lorsque l'affirmation suffit à transmettre le fait), les constructions parallèles martelées (« Pas X. Pas Y. Juste Z. ») et les questions auxquelles on répond soi-même.
- Les mots qui donnent artificiellement du poids au propos (« crucial », « robuste », « explorer en profondeur », « tirer parti de »).
- Les tournures qui évitent « être » et « avoir », comme « sert de » ou « représente un ».
- Les absolus dramatiques (« jamais », « toujours », « ne peut pas ») lorsqu'une simple négation suffit à énoncer le fait.
- Les formules de remplissage (« il convient de noter »), les conclusions annoncées et les introductions qui promettent une révélation.
- Le ton de conversation dans les livrables et les traces de session, comme les intitulés de plan.
- Les attributions vagues, les problèmes désignés par une simple étiquette sans préciser leur mécanisme, et les appellations inventées.

## Portée

S'applique à toute documentation rédigée pour ce projet : ADR, README, CONTRIBUTING, sessions de développement, commentaires de PR. Ne s'applique pas au code lui-même (noms de variables, commentaires techniques) sauf pour les commentaires en prose longue.

## Vérification automatique

`npm run check:docs` vérifie deux choses, et tourne dans `npm run ci:quality` comme dans la CI :

- Les liens relatifs de tous les fichiers Markdown pointent vers un fichier existant, avec la casse exacte. Les liens GitHub vers un fichier des autres repos StockHub sont vérifiés contre un clone de ces repos (la CI les clone, en local le script les cherche dans le dossier parent ou dans `DOCS_SIBLINGS_DIR`, et signale sans échouer ceux qu'il n'a pas pu vérifier). Les liens déjà cassés à la mise en place sont listés dans `scripts/docs-links-baseline.json` et n'échouent pas. Cette liste est faite pour diminuer.
- Les règles fixes ci-dessus (tiret cadratin, point-virgule en prose, point médian) sur les seuls fichiers modifiés par rapport à la branche de base, la règle étant plus récente que le dépôt. Les blocs et spans de code sont ignorés.

`npm run check:docs:all` applique les règles de style à tout le dépôt sans faire échouer : c'est la mesure de la dette restante.

Le script (`scripts/check-docs.mjs`) sert aussi au backend et au design system : leur CI le télécharge depuis ce repo. Chaque repo le configure par un fichier `.docs-check.json` à sa racine (chemin du guide, baseline, dossiers exclus du contrôle de style).
