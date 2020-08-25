module.exports = {
  env: {
    browser: true,
    es2020: true,
    webextensions: true,
    jquery: true,
  },
  extends: ['airbnb-base', 'prettier'],
  plugins: ['prettier'],
  parserOptions: {
    ecmaVersion: 11,
    sourceType: 'module',
  },
  rules: {
    'no-use-before-define': ['error', { functions: false, classes: false }],
  },
};
