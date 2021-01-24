module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [],
  // parserOptions: {
  //   parser: 'babel-eslint',
  // },
  "parserOptions": {
    "ecmaVersion": 2017
  },

  // "env": {
  //   "es6": true
  // },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
  },
}
