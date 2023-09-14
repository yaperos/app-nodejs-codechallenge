export class Identifier {
  constructor(private value: string) {
    this.value = value;
  }

  equals(id?: Identifier): boolean {
    if (id === null || id === undefined) {
      return false;
    }
    if (!(id instanceof this.constructor)) {
      return false;
    }
    return id.toValue() === this.value;
  }

  toString() {
    return String(this.value);
  }

  toValue(): string {
    return this.value;
  }
}
