import { faker } from '@faker-js/faker';

export class IntegerMother {
  static random(params?: { min?: number; max?: number }): number {
    const { min = 1, max = 999999 } = params ?? {};
    return faker.number.int({ min, max });
  }
}
