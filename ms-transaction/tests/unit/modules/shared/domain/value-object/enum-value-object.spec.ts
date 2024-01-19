import { InvalidArgumentError } from 'src/modules/shared/domain/errors/invalid-argument.error';
import { EnumValueObject } from 'src/modules/shared/domain/value-object/enum-value-object';

export enum TestEnum {
  A = 'a',
  B = 'b',
}

class TestEnumValueObject extends EnumValueObject<TestEnum> {
  constructor(value: TestEnum) {
    super(value, Object.values(TestEnum));
  }
}

describe('EnumValueObject test', () => {
  it('should be correctly instance', () => {
    const enumValueObject = new TestEnumValueObject(TestEnum.A);
    expect(enumValueObject.value).toEqual(TestEnum.A);
  });

  it('should throw an error for invalid value', () => {
    expect(() => {
      new TestEnumValueObject('' as TestEnum);
    }).toThrow(InvalidArgumentError);
  });

  it('should test equals function', () => {
    const enumValueObject = new TestEnumValueObject(TestEnum.B);
    const sameEnumValueObject = new TestEnumValueObject(TestEnum.B);
    const diferentEnumValueObject = new TestEnumValueObject(TestEnum.A);

    expect(enumValueObject.equals(sameEnumValueObject)).toBeTruthy();
    expect(enumValueObject.equals(diferentEnumValueObject)).toBeFalsy();
  });
});
