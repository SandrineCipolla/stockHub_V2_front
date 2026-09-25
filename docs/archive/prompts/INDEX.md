# Prompts archivés, sessions Claude Code

Prompts d'audit, de correction et de création d'issues écrits entre février et mars 2026, tous **déjà exécutés**. Conservés comme trace de la démarche assistée par IA, matière pour le dossier RNCP : ils montrent la formulation de la demande, pas le résultat.

Les résultats correspondants sont dans [../audits/](../audits/INDEX.md).

Ces fichiers sont historiques. Ils ne sont plus modifiés, même quand le code qu'ils décrivent a changé depuis.

## Audits demandés

| Prompt                            | Date         | Objet                                                                           |
| --------------------------------- | ------------ | ------------------------------------------------------------------------------- |
| `AUDIT_PROMPT_CLAUDE_CODE.md`     | février 2026 | Audit global du frontend, résultat dans `../audits/Recap_Audit_Frontend.md`     |
| `audit-ia.md`                     | mars 2026    | État réel du module IA côté frontend                                            |
| `Audit_Faisabilité_ModuleIA++.md` | mars 2026    | Faisabilité des écrans IA envisagés                                             |
| `audit_front_items.md`            | mars 2026    | Flux de gestion des items                                                       |
| `audit_pr108_stockdetail.md`      | mars 2026    | Revue de la PR #108, page de détail d'un stock                                  |
| `PROMPT_audit_landing_front.md`   | mars 2026    | Audit de la landing page, avec `mockup-landing.html` et `img.png` comme support |

## Corrections et implémentations demandées

| Prompt                               | Date      | Objet                                         |
| ------------------------------------ | --------- | --------------------------------------------- |
| `CORRECTIONS_CONNEXION_ITEMS.md`     | mars 2026 | Connexion des items et de la page de détail   |
| `CORRECTIONS_STAGING_PROD.md`        | mars 2026 | Staging Vercel et production Azure            |
| `fix_stockdetail_ux.md`              | mars 2026 | Reprise de l'expérience sur la page de détail |
| `fix_front_coverage_80.md`           | mars 2026 | Remontée de la couverture de tests vers 80 %  |
| `impl_front_update_item.md`          | mars 2026 | Mise à jour d'un item                         |
| `prompt_front_98_StockFormModal.md`  | mars 2026 | Issue #98, modale de formulaire de stock      |
| `prompt_front_99_StockDetailPage.md` | mars 2026 | Issue #99, page de détail d'un stock          |

## Créations d'issues demandées

| Prompt                              | Date      | Objet                                                  |
| ----------------------------------- | --------- | ------------------------------------------------------ |
| `create_issues_items_refacto.md`    | mars 2026 | Refonte de la gestion des items                        |
| `brancher_front_vrais_endpoints.md` | mars 2026 | Branchement sur les endpoints de prédiction du backend |
| `suggestions_llm_front.md`          | mars 2026 | Distinction des suggestions LLM et déterministes       |
