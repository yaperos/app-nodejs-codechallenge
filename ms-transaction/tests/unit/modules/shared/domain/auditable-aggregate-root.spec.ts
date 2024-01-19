import { DateMother } from './mothers';
import { Test } from './test';

describe('AuditableAggregateRoot test', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });
  it('should be correctly instance with all parameters', () => {
    const createdAt = DateMother.random();
    const updatedAt = DateMother.random();
    const audtableAggregate = new Test(null, createdAt, updatedAt);

    expect(audtableAggregate.getCreatedAt()).toEqual(createdAt);
    expect(audtableAggregate.getUpdatedAt()).toEqual(updatedAt);
  });

  it('should be correctly instance with only createdAt parameter', () => {
    const createdAt = DateMother.random();
    const audtableAggregate = new Test(null, createdAt);

    expect(audtableAggregate.getCreatedAt()).toEqual(createdAt);
    expect(audtableAggregate.getUpdatedAt()).toEqual(createdAt);
  });

  it('should be correctly instance without parameters', () => {
    const date = new Date();
    jest.spyOn(global, 'Date').mockImplementation(() => date);

    const audtableAggregate = new Test(null);
    expect(audtableAggregate.getCreatedAt()).toEqual(date);
    expect(audtableAggregate.getUpdatedAt()).toEqual(date);
  });

  it('should test markAsUpdated function', () => {
    const date = new Date();
    const audtableAggregate = new Test(null, new Date('01-01-2024'));
    jest.spyOn(global, 'Date').mockImplementation(() => date);

    expect(audtableAggregate.getUpdatedAt()).not.toEqual(date);
    audtableAggregate.markAsUpdated();
    expect(audtableAggregate.getUpdatedAt()).toEqual(date);
  });
});
