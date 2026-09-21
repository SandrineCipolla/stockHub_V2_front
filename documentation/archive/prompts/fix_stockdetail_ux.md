# Fix UX — StockDetailPage (3 corrections)

## Contexte

Suite à la PR #113 (table paginée + ItemFormModal), 3 problèmes UX identifiés
sur la StockDetailPage en conditions réelles.

## Branche

Si la PR #113 n'est pas encore mergée : ajouter les commits dessus.
Si elle est mergée : créer `fix/stockdetail-ux-improvements` depuis main.

---

## Fix 1 — Prédictions repliables (accordéon)

**Fichier à modifier :** `src/pages/StockDetailPage.tsx`

### Comportement attendu

- Section "Alertes intelligentes" repliée par défaut
- Un clic sur le header la déplie/replie
- Le header affiche toujours le nombre d'alertes : "Alertes intelligentes (2)"
- Quand repliée, les cards de prédiction sont cachées mais le header reste visible

### Implémentation

Ajouter un état :

```typescript
const [predictionsOpen, setPredictionsOpen] = useState(false);
```

Remplacer le header de la section par :

```tsx
<button
  onClick={() => setPredictionsOpen(prev => !prev)}
  className="flex items-center gap-2 w-full text-left"
  aria-expanded={predictionsOpen}
  aria-controls="predictions-section"
>
  <h2 className="text-xl font-bold">Alertes intelligentes ({predictions.length})</h2>
  <span className={`transition-transform duration-200 ${predictionsOpen ? 'rotate-180' : ''}`}>
    ▼
  </span>
</button>;

{
  predictionsOpen && <div id="predictions-section">{/* cards de prédiction existantes */}</div>;
}
```

> Adapter les classNames aux classes Tailwind déjà utilisées dans la page.
> Utiliser `aria-expanded` pour l'accessibilité.

---

## Fix 2 — Ajouter le champ quantité dans ItemFormModal (mode create)

**Fichier à modifier :** `src/components/items/ItemFormModal.tsx`

### Comportement attendu

- En mode `create` : afficher un champ "Quantité initiale" (number, min=0, défaut=0)
- En mode `edit` : ne PAS afficher ce champ (la quantité se gère via +/- inline)
- Le champ n'est pas obligatoire (défaut 0)

### Implémentation

Ajouter l'état :

```typescript
const [quantity, setQuantity] = useState(0);
```

Ajouter le champ, visible seulement en mode create :

```tsx
{
  mode === 'create' && (
    <div>
      <label
        htmlFor="item-quantity"
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
      >
        Quantité initiale
      </label>
      <input
        id="item-quantity"
        type="number"
        min={0}
        value={quantity}
        onChange={e => setQuantity(Number(e.target.value))}
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
      />
    </div>
  );
}
```

Mettre à jour l'appel `addItem` :

```typescript
await ItemsAPI.addItem(stockId, {
  label: label.trim(),
  description,
  minimumStock: minimumStock ?? 1,
  quantity, // ← était hardcodé à 0
});
```

---

## Fix 3 — Input quantité éditable inline dans la table

**Fichier à modifier :** `src/pages/StockDetailPage.tsx`

### Comportement attendu

- Le chiffre de quantité est cliquable → devient un input éditable
- Validation au blur ou à la touche Entrée → appelle updateItem
- Escape → annule, revient à la valeur précédente
- Les boutons −/+ restent à côté pour les ajustements rapides

### États à ajouter

```typescript
const [editingQuantityId, setEditingQuantityId] = useState<number | null>(null);
const [inlineQuantityValue, setInlineQuantityValue] = useState<number>(0);
```

### Cellule quantité dans la table

```tsx
<div className="flex items-center gap-2">
  <button onClick={() => updateItem(item.id, { quantity: item.quantity - 1 })}>−</button>

  {editingQuantityId === item.id ? (
    <input
      type="number"
      min={0}
      value={inlineQuantityValue}
      autoFocus
      onChange={e => setInlineQuantityValue(Number(e.target.value))}
      onBlur={() => {
        if (!isNaN(inlineQuantityValue) && inlineQuantityValue >= 0) {
          updateItem(item.id, { quantity: inlineQuantityValue });
        }
        setEditingQuantityId(null);
      }}
      onKeyDown={e => {
        if (e.key === 'Enter') e.currentTarget.blur();
        if (e.key === 'Escape') setEditingQuantityId(null);
      }}
      className="w-16 text-center px-1 py-0.5 border border-purple-500 rounded bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none"
    />
  ) : (
    <span
      className="font-bold cursor-pointer hover:text-purple-400 transition-colors min-w-[24px] text-center"
      title="Cliquer pour éditer"
      onClick={() => {
        setEditingQuantityId(item.id);
        setInlineQuantityValue(item.quantity);
      }}
    >
      {item.quantity}
    </span>
  )}

  <button onClick={() => updateItem(item.id, { quantity: item.quantity + 1 })}>+</button>
</div>
```

> S'assurer que `updateItem` appelé ici est bien celui du hook `useItems`
> (signature : `updateItem(itemId, updates: UpdateItemData)`).

---

## Tests à ajouter

### ItemFormModal.test.tsx

- En mode create : champ "Quantité initiale" présent
- En mode edit : champ "Quantité initiale" absent
- Submit create avec quantité=5 → ItemsAPI.addItem appelé avec `quantity: 5`

### StockDetailPage.test.tsx

- Section "Alertes intelligentes" repliée par défaut (cards non visibles)
- Clic sur le header → section dépliée (cards visibles)
- Clic sur le chiffre de quantité → input affiché
- Blur sur l'input → updateItem appelé avec la nouvelle valeur
- Escape → input disparaît, valeur inchangée

---

## Commits attendus

```
fix(predictions): collapse predictions section by default
fix(items): add quantity field in ItemFormModal create mode
fix(items): add inline editable quantity input in table
test(items): update tests for UX fixes
```

## Validation finale

- [ ] `npm run build` sans erreur TypeScript
- [ ] `npm run test` sans régression
- [ ] Section alertes repliée par défaut, dépliable au clic
- [ ] Modale create : champ quantité visible, valeur passée à addItem
- [ ] Clic sur quantité → input, blur/Entrée → updateItem, Escape → annule
- [ ] `npm run lint` sans erreur
