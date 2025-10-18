module.exports = (path, options) => {
  // If it's a relative path ending in .js, try to resolve it as .ts
  if (path.endsWith('.js') && (path.startsWith('./') || path.startsWith('../'))) {
    try {
      // Try with .ts extension first
      const tsPath = path.replace(/\.js$/, '.ts');
      return options.defaultResolver(tsPath, options);
    } catch (e) {
      // If .ts doesn't exist, try .tsx
      try {
        const tsxPath = path.replace(/\.js$/, '.tsx');
        return options.defaultResolver(tsxPath, options);
      } catch (e2) {
        // Fall through to default
      }
    }
  }

  // Default resolution
  return options.defaultResolver(path, options);
};
