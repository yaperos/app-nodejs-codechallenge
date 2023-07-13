import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';

import { MongooseModuleForTest } from '../../app/mongo';
import { TransactionService } from './transaction.service';
import { Transaction, TransactionSchema } from './entities/transaction.entity';

describe('TransactionService', () => {
  let storedId = '';
  let service: TransactionService;

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

  it('should be defined', async () => {
    const payload = {
      accountExternalIdCredit: 'example-accountExternalIdCredit',
      accountExternalIdDebit: 'example-accountExternalIdDebit',
      tranferTypeId: 1,
      value: 400,
    };
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
});
