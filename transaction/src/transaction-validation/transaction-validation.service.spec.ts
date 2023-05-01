import { Test, TestingModule } from '@nestjs/testing';
import { TransactionValidationService } from './transaction-validation.service';

describe('TransactionValidationService', () => {
  let service: TransactionValidationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransactionValidationService],
    }).compile();

    service = module.get<TransactionValidationService>(TransactionValidationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
