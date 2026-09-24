# TYPESCRIPT.md - StockHub V2

## 📋 Guide des Conventions TypeScript

Ce document présente les conventions de typage adoptées pour StockHub V2, garantissant un code robuste, maintenable et cohérent.

---

## 🔧 Troubleshooting TypeScript

### Problèmes Web Components

Pour les erreurs liées aux web components (TS2339, TS1005, etc.), consulter :
👉 **[4-TROUBLESHOOTING.md](../4-TROUBLESHOOTING.md)**

**Problèmes courants :**

- ✅ Web component non reconnu par TypeScript
- ✅ Incompatibilité camelCase vs kebab-case
- ✅ Erreurs de syntaxe dans fichiers `.d.ts`

---

## ⚙️ Configuration TypeScript

### tsconfig.json - Configuration stricte

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": true,
    "noImplicitOverride": true
  }
}
```

## 🏗️ Types Métier (Business Types)

### Types de base pour les stocks

```typescript
// types/stock.ts
export interface Stock {
  readonly id: string;
  name: string;
  description?: string;
  quantity: number;
  minQuantity: number;
  maxQuantity?: number;
  unitPrice: number;
  totalValue: number;
  category: StockCategory;
  status: StockStatus;
  location: StockLocation;
  supplier?: Supplier;
  metadata: StockMetadata;
  timestamps: EntityTimestamps;
}

export type StockStatus = 'optimal' | 'low' | 'critical' | 'overstock' | 'unavailable';

export type StockCategory =
  'raw-materials' | 'finished-products' | 'components' | 'packaging' | 'tools' | 'consumables';

export interface StockLocation {
  warehouse: string;
  zone?: string;
  aisle?: string;
  shelf?: string;
  bin?: string;
}

export interface StockMetadata {
  sku: string;
  barcode?: string;
  weight?: number;
  dimensions?: Dimensions;
  expirationDate?: Date;
  batchNumber?: string;
  serialNumbers?: string[];
}

export interface Dimensions {
  length: number;
  width: number;
  height: number;
  unit: 'cm' | 'mm' | 'in';
}
```

### Types pour les entités liées

```typescript
// types/supplier.ts
export interface Supplier {
  readonly id: string;
  name: string;
  contactInfo: ContactInfo;
  address: Address;
  paymentTerms?: PaymentTerms;
  rating?: number;
  timestamps: EntityTimestamps;
}

export interface ContactInfo {
  email: string;
  phone?: string;
  website?: string;
  contactPerson?: string;
}

export interface Address {
  street: string;
  city: string;
  postalCode: string;
  country: string;
  region?: string;
}

export interface PaymentTerms {
  type: 'net15' | 'net30' | 'net60' | 'cod' | 'prepaid';
  discountPercentage?: number;
  discountDays?: number;
}
```

### Types communs et utilitaires

```typescript
// types/common.ts
export interface EntityTimestamps {
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly deletedAt?: Date;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  timestamp: Date;
}
```

## 🎨 Types pour les Composants UI

### Props de composants avec variantes strictes

```typescript
// types/components.ts
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant: 'primary' | 'secondary' | 'ghost' | 'danger';
  size: 'sm' | 'md' | 'lg';
  icon?: React.ComponentType<{ className?: string }>;
  loading?: boolean;
  fullWidth?: boolean;
}

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  clickable?: boolean;
}

export interface BadgeProps {
  variant: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
}

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  hint?: string;
  size?: 'sm' | 'md' | 'lg';
  leftIcon?: React.ComponentType<{ className?: string }>;
  rightIcon?: React.ComponentType<{ className?: string }>;
}
```

### Types pour les états de formulaires

```typescript
// types/forms.ts
export interface FormField<T = string> {
  value: T;
  error?: string;
  touched: boolean;
  valid: boolean;
}

