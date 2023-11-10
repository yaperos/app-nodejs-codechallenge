import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from './transactions.service';
import { TransactionDto } from './dto/validate-transaction.dto';

describe('TransactionsService', () => {
  let service: TransactionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransactionsService],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateTransaction', () => {
    it('should return true if the transaction value is less than or equal to 1000', async () => {
      const dto: TransactionDto = { uuid: '123', value: 500 };

      const result = await service.validateTransaction(dto);

      expect(result).toBe(true);
    });

    it('should return false if the transaction value is greater than 1000', async () => {
      const dto: TransactionDto = { uuid: '123', value: 1500 };

      const result = await service.validateTransaction(dto);

      expect(result).toBe(false);
    });
  });
});