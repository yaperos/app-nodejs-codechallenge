import { Test, TestingModule } from '@nestjs/testing';
import { ValidateTransactionService } from './validate-transaction.service';

describe('ValidateTransactionService', () => {
  let service: ValidateTransactionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ValidateTransactionService],
    }).compile();

    service = module.get<ValidateTransactionService>(ValidateTransactionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
