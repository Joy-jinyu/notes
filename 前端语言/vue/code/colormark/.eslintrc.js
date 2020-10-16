module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module',
  },
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  extends: [
    // '@nuxtjs',
    // 'plugin:nuxt/recommended',
    // 'plugin:prettier/recommended',
    'prettier',
    'plugin:vue/recommended',
    'prettier/vue',
    // 'plugin:nuxt/recommended',
    'plugin:prettier/recommended',
  ],
  plugins: ['prettier'],
  // add your custom rules here
  // it is base on https://github.com/vuejs/eslint-config-vue
  rules: {
    'prettier/prettier': 'error',
  },
};
