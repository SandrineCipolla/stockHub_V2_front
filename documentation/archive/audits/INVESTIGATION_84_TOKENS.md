# Investigation #84 — Sécurité tokens Azure B2C

> **Repo** : `stockHub_V2_front`
> **Mode** : diagnostic uniquement — ne modifie rien.
> Dans Claude Code : **"Lis INVESTIGATION_84_TOKENS.md et exécute le diagnostic"**

---

## Objectif

Vérifier si l'issue #84 est réellement un problème ou si MSAL gère déjà
le stockage des tokens de façon sécurisée.

## Diagnostic

**1. Lis la configuration MSAL :**

```bash
# Trouver les fichiers de config auth
find src -name "*.ts" -o -name "*.tsx" | xargs grep -l "cacheLocation\|PublicClientApplication\|msal" 2>/dev/null
```

Affiche le contenu de chaque fichier trouvé.

**2. Vérifie ce qui est dans localStorage au runtime :**

```bash
# Chercher tout usage de localStorage dans le code
grep -rn "localStorage" src/ --include="*.ts" --include="*.tsx"
```

**3. Vérifie la version MSAL utilisée :**

```bash
cat package.json | grep -i msal
```

---

## Questions à répondre dans le rapport

1. Quelle est la valeur de `cacheLocation` dans la config MSAL ?
   - `'localStorage'` → problème réel, issue valide
   - `'sessionStorage'` → moins grave, acceptable
   - `'memory'` ou absent (défaut MSAL v3+) → conforme, issue peut être fermée

2. Y a-t-il des tokens stockés manuellement dans `localStorage` en dehors de MSAL ?

3. Quelle version de `@azure/msal-browser` est utilisée ?
   (MSAL v3+ utilise `memory` par défaut pour les access tokens)

---

## Format du rapport — `INVESTIGATION_84_RESULTS.md`

```markdown
# Investigation #84 — Tokens Azure B2C

Date : [date]

## Configuration MSAL trouvée

- Fichier : [chemin]
- cacheLocation : [valeur ou "non défini"]
- Comportement par défaut MSAL [version] : [memory/sessionStorage]

## localStorage — usage manuel

- [aucun / liste des usages trouvés]

## Verdict

- [ ] ✅ Conforme — MSAL gère le cache en [memory/sessionStorage], aucun token en localStorage
- [ ] ⚠️ Partiellement — cacheLocation forcé à sessionStorage (acceptable, documenter)
- [ ] 🔴 Problème réel — cacheLocation forcé à localStorage ou tokens stockés manuellement

## Action recommandée

[Fermer l'issue avec justification / Corriger cacheLocation / Autre]
```
