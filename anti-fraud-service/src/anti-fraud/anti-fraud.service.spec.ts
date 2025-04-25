import { Test, TestingModule } from '@nestjs/testing';
import { AntiFraudService } from './anti-fraud.service';
import { StatusTransaction } from './interfaces/status.interface';

describe('AntiFraudService', () => {
  let service: AntiFraudService;
  const mockKafkaClient = {
    emit: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AntiFraudService,
        {
          provide: 'KAFKA_SERVICE',
          useValue: mockKafkaClient,
        },
      ],
    }).compile();

    service = module.get<AntiFraudService>(AntiFraudService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('checkTransaction', () => {
    it('should return APPROVED if value is less than 1000', () => {
      expect(service.checkTransaction(999)).toBe(StatusTransaction.APPROVED);
    });

    it('should return REJECTED if value is 1000 or more', () => {
      expect(service.checkTransaction(1000)).toBe(StatusTransaction.REJECTED);
    });
  });

  describe('handleTransaction', () => {
    it('should emit transaction_updated with APPROVED status', () => {
      const dto = {
        transactionExternalId: 'a291c943-4dc7-4063-8d4d-b01463c22f3c',
        amount: 500,
      };

      service.handleTransaction(dto);

      expect(mockKafkaClient.emit).toHaveBeenCalledWith('transaction_updated', {
        transactionExternalId: dto.transactionExternalId,
        transactionStatus: StatusTransaction.APPROVED,
      });
    });

    it('should emit transaction_updated with REJECTED status', () => {
      const dto = {
        transactionExternalId: 'a291c943-4dc7-4063-8d4d-b01463c22f3c',
        amount: 2000,
      };

      service.handleTransaction(dto);

      expect(mockKafkaClient.emit).toHaveBeenCalledWith('transaction_updated', {
        transactionExternalId: dto.transactionExternalId,
        transactionStatus: StatusTransaction.REJECTED,
      });
    });
  });
});
