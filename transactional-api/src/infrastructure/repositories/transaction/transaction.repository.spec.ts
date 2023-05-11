import { Test, TestingModule } from '@nestjs/testing';
import { TransactionRepository } from './transaction.repository';

describe('TransactionRepository', () => {
  let service: TransactionRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransactionRepository],
    }).compile();

    service = module.get<TransactionRepository>(TransactionRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
