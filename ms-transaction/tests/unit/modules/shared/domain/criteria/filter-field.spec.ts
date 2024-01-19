import { FilterField } from 'src/modules/shared/domain/criteria/filter-field';
import { InvalidArgumentError } from 'src/modules/shared/domain/errors/invalid-argument.error';

import { StringMother } from '../mothers';

describe('FilterField test', () => {
  it('should throw an error for invalid value', () => {
    expect(() => {
      new FilterField(StringMother.random({ minLength: 1, maxLength: 1 }));
    }).toThrow(InvalidArgumentError);
  });

  it('should throw an error for invalid value2', () => {
    expect(() => {
      new FilterField(StringMother.random({ minLength: 1, maxLength: 1 }));
    }).toThrow(InvalidArgumentError);
  });
});
