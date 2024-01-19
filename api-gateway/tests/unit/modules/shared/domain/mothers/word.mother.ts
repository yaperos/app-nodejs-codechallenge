import { faker } from '@faker-js/faker';

export class WordMother {
  static random(): string {
    return faker.word.noun({ length: { min: 1, max: 1 } });
  }
}
