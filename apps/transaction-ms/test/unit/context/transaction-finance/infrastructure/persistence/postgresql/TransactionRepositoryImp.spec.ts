import { TestBed } from '@automock/jest';
import { TransactionRepositoryImp } from '../../../../../../../src/contexts/transaction-finance/infrastructure/persistence/postgresql/TransactionRepositoryImp';
import { PrismaClientService } from '../../../../../../../src/contexts/shared/infrastructure/prisma-client';

describe('Transaction Repository Implementation Unit Test', () => {
  let transactionRepository: TransactionRepositoryImp;
  let database: jest.Mocked<PrismaClientService>;

  beforeAll(() => {
    const { unit, unitRef } = TestBed.create(
      TransactionRepositoryImp,
    ).compile();
    transactionRepository = unit;

    database = unitRef.get(PrismaClientService);
  });

  test('should be defined', async () => {
    expect(transactionRepository).toBeDefined();
    expect(database).toBeDefined();
  });
});
