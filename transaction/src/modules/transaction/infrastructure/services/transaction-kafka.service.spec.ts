import { Test, TestingModule } from '@nestjs/testing';
import { KafkaMessage } from 'kafkajs';

import { KafkaService } from '../../../../modules/kafka/kafka.service';
import { TransactionApplication } from '../../application/transaction.application';
import { TransactionKafkaService } from './transaction-kafka.service';

describe('TransactionKafkaService', () => {
  let service: TransactionKafkaService;
  let kafkaService: jest.Mocked<KafkaService>;
  let application: jest.Mocked<TransactionApplication>;

  beforeEach(async () => {
    const kafkaServiceMock = {
      subscribeToTopic: jest.fn(),
      sendMessage: jest.fn(),
    };
    const applicationMock = {
      update: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionKafkaService,
        { provide: KafkaService, useValue: kafkaServiceMock },
        { provide: TransactionApplication, useValue: applicationMock },
      ],
    }).compile();

    service = module.get<TransactionKafkaService>(TransactionKafkaService);
    kafkaService = module.get(KafkaService);
    application = module.get(TransactionApplication);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should send a transaction', async () => {
    const transactionId = 'test-transaction';
    const value = 100;
    await service.sentTransaction(transactionId, value);
    expect(kafkaService.sendMessage).toHaveBeenCalledWith(expect.any(String), {
      transactionId,
      value,
    });
  });

  it('should receive a result and update the application', async () => {
    const message: KafkaMessage = {
      key: null,
      value: Buffer.from(
        JSON.stringify({
          transactionId: 'test-transaction',
          status: 'APPROVED',
        }),
      ),
      timestamp: '2022-01-01',
      attributes: 0,
      offset: '123',
      headers: null,
    };
    await service.receiveResult(message);
    expect(application.update).toHaveBeenCalledWith(
      'test-transaction',
      'APPROVED',
    );
  });

  it('should throw an error if the message cannot be parsed', async () => {
    const message: KafkaMessage = {
      key: null,
      value: Buffer.from('invalid JSON'),
      timestamp: '2022-01-01',
      attributes: 0,
      offset: '123',
      headers: null,
    };
    await expect(service.receiveResult(message)).rejects.toThrow();
  });
});
