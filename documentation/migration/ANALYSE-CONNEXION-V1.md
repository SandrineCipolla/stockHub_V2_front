# 📊 Analyse Connexion Frontend V1 → Backend StockHub

## 🔍 Informations extraites de vos repositories

---

## 1. 🔧 Configuration Backend

### Backend URL et Ports
```bash
# Backend écoute sur le port 3006 (d'après Postman collection)
http://localhost:3006

# Routes disponibles :
- /api/v1/*  → ✅ Auth Azure AD requise (Bearer token)
- /api/v2/*  → ✅ Auth Azure AD requise (Bearer token)
```

### Variables d'environnement Backend
```bash
# Port
PORT=3006

# Base de données
DATABASE_URL=mysql://user:password@localhost:3306/stockhub

# Azure AD (pour auth V1)
AZURE_CLIENT_ID=...
AZURE_TENANT_ID=...
```

---

## 2. 🌐 Configuration Frontend V1

### Variables d'environnement V1 (détectées)

D'après `ConfigManager.ts`, le V1 utilise :

```bash
# .env ou .env.local du V1
VITE_API_SERVER_URL=http://localhost:3006
VITE_API_V1=/api/v1
VITE_API_V2=/api/v2
VITE_REDIRECT_URI=http://localhost:5173
```

### Fichier de configuration : `src/utils/ConfigManager.ts`

```typescript
class ConfigManager {
    // Construit l'URL complète de l'API
    static getApiServerUrl(version: number = 1): string {
        return import.meta.env.VITE_API_SERVER_URL + computeVersionPath(version);
    }
    
    // GET avec auth
    static async getFetchConfig() {
        const token = await getToken(); // Token depuis localStorage
        return {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        };
    }
    
    // POST avec auth
    static async postFetchConfig(body) {
        const token = await getToken();
        return {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(body),
        };
    }
    
    // PUT, DELETE similaires...
}

// Récupération du token depuis localStorage
const getToken = (): Promise<string | null> => {
    return new Promise((resolve) => {
        const checkToken = () => {
            const token = localStorage.getItem('authToken');
            if (token) {
                resolve(token);
            } else {
                setTimeout(checkToken, 100); // Retry après 100ms
            }
        };
        checkToken();
    });
};
```

---

## 3. 📡 Services API V1

### Fichier principal : `src/utils/StockAPIClient.ts`

```typescript
// Exemple de fonction dans V1
export const fetchStocks = async () => {
    const {apiUrl, config} = await getApiConfig('GET', 1);
    const response = await fetch(`${apiUrl}/stocks`, config);
    
    if (!response.ok) {
        throw new Error(`HTTP response with status ${response.status}`);
    }
    
    return await response.json();
};

export const addStock = async (LABEL: string, DESCRIPTION: string) => {
    const body = {LABEL, DESCRIPTION};
    const {apiUrl, config} = await getApiConfig('POST', 1, body);
    
    const response = await fetch(`${apiUrl}/stocks/`, config);
    
    if (!response.ok) {
        throw new Error(`HTTP response with status ${response.status}`);
    }
    
    return await response.json();
};

export const deleteStock = async (stockID: number) => {
    const body = {STOCK: stockID}
    const {apiUrl, config} = await getApiConfig('DELETE', 1, body);
    const response = await fetch(`${apiUrl}/stocks/${stockID}`, config);
    
    if (!response.ok) {
        throw new Error(`HTTP response with status ${response.status}`);
    }
    
    return await response.json();
};

export const fetchItemsList = async (): Promise<Item[]> => {
    const {apiUrl, config} = await getApiConfig('GET', 1);
    const targetUrl = `${apiUrl}/items`;
    const response = await fetch(targetUrl, config);
    
    if (!response.ok) {
        throw new Error(`HTTP response with status ${response.status}`);
    }
    
    return await response.json();
};
```

---

## 4. 🔐 Authentification

### Système d'authentification V1

**Azure AD Bearer Token** stocké dans `localStorage` :

```typescript
// Token stocké après login Azure AD
localStorage.setItem('authToken', token);

// Récupéré pour chaque requête
const token = localStorage.getItem('authToken');

// Envoyé dans le header Authorization
headers: {
    'Authorization': `Bearer ${token}`,
}
```

### Flow d'authentification

```
1. User se connecte → Azure AD
2. Azure AD retourne un token
3. Frontend stocke token dans localStorage
4. Chaque requête API inclut : Authorization: Bearer {token}
5. Backend vérifie le token avec Azure AD
```

---

## 5. 🎯 Endpoints API utilisés

### API V1 (avec auth Azure AD)
```bash
GET    /api/v1/stocks              # Liste des stocks
GET    /api/v1/stocks/:id          # Détails d'un stock
POST   /api/v1/stocks              # Créer un stock
PUT    /api/v1/stocks/:id          # Modifier un stock
DELETE /api/v1/stocks/:id          # Supprimer un stock
GET    /api/v1/items               # Liste des items
DELETE /api/v1/stocks/:stockId/items/:itemId  # Supprimer un item
```

### API V2 (sans auth - MVP)
```bash
GET    /api/v2/stocks              # Liste des stocks
GET    /api/v2/stocks/:id          # Détails d'un stock
GET    /api/v2/stocks/:stockId/items/:itemId  # Détails d'un item
```

---

## 6. 📦 Format des données

### Stock (exemple de réponse)
```json
{
  "id": 1,
  "label": "Cuisine",
  "description": "Stock alimentaire",
  "category": "alimentation",
  "items": [
    {
      "label": "Pâtes",
      "quantity": {
        "value": 5
      },
      "minimumStock": 2
    }
  ]
}
```

