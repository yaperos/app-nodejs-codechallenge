import { TestBed } from '@automock/jest';
import { TransactionRepository } from '../../../../../../src/contexts/transaction-finance/domain/TransactionRepository';
import { TRANSACTION_REPOSITORY } from '../../../../../../src/contexts/transaction-finance/token_repository.di';
import { DataType, IMemoryDb, newDb } from 'pg-mem';
import { FindDepositQueryHandler } from '../../../../../../src/contexts/transaction-finance/application/find/FindDepositQueryHandler';

describe('FindDepositQueryHandler Unit Test', () => {
  let findDepositCommandHandler: FindDepositQueryHandler;
  let transactionRepository: jest.Mocked<TransactionRepository>;

  beforeAll(() => {
    const { unit, unitRef } = TestBed.create(FindDepositQueryHandler).compile();
    findDepositCommandHandler = unit;
    transactionRepository = unitRef.get<TransactionRepository>(
      TRANSACTION_REPOSITORY,
    );
  });

  test('should be defined', async () => {
    expect(findDepositCommandHandler).toBeDefined();
  });

  test('find transaction', async () => {
    const db: IMemoryDb = newDb();
    db.public
      .declareTable({
        name: 'transaction',
        fields: [
          { name: 'transactionExternalId', type: DataType.uuid },
          { name: 'transactionExternalIdDebit', type: DataType.uuid },
          { name: 'transactionExternalIdCredit', type: DataType.uuid },
          { name: 'value', type: DataType.integer },
          { name: 'statusId', type: DataType.integer },
          { name: 'typeId', type: DataType.integer },
          { name: 'createdAt', type: DataType.timestamp },
          { name: 'updatedAt', type: DataType.timestamp },
        ],
      })
      .insert({
        transactionExternalId: '2f346058-1b18-49e6-b211-9ac993643b81',
        transactionExternalIdDebit: 'f00d8e9e-ffad-49d4-8e42-1708a5caba8f',
        transactionExternalIdCredit: '06e1651d-c01d-4afd-81d7-1757e3008dde',
        value: '500',
        statusId: 2,
        typeId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

    const result = db.public.one(`select * from transaction`);
    await findDepositCommandHandler.execute({
      transactionExternalId: '2f346058-1b18-49e6-b211-9ac993643b81',
    });

    expect(transactionRepository.find).toHaveBeenCalled();
    expect(result.transactionExternalId).toBe(
      '2f346058-1b18-49e6-b211-9ac993643b81',
    );
  });
});
