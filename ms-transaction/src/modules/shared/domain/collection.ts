import { AggregateRoot } from './aggregate-root';

export abstract class Collection<T extends AggregateRoot> {
  public abstract all(): Array<T>;

  public allIndexedById(): { [key: string]: T } {
    const allIndexedById: { [key: string]: T } = {};

    if (!this.isEmpty()) {
      const all = this.all();

      all.forEach((aggregate: T) => {
        allIndexedById[aggregate.getId()] = aggregate;
      });
    }

    return allIndexedById;
  }

  public isEmpty(): boolean {
    return !this.all().length;
  }

  public count(): number {
    return this.all().length;
  }

  public getFirst(): T | null {
    if (this.isEmpty()) {
      return null;
    }

    return this.all()[0];
  }
}
