# Améliorations Futures - StockHub V2

**Date de création**: 21 Octobre 2025
**Branche**: `feature/design-system-integration`

---

## 🔍 Recherche & Filtres

### 1. Normalisation des accents dans la recherche

- **Problème**: La recherche ne trouve pas "médium" quand on tape "medium" (sans accent)
- **Impact**: Utilisabilité réduite, surtout pour les utilisateurs mobiles sans accents
- **Localisation**: `src/hooks/useStocks.ts` - fonction de filtrage
- **Solution proposée**: Ajouter une fonction `normalizeString()` qui supprime les accents avant la comparaison
- **Priorité**: ⚠️ Moyenne
- **Exemple de code**:

```typescript
const normalizeString = (str: string) => {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
};

// Dans le filtre:
const normalizedQuery = normalizeString(filters.query);
const normalizedName = normalizeString(stock.name);
if (normalizedName.includes(normalizedQuery)) { ... }
```

---

## 📝 Autres Améliorations à Planifier

_À compléter au fur et à mesure des sessions..._

---

**Auteure**: Sandrine Cipolla
