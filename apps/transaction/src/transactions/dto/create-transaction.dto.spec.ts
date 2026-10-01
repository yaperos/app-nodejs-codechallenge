import { ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { createValidationPipe } from '../../validation';
import { CreateTransactionDto } from './create-transaction.dto';

const metadata: ArgumentMetadata = {
  type: 'body',
  metatype: CreateTransactionDto,
};

const valid = {
  accountExternalIdDebit: '11111111-1111-4111-8111-111111111111',
  accountExternalIdCredit: '22222222-2222-4222-8222-222222222222',
  tranferTypeId: 1,
  value: 120,
};

describe('CreateTransactionDto validation', () => {
  const pipe = createValidationPipe();
  const validate = (body: Record<string, unknown>) =>
    pipe.transform(body, metadata);

  it('accepts the README contract', async () => {
    await expect(validate(valid)).resolves.toMatchObject(valid);
  });

  it('accepts 2 decimals', async () => {
    await expect(validate({ ...valid, value: 1000.01 })).resolves.toBeDefined();
  });

  it.each([
    ['missing value', { ...valid, value: undefined }],
    ['value 0', { ...valid, value: 0 }],
    ['negative value', { ...valid, value: -5 }],
    ['3 decimals', { ...valid, value: 10.123 }],
    ['value as string', { ...valid, value: '120' }],
    ['invalid debit uuid', { ...valid, accountExternalIdDebit: 'abc' }],
    [
      'debit equals credit',
      { ...valid, accountExternalIdCredit: valid.accountExternalIdDebit },
    ],
    ['non-integer type', { ...valid, tranferTypeId: 1.5 }],
    ['unknown field', { ...valid, status: 'approved' }],
    [
      'corrected spelling instead of the contract typo',
      {
        accountExternalIdDebit: valid.accountExternalIdDebit,
        accountExternalIdCredit: valid.accountExternalIdCredit,
        transferTypeId: 1,
        value: 120,
      },
    ],
  ])('rejects %s', async (_, body) => {
    await expect(validate(body)).rejects.toBeInstanceOf(BadRequestException);
  });
});
