import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import prettier from 'eslint-config-prettier/flat';
import globals from 'globals';

const DECLARATIONS = ['const', 'let', 'var'];

export default [
  { ignores: ['dist/**', 'test-results/**', 'playwright-report/**'] },
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    plugins: { '@stylistic': stylistic },
    rules: {
      'id-length': ['error', { min: 1, properties: 'never', exceptions: ['_', 'i'] }],
      'consistent-return': ['warn', { treatUndefinedAsUnspecified: false }],
      'no-console': ['error', { allow: ['warn', 'error'] }],
      'no-useless-escape': 'off',
      // Prettier keeps blank lines but never adds one.
      '@stylistic/padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: DECLARATIONS, next: '*' },
        { blankLine: 'any', prev: DECLARATIONS, next: DECLARATIONS },
        { blankLine: 'always', prev: '*', next: 'return' },
      ],
    },
  },
  {
    files: ['src/**/*.js'],
    languageOptions: {
      globals: { ...globals.browser, __VERSION__: 'readonly' },
    },
  },
  {
    files: ['e2e/**/*.js'],
    languageOptions: { globals: { ...globals.node, ...globals.browser } },
  },
  {
    files: ['*.config.mjs'],
    languageOptions: { globals: globals.node },
  },
  prettier,
  // eslint-config-prettier switches curly off, but its "all" setting never fights prettier.
  { rules: { curly: ['error', 'all'] } },
];
