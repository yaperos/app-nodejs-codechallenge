import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';

import { MongooseModuleForTest } from '../../app/mongo';
import { TransactionService } from './transaction.service';
import { Transaction, TransactionSchema } from './entities/transaction.entity';

describe('TransactionService', () => {
  let storedId = '';
  let service: TransactionService;

  const payload = {
    accountExternalIdCredit: 'example-accountExternalIdCredit',
    accountExternalIdDebit: 'example-accountExternalIdDebit',
    tranferTypeId: 1,
    value: 400,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModuleForTest,
        MongooseModule.forFeature([
          {
            name: Transaction.name,
            schema: TransactionSchema,
          },
        ]),
      ],
      providers: [TransactionService],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
  });

  it('should be create', async () => {
    const transaction = await service.create(payload);
    expect(transaction).toBeDefined();
    expect(transaction.accountExternalIdCredit).toBeDefined();
    expect(transaction.accountExternalIdCredit).toEqual(
      payload.accountExternalIdCredit,
    );
    expect(transaction.accountExternalIdDebit).toBeDefined();
    expect(transaction.accountExternalIdDebit).toEqual(
      payload.accountExternalIdDebit,
    );
    expect(transaction.tranferTypeId).toBeDefined();
    expect(transaction.tranferTypeId).toEqual(payload.tranferTypeId);
    expect(transaction.value).toBeDefined();
    expect(transaction.value).toEqual(payload.value);

    // PERSIST ID
    storedId = transaction.id;
  });

  it('should be list all', async () => {
    const transactions = await service.findAll();
    expect(transactions).toBeDefined();
    expect(transactions.length).not.toBe(0);
  });

  it('should be list one', async () => {
    const transaction = await service.findOne(storedId);
    expect(transaction).toBeDefined();

    expect(transaction.accountExternalIdCredit).toBeDefined();
    expect(transaction.accountExternalIdCredit).toEqual(
      payload.accountExternalIdCredit,
    );
    expect(transaction.accountExternalIdDebit).toBeDefined();
    expect(transaction.accountExternalIdDebit).toEqual(
      payload.accountExternalIdDebit,
    );
    expect(transaction.tranferTypeId).toBeDefined();
    expect(transaction.tranferTypeId).toEqual(payload.tranferTypeId);
    expect(transaction.value).toBeDefined();
    expect(transaction.value).toEqual(payload.value);
  });

  it('should be delete', async () => {
    const isRemoved = await service.remove(storedId);
    expect(isRemoved).toBeTruthy();

    const transaction = await service.findOne(storedId);
    expect(transaction).toBeNull();
  });
});
