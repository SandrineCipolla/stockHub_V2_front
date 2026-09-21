# 🤖 AI-AGENT.md

## 🧠 Présentation

Ce projet permet d'extraire automatiquement des **design tokens** (couleurs, espacements, polices, tailles de texte) à partir de fichiers sources (`.tsx`, `.html`, `.css`, etc.) grâce à une analyse statique pilotée par un **agent local**.

📁 **[Repository GitHub](https://github.com/SandrineCipolla/design-system-agent)**

Les résultats sont ensuite exportables dans deux formats :

- `tokens.json` (Design Token Spec)
- `tailwind.config.js` (configuration étendue pour TailwindCSS)

Il n'y a **aucune dépendance IA externe** : tout fonctionne côté client avec une logique d’extraction optimisée.

---

## 🧩 Architecture

- **Frontend** : React + TailwindCSS
- **Agent IA local** : `extractor.ts`
- **Générateur** de formats : `generator.ts`
- **Interface utilisateur** : `CodeUpload.tsx` + `ResultDisplay.tsx`

---

## 🚀 Guide d’utilisation

### ⚙️ Prérequis

- Node.js ≥ 18
- Gestionnaire de paquets : `npm` ou `yarn`
- Navigateur moderne

### 🔧 Installation

```bash
git clone <url-du-repo>
cd <nom-du-projet>
npm install
npm run dev
```

### 🧪 Étapes d’utilisation

1. Démarre l'application localement
2. Uploade des fichiers `.ts`, `.tsx`, `.html` ou `.css`
3. Clique sur le bouton `🔍 Analyser les fichiers`
4. Visualise les tokens extraits (JSON + config Tailwind)
5. Clique sur `📥 Télécharger les fichiers` pour exporter

---

## 📂 Structure du projet

```
📦 src/
├── components/
│   ├── CodeUpload.tsx       # Interface d’upload multi-fichiers
│   └── ResultDisplay.tsx    # Affichage + téléchargement
├── logic/
│   ├── extractor.ts         # Analyse et extraction des tokens
│   └── generator.ts         # Génération JSON et tailwind.config.js
```

---

## 🔍 Modules internes

### `extractor.ts` — 🎯 Extraction intelligente

#### `extractDesignTokens(files: Record<string, string>)`

> Analyse les fichiers `.tsx`, `.css`, `.html` pour détecter les design tokens utilisés.

- Recherche :
  - Couleurs (text-, bg-, CSS `color:` ou `--color`)
  - Espacement (`p-*`, `m-*`, `space-*`)
  - Font-size (`text-sm`, `text-xl`, etc.)
  - Font-family (`font-*`, `font-family: ...`)

- Gère :
  - Les variables CSS dans `:root { --... }`
  - Les classes dupliquées ou suspectes (console.warn)
  - Les classes non utilisées

**Retourne :**

```token.json
{
  colors: string[],
  spacing: string[],
  fontSizes: string[],
  fonts: string[]
}
```

---

### `generator.ts` — 🛠 Génération de fichiers

#### `generateTokensJson(tokens)`

Transforme l’objet extrait en fichier `tokens.json` :

```json
{
  "color": {
    "primary-1": { "value": "#xxxxxx", "type": "color" }
  },
  "spacing": {
    "spacing-1": { "value": "1rem", "type": "spacing" }
  }
}
```

#### `generateTailwindConfig(tokens)`

Renvoie une string représentant un fichier `tailwind.config.js` :

```js
module.exports = {
  theme: {
    extend: {
      colors: {
        'primary-1': '#xxxxxx'
      },
      spacing: {...},
      fontSize: {...},
      fontFamily: {...}
    }
  }
};
```

---

## 🧪 Interface utilisateur

### `CodeUpload.tsx`

- Permet de charger plusieurs fichiers
- Lit le contenu des fichiers en `base64`
- Envoie à l’extracteur via `onSubmit()`

### `ResultDisplay.tsx`

- Affiche les résultats générés (`tokens.json` et `tailwind.config.js`)
- Permet le téléchargement local via `Blob`

---

## 💡 Exemple

### Classe détectée :

```html
<div class="bg-blue-500 text-white p-4 font-bold text-xl"></div>
```

### Donne :

```json
{
  "color": {
    "primary-1": { "value": "bg-blue-500", "type": "color" },
    "primary-2": { "value": "text-white", "type": "color" }
  },
  "spacing": {
    "spacing-1": { "value": "p-4", "type": "spacing" }
  },
  "fontSize": {
    "text-1": { "value": "text-xl", "type": "fontSize" }
  },
  "fontFamily": {
    "font-1": { "value": "font-bold", "type": "fontFamily" }
  }
}
```

---

## ⚠️ Limitations

- ⚙️ Aucune analyse SCSS/LESS
- 🚫 Pas de support des imports dynamiques CSS
- 🧠 L’analyse repose sur des expressions régulières, pas de parsing AST
- 🔐 Tout est exécuté localement, pas de backend ni persistance

---

## 👤 Auteur

- Projet développé par **Sandrine Cipolla**

---

## 📬 Contact

- GitHub : [@SandrineCipolla](https://github.com/SandrineCipolla)
- Pour toute suggestion, bug ou amélioration : ouvrir une issue
