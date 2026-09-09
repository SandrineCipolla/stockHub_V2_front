# ADR-005: Fixtures de test centralisées dans `test/fixtures/`

**Date:** 2025-10
**Statut:** Accepté
**Décideurs:** Sandrine Cipolla

---

## Contexte

Les tests créaient des données mock directement dans chaque fichier de test, générant duplication et fragilité.

## Décision

Créer un dossier `test/fixtures/` avec des factories typées pour tous les objets de test :

```typescript
export function createMockStock(overrides?: Partial<Stock>): Stock {
  return {
    id: 1,
    label: 'Stock Cuisine',
    category: 'alimentation',
    status: 'optimal',
    quantity: 10,
    minimumStock: 2,
    ...overrides,
  };
}
```

## Conséquences

### Positives

- Tests 100% DRY, lisibles, maintenables
- Facilite l'ajout de nouveaux tests
- Un seul endroit à mettre à jour si la forme d'un type métier change

### Négatives

- Une factory générique peut masquer des cas limites qu'un mock ad hoc aurait forcé à expliciter

## Réexamen

Rouvrir si les factories génériques cachent des régressions liées à des cas limites non couverts.

## Liens

- Code concerné: `test/fixtures/`

---

**Note:** Les ADRs sont immuables. Si cette décision change, créer une nouvelle ADR qui supplante celle-ci.
