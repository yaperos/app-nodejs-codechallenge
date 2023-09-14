export abstract class ValueObject<T> {
  protected readonly _value: T;

  constructor(value: T) {
    this._value = value;
  }
  public toValue(): T {
    return this._value;
  }

  public equals(vo?: ValueObject<T>): boolean {
    if (vo === null || vo === undefined) {
      return false;
    }
    if (vo.toValue() === undefined) {
      return false;
    }
    return this.toValue() === vo.toValue();
  }
}
