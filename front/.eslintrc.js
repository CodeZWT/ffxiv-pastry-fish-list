module.exports = {
  root: true,

  env: {
    node: true,
  },

  extends: [
    'plugin:vue/essential',
    'eslint:recommended',
    '@vue/prettier',
    // '@vue/typescript',
  ],

  parserOptions: {
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
  },

  rules: {
    'no-console': ['warn', { allow: ['debug', 'warn', 'error'] }],
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
  },
}
