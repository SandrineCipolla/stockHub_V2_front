Sandrine: StockHub
https://github.com/SandrineCipolla/stockHub_V2_front
DS: https://github.com/SandrineCipolla/stockhub_design_system
Linting: ESLint 9.25.0 + TypeScript ESLint 8.30.1
Formatting: Prettier 3.6.2 avec auto-formatting
Testing: Vitest 3.2.4 + Testing Library
Git Hooks: Husky 9.1.7 + lint-staged 16.2.6
Dead Code: Knip 5.66.2 pour détection code inutilisé
PostCSS: Autoprefixer 10.4.21 + PostCSS Import 16.1.1
Dev Server: Vite avec Hot Module Replacement
Build Tools: TSX 4.20.3 pour les scripts
SEO: Vite Plugin Sitemap 0.8.2

Design system en place avec StoryBook en Web Components (Atomic Design)
Quelques Tokens définis et maquettes
ESlint/ prettier
Automatisation avec github actions

Mardi 17 - TODO
Audit de ses dépendances et répondre à la question " c'est quoi ce truc ?"
Ajouter CI :

- Sécurité :
- Eco-conception : bundlesize
- A11y : kastor
  Plus tard :
- test un custom element avec Vuejs.
- réfléchir à la complexité de l'architecture front

Dependencies (runtime)
"@stockhub/design-system": "github:SandrineCipolla/stockhub_design_system#v1.3.1": LE DS installé via Github
"framer-motion": "^12.23.24":Biblio animation React (micro-animations sur le dashboard)
"lit": "^3.3.1":Framework pour les Web Components
"lucide-react": "^0.517.0":Biblio d icones SVG pour React
"react": "19.2.3":Bibliotheque front(ensemble de code "préecrit)
"react-dom": "19.2.3":render pour le navigateur :prend le virtual Dom de react pour le traduire en manipulations du DOM HTML
"react-router-dom": "^7.9.5":sert au routing coté client: gestion de la navigation entre les pages de l'app

DevDependencies (développement seulement)
"@eslint/js": "^9.25.0":config ESLint pour JS (outil qui lit ton code sans l'exécuter et détecte des problèmes avant de lancer l'app)
"@testing-library/jest-dom": "^6.8.0":Matchers(fonction permettant de faire une vérification dans un test) additionnels pour les assertions DOM dans les tests
"@testing-library/react": "^16.3.0":Utilitaires (fonctions prêtes à l'emploi) pour tester les composants React
"@testing-library/user-event": "^14.6.1":Simule des interactions utilisateur
"@types/node": "^24.0.3":Types TypeScript pour les APIs Node.js
"@types/react": "^19.1.2"
"@types/react-dom": "^19.1.2":Définitions de types TypeScript pour React et React DOM.
"@vitejs/plugin-react": "^4.4.1":Plugin Vite qui active le support React=> extension pour permettre à vite de comprendre/traiter le code React
"@vitest/coverage-v8": "^3.2.4":Provider de couverture de code pour Vitest, basé sur le moteur V8 de Chrome/Node.=> outil permettant de mesurer quelles lignes de code sont couvertes par des tests
"@vitest/ui": "^3.2.4":Interface graphique de Vitest
"autoprefixer": "^10.4.21":Plugin PostCSS qui ajoute automatiquement les préfixes CSS pour la compatibilité navigateurs.
"eslint": "^9.25.0":Le linter JavaScript/TypeScript
"eslint-config-prettier": "^10.1.8":Désactive les règles ESLint qui entrent en conflit avec Prettier (pour que les deux cohabitent sans conflits).
"eslint-plugin-react-hooks": "^5.2.0":Vérifie les règles des hooks React
"eslint-plugin-react-refresh": "^0.4.19":Vérifie que les composants sont compatibles avec le Fast Refresh de Vit
"globals": "^16.0.0":Liste de variables globales prédéfinies pour ESLint
"happy-dom": "^20.0.11":Implémentation DOM légère et rapide pour les tests Vitest. Alternative à jsdom, plus performante.
"husky": "^9.1.7":Gestion des hooks Git. Configure le hook pre-commit qui lance clean:check avant chaque commit.
"jsdom": "^25.0.1":Implémentation DOM complète pour les tests. Certains tests peuvent l'utiliser à la place de happy-dom selon la config.
"knip": "^5.66.2":Détecteur de code mort TypeScript/JavaScript. Identifie exports, imports et fichiers inutilisés.
"lighthouse": "^12.8.2":L'outil d'audit Google Lighthouse,
"lint-staged": "^16.2.6":Exécute des commandes uniquement sur les fichiers stagés (modifiés dans le commit). Optimise le hook pre-commit pour ne pas tout relancer.
"postcss": "^8.4.38":Processeur CSS. Requis par Tailwind et Autoprefixer.
"prettier": "^3.7.4":Formateur de code. Applique un style cohérent sur tout le projet.
"puppeteer": "^24.24.0":Contrôle un navigateur headless Chrome. Utilisé par les scripts d'audit (Lighthouse, FPS, a11y, colorblind).
"tailwindcss": "^3.4.1":Framework CSS utilitaire. Génère les classes CSS à partir de tes templates.
"terser": "^5.44.0":Minifieur JavaScript. Vite l'utilise pour optimiser le bundle de production.
"tsx": "^4.20.3":Exécute directement des fichiers TypeScript sans compilation préalable. Utilisé pour generate-sitemap.ts.
"typescript": "~5.8.3":Le compilateur TypeScript. Version fixée avec ~ (patch updates seulement, pas de minor).
"typescript-eslint": "^8.30.1":Intégration ESLint + TypeScript : règles ESLint qui comprennent les types TS.
"vite": "^6.3.5":bundler/serveur de dev. Extrêmement rapide grâce aux ES Modules natifs.
"vitest": "^3.2.4":Framework de tests, compatible Vite. Réutilise la config Vite, très rapide.

lint-staged
"lint-staged": {
"_.{ts,tsx}": ["prettier --write", "eslint --fix"],
"_.{json,css,md}": ["prettier --write"]
}:Configure ce qui se passe sur les fichiers stagés au pre-commit : les fichiers TypeScript sont formatés ET lintés (avec correction auto), les autres fichiers sont juste formatés.
