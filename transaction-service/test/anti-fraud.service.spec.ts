import { Test, TestingModule } from '@nestjs/testing';
import { AntiFraudService } from '../src/anti-fraud/anti-fraud.service';
import { KafkaService } from '../src/kafka/kafka.service';
import { Transaction } from '../src/transaction/transaction.entity';
import { TransactionStatus } from '../src/shared/enums/transaction-status.enum';

describe('AntiFraudService', () => {
  let service: AntiFraudService;
  let kafkaService: KafkaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AntiFraudService,
        {
          provide: KafkaService,
          useValue: {
            sendMessage: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AntiFraudService>(AntiFraudService);
    kafkaService = module.get<KafkaService>(KafkaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateTransaction', () => {
    it('should approve transaction with value less than or equal to 1000', async () => {
      const transaction: Transaction = {
        id: '1',
        accountExternalIdDebit: 'debitId',
        accountExternalIdCredit: 'creditId',
        tranferTypeId: 1,
        value: 1000, // Value less than or equal to 1000
        status: TransactionStatus.PENDING,
        createdAt: new Date(),
      };

      const result = await service.validateTransaction(transaction);
      expect(result).toEqual(TransactionStatus.APPROVED);
      expect(kafkaService.sendMessage).toHaveBeenCalledWith('transaction_status_approved', transaction);
    });

    it('should reject transaction with value greater than 1000', async () => {
      const transaction: Transaction = {
        id: '2',
        accountExternalIdDebit: 'debitId',
        accountExternalIdCredit: 'creditId',
        tranferTypeId: 1,
        value: 1500, // Value greater than 1000
        status: TransactionStatus.PENDING,
        createdAt: new Date(),
      };

      const result = await service.validateTransaction(transaction);
      expect(result).toEqual(TransactionStatus.REJECTED);
      expect(kafkaService.sendMessage).toHaveBeenCalledWith('transaction_status_rejected', transaction);
    });
  });
});
