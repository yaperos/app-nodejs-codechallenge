module.exports = (request, options) => {
  // If it's a relative path ending in .js, try to resolve it as .ts
  if (request.endsWith('.js') && (request.startsWith('./') || request.startsWith('../'))) {
    try {
      // Try with .ts extension first
      return options.defaultResolver(request.replace(/\.js$/, '.ts'), options);
    } catch (e) {
      // Fall through to default
    }
  }

  // Default resolution
  return options.defaultResolver(request, options);
};
