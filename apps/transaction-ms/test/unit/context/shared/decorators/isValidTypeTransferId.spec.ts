import { IsValidTypeTransferId } from '../../../../../src/contexts/shared/decorators/isValidTypeTransferId';
import { Validator } from 'class-validator';

const validator = new Validator();

describe('IsValidTypeTransferId Unit Test', () => {
  class MyClassTest {
    @IsValidTypeTransferId()
    typeId: number;
  }

  it('should be valid', () => {
    const obj = new MyClassTest();
    obj.typeId = 1;
    return validator.validate(obj).then((errors) => {
      expect(errors.length).toBe<number>(0);
    });
  });

  it('should be invalid', () => {
    const obj = new MyClassTest();
    obj.typeId = 3;
    return validator.validate(obj).then((errors) => {
      expect(errors.length).toBe<number>(1);
    });
  });
});
