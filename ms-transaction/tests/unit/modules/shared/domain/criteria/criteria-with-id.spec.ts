import { UuidMother } from '../mothers';
import { TestCriteria } from './test-criteria';

describe('CriteriaWithId test', () => {
  it('should be instance empty', () => {
    const criteria = TestCriteria.createEmpty();
    expect(criteria.getId()).toBeNull();
    expect(criteria.getIds()).toBeNull();
  });

  it('should be instance by id', () => {
    const id = UuidMother.random();
    const criteria = TestCriteria.createById(id);
    expect(criteria.getId()).toEqual(id);
  });

  it('should be instance by ids', () => {
    const ids = [UuidMother.random(), UuidMother.random()];
    const criteria = TestCriteria.createByIds(ids);
    expect(criteria.getIds()).toEqual(ids);
  });
});
