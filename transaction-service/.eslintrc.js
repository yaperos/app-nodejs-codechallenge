module.exports = {
    extends: ['airbnb', 'prettier'],
    parser: '@typescript-eslint/parser',
    parserOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
    },
    settings: {
      'import/resolver': {
        node: {
          paths: ['src'],
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      },
    },
    env: {
      browser: true,
      es2021: true,
      node: true,
    },
    rules: {
     
    },
  };
  