import { faker } from '@faker-js/faker';
import {
  Transaction,
  TransactionStatus,
} from '@transactions/domain/transaction.entity';

export const transactionMock: Transaction = new Transaction();

transactionMock.id = faker.string.uuid();
transactionMock.accountExternalIdDebit = faker.string.uuid();
transactionMock.accountExternalIdCredit = faker.string.uuid();
transactionMock.transferTypeId = faker.helpers.enumValue(TransactionStatus);
transactionMock.value = faker.number.float();
transactionMock.status = faker.helpers.enumValue(TransactionStatus);
transactionMock.createdAt = faker.date.past();
