import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';

import { TransactionKafkaService } from './modules/transaction/infrastructure/services/transaction-kafka.service';
import { TransactionService } from './transaction.service';

describe('TransactionService', () => {
  let service: TransactionService;
  let kafkaService: jest.Mocked<TransactionKafkaService>;

  beforeEach(async () => {
    const kafkaServiceMock = {
      sentStatus: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        { provide: HttpService, useValue: {} },
        { provide: TransactionKafkaService, useValue: kafkaServiceMock },
      ],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
    kafkaService = module.get(TransactionKafkaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should update the status of a transaction', () => {
    const transactionId = '8e6d77ca-ca6e-40f7-88a5-c5a0728c0420';
    const status = 'APPROVED';
    service.updateStatus(transactionId, status);
    expect(kafkaService.sentStatus).toHaveBeenCalledWith(transactionId, status);
  });
});
