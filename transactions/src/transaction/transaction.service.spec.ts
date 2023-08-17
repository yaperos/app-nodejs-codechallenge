import { Test, TestingModule } from '@nestjs/testing';
import { TransactionService } from './transaction.service';
import { TransactionRepository } from './repositories/transaction.repository';
import { providersMock } from '../../test/mocks/providersMock';
import { CreateTransferRepository } from './repositories/create-transaction-repository';

describe('TransactionService', () => {
  let service: TransactionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        TransactionRepository,
        CreateTransferRepository,
        ...providersMock(),
      ],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
