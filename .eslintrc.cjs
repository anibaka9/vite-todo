module.exports = {
  env: {
    browser: true,
    es2021: true,
  },

  extends: [
    'hardcore',
    'hardcore/react',
    'hardcore/react-testing-library',
    'hardcore/jest',
    'hardcore/fp',
    'hardcore/ts',
    'plugin:tailwindcss/recommended',
    'prettier',
  ],

  overrides: [],
  parser: '@typescript-eslint/parser',

  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json',
  },

  plugins: ['react', '@typescript-eslint', 'tailwindcss'],

  rules: {
    'react/react-in-jsx-scope': 0,
    '@typescript-eslint/prefer-readonly-parameter-types': 'warn',
  },

  ignorePatterns: ['.eslintrc.cjs'],
};
