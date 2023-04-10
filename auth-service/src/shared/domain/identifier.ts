export class Identifier<T> {
  private readonly _value: T;

  constructor(value: T) {
    this._value = value;
  }

  equals(id?: Identifier<T>): boolean {
    if (id === null || id === undefined) {
      return false;
    }
    if (!(id instanceof Identifier)) {
      return false;
    }

    return id.toValue() === this._value;
  }

  toString(): string {
    return String(this._value);
  }

  toValue(): T {
    return this._value;
  }
}
