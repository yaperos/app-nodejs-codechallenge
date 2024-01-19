import { FilterOperator } from 'src/modules/shared/domain/criteria/filter-operator';
import { InvalidArgumentError } from 'src/modules/shared/domain/errors/invalid-argument.error';

import { StringMother } from '../mothers';

describe('FilterOperator test', () => {
  it('should throw an error for invalid value', () => {
    expect(() => {
      FilterOperator.fromValue(StringMother.random());
    }).toThrow(InvalidArgumentError);
  });
});
