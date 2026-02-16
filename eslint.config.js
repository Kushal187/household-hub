import js from '@eslint/js';
import globals from 'globals';
import prettierConfig from 'eslint-config-prettier';

export default [
  { ignores: ['node_modules/**'] },
  js.configs.recommended,
  prettierConfig,
  {
    files: ['backend/**/*.js'],
    languageOptions: {
      globals: globals.node,
      ecmaVersion: 2022,
      sourceType: 'module',
    },
  },
  {
    files: ['frontend/**/*.js'],
    languageOptions: {
      globals: globals.browser,
      ecmaVersion: 2022,
      sourceType: 'module',
    },
  },
];