export interface StockFormData {
  name: FormField<string>;
  description: FormField<string>;
  quantity: FormField<number>;
  minQuantity: FormField<number>;
  maxQuantity: FormField<number | undefined>;
  unitPrice: FormField<number>;
  category: FormField<StockCategory>;
  supplierId: FormField<string | undefined>;
  location: FormField<StockLocation>;
}

export type FormErrors<T> = {
  [K in keyof T]?: string;
};

export type FormTouched<T> = {
  [K in keyof T]?: boolean;
};
```

## 🔧 Types pour les Hooks et État

### Hook personnalisés avec types génériques

```typescript
// types/hooks.ts
export interface UseApiResult<T> {
  data: T | null;
  loading: LoadingState;
  error: ApiError | null;
  refetch: () => Promise<void>;
}

export interface UseFormResult<T> {
  values: T;
  errors: FormErrors<T>;
  touched: FormTouched<T>;
  isValid: boolean;
  isSubmitting: boolean;
  handleChange: (field: keyof T, value: T[keyof T]) => void;
  handleBlur: (field: keyof T) => void;
  handleSubmit: (onSubmit: (values: T) => Promise<void>) => Promise<void>;
  reset: () => void;
}

export interface UseLocalStorageResult<T> {
  value: T;
  setValue: (value: T | ((prev: T) => T)) => void;
  removeValue: () => void;
}
```

### Types pour le store/contexte global

```typescript
// types/store.ts
export interface AppState {
  user: UserState;
  stocks: StockState;
  ui: UIState;
  notifications: NotificationState;
}

export interface UserState {
  currentUser: User | null;
  isAuthenticated: boolean;
  permissions: Permission[];
  preferences: UserPreferences;
}

export interface StockState {
  items: Stock[];
  loading: LoadingState;
  error: ApiError | null;
  filters: StockFilters;
  pagination: PaginationParams;
  selectedItems: string[];
}

export interface UIState {
  theme: 'light' | 'dark' | 'system';
  sidebarOpen: boolean;
  modals: Record<string, boolean>;
  toasts: Toast[];
}

export interface StockFilters {
  search?: string;
  category?: StockCategory[];
  status?: StockStatus[];
  supplier?: string[];
  location?: Partial<StockLocation>;
  quantityRange?: {
    min?: number;
    max?: number;
  };
  dateRange?: {
    start?: Date;
    end?: Date;
  };
}
```

## 🌐 Types pour les API

### Requêtes et réponses API typées

```typescript
// types/api.ts
export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
  timestamp: string;
}

export interface StockCreateRequest {
  name: string;
  description?: string;
  quantity: number;
  minQuantity: number;
  maxQuantity?: number;
  unitPrice: number;
  category: StockCategory;
  supplierId?: string;
  location: StockLocation;
  metadata?: Partial<StockMetadata>;
}

export interface StockUpdateRequest extends Partial<StockCreateRequest> {
  id: string;
}

export interface StockSearchRequest extends PaginationParams {
  filters?: StockFilters;
}

export type StockResponse = ApiResponse<Stock>;
export type StockListResponse = ApiResponse<PaginatedResponse<Stock>>;
export type StockSearchResponse = ApiResponse<PaginatedResponse<Stock>>;
```

### Types pour les endpoints

```typescript
// types/endpoints.ts
export interface ApiEndpoints {
  stocks: {
    list: (params?: StockSearchRequest) => Promise<StockListResponse>;
    get: (id: string) => Promise<StockResponse>;
    create: (data: StockCreateRequest) => Promise<StockResponse>;
    update: (data: StockUpdateRequest) => Promise<StockResponse>;
    delete: (id: string) => Promise<ApiResponse<void>>;
    export: (filters?: StockFilters) => Promise<Blob>;
  };
  suppliers: {
    list: () => Promise<ApiResponse<Supplier[]>>;
    get: (id: string) => Promise<ApiResponse<Supplier>>;
  };
}
```

## 🎯 Patterns de Typage Avancés

### Types utilitaires personnalisés

```typescript
// types/utils.ts
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type NonEmptyArray<T> = [T, ...T[]];

