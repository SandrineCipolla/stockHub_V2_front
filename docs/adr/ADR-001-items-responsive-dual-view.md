# ADR-001 — Dual-view responsive pour les items de stock (mobile cards + desktop table)

**Date** : 15 juin 2026
**Statut** : Accepté
**Issue** : #165

---

## Contexte

La page `StockDetailPage` affiche les items d'un stock dans un tableau HTML. Sur mobile, ce tableau est tronqué et illisible malgré `overflow-x-auto`. Les utilisateurs ne pouvaient ni lire les données ni interagir avec les boutons d'action (modifier, supprimer), invisibles sur hover sur écran tactile.

## Décision

Approche **dual-view CSS** : deux sections rendues simultanément dans le DOM, visibilité alternée par Tailwind :

```tsx
{/* Vue cards — mobile */}
<div className="md:hidden space-y-3">
  {paginatedItems.map(item => <ItemMobileCard ... />)}
</div>

{/* Vue tableau — desktop */}
<div className="hidden md:block ...">
  <table>...</table>
</div>
```

Le composant `ItemMobileCard` (`src/components/items/ItemMobileCard.tsx`) est autonome et reçoit les mêmes props/callbacks que les lignes du tableau.

## Alternatives écartées

| Alternative                                    | Raison du rejet                                           |
| ---------------------------------------------- | --------------------------------------------------------- |
| `overflow-x-scroll` seul                       | UX dégradée, navigation difficile                         |
| Réorganisation du tableau en colonnes empilées | Cassait la sémantique table/thead/tbody                   |
| Composant DS `<sh-stock-item-card>`            | Props insuffisants : pas de rôles, pas d'inline edit      |
| État local dans ItemMobileCard                 | Désynchronisation avec la vue desktop (même ligne éditée) |

## Contrainte découverte : conflit `autoFocus` entre vues

Les deux vues partagent le state `editingQuantityId`. Quand l'utilisateur ouvre l'éditeur inline :

1. Desktop : input avec `autoFocus` → focus sur l'input desktop
2. Mobile : input avec `autoFocus` → focus sur l'input mobile → **blur sur l'input desktop**
3. `onBlur` du desktop appelle `setEditingQuantityId(null)` → éditeur fermé immédiatement

**Fix** : `autoFocus` retiré du composant `ItemMobileCard`. Le desktop conserve `autoFocus` (UX clavier). Sur mobile le tap sur la valeur ouvre l'input sans focus automatique — ce qui est acceptable sur tactile.

## Impact sur les tests

jsdom n'applique pas le CSS. En test, les deux vues sont visibles simultanément :

- `getByText('Tomates')` → erreur "found multiple elements" → changé en `getAllByText`
- `getByRole('spinbutton')` → deux inputs pour le même item → requêtes scopées via `data-testid="qty-edit-span-{id}"` et `data-testid="qty-input-{id}"` (ajoutés sur la vue desktop uniquement)

## Conséquences

- **Positif** : aucun changement de logique ou d'état, même pagination, mêmes callbacks
- **Positif** : le tableau desktop est préservé exactement, pas de régression
- **Négatif** : deux fois plus d'éléments dans le DOM (impact négligeable : 20 items max par page)
- **À surveiller** : si un troisième point de rupture (ex. tablette) est ajouté, le pattern peut être étendu
