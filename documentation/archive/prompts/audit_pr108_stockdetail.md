# Audit — Contenu de la PR #108 (branche feat/99-stock-detail-page)

## Contexte

PR #108 ouverte sur stockHub_V2_front, branche `feat/99-stock-detail-page`.
Elle réécrit StockDetailPage avec useStockDetail hook, sh-stock-item-card WC, et prédictions IA.
On veut décider si le refacto "table paginée + filter chips + ItemFormModal" doit être intégré
dans cette PR ou traité dans une issue séparée après merge.

## Ce que tu dois faire

### 1. Lire StockDetailPage

Lis le fichier principal de la page détail stock.
Cherche dans cet ordre :

```
src/pages/StockDetailPage.tsx
src/pages/stocks/StockDetailPage.tsx
src/features/stocks/StockDetailPage.tsx
```

Rapporte :

- Le chemin exact trouvé
- Comment les items sont affichés (cards ? table ? WC sh-stock-item-card ?)
- Les actions disponibles sur un item (−/+, delete, edit ?)
- Le hook utilisé (useItems ? useStockDetail ? autre ?)
- Y a-t-il déjà une pagination ou des filter chips ?
- Y a-t-il déjà une modale d'édition d'item ?

### 2. Lire useStockDetail

Cherche :

```
src/hooks/useStockDetail.ts
src/hooks/useStockDetail.tsx
```

Rapporte :

- Le chemin exact
- Les données qu'il expose (stock ? items ? stats ?)
- Appelle-t-il useItems en interne ou directement l'API ?
- Gère-t-il déjà updateItem avec label/description/minimumStock ou seulement quantity ?

### 3. Lire sh-stock-item-card (si utilisé)

Si StockDetailPage utilise le Web Component `sh-stock-item-card`, cherche :

```
src/components/items/
src/components/stocks/
```

Rapporte :

- Comment le WC est utilisé (props passées, events écoutés)
- Ce qu'il affiche (label, quantity, status ?)
- S'il supporte déjà les actions edit/delete

### 4. Vérifier les prédictions IA

Cherche `computePredictions` :

```
src/utils/computePredictions.ts
src/utils/predictions.ts
src/services/predictions.ts
```

Rapporte :

- Le chemin exact
- Ce que la fonction fait (calcul local ? appel API ?)
- Ce qu'elle retourne (quelles prédictions ?)
- Comment les résultats sont affichés dans StockDetailPage

### 5. Synthèse — recommandation

Sur la base de l'audit, réponds à cette question :

**Faut-il intégrer le refacto "table paginée + filter chips + ItemFormModal" dans la PR #108
ou créer une issue séparée après merge ?**

Critères pour ta recommandation :

- Taille de la PR actuelle (déjà grosse ?)
- Chevauchement avec le code existant dans la branche
- Risque de conflits si on ajoute du code
- Bonne pratique : une PR = un périmètre fonctionnel clair

Conclus avec UN des deux choix :

- **INTÉGRER dans #108** : si le périmètre est cohérent et les changements mineurs
- **NOUVELLE ISSUE après merge** : si la PR est déjà conséquente ou si les changements sont importants
