module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    semi: ['error', 'always']
  },
  globals: {
    $http: false,
    CONFIG: false,
    _: false
  }
};
