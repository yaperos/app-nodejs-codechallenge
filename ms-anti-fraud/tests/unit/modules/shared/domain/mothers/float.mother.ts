import { faker } from '@faker-js/faker';

export class FloatMother {
  static random(params?: { min?: number; max?: number }): number {
    const { min = 0, max = 999999 } = params ?? {};
    return faker.number.float({ min, max, precision: 2 });
  }
}
