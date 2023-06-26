import { TransactionRequestDto } from '@transactions/infrastructure/dtos/transaction-request.dto';
import { TransferType } from '@transactions/domain/transaction.entity';
import { faker } from '@faker-js/faker';

export const transactionRequestMock: TransactionRequestDto = {
  accountExternalIdDebit: faker.string.uuid(),
  accountExternalIdCredit: faker.string.uuid(),
  transferTypeId: faker.helpers.enumValue(TransferType),
  value: 100,
};
