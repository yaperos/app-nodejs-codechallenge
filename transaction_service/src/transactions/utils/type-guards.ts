export function hasRequiredKeys<T>(obj: Partial<T>, keys: (keyof T)[]): obj is T {
  if (typeof obj !== 'object' || obj === null) {
    return false;
  }
  return keys.every(key => key in obj && typeof obj[key] !== 'undefined');
}
