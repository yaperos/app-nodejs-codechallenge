import { INestApplication } from '@nestjs/common';
import { TRANSACTION_CLIENT_PROVIDER_ALIAS } from 'src/modules/transaction/domain/providers/transaction-client.provider';
import { StringMother } from 'tests/unit/modules/shared/domain/mothers';
import {
  MockTransactionClientProvider,
  TransactionOutputMother,
} from 'tests/unit/modules/transaction/domain/providers/mock-transaction-client.provider';

import base from '../base';

describe('TransactionsResolver test', () => {
  let app: INestApplication;
  let transactionClientProvider: MockTransactionClientProvider;

  beforeAll(async () => {
    app = await base.getTestingApp();
    await app.init();
    transactionClientProvider = app.get<MockTransactionClientProvider>(
      TRANSACTION_CLIENT_PROVIDER_ALIAS,
    );
  });

  afterAll(async () => {
    await app.close();
  });

  it('should get a transaction', async () => {
    const transaction = TransactionOutputMother.random();
    transactionClientProvider.returnOnFindOne(transaction);

    const res = await base.transactionQuery(
      app,
      transaction.transactionExternalId,
    );
    base.expectOk(res);
    base.expectTypeJson(res);
    const data = res.body?.data;
    expect(data?.transaction).toEqual(transaction);
  });

  it('should create a transaction', async () => {
    const transaction = TransactionOutputMother.random();
    transactionClientProvider.returnOnCreate(transaction);

    const res = await base.createTransactionMutation(app, {
      value: transaction.value,
    });
    base.expectOk(res);
    base.expectTypeJson(res);
    const data = res.body?.data;
    expect(data?.createTransaction).toEqual(transaction);
  });

  it('should fail creating a transaction due to incorrect parameters', async () => {
    const res = await base.createTransactionMutation(app, {
      accountExternalIdCredit: StringMother.random(),
      accountExternalIdDebit: StringMother.random(),
      tranferTypeId: 6,
      value: -1,
    });
    base.expectOk(res);
    base.expectTypeJson(res);
    const error = res.body?.errors?.[0]?.extensions;
    base.expectBadRequestCode(error?.code);
    expect(error?.message?.length).toEqual(4);
  });
});
