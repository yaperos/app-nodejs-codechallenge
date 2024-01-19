import { IntegerMother } from './integer.mother';

export class EnumMother {
  static random<T>(enumObject: { [s: string]: T }): T {
    const enumValues = Object.values(enumObject);
    const randomIndex = IntegerMother.random({
      min: 0,
      max: enumValues.length - 1,
    });
    return enumValues[randomIndex];
  }
}