### Types TypeScript (à créer dans V2)
```typescript
export interface Stock {
  id: number;
  label: string;
  description: string;
  category?: string;
  items: StockItem[];
}

export interface StockItem {
  id?: number;
  label: string;
  quantity: {
    value: number;
  };
  minimumStock: number;
}
```

---

## 7. 🔄 CORS Configuration Backend

```typescript
// Backend CORS (corsConfig.ts)
export const corsConfig: CorsOptions = {
    origin: "*",  // Accepte toutes les origines
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
    credentials: false,
    preflightContinue: false,
    optionsSuccessStatus: 204,
};

export const corsV2Config: CorsOptions = {
    origin: "*",
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
    credentials: false,
    preflightContinue: false,
    optionsSuccessStatus: 200,
};
```

---

## 8. 📋 Plan de migration V1 → V2

### Ce qu'il faut adapter pour le V2

#### 1. **Créer `.env.local` dans V2**
```bash
# Frontend V2 - .env.local
VITE_API_URL=http://localhost:3006
VITE_API_V1=/api/v1
VITE_API_V2=/api/v2
VITE_AZURE_CLIENT_ID=votre-client-id
VITE_AZURE_TENANT_ID=votre-tenant-id
VITE_REDIRECT_URI=http://localhost:5173
```

#### 2. **Créer le client API dans V2**

**src/services/api/client.ts** :
```typescript
// Récupération du token (copié du V1)
const getToken = (): Promise<string | null> => {
    return new Promise((resolve) => {
        const checkToken = () => {
            const token = localStorage.getItem('authToken');
            if (token) {
                resolve(token);
            } else {
                setTimeout(checkToken, 100);
            }
        };
        checkToken();
    });
};

// Client API
const API_BASE_URL = import.meta.env.VITE_API_URL + import.meta.env.VITE_API_V2;

export const apiClient = {
    async get<T>(endpoint: string): Promise<T> {
        const token = await getToken();
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            credentials: 'include'
        });
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }
        
        return response.json();
    },
    
    async post<T>(endpoint: string, data: unknown): Promise<T> {
        const token = await getToken();
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            credentials: 'include',
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }
        
        return response.json();
    },
    
    // Ajouter PUT, DELETE de la même manière
};
```

#### 3. **Créer le service Stock dans V2**

**src/services/api/stockService.ts** :
```typescript
import { apiClient } from './client';

export interface Stock {
  id: number;
  label: string;
  description: string;
  category?: string;
  items: StockItem[];
}

export interface StockItem {
  id?: number;
  label: string;
  quantity: { value: number };
  minimumStock: number;
}

export const stockService = {
    // GET /api/v2/stocks
    getStocks: () => apiClient.get<Stock[]>('/stocks'),
    
    // GET /api/v2/stocks/:id
    getStock: (id: number) => apiClient.get<Stock>(`/stocks/${id}`),
    
    // POST /api/v2/stocks (si disponible en V2)
    createStock: (data: Omit<Stock, 'id'>) => 
        apiClient.post<Stock>('/stocks', data),
    
    // GET /api/v2/stocks/:stockId/items/:itemId
    getItem: (stockId: number, itemId: number) => 
        apiClient.get(`/stocks/${stockId}/items/${itemId}`)
};
```

---

## 9. ✅ Checklist de migration

### Préparation
- [x] Backend tourne sur port 3006
- [x] API V2 disponible (pas d'auth requise)
- [x] ConfigManager V1 analysé
- [x] StockAPIClient V1 analysé
- [x] Format de données identifié

### À faire dans V2
- [ ] Créer `.env.local` avec variables
- [ ] Copier/adapter `getToken()` depuis V1
- [ ] Créer `src/services/api/client.ts`
- [ ] Créer `src/services/api/stockService.ts`
- [ ] Définir les types TypeScript (Stock, StockItem)
- [ ] Configurer React Query
- [ ] Créer les hooks (useStocks, useStock)
- [ ] Tester la connexion

---

## 10. 🚀 Prochaine étape immédiate

### Commande à exécuter dans V2

```bash
# 1. Aller dans le repo V2
cd ~/projects/stockHub_V2_front

# 2. Créer le fichier .env.local
cat > .env.local << 'EOF'
VITE_API_URL=http://localhost:3006
VITE_API_V1=/api/v1
VITE_API_V2=/api/v2
VITE_AZURE_CLIENT_ID=votre-client-id-azure
VITE_AZURE_TENANT_ID=votre-tenant-id-azure
VITE_REDIRECT_URI=http://localhost:5173
EOF

# 3. Créer la structure services
mkdir -p src/services/api

# 4. Installer React Query
npm install @tanstack/react-query

# 5. Démarrer le backend (dans un autre terminal)
cd ~/projects/[votre-backend]
npm run dev

# 6. Démarrer le V2
cd ~/projects/stockHub_V2_front
npm run dev
```

---

## 📊 Récapitulatif

| Élément | V1 | V2 (à faire) |
|---------|----|--------------| 
| **URL API** | `http://localhost:3006` | ✅ Identique |
| **Endpoints** | `/api/v1/*` (auth) | `/api/v2/*` (sans auth) |
| **Auth** | Azure AD Bearer | ⚠️ À copier du V1 |
| **Token storage** | localStorage | ✅ Identique |
| **Services** | `StockAPIClient.ts` | ⚠️ À recréer en TS strict |
| **Config** | `ConfigManager.ts` | ⚠️ À adapter avec client API |
| **Types** | Implicites | ⚠️ À définir explicitement |

---

**Prêt pour la migration ?** Je peux vous guider étape par étape pour créer tous ces fichiers dans le V2 ! 🚀