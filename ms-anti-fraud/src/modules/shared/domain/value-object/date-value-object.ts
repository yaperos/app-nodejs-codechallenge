import { ValueObject } from './value-object';

export class DateValueObject extends ValueObject<Date> {
  toString(): string {
    return this.value.toISOString();
  }
}
