import { BadRequestException } from '@nestjs/common';
import { validate } from 'class-validator';
import { ClassValidator } from '../../../src/classes/ClassValidator.class';
import { ErrorHandler } from '../../../src/classes/ErrorHandler.class';

jest.mock('class-validator');
jest.mock('class-transformer');

class TestDto {}

describe('ClassValidator', () => {
  let classValidator: ClassValidator;

  beforeEach(() => {
    classValidator = new ClassValidator();
  });

  it('should return the value if no metatype is provided', async () => {
    const value = { name: 'John' };
    const result = await classValidator.transform(value, { type: null, metatype: undefined });
    expect(result).toBe(value);
  });

  it('should return the value if metatype is a primitive type', async () => {
    const value = 'string value';
    const result = await classValidator.transform(value, { type: null, metatype: String });
    expect(result).toBe(value);
  });

  it('should throw BadRequestException if validation fails', async () => {
    const value = { name: 'John' };
    const metatype = TestDto;

    (validate as jest.Mock).mockResolvedValueOnce([{ property: 'name', constraints: { isNotEmpty: 'name should not be empty' } }]);

    jest.spyOn(ErrorHandler, 'throwBadRequestException').mockImplementation(() => {
      throw new BadRequestException('Incorrect payload structure. See the API documentation for more details');
    });

    await expect(classValidator.transform(value, { type: null, metatype })).rejects.toThrow(BadRequestException);
  });

  it('should return the transformed value if validation passes', async () => {
    const value = { name: 'John' };
    const metatype = TestDto;
    (validate as jest.Mock).mockResolvedValueOnce([]);

    const result = await classValidator.transform(value, { type: null, metatype });
    expect(result).toBe(value);
  });

  it('should not validate if metatype is in the allowed types', async () => {
    const value = [1, 2, 3];
    const result = await classValidator.transform(value, { type: null, metatype: Array });
    expect(result).toBe(value);
  });
});
