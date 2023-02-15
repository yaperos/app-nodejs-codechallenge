import { Test, TestingModule } from '@nestjs/testing';
import { TransactionStatusService } from './transaction-status.service';

describe('TransactionStatusService', () => {
  let service: TransactionStatusService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransactionStatusService],
    }).compile();

    service = module.get<TransactionStatusService>(TransactionStatusService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
