import { TransactionDto } from '../../../src/transactions/dto/validate-transaction.dto';
import { validate } from 'class-validator';

describe('TransactionDto', () => {
  let dto: TransactionDto;

  beforeEach(() => {
    dto = new TransactionDto();
  });

  it('should require uuid', async () => {
    const errors = await validate(dto);

    const uuidError = errors.find((error) => error.property === 'uuid');
    expect(uuidError).toBeDefined();
    expect(uuidError.constraints).toEqual({
      isNotEmpty: 'uuid should not be empty',
      isUuid: 'uuid must be a UUID',
    });
  });

  it('should require value', async () => {
    const errors = await validate(dto);

    const valueError = errors.find((error) => error.property === 'value');
    expect(valueError).toBeDefined();
    expect(valueError.constraints).toEqual({
      isNotEmpty: 'value should not be empty',
      isNumber: 'value must be a number conforming to the specified constraints',
    });
  });

  it('should be valid with all fields', async () => {
    const newDto = new TransactionDto();
    Object.assign(newDto, {
      uuid: '123e4567-e89b-12d3-a456-426614174000',
      value: 100,
    });

    const errors = await validate(newDto);

    expect(errors).toHaveLength(0);
  });
});
