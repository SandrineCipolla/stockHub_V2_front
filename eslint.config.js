import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import prettierConfig from 'eslint-config-prettier'

export default tseslint.config(
  { ignores: [
      'dist',
          'src/propositionIA.tsx',
      'src/**/__tests__/**',
      'src/test/**',
      'coverage/**',
      '**/*.test.{ts,tsx}',
      '**/*.spec.{ts,tsx}',
      ] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      // eslint-plugin-react-hooks v7 : nouvelle règle très stricte qui flague le
      // pattern "fetch au montage + setLoading(true)" utilisé par de nombreux hooks
      // de ce projet (useStocks, useStockDetail, useNotificationCount, etc.).
      // Le pattern reste valide ; le corriger nécessiterait de re-architecturer le
      // data-fetching de l'app. Passé en warn en attendant un refactor dédié.
      'react-hooks/set-state-in-effect': 'warn',
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      // 🚨 Règles strictes pour détecter les problèmes de types
      '@typescript-eslint/no-explicit-any': 'error', // Interdit 'any'
      '@typescript-eslint/consistent-type-assertions': [
        'error',
        {
          assertionStyle: 'never' // Interdit TOUS les casts 'as' (y compris 'as const')
        }
      ],
      '@typescript-eslint/prefer-as-const': 'off', // Désactivé car on interdit tous les 'as'
      // '@typescript-eslint/no-non-null-assertion': 'error', // Autorisé maintenant
      '@typescript-eslint/ban-ts-comment': 'error', // Interdit @ts-ignore, @ts-nocheck
    },
  },
  prettierConfig, // Disable ESLint rules that conflict with Prettier
)
