# TypeScript : Bonnes pratiques pour les types union stricts

## Pourquoi utiliser `as const` ?

Quand vous définissez un type union strict dans une interface ou un type, par exemple :

```typescript
export interface Notification {
  type: 'info' | 'warning' | 'error' | 'success';
  priority: 'low' | 'medium' | 'high';
  category: 'stock' | 'portfolio' | 'system' | 'alert';
  // ...
}
```

Si vous créez dynamiquement des objets de ce type, TypeScript peut inférer les valeurs comme des `string` génériques au lieu de la valeur littérale attendue (ex : `'info'` au lieu de `'info' | 'warning' | ...`).

### Exemple de problème :

```typescript
const notif = {
  type: 'info', // inféré comme string
} // Erreur si utilisé dans Notification
```

### Solution : utiliser `as const`

```typescript
const notif = {
  type: 'info' as const, // inféré comme 'info'
}
```

Cela garantit que la valeur est bien du type littéral attendu par l’union strict.

### Alternative : assertion de type

Vous pouvez aussi utiliser une assertion de type :

```typescript
const notif = {
  type: 'info',
  priority: 'low',
  category: 'system',
  // ...
} as Notification;
```

Mais attention, TypeScript ne vérifie pas toujours la correspondance exacte des valeurs, donc `as const` reste la méthode la plus sûre pour les valeurs littérales.

## Résumé
- Utilisez `as const` pour les propriétés de type union strict lors de la création dynamique d’objets.
- Cela évite les erreurs de typage et garantit la sécurité du code.
- Vous pouvez aussi utiliser une assertion de type, mais soyez vigilant sur la validité des valeurs.

---

**Bonnes pratiques :**
- Préférez `as const` pour les valeurs littérales dans les objets générés dynamiquement.
- Documentez cette règle dans votre projet pour éviter les erreurs et faciliter la relecture du code.

