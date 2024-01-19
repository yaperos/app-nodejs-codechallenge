import { PaginationPage } from 'src/modules/shared/domain/criteria/pagination-page';
import { InvalidArgumentError } from 'src/modules/shared/domain/errors/invalid-argument.error';

import { PaginationPageMother } from './mothers/pagination-page.mother';

describe('PaginationPage test', () => {
  it('should throw an error for invalid value', () => {
    expect(() => {
      new PaginationPage(0);
    }).toThrow(InvalidArgumentError);
  });

  it('should test default instance', () => {
    let paginationPage = PaginationPage.fromDefault();
    expect(paginationPage.value).toEqual(1);

    const randomPage = PaginationPageMother.randomValue();
    paginationPage = PaginationPage.fromDefault(randomPage);
    expect(paginationPage.value).toEqual(randomPage);
  });
});
