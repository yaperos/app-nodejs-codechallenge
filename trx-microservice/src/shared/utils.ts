export function parseMessage<T>(raw: any): T {
  if (raw?.value) {
    try {
      return JSON.parse(raw.value.toString());
    } catch {}
  }
  return raw as T;
}