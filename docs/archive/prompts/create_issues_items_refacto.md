# Créer les issues GitHub — refacto items (table + modale + backend)

## Prérequis

- La PR #108 vient d'être mergée dans main
- GitHub CLI (`gh`) est disponible
- Tu es dans le repo stockHub_V2_front

## Ce que tu dois faire

Créer les issues suivantes avec `gh issue create`.
**Respecter exactement** les titres, bodies et labels fournis.
Les issues frontend vont dans `stockHub_V2_front`, les issues backend dans `stockhub_back`.

---

### Issue 1 — Frontend : refacto affichage items en table

**Repo :** stockHub_V2_front (repo courant)

```bash
gh issue create \
  --title "feat(items): refacto StockDetailPage — table paginée avec filter chips" \
  --body "## Contexte
La StockDetailPage actuelle affiche les items en cards empilées.
Avec 100+ items, cette UX n'est pas adaptée.

## Valeur utilisateur
En tant qu'utilisateur, je veux voir mes items sous forme de table dense avec filtre par statut,
afin de trouver rapidement les items en rupture ou stock bas.

## Critères d'acceptance
- [ ] Les items sont affichés dans une table (thead/tbody) avec colonnes : Nom/description, Statut, Quantité, Min, Actions
- [ ] Filter chips en haut : Tous / Rupture(n) / Stock bas(n) / OK(n) — filtrage côté client
- [ ] Pastille colorée par statut dans chaque row (rouge/orange/vert)
- [ ] Pagination côté client : 20 items par page
- [ ] Boutons −/+ fonctionnels inline dans chaque row
- [ ] Actions crayon et corbeille visibles au hover de la row
- [ ] Bouton 'Ajouter un item' en haut à droite
- [ ] Tests mis à jour" \
  --label "enhancement"
```

---

### Issue 2 — Frontend : ItemFormModal (create + edit)

**Repo :** stockHub_V2_front (repo courant)

```bash
gh issue create \
  --title "feat(items): add ItemFormModal — create and edit modes" \
  --body "## Contexte
Il n'existe pas de modale pour créer ou éditer un item.
Le backend supporte désormais PATCH avec label/description/minimumStock.

## Valeur utilisateur
En tant qu'utilisateur, je veux pouvoir créer un nouvel item et modifier le nom,
la description et le stock minimum d'un item existant.

## Critères d'acceptance
- [ ] Composant ItemFormModal.tsx dans src/components/items/
- [ ] Mode create : champs label (requis), description, minimumStock — appelle ItemsAPI.addItem
- [ ] Mode edit : champs pré-remplis — appelle ItemsAPI.updateItem avec label/description/minimumStock
- [ ] Accessibilité : role=dialog, aria-modal, aria-labelledby, Escape pour fermer, focus sur premier champ
- [ ] Clic sur le backdrop ferme la modale
- [ ] Validation inline : label vide → message d'erreur
- [ ] Loading state sur le bouton submit
- [ ] Intégrée dans StockDetailPage : bouton Ajouter + crayon par row
- [ ] Minimum 8 tests (create, edit, validation, accessibilité, API calls)

## Modèle
Calquer sur StockFormModal.tsx (même pattern, même accessibilité)" \
  --label "enhancement"
```

---

### Issue 3 — Frontend : étendre UpdateItemData

**Repo :** stockHub_V2_front (repo courant)

```bash
gh issue create \
  --title "feat(items): extend UpdateItemData to support label, description, minimumStock" \
  --body "## Contexte
UpdateItemData ne supporte actuellement que quantity.
Le backend supporte désormais la mise à jour de tous les champs d'un item.

## Valeur utilisateur
En tant que développeur, je veux que le frontend puisse envoyer label/description/minimumStock
au backend via PATCH /stocks/:stockId/items/:itemId.

## Critères d'acceptance
- [ ] UpdateItemData dans src/types/stock.ts étendu : quantity?, label?, description?, minimumStock? (tous optionnels)
- [ ] itemsAPI.ts : body du PATCH construit dynamiquement (ne passer que les champs définis)
- [ ] useItems.ts : validation quantity conditionnelle (seulement si quantity fournie), validation label si fourni
- [ ] Tests useItems mis à jour : updateItem avec label seul, minimumStock seul, tous les champs

## Dépendance
Dépend de l'issue backend UpdateItem CQRS flow (stockhub_back)" \
  --label "enhancement"
```

---

### Issue 4 — Backend : UpdateItem CQRS flow

**Attention : cette issue est dans le repo stockhub_back.**
Exécute cette commande depuis le repo stockhub_back :

```bash
gh issue create \
  --repo SandrineCipolla/stockhub_back \
  --title "feat(items): add UpdateItem CQRS command — label, description, minimumStock, quantity" \
  --body "## Contexte
Le PATCH /api/v2/stocks/:stockId/items/:itemId ne gère actuellement que quantity
via UpdateItemQuantityCommandHandler.
On ajoute une nouvelle commande CQRS pour éditer tous les champs d'un item.

## Valeur utilisateur
En tant qu'utilisateur, je veux pouvoir modifier le nom, la description et le stock minimum
d'un item via l'API.

## Critères d'acceptance
- [ ] UpdateItemCommand.ts créé (stockId, itemId, label?, description?, minimumStock?, quantity?)
- [ ] UpdateItemCommandHandler.ts créé — délègue à stockRepository.updateItem()
- [ ] IStockCommandRepository : méthode updateItem ajoutée
- [ ] PrismaStockCommandRepository : updateItem implémenté (champs optionnels, ne passer que les définis)
- [ ] StockRequestTypes.ts : UpdateItemBody étendu (label?, description?, minimumStock?, quantity?)
- [ ] StockControllerManipulation : méthode updateItem ajoutée, UpdateItemCommandHandler injecté
- [ ] StockRoutesV2 : PATCH /stocks/:stockId/items/:itemId rebranché sur updateItem
- [ ] UpdateItemQuantityCommand/Handler conservés (ne pas supprimer — compatibilité)
- [ ] Tests : PATCH quantity seul, PATCH label+description+minimumStock, PATCH tous champs, 404 itemId inconnu

## Architecture
Respecter le pattern DDD/CQRS existant : Command → CommandHandler → Repository interface → Prisma impl
Ordre d'implémentation : domain command → interface repo → prisma impl → handler → types → controller → routes" \
  --label "enhancement"
```

---

## Après création des issues

Rapporte les numéros d'issues créées pour chaque repo, par exemple :

- stockHub_V2_front : #109, #110, #111
- stockhub_back : #XX

Ces numéros serviront dans les commits (`closes #XXX`) et les PRs.
