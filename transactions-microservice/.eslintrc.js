module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true,
  },
  extends: 'airbnb-base',
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    semi: ['error', 'never'],
    'space-before-function-paren': ['error', 'always'],
    'arrow-parens': ['error', 'as-needed'],
    'class-methods-use-this': ['error', { exceptMethods: ['connect'] }],
    'no-plusplus': 'off',
    'no-underscore-dangle': ['error', { allow: ['_id'] }],
    'max-len': ['error', { code: 120, ignoreTemplateLiterals: true }],
    'no-console': 'off',
    'import/no-extraneous-dependencies': 'off',
  },
}
