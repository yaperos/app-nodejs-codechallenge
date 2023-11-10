import { CreateTransactionDto } from './create-transaction.dto';
import { validate } from 'class-validator';

describe('CreateTransactionDto', () => {
  let dto: CreateTransactionDto;

  beforeEach(() => {
    dto = new CreateTransactionDto();
  });

  it('should require accountExternalIdDebit', async () => {
    const errors = await validate(dto);

    const accountExternalIdDebitError = errors.find(
      (error) => error.property === 'accountExternalIdDebit',
    );
    expect(accountExternalIdDebitError).toBeDefined();
    expect(accountExternalIdDebitError.constraints).toEqual({
      isNotEmpty: 'accountExternalIdDebit should not be empty',
      isString: 'accountExternalIdDebit must be a string',
    });
  });

  it('should require accountExternalIdCredit', async () => {
    const errors = await validate(dto);

    const accountExternalIdCreditError = errors.find(
      (error) => error.property === 'accountExternalIdCredit',
    );
    expect(accountExternalIdCreditError).toBeDefined();
    expect(accountExternalIdCreditError.constraints).toEqual({
      isNotEmpty: 'accountExternalIdCredit should not be empty',
      isString: 'accountExternalIdCredit must be a string',
    });
  });

  it('should require tranferTypeId', async () => {
    const errors = await validate(dto);

    const tranferTypeIdError = errors.find(
      (error) => error.property === 'tranferTypeId',
    );
    expect(tranferTypeIdError).toBeDefined();
    expect(tranferTypeIdError.constraints).toEqual({
      isNotEmpty: 'tranferTypeId should not be empty',
      isNumber:
        'tranferTypeId must be a number conforming to the specified constraints',
    });
  });

  it('should require value', async () => {
    const errors = await validate(dto);

    const valueError = errors.find((error) => error.property === 'value');
    expect(valueError).toBeDefined();
    expect(valueError.constraints).toEqual({
      isNotEmpty: 'value should not be empty',
      isNumber:
        'value must be a number conforming to the specified constraints',
    });
  });

  it('should be valid with all fields', async () => {
    const newDto = new CreateTransactionDto();
    Object.assign(newDto, {
      accountExternalIdDebit: 'test-debit',
      accountExternalIdCredit: 'test-credit',
      tranferTypeId: 1,
      value: 100,
    });

    const errors = await validate(newDto);

    expect(errors).toHaveLength(0);
  });
});
