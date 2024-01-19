import { Pagination } from 'src/modules/shared/domain/criteria/pagination';
import { PaginationLimit } from 'src/modules/shared/domain/criteria/pagination-limit';
import { PaginationPage } from 'src/modules/shared/domain/criteria/pagination-page';

import { IntegerMother } from '../mothers';
import { PaginationMother } from './mothers/pagination.Mother';
import { PaginationLimitMother } from './mothers/pagination-limit.Mother';
import { PaginationPageMother } from './mothers/pagination-page.Mother';

describe('Pagination test', () => {
  it('should test default instance', () => {
    let pagination = Pagination.fromDefault();
    expect(pagination.getPage()).toEqual(PaginationPage.DEFAULT_VALUE);
    expect(pagination.getLimit()).toEqual(PaginationLimit.DEFAULT_VALUE);

    const page = PaginationPageMother.randomValue();
    const limit = PaginationLimitMother.randomValue();
    pagination = Pagination.fromDefault(page, limit);
    expect(pagination.getPage()).toEqual(page);
    expect(pagination.getLimit()).toEqual(limit);
  });

  it('should instance from values', () => {
    const page = PaginationPageMother.randomValue();
    const limit = PaginationLimitMother.randomValue();
    const pagination = Pagination.fromValues({ page, limit });
    expect(pagination.getPage()).toEqual(page);
    expect(pagination.getLimit()).toEqual(limit);
  });

  it('should return the correct offset value', () => {
    const pagination = PaginationMother.random();
    const page = pagination.getPage();
    const limit = pagination.getLimit();
    expect(pagination.getOffset()).toEqual((page - 1) * limit);
  });

  it('should return the correct pages number', () => {
    const pagination = PaginationMother.random();
    const limit = pagination.getLimit();
    const total = IntegerMother.random({ min: 1 });
    expect(pagination.getPages(total)).toEqual(Math.ceil(total / limit));
  });
});
