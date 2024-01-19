import { DateValueObject } from 'src/modules/shared/domain/value-object/date-value-object';

class TestDateValueObject extends DateValueObject {}

describe('DateValueObject test', () => {
  it('should be correctly instance', () => {
    const date = new Date();

    const dateValueObject = new TestDateValueObject(date);
    expect(dateValueObject.value).toEqual(date);
  });

  it('should test toString function', () => {
    const date = new Date();
    const dateValueObject = new TestDateValueObject(date);
    expect(dateValueObject.toString()).toEqual(date.toISOString());
  });
});
