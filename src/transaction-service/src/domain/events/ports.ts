import { Listener } from "../listeners/ports";

interface Event {
  subscribe(listener: Listener): void;
  dispatch(): Promise<void>;
}

abstract class DomainEvent implements Event {
  protected listeners: Listener[];

  constructor() {
    this.listeners = [];
    this.registerListeners();
  }

  public subscribe(listener: Listener): void {
    this.listeners.push(listener);
  }

  protected abstract registerListeners(): void;

  async dispatch(): Promise<void> {
    for (const listener of this.listeners) {
      listener.handle(this);
    }
  }
}

export { Event, DomainEvent };
