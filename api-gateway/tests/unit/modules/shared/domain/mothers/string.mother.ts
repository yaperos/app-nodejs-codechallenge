import { faker } from '@faker-js/faker';

export class StringMother {
  static random(params?: { minLength?: number; maxLength?: number }): string {
    const { minLength = 1, maxLength = 250 } = params ?? {};
    return faker.string.sample({ min: minLength, max: maxLength });
  }
}