export type StringLiteral<T> = T extends string ? (string extends T ? never : T) : never;

export type KeysOfType<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never;
}[keyof T];

// Exemple d'usage
type StockStringFields = KeysOfType<Stock, string>; // 'id' | 'name' | 'description'
```

### Validation avec Zod (optionnel mais recommandé)

```typescript
// types/validation.ts
import { z } from 'zod';

export const StockSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  quantity: z.number().min(0),
  minQuantity: z.number().min(0),
  maxQuantity: z.number().min(0).optional(),
  unitPrice: z.number().min(0),
  category: z.enum([
    'raw-materials',
    'finished-products',
    'components',
    'packaging',
    'tools',
    'consumables',
  ]),
  status: z.enum(['optimal', 'low', 'critical', 'overstock', 'unavailable']),
});

export type StockFromSchema = z.infer<typeof StockSchema>;

// Validation runtime
export const validateStock = (data: unknown): StockFromSchema => {
  return StockSchema.parse(data);
};
```

## 🛡️ Gestion d'Erreurs Typée

### Types d'erreurs spécifiques

```typescript
// types/errors.ts
export class StockError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'StockError';
  }
}

export class ValidationError extends StockError {
  constructor(
    message: string,
    public field: string,
    public value: unknown
  ) {
    super(message, 'VALIDATION_ERROR', 400);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends StockError {
  constructor(resource: string, id: string) {
    super(`${resource} with id ${id} not found`, 'NOT_FOUND', 404);
    this.name = 'NotFoundError';
  }
}

export type AppError = StockError | ValidationError | NotFoundError;

// Result type pour la gestion d'erreurs fonctionnelle
export type Result<T, E = AppError> = { success: true; data: T } | { success: false; error: E };
```

## 📁 Organisation des Types

### Structure de fichiers recommandée

```
src/
├── types/
│   ├── index.ts           # Exports principaux
│   ├── api.ts            # Types API
│   ├── common.ts         # Types communs
│   ├── components.ts     # Types UI
│   ├── errors.ts         # Types d'erreurs
│   ├── forms.ts          # Types formulaires
│   ├── hooks.ts          # Types hooks
│   ├── stock.ts          # Types métier stocks
│   ├── supplier.ts       # Types métier fournisseurs
│   ├── store.ts          # Types état global
│   ├── utils.ts          # Types utilitaires
│   └── validation.ts     # Schémas validation
```

### Exports centralisés

```typescript
// types/index.ts
// Types métier
export type { Stock, StockStatus, StockCategory, StockLocation } from './stock';
export type { Supplier, ContactInfo, Address } from './supplier';

// Types communs
export type { EntityTimestamps, PaginationParams, LoadingState } from './common';

// Types composants
export type { ButtonProps, CardProps, BadgeProps, InputProps } from './components';

// Types API
export type { ApiResponse, StockResponse, StockListResponse } from './api';

// Types erreurs
export { StockError, ValidationError, NotFoundError, type AppError } from './errors';
```

## ✅ Bonnes Pratiques

### 1. Nommage strict

- **Interfaces** : PascalCase avec suffixe descriptif (`UserProfile`, `ApiResponse`)
- **Types** : PascalCase (`StockStatus`, `LoadingState`)
- **Enums** : PascalCase avec valeurs kebab-case
- **Génériques** : Lettres simples (`T`, `K`, `V`) ou descriptives (`TData`, `TError`)

### 2. Réutilisabilité

```typescript
// ✅ Bon : Types réutilisables
interface BaseEntity {
  readonly id: string;
  timestamps: EntityTimestamps;
}

interface Stock extends BaseEntity {
  name: string;
  quantity: number;
}

// ❌ Éviter : Duplication
interface Stock {
  readonly id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  quantity: number;
}
```

### 3. Composition plutôt qu'héritage

```typescript
// ✅ Bon : Composition
interface StockWithSupplier extends Stock {
  supplier: Supplier;
}

// ✅ Bon : Union types
type StockView = Stock | StockWithSupplier | StockSummary;
```

### 4. Types guards pour la validation runtime

```typescript
// types/guards.ts
export const isStock = (value: unknown): value is Stock => {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'name' in value &&
    'quantity' in value
  );
};
export const isStockStatusStrict = (value: unknown): value is StockStatus => {
  return typeof value === 'string' && (STOCK_STATUSES as readonly string[]).includes(value);
};
```

## 🧪 Exemples d'Usage

### Hook typé complet

```typescript
// hooks/useStock.ts
import { useCallback, useEffect, useState } from 'react';
import type { Stock, UseApiResult, StockFilters } from '@/types';

export const useStock = (filters?: StockFilters): UseApiResult<Stock[]> => {
  const [data, setData] = useState<Stock[] | null>(null);
  const [loading, setLoading] = useState<LoadingState>('idle');
  const [error, setError] = useState<ApiError | null>(null);

  const fetchStocks = useCallback(async () => {
    setLoading('loading');
    try {
      const response = await api.stocks.list({ filters });
      setData(response.data.data);
      setLoading('success');
    } catch (err) {
      setError(err as ApiError);
      setLoading('error');
    }
  }, [filters]);

  useEffect(() => {
    fetchStocks();
  }, [fetchStocks]);

  return { data, loading, error, refetch: fetchStocks };
};
```

### Composant typé avec props strictes

```tsx
// components/StockCard.tsx
import type { Stock, StockCardProps } from '@/types';

interface StockCardProps {
  stock: Stock;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  variant?: 'default' | 'compact';
  className?: string;
}

export const StockCard: React.FC<StockCardProps> = ({
  stock,
  onEdit,
  onDelete,
  variant = 'default',
  className,
}) => {
  return (
    <Card variant="elevated" hover className={className}>
      {/* Contenu du composant */}
    </Card>
  );
};
```

---

## 🎯 Union Types - Bonnes Pratiques

### Pourquoi utiliser `as const` ?

Quand vous définissez un type union strict dans une interface ou un type, TypeScript peut inférer les valeurs comme des `string` génériques au lieu de la valeur littérale attendue.

**Exemple de problème :**

```typescript
export interface Notification {
  type: 'info' | 'warning' | 'error' | 'success';
  priority: 'low' | 'medium' | 'high';
  category: 'stock' | 'portfolio' | 'system' | 'alert';
}

const notif = {
  type: 'info', // ❌ inféré comme string, pas comme 'info'
};
```

### Solution : utiliser `as const`

```typescript
const notif = {
  type: 'info' as const, // ✅ inféré comme 'info'
  priority: 'low' as const,
  category: 'system' as const,
};
```

Cela garantit que la valeur est bien du type littéral attendu par l'union strict.

### Alternative : assertion de type complète

```typescript
const notif = {
  type: 'info',
  priority: 'low',
  category: 'system',
  // ...
} as Notification;
```

**⚠️ Attention :** TypeScript ne vérifie pas toujours la correspondance exacte des valeurs avec cette méthode, donc `as const` reste la méthode la plus sûre pour les valeurs littérales individuelles.

### Résumé des bonnes pratiques

- ✅ Utilisez `as const` pour les propriétés de type union strict lors de la création dynamique d'objets
- ✅ Cela évite les erreurs de typage et garantit la sécurité du code
- ✅ Préférez `as const` pour les valeurs littérales dans les objets générés dynamiquement
- ⚠️ Vous pouvez aussi utiliser une assertion de type complète, mais soyez vigilant sur la validité des valeurs
- 📝 Documentez cette règle dans votre projet pour faciliter la relecture du code

---

Ce guide garantit un code TypeScript robuste, maintenable et professionnel pour StockHub V2. 🚀
