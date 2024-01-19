import { InvalidArgumentError } from 'src/modules/shared/domain/errors/invalid-argument.error';
import { ValueObject } from 'src/modules/shared/domain/value-object/value-object';

import { StringMother } from '../mothers';

class TestValueObject extends ValueObject<string> {}

describe('ValueObject test', () => {
  it('should be correctly instance', () => {
    const value = StringMother.random();
    const valueObject = new TestValueObject(value);
    expect(valueObject.value).toEqual(value);
  });

  it('should throw an error for value not defined', () => {
    expect(() => {
      new TestValueObject(null);
    }).toThrow(InvalidArgumentError);

    expect(() => {
      new TestValueObject(undefined);
    }).toThrow(InvalidArgumentError);
  });

  it('should test equals function', () => {
    const value = StringMother.random();
    const valueObject = new TestValueObject(value);
    const sameValueObject = new TestValueObject(value);
    const differentValueObject = new TestValueObject(StringMother.random());
    expect(valueObject.equals(sameValueObject)).toBeTruthy();
    expect(valueObject.equals(differentValueObject)).toBeFalsy();
  });

  it('should test toString function', () => {
    const value = StringMother.random();
    const valueObject = new TestValueObject(value);
    expect(valueObject.toString()).toEqual(value);
  });
});
