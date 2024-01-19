import { OrderBy } from 'src/modules/shared/domain/criteria/order-by';
import { InvalidArgumentError } from 'src/modules/shared/domain/errors/invalid-argument.error';

import { StringMother } from '../mothers';

describe('OrderBy test', () => {
  it('should throw an error for invalid value', () => {
    const invalidValue = StringMother.random({ maxLength: 1 });
    expect(() => {
      new OrderBy(invalidValue);
    }).toThrow(InvalidArgumentError);

    expect(() => {
      new OrderBy('#$%^&');
    }).toThrow(InvalidArgumentError);
  });
});
