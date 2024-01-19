import { UuidMother } from './mothers';
import { Test } from './test';
import { Tests } from './test-collection';

describe('Collection test', () => {
  it('should test isEmpty function', () => {
    let tests = new Tests([]);
    expect(tests.isEmpty()).toBeTruthy();

    tests = new Tests([new Test(UuidMother.random())]);
    expect(tests.isEmpty()).toBeFalsy();
  });

  it('should test count function', () => {
    let tests = new Tests([]);
    expect(tests.count()).toEqual(0);

    tests = new Tests([new Test(UuidMother.random())]);
    expect(tests.count()).toEqual(1);
  });

  it('should test getFirst function', () => {
    let tests = new Tests([]);
    expect(tests.getFirst()).toBeNull();

    const test = new Test(UuidMother.random());
    const test2 = new Test(UuidMother.random());
    tests = new Tests([test, test2]);
    expect(tests.getFirst()).toEqual(test);
  });

  it('should test allIndexedById function', () => {
    let tests = new Tests([]);
    expect(tests.allIndexedById()).toEqual({});

    const test = new Test(UuidMother.random());

    const test2 = new Test(UuidMother.random());

    tests = new Tests([test, test2]);

    const testsById = tests.allIndexedById();
    expect(Object.values(testsById).length).toEqual(2);
    expect(testsById[test.getId()]).toEqual(test);
    expect(testsById[test2.getId()]).toEqual(test2);
  });
});
