import { Test, TestingModule } from '@nestjs/testing';
import { TransactionstatusService } from './transactionstatus.service';

describe('TransactionstatusService', () => {
  let service: TransactionstatusService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransactionstatusService],
    }).compile();

    service = module.get<TransactionstatusService>(TransactionstatusService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
