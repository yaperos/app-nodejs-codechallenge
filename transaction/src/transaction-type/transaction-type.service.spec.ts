import { Test, TestingModule } from '@nestjs/testing';
import { TransactionTypeService } from './transaction-type.service';

describe('TransactionTypeService', () => {
  let service: TransactionTypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransactionTypeService],
    }).compile();

    service = module.get<TransactionTypeService>(TransactionTypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
