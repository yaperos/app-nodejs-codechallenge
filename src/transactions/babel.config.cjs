module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    ['@babel/preset-typescript', { onlyRemoveTypeImports: true }],
  ],
  plugins: [
    ['module-resolver', {
      extensions: ['.js', '.ts', '.jsx', '.tsx'],
      stripExtensions: ['.js']
    }]
  ]
};
