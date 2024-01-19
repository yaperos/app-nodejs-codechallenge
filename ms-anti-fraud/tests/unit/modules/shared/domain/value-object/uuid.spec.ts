import { InvalidArgumentError } from 'src/modules/shared/domain/errors/invalid-argument.error';
import { Uuid } from 'src/modules/shared/domain/value-object/uuid';

import { StringMother, UuidMother } from '../mothers';

describe('Uuid test', () => {
  it('should be correctly instance', () => {
    const uuid = UuidMother.random();
    const uuidObject = new Uuid(uuid);
    expect(uuidObject.value).toEqual(uuid);
  });

  it('should throw an error for invalid value', () => {
    expect(() => {
      new Uuid(StringMother.random());
    }).toThrow(InvalidArgumentError);
  });
});
