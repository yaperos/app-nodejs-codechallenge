export interface Listener {
  handle(event: any): void; // Use any to prevent circular references
}
