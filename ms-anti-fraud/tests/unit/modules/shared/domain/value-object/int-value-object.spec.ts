import { IntValueObject } from 'src/modules/shared/domain/value-object/int-value-object';

import { IntegerMother } from '../mothers';

class TestIntValueObject extends IntValueObject {}

describe('IntValueObject test', () => {
  it('should be correctly instance', () => {
    const int = IntegerMother.random();

    const intValueObject = new TestIntValueObject(int);
    expect(intValueObject.value).toEqual(int);
  });

  it('should test isBiggerThan function', () => {
    const intValueObject = new TestIntValueObject(IntegerMother.random());
    const lowerIntValueObject = new TestIntValueObject(
      intValueObject.value - 1,
    );
    const biggerIntValueObject = new TestIntValueObject(
      intValueObject.value + 1,
    );
    expect(intValueObject.isBiggerThan(lowerIntValueObject)).toBeTruthy();
    expect(intValueObject.isBiggerThan(biggerIntValueObject)).toBeFalsy();
  });
});
