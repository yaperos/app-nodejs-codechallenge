import { PaginationLimit } from 'src/modules/shared/domain/criteria/pagination-limit';
import { InvalidArgumentError } from 'src/modules/shared/domain/errors/invalid-argument.error';

import { PaginationLimitMother } from './mothers/pagination-limit.Mother';

describe('PaginationLimit test', () => {
  it('should throw an error for invalid value', () => {
    expect(() => {
      new PaginationLimit(0);
    }).toThrow(InvalidArgumentError);
  });

  it('should test default instance', () => {
    let paginationLimit = PaginationLimit.fromDefault();
    expect(paginationLimit.value).toEqual(10);

    const randomLimit = PaginationLimitMother.randomValue();
    paginationLimit = PaginationLimit.fromDefault(randomLimit);
    expect(paginationLimit.value).toEqual(randomLimit);
  });
});
