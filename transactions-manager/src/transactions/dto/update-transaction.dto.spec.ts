import { UpdateTransactionDto } from './update-transaction.dto';
import { validate } from 'class-validator';

describe('UpdateTransactionDto', () => {
  let dto: UpdateTransactionDto;

  beforeEach(() => {
    dto = new UpdateTransactionDto();
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

  it('should require transactionStatus', async () => {
    const errors = await validate(dto);

    const transactionStatusError = errors.find(
      (error) => error.property === 'transactionStatus',
    );
    expect(transactionStatusError).toBeDefined();
    expect(transactionStatusError.constraints).toEqual({
      isNotEmptyObject: 'transactionStatus must be a non-empty object',
    });
  });

  it('should be valid with all fields', async () => {
    const newDto = new UpdateTransactionDto();
    const uuid = '123e4567-e89b-12d3-a456-426614174000'; 
    const transactionStatus = { name: 'completed' }; 

    Object.assign(newDto, { uuid, transactionStatus });

    const errors = await validate(newDto);

    expect(errors).toHaveLength(0);
  });
});
