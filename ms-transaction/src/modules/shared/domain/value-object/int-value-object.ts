import { ValueObject } from './value-object';

export abstract class IntValueObject extends ValueObject<number> {
  isBiggerThan(other: IntValueObject): boolean {
    return this.value > other.value;
  }
}
